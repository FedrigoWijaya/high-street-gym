import express, { request, response } from "express"
import * as Booking from "../models/bookingmodel.js" 
import * as classes from "../models/classmodel.js"
import * as ClassUserActivities from "../models/class-activity-user.js"
import * as BookingClassUser from "../models/booking_class_user.js"
import * as User from "../models/usersmodel.js"
import * as Activities from "../models/activitymodel.js"
import * as locations from "../models/locationmodel.js"
import access_control from "../access_control.js"
import { format } from "mysql2"
    
const bookingsController = express.Router();

bookingsController.get("/booked_class", access_control(["admin", "trainer", "member"]), (request, response) => {
    const UserID = request.session.user.userID;
    if (UserID) {
        BookingClassUser.getAllByUserID(UserID)
            .then(bookings => {
                if (bookings.length > 0) {
                    // Create a promise array to fetch class details for each booking
                    const classPromises = bookings.map(booking => ClassUserActivities.getByClassID(booking.class_id));

                    // Resolve all promises to get class details
                    return Promise.all(classPromises)
                        .then(classDetails => {
                            // Merge bookings with their respective class details
                            const bookingsWithClassDetails = bookings.map((booking, index) => ({
                                ...booking,
                                classDetails: classDetails[index]
                            }));

                            response.render("booked_class.ejs", {
                                bookings: bookingsWithClassDetails,
                                accessRole: request.session.user.accessRole,
                                UserID: UserID
                            });
                        });
                } else {
                    response.render("booked_class.ejs", {
                        bookings: [],
                        accessRole: request.session.user.accessRole,
                        UserID: UserID
                    });
                }
            })
            .catch(error => {
                response.render("status.ejs", {
                    status: "No Booked Class",
                    message: error
                });
                console.error(error);
            });
    } else if (request.query.class_id) {
        BookingClassUser.getByClassId(request.query.class_id)
            .then(bookings => {
                response.render("booked_class.ejs", {
                    bookings: bookings,
                    accessRole: request.session.user.accessRole,
                    UserID: UserID
                });
            })
            .catch(error => {
                response.render("status.ejs", {
                    status: "Database error",
                    message: error
                });
                console.error(error);
            });
    } else {
        BookingClassUser.getAll()
            .then(bookings => {
                response.render("booked_class.ejs", {
                    bookings: bookings,
                    accessRole: request.session.user.accessRole,
                    UserID: UserID
                });
            })
            .catch(error => {
                response.render("status.ejs", {
                    status: "No Booked Class",
                    message: error
                });
                console.error(error);
            });
    }
});

bookingsController.post("/booking_class_action", (request, response) => {
    if (request.body) {
        let formData = request.body;
        const newBooking = Booking.newBooking(
            null,
            (new Date().toISOString().slice(0, 19).replace('T', ' ')),
            request.session.user.userID,
            formData.class_id,
            "Pending"
        );

        Booking.create(newBooking).then(([result]) => {
            response.redirect("/booked_class?user_id=" + newBooking.user_id);
        }).catch(error => {
            response.render("status.ejs", {
                status: "Failed to create booking",
                message: "Failed to create booking please contact the support."
            });
        });
    } else {
        response.render("status.ejs", {
            status: "Failed to create booking",
            message: "Request body is missing. Please try again."
        });
    }
});


bookingsController.get("/booked_class_delete", access_control(["admin", "trainer", "member"]), (request, response) => {
    let allActivities, allTrainers, allLocations;
    BookingClassUser.getAllBybookingId(request.query.id)
        .then(editBooking => {
            return Activities.getAll()
                .then(activities => {
                    allActivities = activities;
                    return User.getByRole("trainer")
                        .then(trainers => {
                            allTrainers = trainers;
                            return locations.getAllLocations()
                                .then(locations => {
                                    allLocations = locations;
                                    response.render("booked_class_delete.ejs", {
                                        editBooking: editBooking[0],
                                        allActivities,
                                        allTrainers,
                                        allLocations
                                    });
                                });
                        });
                });
        })
        .catch(error => {
            response.render("status.ejs", {
                status: "Database error",
                message: error.message
            });
            console.error(error);
        });
});

bookingsController.post("/booked_class_delete", (request, response) => {
    const formData = request.body;

    if (formData.action === "delete") {
        Booking.deleteById(formData.booking_id).then(([result]) => {
            response.redirect("/booked_class?user_id=" + formData.user_id);
        }).catch(error => {
            response.render("status.ejs", {
                status: "Failed to delete",
                message: "Database failed to delete booking."
            });
        });
    }
});

bookingsController.get("/booking_manage", access_control(["admin", "trainer"]), (request, response) => {
    if (request.query.search_term) {
        BookingClassUser.getByMemberSearch(request.query.search_term)
            .then(bookings => {
                response.render("booking_manage.ejs", {
                    allBookings: bookings,
                    accessRole: request.session.user.accessRole,
                });
            })
            .catch(error => {
                response.render("status.ejs", {
                    status: "Incorrect search member name",
                    message: "Please enter the correct member name",
                });
                console.error(error);
            });
    } else {
        let bookingStatus = request.query.status;
        if (!bookingStatus) {
            bookingStatus = "pending";
        }

        BookingClassUser.getAllByBookingStatus(bookingStatus)
            .then(bookings => {
                response.render("booking_manage.ejs", {
                    allBookings: bookings,
                    bookingStatus,
                    accessRole: request.session.user.accessRole,
                });
            })
            .catch(error => {
                response.render("status.ejs", {
                    status: "Database error",
                    message: error,
                });
                console.error(error);
            });
    }
});





bookingsController.post("/booking_manage", access_control(["admin", "trainer"]), (request, response) => {
    const formData = request.body;
    Booking.updatestatusbyid(formData.booking_id, formData.booking_status)
        .then(([result]) => {
            if (result.affectedRows > 0) {
                response.redirect("/booking_manage");
            } else {
                response.render("status.ejs", {
                    status: "Failed to update",
                    message: "Database failed to update booking."
                });
            }
        })
        .catch(error => {
            response.render("status.ejs", {
                status: "Failed to update",
                message: "Database failed to update booking."
            });
        });
});

bookingsController.get("/booking_manage_edit", access_control(["admin", "trainer"]), (request, response) => {
    BookingClassUser.getAllBybookingId(request.query.edit_id)
        .then(editBooking => {
            if (editBooking && editBooking.length > 0) {
                response.render("booking_manage_edit.ejs", {
                    editBooking: editBooking[0],
                    accessRole: request.session.user.accessRole,
                });
            } else {
                response.render("status.ejs", {
                    status: "No Booking Found",
                    message: "No booking found with the provided ID."
                });
            }
        })
        .catch(error => {
            response.render("status.ejs", {
                status: "Database error",
                message: error.message
            });
            console.error(error);
        });
});

bookingsController.post("/booking_manage_edit", (request, response) => {
    const formData = request.body;

    if (formData.action === "Update") {
        Booking.updatestatusbyid(formData.booking_id, formData.booking_status)
            .then(([result]) => {
                if (result.affectedRows > 0) {
                    response.redirect("/booking_manage");
                } else {
                    response.render("status.ejs", {
                        status: "Failed to update",
                        message: "Database failed to update booking."
                    });
                }
            })
            .catch(error => {
                response.render("status.ejs", {
                    status: "Failed to update",
                    message: "Database failed to update booking."
                });
                console.error(error);
            });
    } else if (formData.action === "Delete") {
        Booking.deleteById(formData.booking_id).then(([result]) => {
            response.redirect("/booking_manage");
        }).catch(error => {
            response.render("status.ejs", {
                status: "Failed to delete",
                message: "Database failed to delete booking."
            });
        });
    }
});

export default bookingsController;

   
    
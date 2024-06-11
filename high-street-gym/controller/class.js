import express from "express";
import access_control from "../access_control.js";
import * as classes from "../models/classmodel.js";
import * as classactivityuser from "../models/class-activity-user.js";
import * as locations from "../models/locationmodel.js";
import * as activities from "../models/activitymodel.js";
import * as users from "../models/usersmodel.js";

const classController = express.Router();

classController.get("/class_page", access_control(["admin", "trainer", "member"]), (request, response) => {
  if (request.query.search_term) {
    classactivityuser.getBySearchNameTrainer(request.query.search_term)
    .then(classes => {
      response.render("class_page.ejs", { 
        classes,
        accessRole: request.session.user.accessRole,
      });
    })
    .catch(error => {
      response.render("status.ejs", {
        status: "incorrect search trainer name",
        message: "please enter the correct trainer name",
      });
      console.error(error);
    });
  } else if (request.query.search_date_start && request.query.search_date_end) {
    classactivityuser.getByDateRange(request.query.search_date_start, request.query.search_date_end)
    .then(classes => {
      response.render("class_page.ejs", { 
        classes,
        accessRole: request.session.user.accessRole,
      });
    })
    .catch(error => {
      response.render("status.ejs", {
        status: "Incorrect date range",
        message: "please identify the correct date range",
      });
      console.error(error);
    });
  } else {
    classactivityuser.getAll()
    .then(classes => {
      response.render("class_page.ejs", { 
        classes,
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

classController.get("/manage_class", access_control(["admin"]), (request, response) => {
  if (request.query.search_term) {
    classes.getBySearchNameTrainer(request.query.search_term)
    .then(classes => {
      response.render("manage_class.ejs", {
        classes,
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
  } else if (request.query.search_date_start && request.query.search_date_end) {
    classes.getByDateRange(request.query.search_date_start, request.query.search_date_end)
    .then(classes => {
      response.render("manage_class.ejs", {
        classes,
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
  } else {
    classes.getAll()
    .then(classes => {
      response.render("manage_class.ejs", { classes });
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

classController.get("/class_booking", access_control(["admin", "trainer", "member"]), (request, response) => {
  const createID = request.query.create_id;
  classactivityuser.getByClassID(createID)
  .then(createBooking => {
    response.render("class_booking.ejs", {
      createBooking,
      accessRole: request.session.user.accessRole,
    });
  })
  .catch(error => {
    response.render("status.ejs", {
      status: "Cannot book class",
      message: error,
    });
    console.error(error);
  });
});

classController.get("/admin_class", access_control(["admin"]), (request, response) => {
  if (request.query.search_term) {
    classactivityuser.getBySearchNameTrainer(request.query.search_term)
    .then(classes => {
      response.render("admin_class.ejs", { 
        classes,
        accessRole: request.session.user.accessRole,
      });
    })
    .catch(error => {
      response.render("status.ejs", {
        status: "incorrect search trainer name",
        message: "please enter the correct trainer name",
      });
      console.error(error);
    });
  } else if (request.query.search_date_start && request.query.search_date_end) {
    classactivityuser.getByDateRange(request.query.search_date_start, request.query.search_date_end)
    .then(classes => {
      response.render("admin_class.ejs", { 
        classes,
        accessRole: request.session.user.accessRole,
      });
    })
    .catch(error => {
      response.render("status.ejs", {
        status: "Incorrect date range",
        message: "please identify the correct date range",
      });
      console.error(error);
    });
  } else {
    classactivityuser.getAll()
    .then(classes => {
      response.render("admin_class.ejs", { 
        classes,
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


  classController.get("/admin_class_edit", access_control(["admin"]) , (request, response) => {
    const editClassId = request.query.edit_id; // Renamed to editClassId for clarity
    if (editClassId) {
        let allTrainers, allActivities;
        classactivityuser.getByClassID(editClassId)
            .then(editClass => {
                return users.getByRole("trainer") 
                    .then(trainers => {
                        allTrainers = trainers; // Assign trainers to allTrainers
                        return activities.getAll()
                            .then(activities => {
                                allActivities = activities; // Assign activities to allActivities
                                response.render("admin_class_edit.ejs", { 
                                    allTrainers : allTrainers,
                                    allActivities : allActivities,
                                    editClass,
                                    accessRole: request.session.user.accessRole
                                });
                            });
                    });
            })
            .catch(error => {
                response.render("status.ejs", {
                    status: "Can not edit class",
                    message: error
                });
                console.error(error);
            });
    }
    else { 
        let allTrainers, allActivities;
        users.getByRole("trainer")
            .then(trainers => {
                allTrainers = trainers; // Assign trainers to allTrainers
                return activities.getAll()
                })
                .then(activities => {
                    allActivities = activities; // Assign activities to allActivities
                        response.render("admin_class_edit.ejs", { 
                            allTrainers: allTrainers,
                            allActivities: allActivities,
                            editClass: classes.newClasses(0, "", "", "", "")
                        });
                    })
                    .catch(error => {
                        response.render("status.ejs", {
                            status: "Can not edit class",
                            message: error
                        });
                        console.error(error);
            });
    }
});



classController.post(
  "/admin_class_edit",
  access_control(["admin"]), // Access control for admin role
  (request, response) => {
      const formData = request.body;

      // Validate date format YYYY-MM-DD
      if (!/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(formData.class_date)) {
          response.render("status.ejs", {
              status: "Invalid date format",
              message: "The date must be in the format YYYY-MM-DD",
          });
          return;
      }

      const editClass = classes.newClasses(
          formData.class_id,
          formData.class_date,
          formData.activity_id,
          formData.location_id,
          formData.class_trainer_user_id
      );

     if (formData.action === "update") {
          classes.update(editClass).then(([result]) => {
              if (result.affectedRows === 0) {
                  response.render("status.ejs", {
                      status: "No class updated",
                      message: "No class was found with the provided ID."
                  });
              } else {
                  response.redirect("/admin_class");
              }
          }).catch(error => {
              console.error("Error updating class:", error);
              response.render("status.ejs", {
                  status: "Failed to update",
                  message: `Database failed to update class: ${error.message}`
              });
          });
      } else if (formData.action === "delete") {
          classes.deleteByID(formData.class_id).then(([result]) => {
              response.redirect("/admin_class");
          }).catch(error => {
              console.error("Error deleting class:", error);
              response.render("status.ejs", {
                  status: "Failed to delete",
                  message: `Database failed to delete class: ${error.message}`
              });
          });
      }
  }
);



classController.get("/admin_class_create", access_control(["admin"]), (request, response) => {
  let allTrainers, allActivities, editClass;

  Promise.all([
      users.getByRole("trainer"),
      activities.getAll()
  ])
  .then(([trainers, activities]) => {
      allTrainers = trainers;
      allActivities = activities;
      if (request.query.edit_id) {
          return classactivityuser.getByClassID(request.query.edit_id);
      } else {
          return Promise.resolve(classes.newClasses(0, "", "", "", ""));
      }
  })
  .then(editClassData => {
      editClass = editClassData;
      response.render("admin_class_create.ejs", { 
          allTrainers,
          allActivities,
          editClass,
          accessRole: request.session.user.accessRole
      });
  })
  .catch(error => {
      response.render("status.ejs", {
          status: "Error",
          message: error.message
      });
      console.error(error);
  });
});

classController.post(
  "/admin_class_create",
  access_control(["admin"]), // Access control for admin role
  (request, response) => {
      const formData = request.body;

      // Log form data for debugging
      console.log("Form Data:", formData);

      // Validate date format YYYY-MM-DD
      if (!/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(formData.class_date)) {
          response.render("status.ejs", {
              status: "Invalid date format",
              message: "The date must be in the format YYYY-MM-DD",
          });
          return;
      }

      const editClass = classes.newClasses(
          formData.class_id,
          formData.class_date,
          formData.activity_id,
          formData.location_id,
          formData.class_trainer_user_id
      );

      console.log("Class Data to be Created:", editClass);

      if (formData.action === "create") {
          classes.create(editClass).then(([result]) => {
              console.log("Create Result:", result);
              response.redirect("/admin_class");
          }).catch(error => {
              console.error("Create Error:", error);
              response.render("status.ejs", {
                  status: "Failed to create",
                  message: "Database failed to create class."
              });
          });
      } else if (formData.action === "delete") {
          classes.deleteByID(formData.class_id).then(([result]) => {
              console.log("Delete Result:", result);
              response.redirect("/admin_class");
          }).catch(error => {
              console.error("Delete Error:", error);
              response.render("status.ejs", {
                  status: "Failed to delete",
                  message: "Database failed to delete class."
              });
          });
      }
  }
);



export default classController;

console.log((new Date().toISOString().slice(0, 10)))
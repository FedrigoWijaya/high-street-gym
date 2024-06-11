import express from "express";
import * as usersmodel from "../models/usersmodel.js";
import access_control from "../access_control.js";
import bcrypt from "bcryptjs";
import validator from "validator";


const userController = express.Router();



userController.get("/signupusers", (request, response) => {
    response.render("signupuser.ejs");
  });
  
  userController.post("/signupusers", (request, response) => {
    const registerUser = request.body;

    if (!/[a-zA-Z-]{2,}/.test(registerUser.user_firstname)) {
        response.render("status.ejs", {
            status: "Invalid first name",
            message: "First name must be letters",
        });
        return;
    }
    if (!/[a-zA-Z-]{2,}/.test(registerUser.user_lastname)) {
        response.render("status.ejs", {
            status: "Invalid last name",
            message: "Last name must be letters",
        });
        return;
    }
    if (!/[a-zA-Z-]{2,}/.test(registerUser.user_username)) {
        response.render("status.ejs", {
            status: "Invalid username",
            message: "Username must be letters",
        });
        return;
    }
    if (
        !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(
            registerUser.user_email 
        )
    ) {
        response.render("status.ejs", {
            status: "Invalid email",
            message: "Email must be a valid email address.",
        });
        return;
    }
    if (!/[0-9]{10}/.test(registerUser.user_phone)) {
        response.render("status.ejs", {
            status: "Invalid phone number",
            message: "Phone number must be 10 numbers.",
        });
        return;
    }


    const registerUsers = usersmodel.newUsers(
        null,
        validator.escape(registerUser.user_email),
        validator.escape(registerUser.user_password),
        validator.escape(registerUser.user_firstname),
        validator.escape(registerUser.user_lastname),
        validator.escape(registerUser.user_phone),
        validator.escape(registerUser.user_username),
        "member"
    );

    // login compare route
if (!registerUsers.user_password.startsWith("$2a")) {
    registerUsers.user_password = bcrypt.hashSync(registerUsers.user_password);
}
    usersmodel.createUser(registerUsers).then(([result]) => {
        console.log(result);
        response.redirect("/login");
        
    }).catch(error => {
        response.render("status.ejs", {
            status: "Failed to create account",
            message: "Your registration has failed. Please go back and try again."
        });
        console.error(error);
    });
});
// Login User Post Route

userController.get("/login", (request, response) => {
    response.render("login.ejs");
  });
  
  // Login controller
  userController.post("/loginuser", (request, response) => {
    const login_username = request.body.user_username;
    const login_password = request.body.user_password;
  
    usersmodel.getUserByUsername(login_username)
      .then((users) => {
        if (bcrypt.compareSync(login_password, users.user_password)) {
          // Add bcrypt compare sycn after hashing password
          request.session.user = {
            userID: users.user_id,
            accessRole: users.user_roles,
          };
          console.log("User authenticated successfully!");
          response.redirect("/member_homepage");
        } else {
          console.log("Invalid password");
          response.render("status.ejs", {
            status: "Incorrect password",
            message: "Invalid username or password",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        response.render("status.ejs", {
          status: "User not found",
          message: error,
        });
      });
  });

//member homepage
userController.get("/member_homepage", access_control(["member", "trainer", "admin"]), (request, response) => { 
    const user = request.session.user; // Retrieve user data from session
    response.render("member_homepage.ejs", { 
    
        accessRole: request.session.user.accessRole,
        UserID: user.user_id
    });
});


//member about us 
userController.get("/member_aboutus", access_control(["member", "trainer", "admin"]), (request, response) => { 
    const user = request.session.user; // Retrieve user data from session
    response.render("member_aboutus.ejs", { 
    
        accessRole: request.session.user.accessRole,
        UserID: user.user_id
    });
});

userController.get("/user_logout", (request, response) => {
    request.session.destroy();
    response.redirect("/");
});



// userController.post("/loginuser", (request, response) => {
//     const login_username = request.body.username;
//     const login_password = request.body.password;

    //later fix login + signup for users
//     Users.getUserByUsername(login_username)
//         .then((users) => {
//             if (bcrypt.compareSync(login_password, users.password)) {
//                 request.session.users = users;
//                 console.log("User authenticated successfully!");
//                 response.redirect("/");
//             } else {
//                 console.log("Invalid password");
//                 response.render("status.ejs", {
//                     status: "Incorrect password",
//                     message: "Invalid username or password",
//                 });
//             }
//         })
//         .catch((error) => {
//             console.error("Error fetching user:", error);
//             response.render("status.ejs", {
//                 status: "User not found",
//                 message: error,
//             });
//         });
//      });

userController.get("/member_profile", access_control(["admin", "trainer", "member"]), (request, response) => {
    const userID = request.session.user.userID;
    if (userID) {
        usersmodel.getUserById(userID)
            .then((user) => {
                response.render("member_profile.ejs", {
                    user: user,
                    accessRole: request.session.user.accessRole,
                    userID: userID,
                });
            })
            .catch((error) => {
                response.render("status.ejs", {
                    status: "Database error",
                    message: error,
                });
                console.error(error);
            });
    } else {
        response.render("status.ejs", {
            status: "User not found",
            message: "Please login",
        });
    }
});

// Render edit profile page
userController.get("/edit_profile", access_control(['admin', 'trainer', 'member']), (request, response) => {
    const userID = request.session.user.userID;
    if (userID) {
        usersmodel.getUserById(userID).then(editUser => {
            response.render("edit_profile.ejs", { user: editUser });
        }).catch(error => {
            response.render("status.ejs", {
                status: "Error",
                message: "Failed to fetch user data."
            });
            console.error(error);
        });
    } else {
        response.render("status.ejs", {
            status: "User not found",
            message: "Please login",
        });
    }
});
// Handle user edit action
userController.post("/user_edit_action", (request, response) => {
    const FormData = request.body;
    console.log("FormData received:", FormData);
    console.log("Action:", FormData.action); // Add this line

    // Validation
    if (!/[a-zA-Z-]{2,}/.test(FormData.user_first_name)) {
        response.render("status.ejs", {
            status: "Invalid first name",
            message: "First name must be letters."
        });
        return;
    }

    if (!/[a-zA-Z-]{2,}/.test(FormData.user_last_name)) {
        response.render("status.ejs", {
            status: "Invalid last name",
            message: "Last name must be letters."
        });
        return;
    }

    if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(FormData.user_email)) {
        response.render("status.ejs", {
            status: "Invalid email",
            message: "Email must be a valid email address."
        });
        return;
    }

    if (!/[0-9]{10}/.test(FormData.user_phone)) {
        response.render("status.ejs", {
            status: "Invalid phone number",
            message: "Phone number must be 10 digits."
        });
        return;
    }

    // Update the user
    const editUser = usersmodel.newUsers(
        FormData.user_id,
        validator.escape(FormData.user_email),
        FormData.user_password,
        validator.escape(FormData.user_first_name),
        validator.escape(FormData.user_last_name),
        validator.escape(FormData.user_phone),
        validator.escape(FormData.user_username), 
        validator.escape(FormData.user_roles) // Ensure this matches your form field
    );

    console.log("User to update:", editUser);

    // Hash the password only if it is a new password
    if (!editUser.user_password.startsWith("$2a$")) {
        editUser.user_password = bcrypt.hashSync(editUser.user_password);
    }

    // Handle update or delete action
    if (FormData.action === "update") {
        usersmodel.updateUser(editUser)
            .then(([result]) => {
                console.log("Update result:", result);
                response.redirect("/member_profile");
            })
            .catch(error => {
                console.error("Error updating user:", error);
                response.render("status.ejs", {
                    status: "Failed to update",
                    message: "Database failed to update user."
                });
            });
    } else if (FormData.action === "delete") {
        usersmodel.deleteUserById(editUser.user_id)
            .then(([result]) => {
                console.log("Delete result:", result);
                response.redirect("/member_profile");
            })
            .catch(error => {
                console.error("Error deleting user:", error);
                response.render("status.ejs", {
                    status: "Failed to delete",
                    message: "Database failed to delete user."
                });
            });
    } else {
        response.render("status.ejs", {
            status: "Invalid action",
            message: "Invalid action specified."
        });
    }
});

userController.get("/memberlocation" , access_control(['admin', 'trainer', 'member']), (request, response) => {
    const user = request.session.user; // Retrieve user data from session
    response.render("memberlocation.ejs", { 
        accessRole: request.session.user.accessRole,
        UserID: user.user_id
    });
});

userController.get("/policymember", access_control(['admin', 'trainer', 'member']), (request, response) => {
    const user = request.session.user; // Retrieve user data from session
    response.render("policymember.ejs", { 
        accessRole: request.session.user.accessRole,
        UserID: user.user_id
    });
});

export default userController;
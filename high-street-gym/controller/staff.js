import express from "express";
import * as staffmodel from "../models/usersmodel.js";
import access_control from "../access_control.js";
import bcrypt from "bcryptjs";
import validator from "validator";

const staffController = express.Router();

staffController.get("/stafflogin", (request, response) => {
    response.render("stafflogin.ejs");
});

staffController.get("/staff_logout", (request, response) => {
  request.session.destroy();
  response.redirect("/");
});

staffController.post("/stafflogin", (request, response) => {
    const login_username = request.body.user_username;
    const login_password = request.body.user_password;
  
    staffmodel.getUserByUsername(login_username)
      .then((users) => {
        if (bcrypt.compareSync(login_password, users.user_password)) {
          request.session.user = {
            userID: users.user_id,
            accessRole: users.user_roles,
          };
          console.log("User authenticated successfully!");
          response.redirect("/booking_manage");
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

  staffController.get(
    "/admin_user",
    access_control(["admin"]),
    (request, response) => {
        const editID = request.query.edit_id;
        if (editID) {
           staffmodel.getUserById(editID).then(editStaff => {
                staffmodel.getAllUsers().then(allStaff => {
                    response.render("admin_user.ejs", {
                        allStaff,
                        editStaff,
                        accessRole: request.session.user.accessRole,
                    });
                });
            });
        } else {
            staffmodel.getAllUsers().then(allStaff => {
                response.render("admin_user.ejs", {
                    allStaff,
                    editStaff: staffmodel.newUsers(0, "", "", "", "", "", "", ""),
                    accessRole: request.session.user.accessRole,
                });
            });
        }
    }
);

staffController.post("/admin_user", access_control(["admin"]), (request, response) => {
  const FormData = request.body;
  console.log("FormData received:", FormData);
  console.log("Action:", FormData.action);

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
  const editStaff = staffmodel.newUsers(
      FormData.user_id,
      FormData.user_email,
      FormData.user_password,
      FormData.user_first_name,
      FormData.user_last_name,
      FormData.user_phone,
      FormData.user_username,
      FormData.user_roles
  );

  console.log("User to update:", editStaff);

  // Hash the password only if it is a new password
  if (!editStaff.user_password.startsWith("$2a$")) {
      editStaff.user_password = bcrypt.hashSync(editStaff.user_password);
  }

  if (FormData.action === "create") {
      staffmodel.createUser(editStaff).then(([result]) => {
          response.redirect("/admin_user");
      }).catch(error => {
          response.render("status.ejs", {
              status: "Database error",
              message: error,
          });
          console.error(error);
      });
  } else if (FormData.action === "update") {
      staffmodel.updateUser(editStaff).then(([result]) => {
          response.redirect("/admin_user");
      }).catch(error => {
          response.render("status.ejs", {
              status: "Database error",
              message: error,
          });
          console.error(error);
      });
  } else if (FormData.action === "delete") {
      staffmodel.deleteUserById(editStaff.user_id).then(([result]) => {
          response.redirect("/admin_user");
      }).catch(error => {
          response.render("status.ejs", {
              status: "Database error",
              message: error,
          });
          console.error(error);
      });
  }
});



export default staffController;

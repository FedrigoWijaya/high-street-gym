import express, { request } from "express";
import * as usersmodel from "../models/usersmodel.js";
import bcrypt from "bcryptjs";
import validator from "validator";

const guestController = express.Router();

guestController.get("/homepage", (request, response) => {
  response.render("homepage.ejs");
});
guestController.get("/aboutus", (request, response) => {
  response.render("aboutus.ejs");
});

guestController.get("/location", (request, response) => {
  response.render("location.ejs")
});

guestController.get("/contactus", (request, response) => {
  response.render("location.ejs")
});

guestController.get("/policy" , (request, response) => {
  response.render("policy.ejs")
});





// guestController.get("/blog", (request, response) => {
//   response.render("blog.ejs");
// });


export default guestController;

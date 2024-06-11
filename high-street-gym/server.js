import express from "express";
import session from "express-session";
import membersController from "./controller/members.js";
import guestController from "./controller/guest.js";
import staffController from "./controller/staff.js";
import blogController from "./controller/blog.js";
import classController from "./controller/class.js"
import bookingsController from "./controller/bookings.js";

// import bookingControler from "./controller/bookings.js"

//This Create an express app instance and define a port for later 
const app = express();
const port = 8082;

app.use(
    session({
        secret: "secret phrase",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
    })
);

// Serve static resources
app.use(express.static("static"));


// Enable the ejs view engine
app.set("view engine", "ejs");

// Enable support for URL-encoded request bodies
app.use(
    express.urlencoded({
        extended: true,
    })
);

// Redirect request to root to the products page
app.get("/", (request, response) => {
    response.status(301).redirect("/homepage");
});


// Controllers here
//app.use(userController);
app.use(guestController);
app.use(classController);
app.use(staffController);
app.use(membersController);
app.use(blogController);
app.use(bookingsController);



app.listen(port, () => {
    console.log(`Express server started on http://localhost:${port}`);
});
import express from "express";
import * as blog from "../models/blogmodel.js";
import access_control from "../access_control.js";
import * as BlogUser from "../models/blog-usersmodel.js";
import validator from "validator";

const blogController = express.Router();

// For all roles blog
blogController.get("/blog", (request, response) => 
    BlogUser.getAll()
        .then(blogs => {
            console.log('blogs', blogs);
            response.render("blog.ejs", { blogs });
        })
        .catch(error => {
            response.render("status.ejs", {
                status: "Database error",
                message: error
            });
            console.error(error);
        })
);

// For member blog
blogController.get("/blog_view_all_post", access_control(["admin", "trainer", "member"]), (request, response) => {
    const userID = request.session.user.userID;
    const accessRole = request.session.user.accessRole;

    if (userID) {
        BlogUser.getAll()
            .then(blogs => {
                console.log(userID);
                response.render("blog_view_all_post.ejs", { blogs, accessRole });
            })
            .catch(error => {
                response.render("status.ejs", {
                    status: "Database error",
                    message: error
                });
                console.error(error);
            });
    } else {
        response.render("status.ejs", {
            status: "Not found your post",
            message: "User ID not found in session"
        });
    }
});

// View post member
blogController.get("/blog_view_user_post", access_control(["admin", "trainer", "member"]), (request, response) => {
    const userID = request.session.user.userID;

    if (userID) {
        BlogUser.getAllByUserID(userID)
            .then(blogs => {
                console.log('blogs', blogs);
                response.render("blog_view_user_post.ejs", {
                    blogs,
                    UserID: userID
                });
            })
            .catch(error => {
                response.render("status.ejs", {
                    status: "No blogs",
                    message: error
                });
                console.error(error);
            });
    } else {
        response.render("status.ejs", {
            status: "Not found your post",
            message: "User ID not found in session"
        });
    }
});

// Blog member create
blogController.get("/blog_create", access_control(["member", "trainer", "admin"]), (request, response) => {
    response.render("blog_create.ejs", {
        accessRole: request.session.user.accessRole
    });
});

// User create blog
    blogController.post("/blog_create_confirm", (request, response) => {
        const formData = request.body;
        console.log("Form Data:", formData);
        console.log("Session User:", request.session.user);

        const newBlog = blog.newBlog(
            null,
            formData.blog_post,
            request.session.user.userID,
            formData.blog_title,
            (new Date().toISOString().slice(0, 19).replace('T', ' '))
        );

        if (formData.action === "create") {
            blog.createBlog(newBlog)
                .then(result => {
                    console.log("Blog created:", result);
                    response.redirect("/blog_view_user_post?user_id=" + newBlog.user_id);
                })
                .catch(error => {
                    console.error("Error creating blog:", error);
                response.render("status.ejs", {
                    status: "Failed to create blog",
                    message: "Please login"
                });
            });
    } else if (formData.action === "delete") {
        blog.deleteById(newBlog.blog_id)
            .then(result => {
                console.log("Blog deleted:", result);
                response.redirect("/blog_view_all_post?user_id=" + newBlog.user_id);
            })
            .catch(error => {
                console.error("Error deleting blog:", error);
                response.render("status.ejs", {
                    status: "Failed to delete blog",
                    message: "Database failed to delete blog"
                });
            });
    }
});

blogController.get("/blog_delete", (request, response) => {
    BlogUser.getAllByBlogID(request.query.id)
    .then(editBlog => {
        response.render("blog_delete.ejs", { editBlog })
    }).catch(error => {
        response.render("status.ejs", {
            status: "Database error",
            message: error
        })
        console.error(error)
    }

    )
 })

 blogController.post(
    "/blog_user_delete_confirm", 
    (request, response) => {
        const FormData = request.body;
 
        const editBlog = blog.newBlog(
        FormData.blog_id,
        FormData.blog_post,
        request.session.user.userID,
        FormData.blog_title,
        (new Date().toISOString().slice(0, 19).replace('T', ' '))
    
        );

        if(FormData.action === "create"){
            blog.create(editBlog).then(([result]) => {
                response.redirect("/blog_view_user_post?user_id="+ editBlog.user_id)
                
            }).catch(error => {
                response.render("status.ejs", {
                    status: "Failed to create",
                    message: "Database failed to create blog."
                })
            })

        } else if(FormData.action === "delete"){
            blog.deleteBlog(editBlog.blog_id).then(([result]) => {
                response.redirect("/blog_view_user_post?user_id="+ editBlog.user_id)
                
            }).catch(error => {
                response.render("status.ejs", {
                    status: "Failed to create",
                    message: "Database failed to delete blog"
                })
            })
    }
 })

 
blogController.get("/admin_blog", access_control(["admin"]), (request, response) => {
    const editID = request.query.edit_id;
    if (editID) {
        BlogUser.getAllByBlogID(editID).then(editBlog => {
            BlogUser.getAll().then(allBlogs => {
                response.render("admin_blog.ejs", {
                    allBlogs,
                    editBlog,
                    accessRole: request.session.user.accessRole,
                });
            });
        });
    } else {
        BlogUser.getAll().then(allBlogs => {
            response.render("admin_blog.ejs", {
                allBlogs,
                editBlog: blog.newBlog(0, "", request.session.user.userID, "", ""), // Adjust the parameters as per your `newBlog` function
                accessRole: request.session.user.accessRole,
            });
        });
    }
});

blogController.post("/admin_blog", (request, response) => {
    const formData = request.body;
    console.log("Form Data:", formData);
    console.log("Session User:", request.session.user);

    const newBlog = blog.newBlog(
        formData.blog_id,
        formData.blog_post,
        request.session.user.userID,
        formData.blog_title,
        (new Date().toISOString().slice(0, 19).replace('T', ' '))
    );

    if (formData.action === "create") {
        blog.createBlog(newBlog)
            .then(result => {
                console.log("Blog created:", result);
                response.redirect("/admin_blog?user_id=" + newBlog.user_id);
            })
            .catch(error => {
                console.error("Error creating blog:", error);
                response.render("status.ejs", {
                    status: "Failed to create blog",
                    message: "Please login"
                });
            });
    } else if (formData.action === "update") {
        blog.updateBlog(newBlog)
            .then(result => {
                console.log("Blog updated:", result);
                response.redirect("/admin_blog?user_id=" + newBlog.user_id);
            })
            .catch(error => {
                console.error("Error updating blog:", error);
                response.render("status.ejs", {
                    status: "Failed to update blog",
                    message: "Database failed to update blog"
                });
            });
    } else if (formData.action === "delete") {
        blog.deleteBlog(newBlog.blog_id)
            .then(result => {
                console.log("Blog deleted:", result);
                response.redirect("/admin_blog?user_id=" + newBlog.user_id);
            })
            .catch(error => {
                console.error("Error deleting blog:", error);
                response.render("status.ejs", {
                    status: "Failed to delete blog",
                    message: "Database failed to delete blog"
                });
            });
    }
});



export default blogController;

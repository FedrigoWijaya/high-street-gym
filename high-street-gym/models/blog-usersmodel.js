import { db_conn } from "../database.js";

export function newBlogUser(
  blog_id,
  user_id,
  user_email,
  user_password,
  user_first_name,
  user_last_name,
  user_phone,
  user_username,
  user_roles,
  blog_post,
  blog_title,
  blog_date
) {
  return {
    blog_id,
    user_id,
    user_email,
    user_password,
    user_first_name,
    user_last_name,
    user_phone,
    user_username,
    user_roles,
    blog_post,
    blog_title,
    blog_date,
  };
}

export function getAll() {
  return db_conn
    .query(
      `SELECT * FROM blog 
        INNER JOIN users 
        ON blog.user_id = users.user_id 
        WHERE blog.blog_removed = 0
        `
    )
    .then(([queryResult]) =>
      queryResult.map((result) =>
        newBlogUser(
          result.blog_id,
          result.user_id,
          result.user_email,
          result.user_password,
          result.user_first_name,
          result.user_last_name,
          result.user_phone,
          result.user_username,
          result.user_roles,
          result.blog_post,
          result.blog_title,
          result.blog_date
        )
      )
    );
}

//test

// getAll().then((blogs) => {
//    console.log(blogs)
// })

export function getAllByBlogID(BlogID) {
  return db_conn
    .query(
      `SELECT * FROM blog
        INNER JOIN users
        ON blog.user_id = users.user_id
        WHERE blog.blog_id = ? AND blog.blog_removed = 0`,
      [BlogID]
    )
    .then(([queryResult]) => {
      if (queryResult.length > 0) {
        const result = queryResult[0];
        return newBlogUser(
          result.blog_id,
          result.user_id,
          result.user_email,
          result.user_password,
          result.user_first_name,
          result.user_last_name,
          result.user_phone,
          result.user_username,
          result.user_roles,
          result.blog_post,
          result.blog_title,
          result.blog_date
        );
      } else {
        return Promise.reject("no matching results");
      }
    });
}

export function getAllByUserID(BlogUserID) {
  return db_conn
    .query(
      `SELECT * FROM blog
        INNER JOIN users
        ON blog.user_id = users.user_id
        WHERE users.user_id = ? AND blog.blog_removed = 0`,
      [BlogUserID]
    )
    .then(([queryResult]) =>
      queryResult.map((result) =>
        newBlogUser(
          result.blog_id,
          result.user_id,
          result.user_email,
          result.user_password,
          result.user_first_name,
          result.user_last_name,
          result.user_phone,
          result.user_username,
          result.user_roles,
          result.blog_post,
          result.blog_title,
          result.blog_date
        )
      )
    );
}

//test

// getAllByUserID(25).then((blogs) => {
//   console.log(blogs);
// });

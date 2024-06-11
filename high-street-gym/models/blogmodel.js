import { db_conn } from "../database.js";

export function newBlog(
  blog_id,
  blog_post,
  user_id,
  blog_title,
  blog_date
) {
  return {
    blog_id,
    blog_post,
    user_id,
    blog_title,
    blog_date,
  };
}

export function getAllBlogs() {
  return db_conn.query(`SELECT * FROM blog WHERE blog_removed = 0`).then(([queryResult]) => {
    return queryResult.map((result) =>
      newBlog(
        result.blog_id,
        result.blog_post,
        result.user_id,
        result.blog_title,
        result.blog_date
      )
    );
  });
}

export function getBlogbyID(blogID) {
  return db_conn
    .query(`SELECT * FROM blog WHERE blog_id = ?`, [blogID])
    .then(([queryResult]) => {
      if (queryResult.length > 0) {
        const result = queryResult[0];
        return newBlog(
          result.blog_id,
          result.blog_post,
          result.user_id,
          result.blog_title,
          result.blog_date
        );
      } else {
        return Promise.reject("No matching results");
      }
    });
}

export function getBlogByTitle(blogTitle) {
  return db_conn
    .query(`SELECT * FROM blog WHERE blog_title = ?`, [blogTitle])
    .then(([queryResult]) => {
      if (queryResult.length > 0) {
        const result = queryResult[0];
        return newBlog(
          result.blog_id,
          result.blog_post,
          result.user_id,
          result.blog_title,
          result.blog_date
        );
      } else {
        return Promise.reject("No matching results");
      }
    });
}

export function createBlog(newBlog) {
    return db_conn.query(
        `INSERT INTO blog (blog_post, user_id, 
           blog_title, blog_date)
        VALUES (?, ?,  ?, ?)`,
        [
            newBlog.blog_post,
            newBlog.user_id,
            newBlog.blog_title,
            newBlog.blog_date,
        ]
    );
}
//test///

// const newBlog1 = newBlog(
//     null,
//     "test",
//     23,
//     1,
//     "test",
//     "2024-05-24"
// );

// createBlog(newBlog1)

// //test///


export function updateBlog(newBlog) {
  return db_conn.query(
    `UPDATE blog SET blog_title = ?, blog_post = ?, user_id = ? ,blog_date = ? WHERE blog_id = ?`,
    [
      newBlog.blog_title,
      newBlog.blog_post,
      newBlog.user_id,
      newBlog.blog_date,
      newBlog.blog_id,
    ]);
}

export function deleteBlog(blogID) {
  return db_conn.query(`UPDATE blog SET blog_removed = 1 WHERE blog_id = ?`, [blogID]);
}

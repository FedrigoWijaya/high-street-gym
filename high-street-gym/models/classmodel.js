import { db_conn } from "../database.js";

export function newClasses(
  class_id,
  class_date,
  activity_id,
  location_id,
  class_trainer_user_id,
 
) {
  return {
    class_id,
    class_date,
    activity_id,
    location_id,
    class_trainer_user_id
  };
}

export function getAll() {
  return db_conn
    .query(`SELECT * FROM class WHERE class_removed = 0`)
    .then(([queryResult]) => {
      return queryResult.map((result) =>
        newClasses(
          result.class_id,
          result.class_date,
          result.activity_id,
          result.location_id,
          result.class_trainer_user_id,
        )
      );
    });
}

// getAll().then(allUsers =>   //need to use then to get data
//     {console.log(allUsers)

//     })

export function getByID(class_id) {
  return db_conn
    .query(`SELECT * FROM class WHERE class_id = ? AND class_removed = 0`, [
      class_id,
    ])
    .then(([queryResult]) => {
      if (queryResult.length > 0) {
        const result = queryResult[0];
        return newClasses(
          result.class_id,
          result.class_date,
          result.activity_id,
          result.location_id,
          result.class_trainer_user_id,
        );
      } else {
        return Promise.reject("No results found");
      }
    });
}

export function getBysearch(searchTerm) {
  return db_conn(`
    SELECT * FROM class WHERE class_removed = 0 `);
}

export function create(newClasses) {
  return db_conn.query(
    `INSERT INTO class (class_date, activity_id, location_id, class_trainer_user_id) VALUES (?, ?, ?, ?)`,
    [
      newClasses.class_date,
      newClasses.activity_id,
      newClasses.location_id,
      newClasses.class_trainer_user_id
    ]
  );
}

export function update(newClasses) {
  return db_conn.query(
    `UPDATE class SET class_date = ?, activity_id = ?, location_id = ?, class_trainer_user_id = ? WHERE class_id = ?`,
    [
      newClasses.class_date,
      newClasses.activity_id,
      newClasses.location_id,
      newClasses.class_trainer_user_id,
      newClasses.class_id
    ]
  );
}

export function deleteByID(class_id) {
  return db_conn.query(`
  UPDATE class
  SET class_removed = 1 
  where class_id = ?`, [class_id]); //code is just removed from the website but not from the database itself
}

import { db_conn } from "../database.js";

export function newClassActivityUser(
  class_id,
  activity_id,
  location_id,
  class_trainer_user_id,
  class_trainer_first_name,
  class_trainer_last_name,
  class_date,
  location_name,
  activity_name,
  activity_description,
  activity_duration
) {
  return {
    class_id,
    activity_id,
    location_id,
    class_trainer_user_id,
    class_trainer_first_name,
    class_trainer_last_name,
    class_date,
    location_name,
    activity_name,
    activity_description,
    activity_duration
  };
}

export function getAll() {
  return db_conn.query(
    `SELECT class.*, 
            trainer_user.user_first_name AS class_trainer_first_name,
            trainer_user.user_last_name AS class_trainer_last_name,
            activity.activity_name,
            activity.activity_description,
            activity.activity_duration,
            location.location_name 
     FROM class 
     INNER JOIN users AS trainer_user 
       ON class.class_trainer_user_id = trainer_user.user_id
     INNER JOIN activity 
       ON class.activity_id = activity.activity_id 
     INNER JOIN location 
       ON location.location_id = class.location_id
     WHERE class.class_removed = 0`
  ).then(([queryResult]) => {
    return queryResult.map(result =>
      newClassActivityUser(
        result.class_id,
        result.activity_id,
        result.location_id,
        result.class_trainer_user_id,
        result.class_trainer_first_name,
        result.class_trainer_last_name,
        result.class_date,
        result.location_name,
        result.activity_name,
        result.activity_description,
        result.activity_duration
      )
    );
  });
}

export function getByClassID(class_id) {
  return db_conn.query(
    `SELECT class.*, 
            trainer_user.user_first_name AS class_trainer_first_name,
            trainer_user.user_last_name AS class_trainer_last_name,
            activity.activity_name,
            activity.activity_description,
            activity.activity_duration,
            location.location_name 
     FROM class 
     INNER JOIN users AS trainer_user 
       ON class.class_trainer_user_id = trainer_user.user_id
     INNER JOIN activity 
       ON class.activity_id = activity.activity_id 
     INNER JOIN location 
       ON location.location_id = class.location_id 
     WHERE class.class_removed = 0 AND class.class_id = ?`,
    [class_id]
  ).then(([queryResult]) => {
    if (queryResult.length > 0) {
      const result = queryResult[0];
      return newClassActivityUser(
        result.class_id,
        result.activity_id,
        result.location_id,
        result.class_trainer_user_id,
        result.class_trainer_first_name,
        result.class_trainer_last_name,
        result.class_date,
        result.location_name,
        result.activity_name,
        result.activity_description,
        result.activity_duration
      );
    } else {
      return Promise.reject("no matching result");
    }
  });
}

export function getByDateRange(startDate, endDate) {
  return db_conn.query(
    `SELECT class.*, 
            trainer_user.user_first_name AS class_trainer_first_name,
            trainer_user.user_last_name AS class_trainer_last_name,
            activity.activity_name,
            activity.activity_description,
            activity.activity_duration,
            location.location_name 
     FROM class 
     INNER JOIN users AS trainer_user 
       ON class.class_trainer_user_id = trainer_user.user_id
     INNER JOIN activity 
       ON class.activity_id = activity.activity_id 
     INNER JOIN location 
       ON location.location_id = class.location_id 
     WHERE class.class_removed = 0 AND (class_date BETWEEN ? AND ?)`,
    [startDate, endDate]
  ).then(([queryResult]) => {
    return queryResult.map(result =>
      newClassActivityUser(
        result.class_id,
        result.activity_id,
        result.location_id,
        result.class_trainer_user_id,
        result.class_trainer_first_name,
        result.class_trainer_last_name,
        result.class_date,
        result.location_name,
        result.activity_name,
        result.activity_description,
        result.activity_duration
      )
    );
  });
}

export function getByLocationID(location_id) {
  return db_conn.query(
    `SELECT class.*, 
            trainer_user.user_first_name AS class_trainer_first_name,
            trainer_user.user_last_name AS class_trainer_last_name,
            activity.activity_name,
            activity.activity_description,
            activity.activity_duration,
            location.location_name 
     FROM class 
     INNER JOIN users AS trainer_user 
       ON class.class_trainer_user_id = trainer_user.user_id
     INNER JOIN activity 
       ON class.activity_id = activity.activity_id 
     INNER JOIN location 
       ON location.location_id = class.location_id 
     WHERE class.class_removed = 0 AND class.location_id = ?`,
    [location_id]
  ).then(([queryResult]) => {
    return queryResult.map(result => newClassActivityUser(
      result.class_id,
      result.activity_id,
      result.location_id,
      result.class_trainer_user_id,
      result.class_trainer_first_name,
      result.class_trainer_last_name,
      result.class_date,
      result.location_name,
      result.activity_name,
      result.activity_description,
      result.activity_duration
    ));
  });
}

export function getBySearchNameTrainer(searchTerm) {
  return db_conn.query(
    `SELECT class.*, 
            trainer_user.user_first_name AS class_trainer_first_name,
            trainer_user.user_last_name AS class_trainer_last_name,
            activity.activity_name,
            activity.activity_description,
            activity.activity_duration,
            location.location_name 
     FROM class 
     INNER JOIN users AS trainer_user 
       ON class.class_trainer_user_id = trainer_user.user_id
     INNER JOIN activity 
       ON class.activity_id = activity.activity_id 
     INNER JOIN location 
       ON location.location_id = class.location_id 
     WHERE class.class_removed = 0 
       AND (trainer_user.user_first_name LIKE ? OR trainer_user.user_last_name LIKE ?)`,
    [`%${searchTerm}%`, `%${searchTerm}%`]
  ).then(([queryResult]) => {
    if (queryResult.length > 0) {
      return queryResult.map(result =>
        newClassActivityUser(
          result.class_id,
          result.activity_id,
          result.location_id,
          result.class_trainer_user_id,
          result.class_trainer_first_name,
          result.class_trainer_last_name,
          result.class_date,
          result.location_name,
          result.activity_name,
          result.activity_description,
          result.activity_duration
        )
      );
    } else {
      return Promise.reject("no matching results");
    }
  });
}

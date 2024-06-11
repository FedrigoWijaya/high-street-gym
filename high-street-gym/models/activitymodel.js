import { db_conn } from "../database.js";

export function newActivity(
    activity_id,
    activity_name,
    activity_description,
    activity_duration
) {
    return {
        activity_id,
        activity_name,
        activity_description,
        activity_duration
    };
}

export function getAll() {
    return db_conn.query(`SELECT * FROM activity`)
        .then(([queryResult]) => {
            return queryResult.map(
                result => newActivity(
                    result.activity_id,
                    result.activity_name,
                    result.activity_description,
                    result.activity_duration
                )
            );
        });
}

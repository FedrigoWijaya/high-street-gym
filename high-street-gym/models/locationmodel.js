import { db_conn } from "../database.js";

export function newLocation(
    location_id,
    location_name
    )
{
    return {
        location_id,
        location_name
    };
}

// locationmodel.js

export function getById(location_id) {
    return db_conn.query(
        `SELECT * FROM locations WHERE location_id = ?`,
        [location_id]
    ).then(([queryResult]) => {
            return queryResult.map(result => newLocation
                (result.location_id,
                    result.location_name
                ));
        });

}


export function getAllLocations() {
    return db_conn.query(`SELECT * FROM location`)
        .then(([queryResult]) => {
            return queryResult.map(result => newLocation(
                result.location_id,
                result.location_name
            ));
        });
}

export function getLocationByName(locationName) {
    return db_conn.query(`SELECT * FROM location WHERE location_name = ?`, [locationName])
        .then(([queryResult]) => {
            if (queryResult.length > 0) {
                const result = queryResult[0];
                return newLocation(
                    result.location_id,
                    result.location_name
                );
            } else {
                return Promise.reject("No matching results");
            }
        });
}
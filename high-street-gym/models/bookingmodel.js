import { db_conn } from "../database.js"

export function newBooking (
    booking_id,
    booking_datetime,
    user_id,
    class_id,
    booking_status

) {

    return {
        booking_id,
        booking_datetime,
        user_id,
        class_id,
        booking_status
    }

}


export function getAll() {
    return db_conn.query("SELECT * FROM booking WHERE booking_removed = 0")
        .then(([queryResult]) => {
            return queryResult.map(
                result => newBooking(
                    result.booking_id,
                    result.booking_datetime,
                    result.user_id,
                    result.class_id,
                   result.booking_status
                )
            )
        })
}

export function getBybookingId(bookingID) {
    return db_conn.query("SELECT * FROM booking WHERE booking_id = ? AND booking_removed = 0" , [bookingID])
        .then(([queryResult]) => {
            // check that at least 1 match was found
            if (queryResult.length > 0) {
                // get the first matching result
                const result = queryResult[0]

                // convert result into a model object
                return newBooking(
                    result.booking_id,
                    result.booking_datetime,
                    result.user_id,
                    result.class_id,
                    result.booking_status
                )
            } else {
                return Promise.reject("no matching results")
            }

        })
}

export function getByUserid(user_id) {
    return db_conn.query(`SELECT * FROM booking WHERE user_id = ? AND booking_removed = 0`, 
    [user_id])
        .then(([queryResult]) => {
        // check that order was found
        if (queryResult.length > 0) {
            // get matching result
            const result = queryResult[0]

            // convert result into a object
            return queryResult.map(
                result => newBooking(
                    result.booking_id,
                    result.booking_datetime,
                    result.user_id,
                    result.class_id,
                    result.booking_status
                )
            )
        } else {
            return Promise.reject("no matching results")
        }

    })
}

export function create(newBooking) {
    return db_conn.query(
        `
        INSERT INTO booking
        (class_id, user_id, booking_datetime, booking_status) 
        VALUES (?, ?, ?, ?)
    `,
        [
            newBooking.class_id,
            newBooking.user_id,
            newBooking.booking_datetime,
            newBooking.booking_status
        ]
    );
}


export function update(newBooking) {
    return db_conn.query(
        `
        UPDATE booking
        SET class_id =?,
        user_id = ?,
        booking_datetime = ?
        booking_status = ?
        WHERE booking_id = ?
    `,
        [
            newBooking.class_id,
            newBooking.user_id,
            newBooking.booking_datetime,
            newBooking.booking_status,
            newBooking.booking_id
    
        ]  
    );
}

export function updatestatusbyid(bookingID, status) {
    return db_conn.query(
        `UPDATE booking 
        SET booking_status = ?
        WHERE booking_id = ?`,
        [status, bookingID]
    );
}

export function deleteById(bookingID) {
    // Instead of actually deleting products we just flag them
    // as removed. This allows us to hide "deleted" products, while
    // still maintaining referential integrity with the orders table.
    return db_conn.query(`
    UPDATE booking
    SET booking_removed = 1
    WHERE booking_id = ?
    `, [bookingID])
;
}

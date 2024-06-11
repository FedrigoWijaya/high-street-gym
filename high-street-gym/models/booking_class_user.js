import { db_conn } from "../database.js";

export function newBookingClassUser(
    booking_id,
    class_id,
    user_id,
    location_id,
    location_name,
    user_email,
    user_password,
    user_first_name,
    user_last_name,
    user_phone,
    user_username,
    user_roles,
    booking_status,
    booking_datetime,
    class_date,
    class_trainer_user_id,
    activity_id,
    activity_name,
    activity_description,
    activity_duration
) {
    return {
        booking_id,
        class_id,
        user_id,
        location_id,
        location_name,
        user_email,
        user_password,
        user_first_name,
        user_last_name,
        user_phone,
        user_username,
        user_roles,
        booking_status,
        booking_datetime,
        class_date,
        class_trainer_user_id,
        activity_id,
        activity_name,
        activity_description,
        activity_duration
    };
}

export function getAll() {
    return db_conn.query(
        `
        SELECT * FROM booking
        INNER JOIN class
        ON booking.class_id = class.class_id
        INNER JOIN users
        ON booking.user_id = users.user_id
        INNER JOIN activity
        ON class.activity_id = activity.activity_id
        WHERE booking.booking_removed = 0
    `
    ).then(([queryResult]) => {
        return queryResult.map(
            result => newBookingClassUser(
                result.booking_id,
                result.class_id,
                result.user_id,
                result.location_id,
                result.location_name,
                result.user_email,
                result.user_password,
                result.user_first_name,
                result.user_last_name,
                result.user_phone,
                result.user_username,
                result.user_roles,
                result.booking_status,
                result.booking_datetime,
                result.class_date,
                result.class_trainer_user_id,
                result.activity_id,
                result.activity_name,
                result.activity_description,
                result.activity_duration
            )
        );
    });
}

export function getAllBybookingId(booking_id) {
    return db_conn.query(`
    SELECT * FROM booking
    INNER JOIN class
    ON booking.class_id = class.class_id
    INNER JOIN users
    ON booking.user_id = users.user_id
    INNER JOIN activity
    ON class.activity_id = activity.activity_id
    WHERE booking.booking_removed = 0 AND booking.booking_id = ? 
    `,
    [booking_id]
    ).then(([queryResult]) => {
        return queryResult.map(
            result => newBookingClassUser(
                result.booking_id,
                result.class_id,
                result.user_id,
                result.location_id,
                result.location_name,
                result.user_email,
                result.user_password,
                result.user_first_name,
                result.user_last_name,
                result.user_phone,
                result.user_username,
                result.user_roles,
                result.booking_status,
                result.booking_datetime,
                result.class_date,
                result.class_trainer_user_id,
                result.activity_id,
                result.activity_name,
                result.activity_description,
                result.activity_duration
            )
        );
    });
}

export function getAllByUserID(user_ID) {
    return db_conn.query(
        `
        SELECT * FROM booking
        INNER JOIN class
        ON booking.class_id = class.class_id
        INNER JOIN users
        ON booking.user_id = users.user_id
        INNER JOIN activity
        ON class.activity_id = activity.activity_id
        WHERE booking.booking_removed = 0 AND booking.user_id = ? 
    `,
        [user_ID]
    ).then(([queryResult]) => {
        return queryResult.map(
            result => newBookingClassUser(
                result.booking_id,
                result.class_id,
                result.user_id,
                result.location_id,
                result.location_name,
                result.user_email,
                result.user_password,
                result.user_first_name,
                result.user_last_name,
                result.user_phone,
                result.user_username,
                result.user_roles,
                result.booking_status,
                result.booking_datetime,
                result.class_date,
                result.class_trainer_user_id,
                result.activity_id,
                result.activity_name,
                result.activity_description,
                result.activity_duration
            )
        );
    });
}

export function getByClassId(class_id) {
    return db_conn.query(
        `
        SELECT * FROM booking
        INNER JOIN class
        ON booking.class_id = class.class_id
        INNER JOIN users
        ON booking.user_id = users.user_id
        INNER JOIN activity
        ON class.activity_id = activity.activity_id
        WHERE class.class_id = ? AND booking_removed = 0
    `,
        [class_id]
    ).then(([queryResult]) => {
        return queryResult.map(
            result => newBookingClassUser(
                result.booking_id,
                result.class_id,
                result.user_id,
                result.location_id,
                result.location_name,
                result.user_email,
                result.user_password,
                result.user_first_name,
                result.user_last_name,
                result.user_phone,
                result.user_username,
                result.user_roles,
                result.booking_status,
                result.booking_datetime,
                result.class_date,
                result.class_trainer_user_id,
                result.activity_id,
                result.activity_name,
                result.activity_description,
                result.activity_duration
            )
        );
    });
}

export function getByMemberSearch(searchTerm) {
    return db_conn.query(
        `
        SELECT * FROM booking
        INNER JOIN class
        ON booking.class_id = class.class_id
        INNER JOIN users
        ON booking.user_id = users.user_id
        INNER JOIN activity
        ON class.activity_id = activity.activity_id
        WHERE (users.user_first_name LIKE ? OR users.user_last_name LIKE ?) AND booking_removed = 0
        `,
        [`%${searchTerm}%`, `%${searchTerm}%`]
    ).then(([queryResult]) => {
        return queryResult.map(
            result => newBookingClassUser(
                result.booking_id,
                result.class_id,
                result.user_id,
                result.location_id,
                result.location_name,
                result.user_email,
                result.user_password,
                result.user_first_name,
                result.user_last_name,
                result.user_phone,
                result.user_username,
                result.user_roles,
                result.booking_status,
                result.booking_datetime,
                result.class_date,
                result.class_trainer_user_id,
                result.activity_id,
                result.activity_name,
                result.activity_description,
                result.activity_duration
            )
        );
    });
}

export function getAllByBookingStatus(booking_status) {
    return db_conn.query(
        `
        SELECT * FROM booking
        INNER JOIN class
        ON booking.class_id = class.class_id
        INNER JOIN users
        ON booking.user_id = users.user_id
        INNER JOIN activity
        ON class.activity_id = activity.activity_id
        WHERE booking_removed = 0 AND booking_status = ?
    `,
        [booking_status]
    ).then(([queryResult]) => {
        return queryResult.map(
            result => newBookingClassUser(
                result.booking_id,
                result.class_id,
                result.user_id,
                result.location_id,
                result.location_name,
                result.user_email,
                result.user_password,
                result.user_first_name,
                result.user_last_name,
                result.user_phone,
                result.user_username,
                result.user_roles,
                result.booking_status,
                result.booking_datetime,
                result.class_date,
                result.class_trainer_user_id,
                result.activity_id,
                result.activity_name,
                result.activity_description,
                result.activity_duration
            )
        );
    });
}

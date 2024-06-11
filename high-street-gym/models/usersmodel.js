import { db_conn } from "../database.js";

export function newUsers(
    user_id,
    user_email,
    user_password,
    user_first_name,
    user_last_name,
    user_phone,
    user_username,
    user_roles
) {
    return {
        user_id,
        user_email,
        user_password,
        user_first_name,
        user_last_name,
        user_phone,
        user_username,
        user_roles
    };
}

// Create
export function createUser(NewUser) {
    return db_conn.query(
        `
        INSERT INTO users 
        (user_email, user_password, user_first_name, user_last_name, user_phone, user_username, user_roles)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
        [NewUser.user_email, 
        NewUser.user_password, 
        NewUser.user_first_name, 
        NewUser.user_last_name, 
        NewUser.user_phone, 
        NewUser.user_username, 
        NewUser.user_roles]
    );
}

// Read
export function getAllUsers() {
    return db_conn.query(`SELECT * FROM users where user_removed = 0`)
        .then(([queryResult]) => {
            return queryResult.map(
                result => newUsers(
                    result.user_id,
                    result.user_email,
                    result.user_password,
                    result.user_first_name,
                    result.user_last_name,
                    result.user_phone,
                    result.user_username,
                    result.user_roles
                )
            )
        })
}

export function getUserById(userId) {
    return db_conn.query(`SELECT * FROM users WHERE user_id = ?`, [userId])
        .then(([queryResult]) => {
            if (queryResult.length > 0) {
                const result = queryResult[0]
                return newUsers(
                    result.user_id,
                    result.user_email,
                    result.user_password,
                    result.user_first_name,
                    result.user_last_name,
                    result.user_phone,
                    result.user_username,
                    result.user_roles,
                )
            } else {
                return Promise.reject("No matching results")
            }
        })
}

export function getUserByUsername(username) {
    return db_conn.query(`SELECT * FROM users WHERE user_username = ?`, [username])
        .then(([queryResult]) => {
            if (queryResult.length > 0) {
                const result = queryResult[0]
                return newUsers(
                    result.user_id,
                    result.user_email,
                    result.user_password,
                    result.user_first_name,
                    result.user_last_name,
                    result.user_phone,
                    result.user_username,
                    result.user_roles
                )
            } else {
                return Promise.reject("No matching results")
            }
        })
}

export function getByRole(role) {
    return db_conn.query(`SELECT * FROM users WHERE user_roles = ?`, [role])
        .then(([queryResult]) => {
            return queryResult.map(result =>
                newUsers(
                    result.user_id,
                    result.user_email,
                    result.user_password,
                    result.user_first_name,
                    result.user_last_name,
                    result.user_phone,
                    result.user_username,
                    result.user_roles
                )
            );
        });
}

// Update
export function updateUser(NewUser) {
    return db_conn.query(
        `
        UPDATE users
        SET user_email = ?, user_password = ?, user_first_name = ?, user_last_name = ?, user_phone = ?, user_username = ?, user_roles = ?
        WHERE user_id = ?
    `,
        [
            NewUser.user_email, 
            NewUser.user_password, 
            NewUser.user_first_name, 
            NewUser.user_last_name, 
            NewUser.user_phone, 
            NewUser.user_username, 
            NewUser.user_roles, 
            NewUser.user_id
        ]
    );
}

export function getByTrainerRole(role) {
    return db_conn.query(`SELECT * FROM users WHERE user_roles = trainer`, [role])
        .then(([queryResult]) => {
            return queryResult.map(result =>
                newUsers(
                    result.user_id,
                    result.user_email,
                    result.user_password,
                    result.user_first_name,
                    result.user_last_name,
                    result.user_phone,
                    result.user_username,
                    result.user_roles
                )
            );
        });
}

// Delete
export function deleteUserById(userId) {
    return db_conn.query(`UPDATE users SET user_removed = 1 WHERE user_id = ?`, [userId]);
}


// getAllUsers().then((user1) => {
//    console.log(user1)
// })

const user1 = newUsers(
    1,
    "john.doe@example.com",
    "securePassword123",
    "John",
    "Doe",
    "1234567890",
    "johndoe",
    "member"
);
import mysql from "mysql2/promise";

export const db_conn = mysql.createPool({
    host: "localhost", //depend on the mysql workbench host name
    port: 3306, // This port might differ in depends on the mysql workbench port number
    user: "high-gym-admin", //server username
    password: "Tafe-qld-2024-z!@azxc", //server PASSWORD
    database: "high-street-gym-db", //database name
});

export function convertToMySQLDate(date) {
    const year = date.toLocaleString('default', { year: 'numeric' });
    const month = date.toLocaleString('default', { month: '2-digit' });
    const day = date.toLocaleString('default', { day: '2-digit' });
    const hours = date.toLocaleString('default', { hour: '2-digit'});
    const minutes = date.toLocaleString('default', { minute: '2-digit' });
    const seconds = date.toLocaleString('default', { second: '2-digit' });

    return [year, month, day].join('-') + ' ' + [hours, minutes, seconds].join(':');
}

  

  
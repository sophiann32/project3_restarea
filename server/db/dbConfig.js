const oracledb = require('oracledb');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECTION_STRING
};

async function getConnection() {
    return await oracledb.getConnection(dbConfig);
}
oracledb.initOracleClient({ libDir: 'C:\\JEWi\\Util\\instantclient_21_13' });
//
// oracledb.initOracleClient({ libDir: 'C:\\SHJO\\Util\\instantclient_21_13' });

// oracledb.initOracleClient({ libDir: 'C:\\instantclient_21_13' });


module.exports = {
    getConnection
};

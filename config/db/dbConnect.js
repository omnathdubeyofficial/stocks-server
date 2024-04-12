//Import section
import mysql from 'mysql';
import util from 'util';
import dotenv from 'dotenv';
dotenv.config();

//Local host
const dbConfig = {
    host : process.env.MYSQL1_DBHOST,
    user : process.env.MYSQL1_DBUSER,
    password : process.env.MYSQL1_DBPASSWORD,
    database : process.env.MYSQL1_DATABASE,
    multipleStatements: true,
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
}


// Connection pool
const dbConnectionPool = mysql.createPool(dbConfig);

// Promisify the pool to use ES8 asyn/await
dbConnectionPool.query = util.promisify(dbConnectionPool.query)

// Export db connection pool
export default dbConnectionPool;
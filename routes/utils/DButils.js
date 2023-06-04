require("dotenv").config();
const MySql = require("./MySql");

exports.execQuery = async function (query, params) {
    let returnValue = []
const connection = await MySql.connection();
    try {
    await connection.query("START TRANSACTION");
    returnValue = await connection.query(query, params);
  } catch (err) {
    await connection.query("ROLLBACK");
    console.log('ROLLBACK at querySignUp', err);
    // throw {code: err.code, message: err.sqlMessage};
  } finally {
    await connection.release();
  }
  return returnValue
}


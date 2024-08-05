import {createPool} from "mysql12";
import 'dotenv/config'

let connection = createPool({
  host: process.env.hostDb,
  user: process.env.userDb,
  password: process.env.passwordDb,
  database: process.env.dbName,
  multipleStatements: true,
  connectionLimit: 30
})
connection.on('connection', (err) => {
    if(err) throw new Error('Couldn\'t connect to the database.Please try again later')
})
export {
    connection
}



import express from 'express'
 import path from 'path'
 import {connection as db} from './config/index.js'
 
 //Create an express app
 
 const app = express()
 const port = +process.env.PORT || 4000
 const router = express.Router()
 
 //Middleware  process that happens between request and response 
 app.use(router,
   express.static('./static'),
 express.json(),
 express.urlencoded({
  extended: true
 }))
 
 //Endpoint we want to give user the option to specify  /eShopping

 router.get('^/$|/eShopping', (req, res) => {
  res.status(200).sendFile(path.resolve('./static/html/index.html'))
})
router.get('/users', (req, res) => {
try {
const strQry = `
SELECT firstname, lastName, age, emailAdd
FROM Users;`
db.query(strQry, (err, results) => {
  if(err)  throw new Error(err)
      res.json({
  status: res.statusCode, results
      })
})
} catch(e) {
  res.json({
      status: 404,
      msg: e.message //e.message is the error message in in the if statements
  })
}
})

router.get('/user/:id', (req, res) => {
  try{
    const strQry = `
    SELECT userID, firstName, lastName, age, emailAdd
    FROM Users
    WHERE userID = ${req.params.id}; `

    db.query(strQry), (err, result) =>{
      id (err) throw new Error ('Issue when retrieving a user
        ')
    }
  }
})

app.listen(port, () => { // listen method assigns a port number to a server
  console.log(`Server is running on ${port}`)
})



 //app.listen assigns a port number to the server
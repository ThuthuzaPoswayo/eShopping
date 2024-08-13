import express from "express";
import path from "path";
import { connection as db } from "./config/index.js";
import { hash } from "bcrypt";
import "dotenv/config";
import bodyParser from "body-parser";

const port = +process.env.PORT || 4000;

// Create an express app
const app = express();
const router = express.Router();

router.use(bodyParser.json());
// Middleware
app.use(
  router,
  express.static("./static"),
  express.json(),
  express.urlencoded({
    extended: true,
  })
);
// Endpoints
// homepage end-point : used to get the homepage
router.get("^/$|/eShop", (req, res) => {
  res.status(200).sendFile(path.resolve("./static/html/index.html"));
});

// users end-point : used to get all the users
router.get("/users", (req, res) => {
  try 
  {
    const strQry = `
      SELECT firstName, lastName, age, emailAdd, userRole, profileURL
      FROM Users;
      `;
    db.query(strQry, (err, results) => {
      if (err) throw new Error("Issue when retrieving all users.");
      res.json({
        status: res.statusCode,
        results,
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});

// user end-point : used to get user by id
router.get("/user/:id", (req, res) => {
  try {
    const strQry = `
      SELECT userID, firstName, lastName, age, emailAdd, userProfile, ProfileURL
      FROM Users
      WHERE userID = ${req.params.id};
      `;
    db.query(strQry, (err, result) => {
      if (err) throw new Error("Issue when retrieving a user.");
      res.json({
        status: res.statusCode,
        result: result[0],
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});

// update user end-point : used to update user by id
router.patch("/user/:id", async (req, res) => {
  try {
    let data = req.body;
    if (data.pwd) {
      data.pwd = await hash(data.pwd, 12);
    }
    const strQry = `
    update Users
    SET ?
    where userID = ${req.params.id};
    `;
    db.query(strQry, [data], (err, results) => {
      if (err) throw new Error("Unable to update user");
      res.json({
        status: res.statusCode,
        msg: "Congartulations you have successfully updated the user!",
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});

// error page end-point : to handle a bad request
router.get("*", (req, res) => {
  res.json({
    status: 404,
    msg: "Resource not found",
  });
});

// delete user end-point : deletes user by id
router.delete("/user/:id", (req, res) => {
  try {
    const strQry = `
    DELETE FROM Users
    WHERE userID = ${req.params.id};`;
    db.query(strQry, (err) => {
      if (err)
        throw new Error("To delete a user, please review your delete query.");
      res.json({
        status: res.statusCode,
        msg: "A user 's information was removed",
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});

// login end-point : to login a user
router.post("/login", (req, res) => {
  try {
    const { emailAdd, pwd } = req.body;
    const strQry = `
    SELECT userID, firstName, lastName, age, emailAdd, pwd, userProfile, ProfileURL
    from Users
    WHERE emailAdd = '${emailAdd}'`;
    db.query(strQry, async (err, results) => {
      if (err) throw new Error("To login please review your query.");
      res.json({
        status: res.statusCode,
        results,
      });
    });
  } catch (err) {
    console.log(err);
  }
});

//app.listen assigns a port number to the server

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

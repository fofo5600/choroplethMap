const express = require("express");
const bodyParser = require("body-parser");
const userController = require("./controllers/userController");

// db instance connection
require("./config/db");

const app = express();

const port = process.env.PORT || 3301;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// API ENDPOINTS

app
  .route("/user")
  .get(userController.listAllUsers)
  .post(userController.createNewUser);

app
.route("/paisesFiltro")
.post(userController.cityByNumUser);

  app
    .route("/datacsv")
    .post(userController.csvToDB);

app
  .route("/user/delete")
  .get(userController.readUser)
  .put(userController.updateUser)
  .post(userController.deleteUser);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

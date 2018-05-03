const mongoose = require("mongoose");

const dbURI =
  "mongodb://test_user:test1@cluster0-shard-00-00-1bkgw.mongodb.net:27017,cluster0-shard-00-01-1bkgw.mongodb.net:27017,cluster0-shard-00-02-1bkgw.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";

const options = {
  reconnectTries: Number.MAX_VALUE,
  poolSize: 10
};

mongoose.connect(dbURI, options).then(
  () => {
    console.log("Database connection established!");
  },
  err => {
    console.log("Error connecting Database instance due to: ", err);
  }
);

// require any models

require("../models/user");

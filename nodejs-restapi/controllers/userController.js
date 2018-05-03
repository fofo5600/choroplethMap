var fs = require('fs');
var csv = require('fast-csv');


const User = require("../models/user");

exports.listAllUsers = (req, res) => {
  User.find({}, (err, User) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(User);
  });
};

exports.cityByNumUser = (req, res) => {

  var paises = {};
  var query = {};

  if (req.body.sex != '') {
    query.sex = req.body.sex;
  }
  if (req.body.edadMayor != '' || req.body.edadMenor != '') {
    query.date_of_birth = {};
    if (req.body.edadMayor != '' ) {
      query.date_of_birth.$gt = new Date(new Date().setYear(new Date().getFullYear() - req.body.edadMayor));
    }
    if (req.body.edadMenor != '') {
      query.date_of_birth.$lt = new Date(new Date().setYear(new Date().getFullYear() - req.body.edadMenor));
    }
  }

  User.find(query, (err, User) => {
    if (err) {
      res.status(500).send(err);
    }
    for (var i = 0, len = User.length; i < len; i++) {
      if(User[i].nationality in paises) {
        paises[User[i].nationality] +=1;
      } else {
        paises[User[i].nationality] = 1;
      }
    }
    res.status(200).json(paises);

});

};

exports.createNewUser = (req, res) => {
  let newUser = new User(req.body);
  newUser.save((err, User) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(201).json(User);
  });
};

//Conversion de csv a json para la DB
exports.csvToDB = (req, res) => {
  var errorUser = [];
  fs.createReadStream('csv/users.csv')
  .pipe(csv())
  .on('data', function(data) {
    if(data[0] != 'id') {
      var newUser = new User({
        id: data[0],
        name: data[1],
        nationality: data[2],
        sex: data[3],
        date_of_birth: data[4]
      });
    newUser.save((err, User) => {
      if (err) {
        errorUser.push(newUser);
      }
    });
  }
  }).on('end', function(data){
      res.status(200).json(errorUser);
  })
};

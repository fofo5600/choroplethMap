var fs = require('fs');
var csv = require('fast-csv');


const User = require("../models/user");

exports.listAllUsers = (req, res) => {
  User.find({}, (err, User) => {
    if (err) {
      res.status(500).send(err);
    }
    console.log(User);
    res.status(200).json(User);
  });
};

exports.cityByNumUser = (req, res) => {

  var paises = {};
  var query = {};

  if (req.body.sex != '') {
    console.log("enotr");
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

  console.log(query);

  // {:profile.birthday":{$lt: new Date(new Date().setYear(new Date().getFullYear() - fromAge)), $gt: new Date(new Date().setYear(new Date().getFullYear() - toAge))}


  User.find(query, (err, User) => {
    if (err) {
      res.status(500).send(err);
    }
    for (var i = 0, len = User.length; i < len; i++) {
      if(User[i].nationality in paises) {

        paises[User[i].nationality] +=1;
      } else {
        // paises.push(User[i].nationality);
        paises[User[i].nationality] = 1;
      }
    }
    // User.forEach (function (user) {
    //   console.log(user.nationality);
      //
    //     console.log("else");
    //     paises.push(user.nationality);
        // paises[user.nationality] = 1;
      // }
    res.status(200).json(paises);
  // });

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

exports.readUser = (req, res) => {
  User.findById(req.params.Userid, (err, User) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(User);
  });
};

exports.updateUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.Userid },
    req.body,
    { new: true },
    (err, User) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(User);
    }
  );
};

exports.deleteUser = (req, res) => {
  User.remove({ _id: req.userid }, (err, User) => {
    if (err) {
      res.status(404).send(err);
    }
    res.status(200).json({ message: "User successfully deleted" });
  });
};

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
  } else {
    console.log(data);
  }
  }).on('end', function(data){
    console.log('end');
      res.status(200).json(errorUser);
  })
};

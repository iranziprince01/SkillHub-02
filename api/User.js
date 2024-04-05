const express = require("express");
const router = express.Router();

//database user model
const User = require("./../models/User");

//password handler
const bcrypt = require("bcrypt");

//signup
router.post("/signup", (req, res) => {
  let { fullName, email, password, dateOfBirth } = req.body;
  name = fullName;
  email = email;
  password = password;
  dateOfBirth = dateOfBirth;

  if (name == "" || email == "" || password == "" || dateOfBirth == "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields!",
    });
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    res.json({
      status: "FAILED",
      message: "Invalid name entered",
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "Invalid email entered",
    });
  } else if (!new Date(dateOfBirth).getTime()) {
    res.json({
      status: "FAILED",
      message: "Invalid date of birth entered",
    });
  } else if (password.length < 8) {
    res.json({
      status: "FAILED",
      message: "password entered is too short!",
    });
  } else {
    //checking if the user already exists
    User.find({ email })
      .then((result) => {
        if (result.length) {
          //A user already exists
          res.json({
            status: "FAILED",
            message: "User with the same email already exists",
          });
        } else {
          //New user creation

          //password hashing
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then((hashedPassword) => {
              const newUser = new User({
                name,
                email,
                password: hashedPassword,
                dateOfBirth,
              });

              newUser
                .save()
                .then((result) => {
                  res.json({
                    status: "SUCCESS",
                    message: "Signup successful",
                    data: result,
                  });
                })
                .catch((err) => {
                  res.json({
                    status: "FAILED",
                    message: "An error occured while saving user account!",
                  });
                });
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "An error occured while hashing password",
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "An error occurred while checking for existing user!",
        });
      });
  }
});

//signin
router.post("/signin", (req, res) => {
  let { email, password } = req.body;
  email = email;
  password = password;

  if (email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Empty login credentials",
    });
  } else {
    //Check if a user exists
    User.find({ email })
      .then((data) => {
        if (data.length) {
          //User exists

          const hashedPassword = data[0].password;
          bcrypt
            .compare(password, hashedPassword)
            .then((result) => {
              if (result) {
                //password matching
                res.json({
                  status: "SUCCESS",
                  message: "Login successful",
                  data: data,
                });
              } else {
                res.json({
                  status: "FAILED",
                  message: "Invalid password entered!",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "An error occured while comparing passwords",
              });
            });
        } else {
          res.json({
            status: "FAILED",
            message: "Invalid credentials entered!",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "FAILED",
          message: "An error occured while checking for existing user",
        });
      });
  }
});

module.exports = router;

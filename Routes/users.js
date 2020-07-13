//jshint esversion:8
const express = require("express");
const routes = require("express").Router();
const { User } = require("../db");
const taskRoute = require("./tasks");
const bcrypt = require("bcrypt");
const saltRounds = 10;

routes.use("/tasks", taskRoute);

routes
   .get("/getall", (req, res) => {
      User.find((err, found) => {
         if (err) {
            res.status(500).send(err.message);
         } else {
            res.send(found);
         }
      });
   })

   .post("/register", (req, res) => {
      bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
         if (err) {
            console.log(err);
         } else {
            const user = new User({
               fname: req.body.fname,
               lname: req.body.lname,
               email: req.body.email,
               password: hash,
               userCategories: [],
               userClients: [],
            });

            User.findOne(
               {
                  email: user.email,
               },
               (err, foundUser) => {
                  if (err) {
                     res.json(err);
                  } else {
                     if (!foundUser) {
                        user.save((err) => {
                           if (err) {
                              res.json(err);
                           } else {
                              res.json({ message: "Success" });
                           }
                        });
                     } else {
                        res.json({ message: "User Already Exists" });
                     }
                  }
               },
            );
         }
      });
   })

   .post("/login", (req, res) => {
      const email = req.body.email;
      const password = req.body.password;

      User.findOne(
         {
            email: email,
         },
         (err, foundUser) => {
            if (err) {
               res.status(400).json({
                  success: false,
                  message: err.message,
               });
            } else {
               if (foundUser) {
                  bcrypt.compare(password, foundUser.password, (err, result) => {
                     if (result === true) {
                        res.json({
                           message: "Success",
                        });
                     } else {
                        res.json({ message: "Wrong user Password" });
                     }
                  });
               } else {
                  res.json({ message: "User does not exist" });
               }
            }
         },
      );
   })
   .get("/getfname/:userEmail", (req, res) => {
      const userEmail = req.params.userEmail;
      console.log("userEmail in users", userEmail);

      User.findOne({ email: userEmail }, (err, foundUser) => {
         if (err) {
            res.status(400).json({
               success: false,
               message: err.message,
            });
         } else {
            res.json(foundUser);
         }
      });
   })
   .patch("/updateuser", (req, res) => {
      const user = req.body.userEmail;
      const category = req.body.category;
      const client = req.body.client;
      console.log("user and category and client", user, category, client);
      User.update({ email: user }, { $addToSet: { userCategories: category, userClients: client } }, (err) => {
         if (!err) {
            res.json(err);
         } else {
            res.json({ message: "Success" });
         }
      });
   });

module.exports = routes;

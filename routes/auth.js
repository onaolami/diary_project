const express = require("express");
const yup = require("yup");
const router = express.Router();
const connection = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//create a data

router.post("/signup", async (req, res) => {
  const body = req.body;

  const userSchema = yup.object().shape({
    user_name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password cannot be less than 6")
      .max(10, "Password cannot be more than 12")
      .required("Password is required"),
  });

  try {
    await userSchema.validate(body);

    connection.query(
      "SELECT COUNT (id) as count FROM users WHERE email = ? ",
      [body.email],
      (err, result) => {
        console.log(err);
        if (err) return res.status(500).send("An error occurred");

        if (result[0].count !== 0) {
          return res.status(400).json({ message: "Email is already used" });
        }

        const hashedPassword = bcrypt.hashSync(body.password, 10);

        connection.query(
          "INSERT INTO users (user_name,email,password) VALUES (?, ?, ?)",
          [body.user_name, body.email, hashedPassword],
          (err, result) => {
            console.log(err);
            if (err) return res.status(500).send("An error occurred");

            return res
              .status(200)
              .json({ message: "User signed up successfully" });
          }
        );
      }
    );
  } catch (e) {
    return res.status(400).json(e);
  }
});

router.post("/login", async (req, res) => {
  const body = req.body;

  const userSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password should not be less than 6")
      .max(12, "Password should not be more than 12")
      .required("Password is required"),
  });
  try {
    await userSchema.validate(body);
    connection.query(
      "SELECT * FROM users WHERE email = ? ",
      [body.email],
      (err, result) => {
        if (err) return (500).send("An error occurred");
        if (result.length !== 1) {
          return res.status(401).json({ message: "Invalid login details" });
        }

        const user = result[0];

        if (bcrypt.compareSync(body.password, user.password)) {
          const token = jwt.sign(
            {
              id: user.id,
              email: user.email,
              exp: Math.floor(Date.now() / 1000) + 60 * 60,
            },
            "mySecretkey"
          );
          return res.status(200).json({ token: token });
        } else {
          return res.status(401).json({ message: "Invalid login details" });
        }
      }
    );
  } catch (e) {
    return res.status(400).json(e);
  }
});

module.exports = router;

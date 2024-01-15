const express = require("express");
const router = express.Router();
const yup = require("yup");
const connection = require("../config/db");

//create diary
router.post("", async (req, res) => {
  const diarySchema = yup.object().shape({
    title: yup.string().required("Required"),
    description: yup.string().required("Required"),
  });
  const body = req.body;
  try {
    await diarySchema.validate(body);

    const { title, description } = body;

    connection.query(
      "INSERT INTO diary (title,description,created_at) VALUES (?,?,?)",
      [title, description, new Date()],
      (err, result) => {
        if (err) return res.status(500).send("An error occured");
        console.log(result);
        return res.status(201).json({ message: "Diary updated successfully" });
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(400).json(e);
  }
});

//Update diary
router.put("", async (req, res) => {
  const diarySchema = yup.object().shape({
    title: yup.string().required("Required"),
    description: yup.string().required("Required"),
  });

  const body = req.body;
  try {
    await diarySchema.validate(body);
    const { title, description, id } = body;

    connection.query(
      "UPDATE diary SET title = ?, description = ? WHERE id =?",
      [title, description, id],
      (err, result) => {
        if (err) return res.status(500).send("An error occurred");
        console.log(result);
        return res.status(200).json({ message: "Diary updated successfully" });
      }
    );
  } catch (e) {
    return res.status(400).json(e);
  }
});

//search for diary
router.get("/search", (req, res) => {
  const query = req.query.query;
  connection.query(
    `SELECT * FROM diary WHERE title LIKE '%${query}%'`,
    (err, result) => {
      return res.status(200).json(result);
    }
  );
});

//Get diary

router.get("/:id", (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM diary WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).send("An error occurred");
    if (result.length === 0) {
      return res.status(404).json({ message: "Diary not found" });
    } else {
      return res.status(200).json(result[0]);
    }
  });
});

//delete diary

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM diary WHERE id = ?", [id], (err, result) => {
    return res.status(200).json({ message: "Diary deleted successfully" });
  });
});

module.exports = router;

const pool = require("../dbconfig");

const usersController = {
  getUsers: async (req, res) => {
    console.log("request on all users");
    try {
      const data = await pool.query("SELECT * FROM users");
      res.json({
        operation: "success",
        code: 200,
        description: "fetched user by id",
        data: data.rows,
      });
    } catch (e) {
      console.error(e);
      res.status(400).send("something went wrong");
    }
  },
  getUserbyId: async (req, res) => {
    const userId = req.params.id;
    console.log(`request on user with id = ${userId}`);
    if (!(userId && /^\d+$/.test(userId))) {
      res.status(400).send("something went wrong");
    } else {
      try {
        const data = await pool.query("SELECT * FROM users WHERE id = $1", [
          userId,
        ]);
        if (data.rows.length === 0) {
          res.status(404).send();
        } else {
          res.send({
            operation: "success",
            code: 200,
            description: "fetched user by id",
            data: data.rows[0],
          });
        }
      } catch (e) {
        console.error(e);
        res.status(400).send("something went wrong");
      }
    }
  },
  addUser: async (req, res) => {
    const user = req.body;
    if (!(user.first_name && user.last_name && user.age)) {
      res.status(400).send("something went wrong");
      return;
    }
    try {
      const response = await pool.query(
        "INSERT INTO users(first_name,last_name,age) VALUES($1,$2,$3) RETURNING *;",
        [user.first_name, user.last_name, user.age]
      );
      res.send(response.rows[0]);
    } catch (e) {
      console.error(e);
      res.status(400).send("something went wrong");
    }
  },
  deleteUserById: async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
      res.status(400).send("something went wrong");
      return;
    }
    try {
      const response = await pool.query("DELETE FROM users WHERE id=$1", [
        userId,
      ]);
      res.send();
    } catch (e) {
      console.error(e);
      res.status(400).send("something went wrong");
    }
  },
  updateUserById: async (req, res) => {
    const user = req.body;
    const id = req.params.id;
    if (!(user.first_name && user.last_name && user.age)) {
      res.status(400).send("something went wrong");
      return;
    }
    try {
      const response = await pool.query(
        "UPDATE users SET first_name=$2, last_name=$3, age=$4 WHERE id=$1",
        [id, user.first_name, user.last_name, user.age]
      );
      res.send(response.rows[0]);
    } catch (e) {
      console.error(e);
      res.status(400).send("something went wrong");
    }
  },
};

module.exports = usersController;

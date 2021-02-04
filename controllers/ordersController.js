const pool = require("../dbconfig");

const ordersController = {
  getOrders: async (req, res) => {
    console.log("request on all orders");
    try {
      const data = await pool.query(
        "SELECT orders.id, orders.price, orders.date, row_to_json(users.*) AS user FROM orders, users WHERE orders.user_id = users.id"
      );
      res.json({
        operation: "success",
        description: "fetched orders by id",
        data: data.rows,
      });
    } catch (e) {
      console.error(e);
      res.status(400).send("something went wrong");
    }
  },
  getOrderById: async (req, res) => {
    const orderId = req.params.id;
    console.log(`request on orders with id = ${orderId}`);
    if (!(orderId && /^\d+$/.test(orderId))) {
      res.status(400).send("something went wrong");
    } else {
      try {
        const data = await pool.query(
          "SELECT orders.id, orders.price, orders.date, row_to_json(users.*) AS user FROM orders, users WHERE orders.user_id = users.id AND orders.id = $1",
          [orderId]
        );
        if (data.rows.length === 0) {
          res.status(404).send("something went wrong");
        } else {
          res.send({
            operation: "success",
            description: "fetched order by id",
            data: data.rows[0],
          });
        }
      } catch (e) {
        console.error(e);
        res.status(400).send("something went wrong");
      }
    }
  },
  postOrder: async (req, res) => {
    const order = req.body;
    if (!(order.price && order.date && order.user_id)) {
      res.status(400).send("something went wrong");
      return;
    }
    try {
      const response = await pool.query(
        "INSERT INTO orders(price,date,user_id) VALUES($1,$2,$3) RETURNING *;",
        [order.price, order.date, order.user_id]
      );
      res.send(response.rows[0]);
    } catch (e) {
      console.error(e);
      res.status(400).send("something went wrong");
    }
  },
  deleteOrder: async (req, res) => {
    const orderId = req.params.id;
    if (!orderId) {
      res.status(400).send("something went wrong");
      return;
    }
    try {
      const response = await pool.query("DELETE FROM orders WHERE id=$1", [
        orderId,
      ]);
      res.send();
    } catch (e) {
      console.error(e);
      res.status(400).send("something went wrong");
    }
  },
  updateOrder: async (req, res) => {
    const orderId = req.params.id;
    const orderUpdate = req.body;
    if (
      !orderId ||
      !(orderUpdate.price && orderUpdate.date && orderUpdate.user_id)
    ) {
      res.status(400).send("something went wrong");
      return;
    }
    try {
      const response = await pool.query(
        "UPDATE orders SET price=$2, date=$3, user_id=$4 WHERE id=$1",
        [orderId, orderUpdate.price, orderUpdate.date, orderUpdate.user_id]
      );
      res.send();
    } catch (e) {
      console.error(e);
      res.status(400).send("something went wrong");
    }
  },
};
module.exports = ordersController;

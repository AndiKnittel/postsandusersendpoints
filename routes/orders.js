const express = require("express");
const router = express.Router();

const ordersController = require("../controllers/ordersController");
const tokensController = require("../controllers/tokensController");

router.use(tokensController.verify);

router.get("/", ordersController.getOrders);
router.get("/:id", ordersController.getOrderById);
router.post("/", ordersController.postOrder);
router.delete("/:id", ordersController.deleteOrder);
router.put("/:id", ordersController.updateOrder);

module.exports = router;

const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");

const tokensController = require("../controllers/tokensController");

router.use(tokensController.verify);

router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUserbyId);

module.exports = router;

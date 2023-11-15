const express = require("express");
const isAuth = require("../middleware/is-auth");
const router = express.Router();
const messageController = require("../controllers/message");
router.post("/", isAuth, messageController.addChat);
router.get("/:chatId", isAuth, messageController.getChat);
module.exports = router;

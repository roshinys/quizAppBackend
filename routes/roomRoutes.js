const express = require("express");

const router = express.Router();
const roomController = require("../controller/roomController");

router.post("/create-room", roomController.createRoom);
router.get("/fetch-room", roomController.fetchRoom);
router.post("/add-user/:roomId", roomController.addUserToRoom);

module.exports = router;

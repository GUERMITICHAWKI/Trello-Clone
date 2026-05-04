const express = require("express");
const router = express.Router();
const Message = require("../Models/messageModel");
const { verifyToken } = require("../Middlewares/auth");

// Get last 50 messages for a board
router.get("/:boardId", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({ boardId: req.params.boardId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.status(200).json(messages.reverse());
  } catch (err) {
    res.status(500).json({ errMessage: "Something went wrong", details: err.message });
  }
});

module.exports = router;
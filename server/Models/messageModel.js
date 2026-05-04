const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
    sender: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
      surname: String,
      color: String,
    },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
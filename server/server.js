const dotenv = require('dotenv');
const express = require('express');
const http = require("http");           // ✅ add
const { Server } = require("socket.io"); // ✅ add
const unless = require('express-unless');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoute = require('./Routes/userRoute');
const boardRoute = require('./Routes/boardRoute');
const listRoute = require('./Routes/listRoute');
const cardRoute = require('./Routes/cardRoute');
const auth = require('./Middlewares/auth');

dotenv.config();
const app = express();
const server = http.createServer(app);  // ✅ wrap app in http server
// ✅ Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// AUTH VERIFICATION AND UNLESS

auth.verifyToken.unless = unless;

app.use(
	auth.verifyToken.unless({
		path: [
			{ url: '/user/login', method: ['POST'] },
			{ url: '/user/register', method: ['POST'] },
		],
	})
);

//MONGODB CONNECTION

mongoose.Promise = global.Promise;
mongoose
	.connect(process.env.MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('Database connection is succesfull!');
	})
	.catch((err) => {
		console.log(`Database connection failed!`);
		console.log(`Details : ${err}`);
	});

//ROUTES

app.use('/user', userRoute);
app.use('/board', boardRoute);
app.use('/list', listRoute);
app.use('/card', cardRoute);

const messageRoutes = require("./Routes/messageRoutes"); // ✅ add
app.use("/message", messageRoutes);                      // ✅ add

// ✅ Socket.io chat logic
const Message = require("./Models/messageModel");

io.on("connection", (socket) => {
  // User joins a board room
  socket.on("join_board", (boardId) => {
    socket.join(boardId);
  });

  // User sends a message
  socket.on("send_message", async ({ boardId, sender, text }) => {
    try {
      const message = await Message.create({ boardId, sender, text });
      // Broadcast to everyone in the board room
      io.to(boardId).emit("receive_message", message);
    } catch (err) {
      console.error("Chat error:", err.message);
    }
  });

  socket.on("disconnect", () => {});
});

// ✅ Use server.listen instead of app.listen
mongoose.connect(process.env.MONGO_URI).then(() => {
  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});

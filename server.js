const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const port = 3000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

// app.listen(port, () => {
//   console.log("Server listening on Port: " + port);
// });
app.use(express.static("src"));

io.on("connection", (socket) => {
  console.log("User connected");

  // socket.on("set score1", (score1) => {
  //   socket.broadcast.emit("score1", score1);
  // });

  // socket.on("set score2", (score2) => {
  //   socket.broadcast.emit("score2", score2);
  // });

  socket.on("set score", (score1, score2) => {
    socket.broadcast.emit("score", score1, score2);
  });

  socket.on("puk moved", (posX, posY, velX, velY, angVelX, angVelY) => {
    socket.broadcast.emit(
      "puk position",
      posX,
      posY,
      velX,
      velY,
      angVelX,
      angVelY
      // velocity,
      // angularVelocity
    );
  });

  socket.on("pusher1 moved", (posX, posY) => {
    socket.broadcast.emit("pusher1 position", posX, posY);
  });

  socket.on("pusher2 moved", (posX, posY) => {
    socket.broadcast.emit("pusher2 position", posX, posY);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

httpServer.listen(3000, () => {
  console.log("Server listening on Port " + port);
});

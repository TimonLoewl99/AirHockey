const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const port = 3000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

const socket_by_cid = [];

app.use(express.static("src"));

httpServer.on("error", function (err) {
  console.error(err.stack);
  process.exit(1);
});

// Logging
// Could be enhanced to print more info from session object
function logger(cid, text) {
  const id = cid ? "#" + cid + "-" : "";
  console.log(`[${new Date().toISOString()}] ${id} ${text}`);
}

io.on("connection", (socket) => {
  // stuff that has to be stored per websocket connection
  // not stored in an object, because all routes are within the 'connection' event function scope
  const cid =
    String.fromCharCode(Math.random() * 26 + 65) +
    Math.random().toString(36).substring(2, 6);

  // store relation from cids to socket for lookup
  socket_by_cid[cid] = socket;

  // initial websocket message containing ids
  socket.on("getId", () => {
    socket.emit("*id", { cid: cid });
  });

  logger(cid, `new websocket connection id ${cid}`);

  // cleanup on disconnect
  socket.on("disconnect", function () {
    logger(cid, "websocket disconnect");
    delete socket_by_cid[cid];
  });

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
});

httpServer.listen(3000, () => {
  console.log("Server listening on Port " + port);
});

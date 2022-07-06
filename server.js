const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const port = 3000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

var serverIndex;
var sender;
var cidPlayer1;
var cidPlayer2;

var connection = {
  player1: false,
  player2: false,
};

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

  socket.emit("player connection", connection);

  // initial websocket message containing ids

  // socket.emit("*id", {
  //   cid: cid,
  //   pusher: serverIndex,
  // });
  // setTimeout(function () {
  //   if (serverIndex === 1) {
  //     serverIndex = 2;
  //   } else if (serverIndex === 2) {
  //     serverIndex = 1;
  //   }
  // }, 0);
  socket.on("update connection", () => {
    socket.emit("connection status", connection);
  });

  socket.on("player1 connected", () => {
    connection.player1 = true;
    socket.emit("*id", {
      cid: cid,
      pusher: 1,
    });
    socket.emit("connection status", connection);
    cidPlayer1 = cid;
    console.log(connection);
  });

  socket.on("player2 connected", () => {
    connection.player2 = true;
    socket.emit("*id", {
      cid: cid,
      pusher: 2,
    });
    socket.emit("connection status", connection);
    cidPlayer2 = cid;
    console.log(connection);
  });

  //logger(cid, `new websocket connection id ${cid} serverIndex ${serverIndex}`);
  logger(cid, `new websocket connection id ${cid}`);

  // cleanup on disconnect
  socket.on("disconnect", function () {
    logger(cid, "websocket disconnect");
    if (cidPlayer1 === cid) {
      connection.player1 = false;
      console.log(connection.player1);
    }
    if (cidPlayer2 === cid) {
      connection.player2 = false;
      console.log(connection.player2);
    }
    delete socket_by_cid[cid];
  });

  // socket.on("set score1", (score1) => {
  //   socket.broadcast.emit("score1", score1);
  // });

  // socket.on("set score2", (score2) => {
  //   socket.broadcast.emit("score2", score2);
  // });

  socket.on("Switch collison state", (pusherId) => {
    sender = pusherId;
    console.log(sender);
    socket.broadcast.emit("getSender", sender);
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

  socket.on("pusher1 moved", (posX, posY, velX, velY) => {
    socket.broadcast.emit("other pusher position", posX, posY, velX, velY);
  });

  socket.on("pusher2 moved", (posX, posY, velX, velY) => {
    socket.broadcast.emit("other pusher position", posX, posY, velX, velY);
  });

  socket.on("set score", (score1, score2) => {
    socket.broadcast.emit("score", score1, score2);
  });

  socket.on("update enemy position", (posX, posY, velX, velY) => {
    socket.broadcast.emit("update my position", posX, posY, velX, velY);
  });
});

// httpServer.listen(port, "192.168.2.102", () => {
//   console.log("Server listening on Port " + port);
// });

httpServer.listen(port, () => {
  console.log("Server listening on Port " + port);
});

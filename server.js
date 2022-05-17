const express = require("express");
const port = 3000;
const app = express();

app.listen(port, () => {
  console.log("Server listening on Port: " + port);
});

app.use(express.static("src"));

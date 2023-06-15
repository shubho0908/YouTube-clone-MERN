const express = require("express");
const router = require("./Router/router");
const app = express();
const port = 3000;

//Middlewares
app.use(router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

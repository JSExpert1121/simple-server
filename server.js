const express = require("express");
const bodyParser = require("body-parser");

const db = require("./config/database");
const api = require("./api");
const middleware = require("./middleware");

db.connectDB();

const PORT = process.env.PORT || 1337;

const app = express();

app.use(bodyParser.json());

app.get("/health", api.getHealth);

app.get("/:studentId/*", api.getProperty);

app.put("/:studentId/*", api.putProperty);

app.delete("/:studentId/*", api.deleteProperty);

app.use(middleware.handleError);
app.use(middleware.notFound);

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);

if (require.main !== module) {
  module.exports = server;
}

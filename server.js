require("dotenv").config();
const express = require("express");

const app = express();
const mongoose = require("mongoose");

const port = process.env.PORT || 5000;

// database connection
// const url = "mongodb://localhost/Create-RESTApi";

const url = "mongodb://localhost:27017/Create-RESTApi";

mongoose.connect(url, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
});

const connection = mongoose.connection;

connection
  .once("open", () => {
    console.log("Database connected");
  })
  .catch(() => {
    console.log("Database error");
  });

//
app.use(express.json());

// routes
const articlesRoutes = require("./routes/articles");
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const userRoute = require("./routes/user");
const refreshRoute = require("./routes/refresh");
const logoutRoute = require("./routes/logout");

app.use("/api/articles", articlesRoutes);
app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/user", userRoute);
app.use("/api/refresh", refreshRoute);
app.use("/api/logout", logoutRoute);

app.listen(port, () => {
  console.log(`listening on port ${port} `);
});

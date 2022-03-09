const express = require("express");
const path = require("path");
const logger = require("morgan");
const ProductRouter = require("./routes/ProductRouter");
const UserRouter = require("./routes/UserRouter");
// const cors = require("cors");

var DB = require("./configdb"); // import file config database
require("dotenv").config();
//connect database;
DB.ConfigDB();
const app = express();

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     optionsSuccessStatus: 200,
//     credentials: true,
//   })
// );
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
// app.use(cors())

const port = process.env.PORT || 8000;

app.use("/api/auth", UserRouter);
app.use("/api", ProductRouter);
app.get("/", function (req, res) {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server đã chạy trên port ${port}`);
});

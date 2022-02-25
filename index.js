var express = require('express');
require("dotenv").config();


var app = express();

const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.listen(port, () => {
  console.log("Server đã chạy trên port: " + port);
})
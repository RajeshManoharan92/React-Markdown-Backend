const mongo = require("./shared")
const express = require('express');
require('dotenv').config()
const cors = require('cors')
const router = require("./module/module")


mongo.connect();

var app = express();

app.use(express.json());

app.use(cors());

app.use("/",router)

app.listen(process.env.PORT||3001, () => {
  console.log(`Server running on port ${3001}`);
})


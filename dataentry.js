const mongoose = require("mongoose");
const fs = require("fs");
const Tour = require("./models/tourModel");

const data = fs.readFileSync(`${__dirname}/data/tours.json`, "utf-8"); // const data =
const tours = JSON.parse(data); // json []

mongodburl =
  "mongodb+srv://h2wymog:YUsotOFLLIV9AKqD@newmorningtours.hticjys.mongodb.net/mytoursdb?retryWrites=true&w=majority";

mongoose
  .connect(mongodburl)
  .then((con) => {
    // console.log(con.connections);
    console.log("DB Connection Successful.");
  })
  .catch((err) => {
    console.log("ERROR");
  });

const importData = async () => {
  await Tour.insertMany(tours);
  console.log("Data Successfully Loaded!");
};

importData();

const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");

dotenv.config({ path: "./config.env" });

var dbpass = process.env.DB_PASSWORD;

mongodburl = `mongodb+srv://h2wymog:${dbpass}@newmorningtours.hticjys.mongodb.net/mytoursdb?retryWrites=true&w=majority`;

mongoose
  .connect(mongodburl)
  .then((con) => {
    // console.log(con.connections);
    console.log("DB Connection Successful.");
  })
  .catch((err) => {
    console.log("ERROR");
  });

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App is runing on port ${port}`);
});

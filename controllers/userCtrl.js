const fs = require("fs");

const data = fs.readFileSync(`${__dirname}/../data/users.json`, "utf-8"); // const data =
const users = JSON.parse(data); // json []

exports.getAllUsers = (req, res) => {
  //   res.end("Hello");
  res.status(200).json({
    status: "success",
    users,
  });
};

exports.getOneUser = (req, res) => {
  console.log(req.params);
  const id = req.params.id;
  var user = users.find((el) => el._id == id);

  if (!user) {
    return res.status(200).json({
      status: "fail",
      message: "User doesn't exist",
    });
  }

  res.status(200).json({
    status: "success",
    user,
  });
};

exports.login = (req, res) => {
  console.log(req.body);

  const loginData = req.body;
  // { email : "admin@gamil.com", password : "password"}

  // Find User in Database
  var user = users.find((el) => el.email == loginData.email);
  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "User doesn't exist",
    });
  }

  // Check Password

  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    user,
  });
};

exports.register = (req, res) => {
  console.log(req.body);

  const newUser = req.body; // { _id : "9898876"}

  var user = users.find((el) => el._id == newUser._id);

  if (user) {
    return res.status(400).json({
      status: "fail",
      message: "User already exist",
    });
  }

  users.push(newUser);
  // Write file to database (file)
  fs.writeFile(
    `${__dirname}/../data/users.json`,
    JSON.stringify(users),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: "fail",
          message: "Something went wrong when adding data to database",
        });
      }

      return res.status(200).json({
        status: "success",
        message: "Successfully added a tour to database",
        user: newUser,
      });
    }
  );
};

exports.updateOneUser = (req, res) => {
  console.log(req.body); //  { duration : 5, price : 500 }
  const id = req.params.id;

  var user = users.find((el) => el._id == id); // { price: , duration , _id}

  var newUser = {
    ...user,
  };

  res.status(200).json({
    status: "success",
    message: "Tour has been updated successfully.",
    user: newUser,
  });
};

exports.deleteOneUser = (req, res) => {
  console.log(req.body);
  const id = req.params.id;

  var user = users.find((el) => el._id == id);

  if (!user) {
    return res.status(200).json({
      status: "fail",
      message: "User doesn't exist",
    });
  }

  res.status(200).json({
    status: "success",
    message: "User deleted successfully.",
  });
};

exports.deleteAllUsers = (req, res) => {
  users = [];

  res.status(200).json({
    status: "success",
    message: "Users deleted successfully.",
  });
};

exports.checkBody = (req, res, next) => {
  console.log(req.body);
  console.log(">>>>> this is checkbody middleware <<<<<<");
  // if (!body) res 400 bad request
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({
      status: "fail",
      message: "Missing email or password",
    });
  }
  next();
};

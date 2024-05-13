const User = require("../models/userModel");
const APIFeatures = require("../utils/apifeatures");
const AppError = require("../utils/apperror");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const sendEmail = require("../utils/nodemailer");

signToken = (userid) => {
  return jwt.sign(
    {
      id: userid,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

exports.register = catchAsync(async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  const token = signToken(user._id);

  res.status(201).json({
    status: "success",
    message: "User has been created successfully.",
    user,
    token,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );

  if (!user) {
    return next(new AppError("User is not registered", 404));
  }

  const match = await bcrypt.compare(req.body.password, user.password);

  if (match == true) {
    const token = signToken(user._id);

    res.status(201).json({
      status: "success",
      message: "Logged in successfully.",
      user,
      token,
    });
  } else {
    return next(new AppError("Invalid Password", 401));
  }
});

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  //   res.end("Hello");
  res.status(200).json({
    status: "success",
    users,
  });
};

exports.changePassword = catchAsync(async (req, res, next) => {
  // 1. ask email, oldpass, newpass
  // 2. change to newpassword, passwordChangeAt
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You have to login to view all tours.", 401));
  }

  // 2) Verification token
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  console.log(decodedToken);

  // 3) Check if user still exists
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return next(new AppError("User that owns the token doesn't exist."), 401);
  }

  // 4) Check if user changed password after the token was issued

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on user's email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("User with this email doesn't exist.", 404));
  }

  // 2. Generate random access token
  const { resetToken, passwordResetToken, passwordResetExpires } =
    createPasswordResetToken();

  // 2.1. Save the token to the database
  await User.findByIdAndUpdate(user._id, {
    passwordResetToken: passwordResetToken,
    passwordResetExpires: passwordResetExpires,
  });

  // 3. Send it to user's email
  await sendEmail({
    email: user.email,
    subject: "Your password reset token (valid for 10 minutes)",
    message: `http://localhost:8080/api/v1/users/resetpassword/${resetToken}.`,
  });

  res.status(200).json({
    status: "success",
    message: "Your password reset token has been sent to your email.",
    resetToken,
  });
});

const createPasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex"); // 32423423424235342

  console.log(resetToken);

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex"); /// hashed token

  const passwordResetExpires = Date.now() + 10 * 60 * 1000; // Date.now in millisecs + 10 mins

  return { resetToken, passwordResetToken, passwordResetExpires };
};

exports.resetPassword = catchAsync(async (req, res, next) => {
  const token = req.params.token;

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex"); /// hashed token

  const user = await User.findOne({
    passwordResetToken: passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Password restt token invalid or expired", 403));
  }

  // newpassword => hashed => DB save
  // passwordChangedAt => Date.now
  // passwordResetToken, passwordResetExpires = null

  // sign new token

  return res.status(200).json({
    status: "success",
    message: "You have changed your password successfully",
    token, // jwt token
  });
});

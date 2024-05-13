const Tour = require("../models/tourModel");
const APIFeatures = require("../utils/apifeatures");
const AppError = require("../utils/apperror");
const catchAsync = require("../utils/catchAsync");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = "price";
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // Build QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limit()
    .paginate();
  // Run the Query
  const tours = await features.query;

  res.status(200).json({
    status: "success",
    results: tours.length,
    tours,
  });
});

exports.getOneTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.tourid);

    res.status(200).json({
      status: "success",
      tour: tour,
    });
  } catch (err) {
    next(new AppError(err.message, 401));
  }
};

exports.addNewTour = catchAsync(async (req, res) => {
  const newTour = await Tour.create(req.body);
  res.status(200).json({
    status: "success",
    message: "Tour has been added successfully.",
    tour: newTour,
  });
});

exports.updateOneTour = async (req, res) => {
  try {
    const newTour = await Tour.findByIdAndUpdate(req.params.tourid, req.body, {
      new: true,
    });

    res.status(200).json({
      status: "success",
      message: "Tour has been updated successfully.",
      tour: newTour,
    });
  } catch (err) {
    res.status(401).json({
      status: "fail",
      message: "Something went wrong",
      error: err,
    });
  }
};

exports.deleteOneTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.tourid);
    res.status(204).json({
      status: "success",
      message: "Tour has been deleted successfully.",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Error while deleting tour",
    });
  }
};

exports.deleteAllTours = (req, res) => {
  try {
  } catch (err) {}
};

exports.checkID = (req, res, next, val) => {
  if (req.params.tourid * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next();
};

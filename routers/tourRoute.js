const express = require("express");
const tourCtrl = require("../controllers/tourCtrl");
const authCtrl = require("../controllers/authCtrl");

const tourRouter = express.Router();

tourRouter
  .route("/")
  .get(
    authCtrl.protect,
    tourCtrl.getAllTours
  )
  .delete(
    authCtrl.protect, // User info - role
    authCtrl.restrictTo("admin", "lead-guide"),
    tourCtrl.deleteAllTours)
  .post(tourCtrl.addNewTour);

tourRouter
  .route("/top-5-cheap")
  .get(tourCtrl.aliasTopTours, tourCtrl.getAllTours);

tourRouter
  .route("/:tourid")
  .get(tourCtrl.getOneTour)
  .patch(tourCtrl.updateOneTour)
  .delete(tourCtrl.deleteOneTour);

// tourRouter.param("tourid", tourCtrl.checkID);

module.exports = tourRouter;

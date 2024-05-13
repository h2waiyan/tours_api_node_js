class APIFeatures {
  // query = Tour.find(), User.find(), Booking.find()
  // queryStr = req.query.filter, req.query.sort, req.query.page, req.query.limit
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // 1. Filter
  filter() {
    // 1. Filtering
    // 1.1. Remove Unwanted Query e.g., page, sort, fields, limit
    const queryObj = { ...this.queryStr };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 1.2 Advance Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    // query build => Select * from tours where duration = 5
    return this;
  }
  // 2. Sort
  sort() {
    // 2. Sorting
    if (this.queryStr.sort) {
      // 2.1 Multiple Sorting
      const sortBy = this.queryStr.sort.split(",").join(" ");
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
      // query => Select * from tours where duration = 5 order by price, duration
    } else {
      // 2.2 Default Sorting
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }
  // 3. Limit
  limit() {
    //3. Field Limiting
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      // 3.1 Default Field Limiting
      this.query = this.query.select("-__v");
    }

    return this;
  }
  // 4. Pagination
  paginate() {
    //4. Pagination
    // http://localhost:3000/api/v1/tours?page=3&limit=10
    // Page 1, 1-10, Page 2, 11-20, Page 3, 21-30
    const page = this.queryStr.page * 1 || 1; // page = 1, 2
    const limit = this.queryStr.limit * 1 || 10; // limit = 10
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

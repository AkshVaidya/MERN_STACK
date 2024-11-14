const axios = require("axios");
const transactions = require("../models/transactions");

const seedDatabase = async (req, res, next) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const result = await transactions.insertMany(response.data);
    console.log("Fetched data: ", response.data.slice(0, 5));
    res.status(200).send("DB seeded successfully");
  } catch (err) {
    console.log("Error :", err);
    res.status(500).send("Error in Fetching Data");
  }
  next();
};

const fetchData = async (req, res, next) => {
  try {
    const { search, page = 1, pageSize = 10 } = req.query;
    const { month } = req.params;

    // Filter to always include the month condition
    const filter = {
      $and: [
        {
          $expr: { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] },
        },
      ],
    };

    // Set up search conditions based on the single `search` parameter
    if (search) {
      const searchRegex = new RegExp(search, "i"); // Case-insensitive regex
      const searchConditions = [
        { title: searchRegex },
        { description: searchRegex },
      ];

      // Check if `search` can be parsed as a number for price matching
      const searchPrice = parseFloat(search);
      if (!isNaN(searchPrice)) {
        searchConditions.push({ price: searchPrice });
      }

      // Add search conditions as `$or` in the filter
      filter.$and.push({ $or: searchConditions });
    }

    // Set up pagination
    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSizeNumber = Math.max(1, parseInt(pageSize, 10));
    const skip = (pageNumber - 1) * pageSizeNumber;

    // Fetch filtered data with pagination
    const data = await transactions
      .find(filter)
      .skip(skip)
      .limit(pageSizeNumber);

    const totalCount = await transactions.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / pageSizeNumber);

    res.status(200).json({
      data,
      pagination: {
        page: pageNumber,
        pageSize: pageSizeNumber,
        totalCount,
        totalPages,
      },
    });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Error in fetching transactions" });
  }
};

module.exports = { seedDatabase, fetchData };

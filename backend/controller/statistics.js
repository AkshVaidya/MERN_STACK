const transactions = require("../models/transactions");
const axios = require("axios");

const totalSales = async (req, res, next) => {
  try {
    const { month } = req.params;
    const targetMonth = parseInt(month);
    console.log(`Month`, targetMonth);
    const transactionRecords = await transactions.find();

    const transPrice = transactionRecords
      .filter(
        (item) => new Date(item.dateOfSale).getMonth() + 1 === targetMonth
      )
      .reduce((total, item) => total + item.price, 0);
    console.log(transPrice);

    const soldItems = transactionRecords.filter(
      (item) =>
        new Date(item.dateOfSale).getMonth() + 1 === targetMonth &&
        item.sold === true
    );
    const totalSoldItems = soldItems.length;
    console.log(totalSoldItems);

    const NotSoldItems = transactionRecords.filter(
      (item) =>
        new Date(item.dateOfSale).getMonth() + 1 === targetMonth &&
        item.sold === false
    );
    const totalNotSoldItems = NotSoldItems.length;
    res.status(200).json({
      totalSales: transPrice,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (err) {
    console.log("Errror :", err);
    res.status(500).json({ error: "Error In Fetching" });
  }
};

//FOR BARCHART**********************
const barChart = async (req, res, next) => {
  try {
    const { month } = req.params;
    const targetMonth = parseInt(month);
    console.log(`Month`, targetMonth);
    const priceRanges = Array.from({ length: 9 }, (_, i) => ({
      min: i * 100 + 1,
      max: (i + 1) * 100,
    }));
    priceRanges.push({ min: 901, max: Infinity });

    const result = [];

    for (const range of priceRanges) {
      const data = await transactions.aggregate([
        {
          $match: {
            $expr: { $eq: [{ $month: "$dateOfSale" }, targetMonth] },
            price: { $gte: range.min, $lte: range.max },
          },
        },
        {
          $group: {
            _id: `${range.min}-${
              range.max === Infinity ? "above 900" : range.max
            }`,
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, priceRange: "$_id", count: 1 } },
      ]);

      if (data.length > 0) {
        result.push(...data);
      } else {
        result.push({ priceRange: `${range.min}-${range.max}`, count: 0 });
      }
    }
    res.status(200).json(result);
  } catch (err) {
    console.log("Errror :", err);
    res.status(500).json({ error: "Error in Fetching Data" });
  }
};

const pieChart = async (req, res, next) => {
  // try {
  // const { month } = req.params;
  // const targetMonth = parseInt(month);
  // console.log(targetMonth);
  // //const Item = await transactions.find();
  // const data = await transactions.aggregate([
  //   { $match: { $expr: { $eq: [{ $month: "$date" }, targetMonth] } } },
  //   { $group: { _id: "$category", count: { $sum: 1 } } },
  //   { $project: { _id: 0, category: "$_id", count: 1 } },
  // ]);
  // res.status(200).json(data);
  try {
    const { month } = req.params;
    const targetMonth = parseInt(month); // Extract the month from the request params

    if (isNaN(targetMonth) || targetMonth < 1 || targetMonth > 12) {
      return res.status(400).json({
        error: "Invalid month. Please provide a month between 1 and 12.",
      });
    }

    const data = await transactions.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, targetMonth],
          },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err,
    });
  }
};

const combineAll = async (req, res, next) => {
  try {
    const { month } = req.params;

    const pieChartUrl = `http://localhost:8080/statistics/piechart/${month}`;
    const barChartUrl = `http://localhost:8080/statistics/barchart/${month}`;
    const totalSalesUrl = `http://localhost:8080/statistics/stats/${month}`;

    const [pieChartData, barChartData, totalSalesData] = await Promise.all([
      axios.get(pieChartUrl),
      axios.get(barChartUrl),
      axios.get(totalSalesUrl),
    ]);

    const combinedData = {
      totalSales: totalSalesData.data,
      barChart: barChartData.data,
      pieChart: pieChartData.data,
    };

    res.status(200).json(combinedData);
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ error: "Error in Fetching Data" });
  }
};
module.exports = { totalSales, barChart, pieChart, combineAll };

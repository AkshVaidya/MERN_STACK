const router = require("express").Router();
const {
  totalSales,
  barChart,
  pieChart,
  combineAll,
} = require("../controller/statistics");

//CREATE API FOR STATISTICS
router.get("/stats/:month", totalSales);
router.get("/barchart/:month", barChart);
router.get("/piechart/:month", pieChart);
router.get("/combine/:month", combineAll);

module.exports = router;

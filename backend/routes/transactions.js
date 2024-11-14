const router = require("express").Router();

const { fetchData, seedDatabase } = require("../controller/transactions");

router.post("/seed", seedDatabase); //FETCH JSON from third party APIs
router.get("/fetching/:month", fetchData);

module.exports = router;

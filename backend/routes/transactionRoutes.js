const express = require("express");
const { addTransaction, getTransactions, deleteTransaction, updateTransaction, filterTransactions, getSummary } = require("../controllers/transactionController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// PROTECTED ROUTE
router.post("/add", protect, addTransaction);
router.get("/", protect, getTransactions);
router.delete("/:id", protect, deleteTransaction);
router.put("/:id", protect, updateTransaction);
router.get("/filter", protect, filterTransactions);
router.get("/summary", protect, getSummary);

module.exports = router;
const express = require("express");
const {
  addTransaction,
  getTransactions,
  deleteTransaction,
  updateTransaction,
  getSummary,
} = require("../controllers/transactionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// 🔐 PROTECTED ROUTES
router.post("/add", protect, addTransaction);
router.get("/", protect, getTransactions);
router.delete("/:id", protect, deleteTransaction);
router.put("/:id", protect, updateTransaction);
router.get("/summary", protect, getSummary);

// ❌ REMOVED filterTransactions (causing crash)

module.exports = router;
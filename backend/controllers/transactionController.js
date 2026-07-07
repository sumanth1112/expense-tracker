const Transaction = require("../models/Transaction");


// 🔹 ADD TRANSACTION
exports.addTransaction = async (req, res) => {
  try {
    const { type, amount, category, date } = req.body;

    const transaction = await Transaction.create({
      type,
      amount,
      category,
      date,
      userId: req.user.id,   // ✅ FIXED
    });

    res.status(201).json({
      message: "Transaction added",
      transaction,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 GET ONLY CURRENT USER TRANSACTIONS
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id,   // ✅ FIXED
    }).sort({ date: -1 });

    res.json(transactions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 DELETE ONLY OWN DATA
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.user.id) {  // ✅ FIXED
      return res.status(401).json({ message: "Not authorized" });
    }

    await transaction.deleteOne();

    res.json({ message: "Transaction deleted" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 UPDATE ONLY OWN DATA
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.userId.toString() !== req.user.id) {  // ✅ FIXED
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Transaction updated",
      transaction: updatedTransaction,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 FILTER ONLY OWN DATA
exports.filterTransactions = async (req, res) => {
  try {
    const { type, category } = req.query;

    let filter = { userId: req.user.id };   // ✅ FIXED

    if (type) filter.type = type;
    if (category) filter.category = category;

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    res.json(transactions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 SUMMARY (USER-SPECIFIC)
exports.getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      userId: req.user.id,   // ✅ FIXED
    });

    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    res.json({
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
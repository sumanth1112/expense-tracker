import React, { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ FIXED useEffect (important for Vercel build)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await API.get("/transactions/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addTransaction = async () => {
    try {
      if (editId) {
        await API.put(
          `/transactions/${editId}`,
          { type, amount, category },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEditId(null);
      } else {
        await API.post(
          "/transactions/add",
          { type, amount, category },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }

      fetchTransactions();
      fetchSummary();

      setAmount("");
      setCategory("");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await API.delete(`/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchTransactions();
      fetchSummary();
    } catch (error) {
      console.log(error);
    }
  };

  // 🎨 Card styles
  const cardStyle = (bg) => ({
    flex: 1,
    padding: "20px",
    background: bg,
    color: "white",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  });

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        background: "#f0f2f5",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Expense Tracker 🚀</h1>

      {/* SUMMARY */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={cardStyle("#28a745")}>
          <h3>Income</h3>
          <p>₹ {summary.totalIncome || 0}</p>
        </div>

        <div style={cardStyle("#dc3545")}>
          <h3>Expense</h3>
          <p>₹ {summary.totalExpense || 0}</p>
        </div>

        <div style={cardStyle("#007bff")}>
          <h3>Balance</h3>
          <p>₹ {summary.balance || 0}</p>
        </div>
      </div>

      {/* FORM */}
      <div style={{ marginBottom: "20px" }}>
        <h3>{editId ? "Edit Transaction" : "Add Transaction"}</h3>

        <div
          style={{
            display: "flex",
            gap: "10px",
            background: "white",
            padding: "15px",
            borderRadius: "10px",
            alignItems: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          }}
        >
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            style={{ padding: "6px" }}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ padding: "6px" }}
          />

          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: "6px" }}
          />

          <button
            onClick={addTransaction}
            style={{
              background: editId ? "#007bff" : "#28a745",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* TABLE */}
      <h3>Transactions</h3>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ background: "#ddd" }}>
            <th>Type</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((t) => (
            <tr key={t._id} style={{ textAlign: "center" }}>
              <td>{t.type}</td>
              <td>₹ {t.amount}</td>
              <td>{t.category}</td>

              <td>
                {/* EDIT */}
                <button
                  onClick={() => {
                    setEditId(t._id);
                    setType(t.type);
                    setAmount(t.amount);
                    setCategory(t.category);
                  }}
                  style={{
                    background: "#007bff",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "5px",
                    marginRight: "5px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>

                {/* DELETE */}
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure?")) {
                      deleteTransaction(t._id);
                    }
                  }}
                  style={{
                    background: "#dc3545",
                    color: "white",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
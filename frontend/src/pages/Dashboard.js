import React, { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const token = localStorage.getItem("token");

  const fetchTransactions = useCallback(async () => {
    const res = await API.get("/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTransactions(res.data);
  }, [token]);

  const fetchSummary = useCallback(async () => {
    const res = await API.get("/transactions/summary", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSummary(res.data);
  }, [token]);

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, [fetchTransactions, fetchSummary]);

  const addTransaction = async () => {
    if (!amount || !category) return alert("Fill all fields");

    if (editId) {
      await API.put(
        `/transactions/${editId}`,
        { type, amount, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
    } else {
      await API.post(
        "/transactions/add",
        { type, amount, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    setAmount("");
    setCategory("");
    fetchTransactions();
    fetchSummary();
  };

  const deleteTransaction = async (id) => {
    await API.delete(`/transactions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTransactions();
    fetchSummary();
  };

  const startEdit = (t) => {
    setEditId(t._id);
    setType(t.type);
    setAmount(t.amount);
    setCategory(t.category);
  };

  // 🎨 STYLES
  const styles = {
    page: {
      minHeight: "100vh",
      background: darkMode
        ? "linear-gradient(135deg, #1e3c72, #2a5298)"
        : "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
    },
    glass: {
      backdropFilter: "blur(15px)",
      background: darkMode
        ? "rgba(255,255,255,0.1)"
        : "rgba(255,255,255,0.7)",
      borderRadius: "15px",
      padding: "20px",
    },
    content: {
      maxWidth: "1100px",
      margin: "auto",
      padding: "30px 20px",
      animation: "fadeIn 0.8s ease-in-out",
    },
  };

  const cardStyle = (gradient) => ({
    flex: "1 1 250px",
    maxWidth: "300px",
    padding: "25px",
    borderRadius: "15px",
    color: "white",
    background: gradient,
    textAlign: "center",
    transition: "0.3s",
  });

  const input = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  };

  const button = {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const table = {
    width: "100%",
    borderCollapse: "collapse",
    background: "rgba(255,255,255,0.9)",
  };

  const data = [
    { name: "Income", value: summary.totalIncome || 0 },
    { name: "Expense", value: summary.totalExpense || 0 },
  ];

  const COLORS = ["#00C49F", "#FF4B2B"];

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        <Navbar />

        {/* Dark Mode */}
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>

        {/* Cards + Chart */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          <div style={styles.glass}>
            {summary.totalIncome === 0 && summary.totalExpense === 0 ? (
              <p>No Data</p>
            ) : (
              <PieChart width={300} height={300}>
                <Pie data={data} dataKey="value" innerRadius={60}>
                  {data.map((entry, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            )}
          </div>

          {[
            ["Income", summary.totalIncome, "#00b09b,#96c93d"],
            ["Expense", summary.totalExpense, "#ff416c,#ff4b2b"],
            ["Balance", summary.balance, "#2193b0,#6dd5ed"],
          ].map(([t, v, g], i) => (
            <div key={i} style={cardStyle(`linear-gradient(135deg,${g})`)}>
              <h3>{t}</h3>
              <p>{v || 0}</p>
            </div>
          ))}
        </div>

        {/* FORM */}
        <div style={{ ...styles.glass, marginTop: "20px" }}>
          <h3>{editId ? "Edit Transaction" : "Add Transaction"}</h3>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ ...input, flex: 1 }}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input
              style={{ ...input, flex: 1 }}
              placeholder="Amount"
              value={amount}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || /^[1-9][0-9]*$/.test(v)) setAmount(v);
              }}
            />

            <input
              style={{ ...input, flex: 1 }}
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <button onClick={addTransaction} style={button}>
              {editId ? "Update" : "Add"}
            </button>
          </div>
        </div>

        {/* TABLE */}
        {transactions.length > 0 && (
          <div style={{ marginTop: "20px" }}>
            <table style={table}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t._id}>
                    <td>
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </td>
                    <td>{t.amount}</td>
                    <td>{t.category}</td>
                    <td>
                      <button onClick={() => startEdit(t)}>✏️</button>
                      <button onClick={() => deleteTransaction(t._id)}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {transactions.length === 0 && <h3>No Transactions Yet 🚀</h3>}
      </div>
    </div>
  );
}

export default Dashboard;
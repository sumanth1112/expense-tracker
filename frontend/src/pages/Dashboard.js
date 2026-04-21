import React, { useEffect, useState } from "react";
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

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchTransactions();
    fetchSummary();
    // eslint-disable-next-line
  }, []);

  const fetchTransactions = async () => {
    const res = await API.get("/transactions", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTransactions(res.data);
  };

  const fetchSummary = async () => {
    const res = await API.get("/transactions/summary", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSummary(res.data);
  };

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

  // 🎨 STYLES
  const styles = {
    page: {
  minHeight: "100vh",
  backgroundImage: "url('/assets/dashboard-bg.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "relative",
},

    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.8)",
      zIndex: 1,
    },

    content: {
  position: "relative",
  zIndex: 2,
  maxWidth: "1100px",
  margin: "auto",
  padding: "30px 20px",
},
  };

  const cardStyle = (gradient) => ({
    flex: 1,
    padding: "25px",
    borderRadius: "15px",
    color: "white",
    background: gradient,
    boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    textAlign: "center",
  });

  const formBox = {
    background: "rgba(255,255,255,0.9)",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    marginBottom: "25px",
  };

  const input = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  };

  const button = {
    background: "linear-gradient(135deg, #007bff, #00c6ff)",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  };

  const table = {
    width: "100%",
    borderCollapse: "collapse",
    background: "rgba(255,255,255,0.95)",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  };

  const data = [
  { name: "Income", value: summary.totalIncome || 0 },
  { name: "Expense", value: summary.totalExpense || 0 },
];

  const COLORS = ["#00C49F", "#FF4B2B"];

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <div style={styles.content}>
  <Navbar />

  {/* Cards */}
  <div style={{
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
    transition: "0.3s",
    cursor: "pointer",
  }}>

    {/* 📊 Chart */}
<div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
  <PieChart width={300} height={300}>
    <Pie data={data} dataKey="value" outerRadius={100}>
      {data.map((entry, index) => (
        <Cell key={index} fill={COLORS[index]} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</div>

          <div style={cardStyle("linear-gradient(135deg, #00b09b, #96c93d)")}>
            <h3>Income</h3>
            <p style={{ fontSize: "20px" }}>
              ₹ {summary.totalIncome || 0}
            </p>
          </div>

          <div style={cardStyle("linear-gradient(135deg, #ff416c, #ff4b2b)")}>
            <h3>Expense</h3>
            <p style={{ fontSize: "20px" }}>
              ₹ {summary.totalExpense || 0}
            </p>
          </div>

          <div style={cardStyle("linear-gradient(135deg, #2193b0, #6dd5ed)")}>
            <h3>Balance</h3>
            <p style={{ fontSize: "20px" }}>
              ₹ {summary.balance || 0}
            </p>
          </div>
        </div>

        {/* Form */}
        <div style={formBox}>
          <h3>{editId ? "Edit Transaction" : "Add Transaction"}</h3>

          <div style={{ display: "flex", gap: "10px" }}>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input
              style={input}
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <input
              style={input}
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <button style={button} onClick={addTransaction}>
              {editId ? "Update" : "Add"}
            </button>
          </div>
        </div>

        {/* Table */}
        <h3 style={{ color: "white" }}>Transactions</h3>

        <table style={table}>
          <thead>
            <tr style={{ background: "#007bff", color: "white" }}>
              <th>Type</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t) => (
              <tr
                key={t._id}
                style={{ textAlign: "center" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f5f5f5")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "white")
                }
              >
                <td>{t.type}</td>
                <td>₹ {t.amount}</td>
                <td>{t.category}</td>

                <td>
                  <button
                    style={{ marginRight: "5px", cursor: "pointer" }}
                    onClick={() => {
                      setEditId(t._id);
                      setType(t.type);
                      setAmount(t.amount);
                      setCategory(t.category);
                    }}
                  >
                    ✏️
                  </button>

                  <button
                    style={{ cursor: "pointer" }}
                    onClick={() => deleteTransaction(t._id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
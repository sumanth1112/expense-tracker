import React, { useState } from "react";
import API from "../services/api";
import bg from "../assets/bg.jpg"; // ✅ ADD THIS

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>
      
      {/* ✅ DARK OVERLAY */}
      <div style={styles.overlay}></div>

      <div style={styles.card}>
        <h2 style={{ marginBottom: "20px" }}>Login 🚀</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button
  onMouseOver={(e) => (e.target.style.opacity = "0.8")}
  onMouseOut={(e) => (e.target.style.opacity = "1")}
  onClick={handleLogin}
  style={styles.button}
>
  Login
</button>

        <p style={{ marginTop: "10px" }}>
          New user?{" "}
          <span
            style={{ color: "#00c6ff", cursor: "pointer" }}
            onClick={() => (window.location.href = "/register")}
          >
            Register here
          </span>
        </p>

      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    backgroundImage: `url(${bg})`, // ✅ BACKGROUND
    backgroundSize: "cover",
    backgroundPosition: "center",

    position: "relative",
  },

  overlay: {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,50,0.8))",
  zIndex: 1,
},

  card: {
    position: "relative",
    zIndex: 2,
    padding: "30px",
    borderRadius: "15px",

    background: "rgba(255,255,255,0.1)", // glass
    backdropFilter: "blur(10px)",

    boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
    width: "300px",
    textAlign: "center",
    color: "white",
  },

  input: {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "8px",
  border: "1px solid rgba(255,255,255,0.2)",
  outline: "none",
  background: "rgba(255,255,255,0.1)",
  color: "white",
},

  button: {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  background: "linear-gradient(135deg, #007bff, #00c6ff)",
  color: "white",
  cursor: "pointer",
  transition: "0.3s",
},
};

export default Login;
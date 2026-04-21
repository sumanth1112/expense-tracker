import React from "react";

function Navbar() {
  return (
    <div style={styles.nav}>
      <h2>💰 Expense Tracker</h2>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.reload();
        }}
        style={styles.btn}
      >
        Logout
      </button>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 25px",
    background: "#0f172a",
    color: "white",
    borderRadius: "10px",
    marginBottom: "20px",
  },
  btn: {
    background: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Navbar;
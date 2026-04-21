import React from "react";

function Sidebar() {
  return (
    <div style={styles.sidebar}>
      <h3>Menu</h3>
      <p>🏠 Dashboard</p>
      <p>📊 Analytics</p>
      <p>💸 Transactions</p>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "200px",
    height: "100vh",
    background: "#020617",
    color: "white",
    padding: "20px",
    position: "fixed",
  },
};

export default Sidebar;
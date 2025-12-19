const DashboardCard = ({ title, value, icon: Icon }) => {
  return (
    <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
      <div
        style={{
          backgroundColor: "#e9f5ff",
          borderRadius: "50%",
          padding: "0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {Icon && <Icon size={24} style={{ color: "#007bff" }} />}
      </div>
      <div>
        <p style={{ fontSize: "0.875rem", color: "#6c757d", marginBottom: "0.25rem" }}>{title}</p>
        <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{value}</h3>
      </div>
    </div>
  )
}

export default DashboardCard

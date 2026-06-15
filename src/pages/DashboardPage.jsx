function DashboardPage({ user }) {
  return (
    <div className="dashboard">
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: T.blue, color: T.yellow, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 22 }}>
          {user.username[0].toUpperCase()}
        </div>
        <div>
          <div className="dash-welcome">Welcome, {user.username} 👋</div>
          <div className="dash-sub">{user.email} · Retailer Account</div>
        </div>
      </div>
 
      <div className="dash-kpi-grid">
        {[
          { label: "Total Orders", value: "41", change: "+3 this month", yellow: true },
          { label: "Total Spent", value: "KES 284K", change: "+18% vs last month", yellow: false },
          { label: "Active Cart", value: "0 items", change: "Nothing in cart yet", yellow: true },
          { label: "Loyalty Points", value: "1,240 pts", change: "Redeem on next order", yellow: false },
        ].map(kpi => (
          <div key={kpi.label} className={`kpi-card ${kpi.yellow ? "" : "blue-border"}`}>
            <div className="kpi-label">{kpi.label}</div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-change">{kpi.change}</div>
          </div>
        ))}
      </div>
 
      <div className="dash-orders-table">
        <div className="section-header" style={{ marginBottom: 20 }}>
          <h2 className="section-title">Recent <span>Orders</span></h2>
          <span className="see-all">View all orders →</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_ORDERS.map(o => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 700, color: T.blue }}>{o.id}</td>
                  <td>{o.date}</td>
                  <td>{o.items} items</td>
                  <td style={{ fontWeight: 700 }}>{o.total}</td>
                  <td>
                    <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, color: T.blueLight, fontWeight: 600, cursor: "pointer" }}>View →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: T.white, borderRadius: 14, padding: 24, boxShadow: `0 2px 8px rgba(10,46,110,0.06)` }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 800, color: T.blue, marginBottom: 16 }}>Account Details</h3>
          {[["Username", user.username],["Email", user.email],["Account Type","Retailer"],["Status","✅ Verified"],["Member Since","June 2025"]].map(([k,v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${T.gray100}`, fontSize: 14 }}>
              <span style={{ color: T.gray500 }}>{k}</span>
              <span style={{ fontWeight: 600, color: T.blue }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ background: T.white, borderRadius: 14, padding: 24, boxShadow: `0 2px 8px rgba(10,46,110,0.06)` }}>
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 800, color: T.blue, marginBottom: 16 }}>Quick Actions</h3>
          {[["🛒","Browse Products","Shop our full catalogue"],["📋","My Orders","Track all your orders"],["💳","Payment Methods","Manage how you pay"],["📍","Delivery Addresses","Manage delivery points"],["🎁","Loyalty Rewards","Redeem your points"]].map(([icon, title, sub]) => (
            <div key={title} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.gray100}`, cursor: "pointer" }}
              onMouseEnter={e => e.currentTarget.style.paddingLeft = "4px"}
              onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.gray100}`, cursor: "pointer", transition: "padding 0.15s" }}
            >
              <span style={{ fontSize: 20 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.blue }}>{title}</div>
                <div style={{ fontSize: 12, color: T.gray500 }}>{sub}</div>
              </div>
              <span style={{ marginLeft: "auto", color: T.gray300 }}>›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
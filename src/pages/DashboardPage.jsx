import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { T } from "../styles/theme";
import Spinner from "../components/Spinner";
import { fetchRetailerDashboard } from "../api/retailer";

export default function DashboardPage({ user }) {
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            const data = await fetchRetailerDashboard();
            if (data) {
                setStats(data.stats);
                setOrders(data.recent_orders);
            }
            setLoading(false);
        }
        load();
    }, []);

    if (loading) return <Spinner fullPage text="Loading dashboard..." />;

    const kpis = [
        {
            label: "Total Orders",
            value: stats?.total_orders ?? 0,
            change: `${stats?.status_breakdown?.pending || 0} pending`,
            yellow: true,
            icon: "📋",
            path: "/retailer/orders",
        },
        {
            label: "Total Spent",
            value: `KES ${Number(stats?.total_spent || 0).toLocaleString()}`,
            change: "Lifetime spend",
            yellow: false,
            icon: "💰",
            path: "/retailer/orders",
        },
        {
            label: "Active Cart",
            value: `${stats?.cart_items ?? 0} items`,
            change: stats?.cart_items > 0
                ? `KES ${Number(stats.cart_total).toLocaleString()} total`
                : "Nothing in cart yet",
            yellow: true,
            icon: "🛒",
            path: "/products",
        },
        {
            label: "Loyalty Points",
            value: `${Number(stats?.loyalty_points || 0).toLocaleString()} pts`,
            change: stats?.loyalty_points > 0
                ? "Redeem on next order"
                : "Place orders to earn points",
            yellow: false,
            icon: "🎁",
            path: "/retailer/loyalty",
        },
    ];

    const quickActions = [
        { icon: "🛒", title: "Browse Products",    sub: "Shop our full catalogue",      path: "/products" },
        { icon: "📋", title: "My Orders",          sub: "Track all your orders",        path: "/retailer/orders" },
        { icon: "🎁", title: "Loyalty Rewards",    sub: "Redeem your points",           path: "/retailer/loyalty" },
        { icon: "👤", title: "My Profile",         sub: "Update your account details",  path: "/retailer/profile" },
    ];

    function statusBadgeStyle(status) {
        const map = {
            pending:   { bg: "#fff3cd", color: "#856404" },
            paid:      { bg: "#cce5ff", color: "#004085" },
            shipped:   { bg: "#d4edda", color: "#155724" },
            delivered: { bg: "#d4edda", color: "#155724" },
            cancelled: { bg: "#f8d7da", color: "#721c24" },
        };
        return map[status] || { bg: "#e2e3e5", color: "#383d41" };
    }

    return (
        <div className="dashboard">
            {/* Welcome header */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
                <div style={{
                    width: 52, height: 52, borderRadius: "50%",
                    background: T.blue, color: T.yellow,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800, fontSize: 22, flexShrink: 0,
                }}>
                    {user?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                    <div className="dash-welcome">Welcome back, {user?.username} 👋</div>
                    <div className="dash-sub">{user?.email} · Retailer Account</div>
                </div>
            </div>

            {/* KPI cards */}
            <div className="dash-kpi-grid">
                {kpis.map(kpi => (
                    <div
                        key={kpi.label}
                        className={`kpi-card ${kpi.yellow ? "" : "blue-border"}`}
                        onClick={() => navigate(kpi.path)}
                        style={{ cursor: "pointer", transition: "transform 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        <div style={{ fontSize: 24, marginBottom: 6 }}>{kpi.icon}</div>
                        <div className="kpi-label">{kpi.label}</div>
                        <div className="kpi-value">{kpi.value}</div>
                        <div className="kpi-change">{kpi.change}</div>
                    </div>
                ))}
            </div>

            {/* Recent orders */}
            <div className="dash-orders-table">
                <div className="section-header" style={{ marginBottom: 20 }}>
                    <h2 className="section-title">Recent <span>Orders</span></h2>
                    <span
                        className="see-all"
                        onClick={() => navigate("/retailer/orders")}
                        style={{ cursor: "pointer" }}
                    >
                        View all orders →
                    </span>
                </div>

                {orders.length === 0 ? (
                    <div style={{
                        textAlign: "center", padding: "48px 20px",
                        background: T.white, borderRadius: 14,
                        boxShadow: "0 2px 8px rgba(10,46,110,0.06)",
                    }}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
                        <div style={{
                            fontWeight: 700, color: T.blue,
                            fontSize: 16, marginBottom: 8,
                        }}>
                            No orders yet
                        </div>
                        <div style={{ color: T.gray500, fontSize: 14, marginBottom: 20 }}>
                            Start by browsing our wholesale catalogue.
                        </div>
                        <button
                            onClick={() => navigate("/products")}
                            style={{
                                background: T.blue, color: "white",
                                border: "none", borderRadius: 10,
                                padding: "12px 24px", fontSize: 14,
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontWeight: 700, cursor: "pointer",
                            }}
                        >
                            Browse Products →
                        </button>
                    </div>
                ) : (
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
                                {orders.map(o => {
                                    const badge = statusBadgeStyle(o.status);
                                    return (
                                        <tr key={o.order_id}>
                                            <td style={{ fontWeight: 700, color: T.blue }}>
                                                #{o.order_id}
                                            </td>
                                            <td>{new Date(o.created_at).toLocaleDateString("en-KE")}</td>
                                            <td>{o.items_count} items</td>
                                            <td style={{ fontWeight: 700 }}>
                                                KES {Number(o.total_amount).toLocaleString()}
                                            </td>
                                            <td>
                                                <span style={{
                                                    padding: "3px 10px", borderRadius: 20,
                                                    fontSize: 12, fontWeight: 700,
                                                    background: badge.bg, color: badge.color,
                                                }}>
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    onClick={() => navigate(`/retailer/orders/${o.order_id}`)}
                                                    style={{
                                                        fontSize: 13, color: T.blueLight,
                                                        fontWeight: 600, cursor: "pointer",
                                                    }}
                                                >
                                                    View →
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Account details + Quick actions */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Account details */}
                <div style={{
                    background: T.white, borderRadius: 14, padding: 24,
                    boxShadow: "0 2px 8px rgba(10,46,110,0.06)",
                }}>
                    <h3 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 16, fontWeight: 800,
                        color: T.blue, marginBottom: 16,
                    }}>
                        Account Details
                    </h3>
                    {[
                        ["Username", user?.username],
                        ["Email", user?.email],
                        ["Phone", user?.phone || "—"],
                        ["Business", user?.business_name || "—"],
                        ["Account Type", "Retailer"],
                        ["Status", "✅ Verified"],
                        ["Member Since", new Date(user?.created_at || Date.now()).toLocaleDateString("en-KE", {
                            month: "long", year: "numeric",
                        })],
                    ].map(([k, v]) => (
                        <div key={k} style={{
                            display: "flex", justifyContent: "space-between",
                            padding: "8px 0",
                            borderBottom: `1px solid ${T.gray100}`,
                            fontSize: 14,
                        }}>
                            <span style={{ color: T.gray500 }}>{k}</span>
                            <span style={{ fontWeight: 600, color: T.blue }}>{v}</span>
                        </div>
                    ))}
                    <button
                        onClick={() => navigate("/retailer/profile")}
                        style={{
                            marginTop: 16, width: "100%",
                            background: "#f0f2f8", color: T.blue,
                            border: "none", borderRadius: 8,
                            padding: "10px 0", fontSize: 13,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 700, cursor: "pointer",
                        }}
                    >
                        Edit Profile →
                    </button>
                </div>

                {/* Quick actions */}
                <div style={{
                    background: T.white, borderRadius: 14, padding: 24,
                    boxShadow: "0 2px 8px rgba(10,46,110,0.06)",
                }}>
                    <h3 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 16, fontWeight: 800,
                        color: T.blue, marginBottom: 16,
                    }}>
                        Quick Actions
                    </h3>
                    {quickActions.map(({ icon, title, sub, path }) => (
                        <div
                            key={title}
                            onClick={() => navigate(path)}
                            style={{
                                display: "flex", alignItems: "center", gap: 12,
                                padding: "10px 0",
                                borderBottom: `1px solid ${T.gray100}`,
                                cursor: "pointer", transition: "padding 0.15s",
                            }}
                            onMouseEnter={e => e.currentTarget.style.paddingLeft = "6px"}
                            onMouseLeave={e => e.currentTarget.style.paddingLeft = "0"}
                        >
                            <span style={{ fontSize: 20 }}>{icon}</span>
                            <div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: T.blue }}>
                                    {title}
                                </div>
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
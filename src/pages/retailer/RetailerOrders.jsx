import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { T } from "../../styles/theme";
import Spinner from "../../components/Spinner";
import { fetchRetailerOrders } from "../../api/retailer";

export default function RetailerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchRetailerOrders().then(data => {
            if (data) setOrders(data.orders);
            setLoading(false);
        });
    }, []);

    const statuses = ["", "pending", "paid", "shipped", "delivered", "cancelled"];

    const filtered = statusFilter
        ? orders.filter(o => o.status === statusFilter)
        : orders;

    function badgeStyle(status) {
        const map = {
            pending:   { bg: "#fff3cd", color: "#856404" },
            paid:      { bg: "#cce5ff", color: "#004085" },
            shipped:   { bg: "#d4edda", color: "#155724" },
            delivered: { bg: "#d4edda", color: "#155724" },
            cancelled: { bg: "#f8d7da", color: "#721c24" },
        };
        return map[status] || { bg: "#e2e3e5", color: "#383d41" };
    }

    if (loading) return <Spinner fullPage text="Loading orders..." />;

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 24, fontWeight: 800, color: T.blue, marginBottom: 4,
                }}>
                    My Orders
                </h1>
                <p style={{ color: T.gray500, fontSize: 14 }}>
                    {orders.length} total orders
                </p>
            </div>

            {/* Status filter tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                {statuses.map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        style={{
                            padding: "8px 18px", borderRadius: 20,
                            border: "none", fontSize: 13, fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            background: statusFilter === s ? T.blue : "#f0f2f8",
                            color: statusFilter === s ? "white" : T.gray500,
                            transition: "all 0.15s",
                        }}
                    >
                        {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>

            {filtered.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: 80,
                    background: "white", borderRadius: 14,
                    boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                    <div style={{ fontWeight: 700, color: T.blue, fontSize: 18, marginBottom: 8 }}>
                        No orders found
                    </div>
                    <div style={{ color: T.gray500, fontSize: 14, marginBottom: 20 }}>
                        {statusFilter
                            ? `No ${statusFilter} orders.`
                            : "You haven't placed any orders yet."}
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
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {filtered.map(o => {
                        const badge = badgeStyle(o.status);
                        return (
                            <div
                                key={o.order_id}
                                onClick={() => navigate(`/retailer/orders/${o.order_id}`)}
                                style={{
                                    background: "white", borderRadius: 14,
                                    padding: "20px 24px",
                                    boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                                    cursor: "pointer", transition: "transform 0.15s",
                                    display: "flex", alignItems: "center",
                                    justifyContent: "space-between", gap: 16,
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 20, flex: 1 }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: 12,
                                        background: "#f0f2f8",
                                        display: "flex", alignItems: "center",
                                        justifyContent: "center", fontSize: 22, flexShrink: 0,
                                    }}>
                                        📦
                                    </div>
                                    <div>
                                        <div style={{
                                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                                            fontWeight: 800, fontSize: 15, color: T.blue, marginBottom: 4,
                                        }}>
                                            Order #{o.order_id}
                                        </div>
                                        <div style={{ fontSize: 13, color: T.gray500 }}>
                                            {o.items_count} items ·{" "}
                                            {new Date(o.created_at).toLocaleDateString("en-KE", {
                                                day: "numeric", month: "short", year: "numeric",
                                            })}
                                            {o.delivery_city && ` · ${o.delivery_city}`}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                    <div style={{
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontWeight: 800, fontSize: 16, color: T.blue, marginBottom: 6,
                                    }}>
                                        KES {Number(o.total_amount).toLocaleString()}
                                    </div>
                                    <span style={{
                                        padding: "4px 12px", borderRadius: 20,
                                        fontSize: 12, fontWeight: 700,
                                        background: badge.bg, color: badge.color,
                                    }}>
                                        {o.status}
                                    </span>
                                </div>

                                <span style={{ color: T.gray300, fontSize: 20 }}>›</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
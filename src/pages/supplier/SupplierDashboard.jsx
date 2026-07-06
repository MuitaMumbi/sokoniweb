import { useEffect, useState } from "react";
import { T } from "../../styles/theme";
import { fetchSupplierDashboard } from "../../api/supplier";
import { useNavigate } from "react-router-dom";

export default function SupplierDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSupplierDashboard().then(d => {
            if (d) setData(d);
            setLoading(false);
        });
    }, []);

    if (loading) return <div style={{ color: T.blue, padding: 40 }}>Loading dashboard...</div>;

    const { stats, recent_purchase_orders, recent_deliveries } = data || {};

    const kpis = [
        { label: "Total Products",    value: stats?.total_products  ?? 0, icon: "📦", path: "/supplier/products" },
        { label: "Active Products",   value: stats?.active_products ?? 0, icon: "✅", path: "/supplier/products" },
        { label: "Low Stock",         value: stats?.low_stock       ?? 0, icon: "⚠️", path: "/supplier/inventory" },
        { label: "Out of Stock",      value: stats?.out_of_stock    ?? 0, icon: "❌", path: "/supplier/inventory" },
        { label: "Pending POs",       value: stats?.pending_pos     ?? 0, icon: "📋", path: "/supplier/orders" },
        { label: "Unpaid Invoices",   value: stats?.unpaid_invoices ?? 0, icon: "💰", path: "/supplier/orders" },
    ];

    return (
        <div>
            <h1 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 24, fontWeight: 800,
                color: T.blue, marginBottom: 8,
            }}>
                Supplier Dashboard
            </h1>
            <p style={{ color: T.gray500, fontSize: 14, marginBottom: 28 }}>
                Overview of your products, inventory and orders.
            </p>

            {/* KPI grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 16,
                marginBottom: 32,
            }}>
                {kpis.map(k => (
                    <div
                        key={k.label}
                        onClick={() => navigate(k.path)}
                        style={{
                            background: T.white,
                            borderRadius: 14,
                            padding: "20px 24px",
                            boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                            cursor: "pointer",
                            transition: "transform 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                    >
                        <div style={{ fontSize: 28, marginBottom: 8 }}>{k.icon}</div>
                        <div style={{
                            fontSize: 28, fontWeight: 800,
                            color: T.blue,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}>
                            {k.value}
                        </div>
                        <div style={{ fontSize: 13, color: T.gray500, marginTop: 4 }}>{k.label}</div>
                    </div>
                ))}
            </div>

            {/* Unpaid amount banner */}
            {stats?.unpaid_amount > 0 && (
                <div style={{
                    background: `linear-gradient(120deg, ${T.blue}, #1a4fa0)`,
                    borderRadius: 14,
                    padding: "20px 28px",
                    color: T.white,
                    marginBottom: 32,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}>
                    <div>
                        <div style={{ fontSize: 13, opacity: 0.7 }}>Outstanding Balance</div>
                        <div style={{
                            fontSize: 28, fontWeight: 800,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}>
                            KES {Number(stats.unpaid_amount).toLocaleString()}
                        </div>
                    </div>
                    <div style={{ fontSize: 36 }}>💳</div>
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {/* Recent Purchase Orders */}
                <div style={{
                    background: T.white, borderRadius: 14,
                    padding: 24, boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                }}>
                    <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", marginBottom: 16,
                    }}>
                        <h3 style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 16, fontWeight: 800, color: T.blue,
                        }}>
                            Recent Purchase Orders
                        </h3>
                        <span
                            onClick={() => navigate("/supplier/orders")}
                            style={{ fontSize: 13, color: T.blueLight, cursor: "pointer", fontWeight: 600 }}
                        >
                            View all →
                        </span>
                    </div>
                    {recent_purchase_orders?.length === 0 ? (
                        <div style={{ color: T.gray500, fontSize: 14, textAlign: "center", padding: 20 }}>
                            No purchase orders yet
                        </div>
                    ) : (
                        recent_purchase_orders?.map(po => (
                            <div key={po.po_id} style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center", padding: "10px 0",
                                borderBottom: `1px solid ${T.gray100}`,
                                fontSize: 14,
                            }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: T.blue }}>
                                        #{po.po_id} — {po.product_name}
                                    </div>
                                    <div style={{ fontSize: 12, color: T.gray500 }}>
                                        {po.quantity_requested} units
                                    </div>
                                </div>
                                <span style={{
                                    padding: "3px 10px",
                                    borderRadius: 20,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    background: po.status === "pending" ? "#fff3cd" :
                                                po.status === "accepted" ? "#d4edda" :
                                                po.status === "rejected" ? "#f8d7da" : "#e2e3e5",
                                    color: po.status === "pending" ? "#856404" :
                                           po.status === "accepted" ? "#155724" :
                                           po.status === "rejected" ? "#721c24" : "#383d41",
                                }}>
                                    {po.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* Recent Deliveries */}
                <div style={{
                    background: T.white, borderRadius: 14,
                    padding: 24, boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                }}>
                    <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", marginBottom: 16,
                    }}>
                        <h3 style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 16, fontWeight: 800, color: T.blue,
                        }}>
                            Recent Deliveries
                        </h3>
                        <span
                            onClick={() => navigate("/supplier/shipments")}
                            style={{ fontSize: 13, color: T.blueLight, cursor: "pointer", fontWeight: 600 }}
                        >
                            View all →
                        </span>
                    </div>
                    {recent_deliveries?.length === 0 ? (
                        <div style={{ color: T.gray500, fontSize: 14, textAlign: "center", padding: 20 }}>
                            No deliveries yet
                        </div>
                    ) : (
                        recent_deliveries?.map(d => (
                            <div key={d.delivery_id} style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center", padding: "10px 0",
                                borderBottom: `1px solid ${T.gray100}`,
                                fontSize: 14,
                            }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: T.blue }}>
                                        Delivery #{d.delivery_id}
                                    </div>
                                    <div style={{ fontSize: 12, color: T.gray500 }}>
                                        {d.quantity_delivered} units · {d.delivery_date || "TBD"}
                                    </div>
                                </div>
                                <span style={{
                                    padding: "3px 10px",
                                    borderRadius: 20,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    background: d.status === "delivered" ? "#d4edda" :
                                                d.status === "in_transit" ? "#cce5ff" : "#e2e3e5",
                                    color: d.status === "delivered" ? "#155724" :
                                           d.status === "in_transit" ? "#004085" : "#383d41",
                                }}>
                                    {d.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
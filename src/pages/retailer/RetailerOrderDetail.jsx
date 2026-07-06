import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { T } from "../../styles/theme";
import Spinner from "../../components/Spinner";
import { fetchOrderDetail, confirmDelivery } from "../../api/retailer";

export default function RetailerOrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    async function load() {
        const data = await fetchOrderDetail(id);
        if (data) setOrder(data.order);
        setLoading(false);
    }

    useEffect(() => { load(); }, [id]);

    async function handleConfirmDelivery() {
        if (!window.confirm("Confirm you have received this order?")) return;
        setConfirming(true);
        const data = await confirmDelivery(id);
        setConfirming(false);
        if (data?.message) {
            setConfirmed(true);
            load();
        }
    }

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

    const steps = ["pending", "paid", "shipped", "delivered"];

    if (loading) return <Spinner fullPage text="Loading order..." />;
    if (!order) return (
        <div style={{ textAlign: "center", padding: 80 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>❌</div>
            <div style={{ fontWeight: 700, color: T.blue }}>Order not found</div>
            <button onClick={() => navigate("/retailer/orders")} style={{
                marginTop: 16, background: T.blue, color: "white",
                border: "none", borderRadius: 10, padding: "12px 24px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700, cursor: "pointer", fontSize: 14,
            }}>
                Back to Orders
            </button>
        </div>
    );

    const badge = badgeStyle(order.status);
    const currentStep = steps.indexOf(order.status);

    return (
        <div>
            {/* Back */}
            <button
                onClick={() => navigate("/retailer/orders")}
                style={{
                    background: "none", border: "none",
                    color: T.blueLight, fontSize: 14, fontWeight: 600,
                    cursor: "pointer", padding: 0, marginBottom: 20,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    display: "flex", alignItems: "center", gap: 6,
                }}
            >
                ← Back to Orders
            </button>

            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12,
            }}>
                <div>
                    <h1 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 24, fontWeight: 800, color: T.blue, marginBottom: 4,
                    }}>
                        Order #{order.order_id}
                    </h1>
                    <p style={{ color: T.gray500, fontSize: 14 }}>
                        Placed on {new Date(order.created_at).toLocaleDateString("en-KE", {
                            day: "numeric", month: "long", year: "numeric",
                        })}
                    </p>
                </div>
                <span style={{
                    padding: "8px 20px", borderRadius: 20,
                    fontSize: 14, fontWeight: 700,
                    background: badge.bg, color: badge.color,
                }}>
                    {order.status}
                </span>
            </div>

            {/* Progress tracker */}
            {order.status !== "cancelled" && (
                <div style={{
                    background: "white", borderRadius: 14, padding: 24,
                    boxShadow: "0 2px 8px rgba(10,46,110,0.07)", marginBottom: 20,
                }}>
                    <h3 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 15, fontWeight: 800, color: T.blue, marginBottom: 20,
                    }}>
                        Order Progress
                    </h3>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {steps.map((step, i) => {
                            const done = i <= currentStep;
                            const active = i === currentStep;
                            return (
                                <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: "50%",
                                            background: done ? T.blue : "#e2e3e5",
                                            color: done ? "white" : T.gray500,
                                            display: "flex", alignItems: "center",
                                            justifyContent: "center", fontSize: 13,
                                            fontWeight: 700,
                                            border: active ? `3px solid ${T.yellow}` : "3px solid transparent",
                                        }}>
                                            {done ? "✓" : i + 1}
                                        </div>
                                        <div style={{
                                            fontSize: 11, fontWeight: done ? 700 : 400,
                                            color: done ? T.blue : T.gray500,
                                            textAlign: "center", whiteSpace: "nowrap",
                                        }}>
                                            {step.charAt(0).toUpperCase() + step.slice(1)}
                                        </div>
                                    </div>
                                    {i < steps.length - 1 && (
                                        <div style={{
                                            flex: 1, height: 2, margin: "0 4px",
                                            marginBottom: 20,
                                            background: i < currentStep ? T.blue : "#e2e3e5",
                                        }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                {/* Order summary */}
                <div style={{
                    background: "white", borderRadius: 14, padding: 24,
                    boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                }}>
                    <h3 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 15, fontWeight: 800, color: T.blue, marginBottom: 16,
                    }}>
                        Order Summary
                    </h3>
                    {[
                        ["Order ID", `#${order.order_id}`],
                        ["Status", order.status],
                        ["Total Amount", `KES ${Number(order.total_amount).toLocaleString()}`],
                        ["Discount", order.discount_amount > 0 ? `KES ${Number(order.discount_amount).toLocaleString()}` : "None"],
                        ["Promo Code", order.promo_code || "None"],
                        ["Payment", order.mpesa_receipt || "Pending"],
                    ].map(([k, v]) => (
                        <div key={k} style={{
                            display: "flex", justifyContent: "space-between",
                            padding: "8px 0", borderBottom: `1px solid ${T.gray100}`, fontSize: 14,
                        }}>
                            <span style={{ color: T.gray500 }}>{k}</span>
                            <span style={{ fontWeight: 600, color: T.blue }}>{v}</span>
                        </div>
                    ))}
                </div>

                {/* Delivery info */}
                <div style={{
                    background: "white", borderRadius: 14, padding: 24,
                    boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                }}>
                    <h3 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 15, fontWeight: 800, color: T.blue, marginBottom: 16,
                    }}>
                        Delivery Details
                    </h3>
                    {[
                        ["Address", order.delivery_address || "—"],
                        ["City", order.delivery_city || "—"],
                        ["Country", order.country || "Kenya"],
                        ["Recipient", order.buyer_name || "—"],
                        ["Phone", order.buyer_phone || "—"],
                    ].map(([k, v]) => (
                        <div key={k} style={{
                            display: "flex", justifyContent: "space-between",
                            padding: "8px 0", borderBottom: `1px solid ${T.gray100}`, fontSize: 14,
                        }}>
                            <span style={{ color: T.gray500 }}>{k}</span>
                            <span style={{ fontWeight: 600, color: T.blue, textAlign: "right", maxWidth: "60%" }}>
                                {v}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order items */}
            <div style={{
                background: "white", borderRadius: 14, padding: 24,
                boxShadow: "0 2px 8px rgba(10,46,110,0.07)", marginBottom: 20,
            }}>
                <h3 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 15, fontWeight: 800, color: T.blue, marginBottom: 16,
                }}>
                    Items Ordered
                </h3>
                {order.items?.map((item, i) => (
                    <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 16,
                        padding: "12px 0", borderBottom: `1px solid ${T.gray100}`,
                    }}>
                        {item.product_photo ? (
                            <img
                                src={item.product_photo}
                                alt={item.product_name}
                                style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover", flexShrink: 0 }}
                            />
                        ) : (
                            <div style={{
                                width: 48, height: 48, borderRadius: 8,
                                background: "#f0f2f8", display: "flex",
                                alignItems: "center", justifyContent: "center",
                                fontSize: 22, flexShrink: 0,
                            }}>
                                📦
                            </div>
                        )}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, color: T.blue, fontSize: 14 }}>
                                {item.product_name}
                            </div>
                            <div style={{ fontSize: 13, color: T.gray500 }}>
                                {item.quantity} {item.unit}s × KES {Number(item.unit_price).toLocaleString()}
                            </div>
                        </div>
                        <div style={{ fontWeight: 800, color: T.blue, fontSize: 15 }}>
                            KES {Number(item.subtotal).toLocaleString()}
                        </div>
                    </div>
                ))}

                {/* Total */}
                <div style={{
                    display: "flex", justifyContent: "space-between",
                    padding: "16px 0 0", fontSize: 16,
                }}>
                    <span style={{ fontWeight: 800, color: T.blue }}>Total</span>
                    <span style={{ fontWeight: 800, color: T.blue }}>
                        KES {Number(order.total_amount).toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Confirm delivery */}
            {order.status === "shipped" && (
                <div style={{
                    background: "#d4edda", borderRadius: 14, padding: 24,
                    border: "1px solid #c3e6cb",
                }}>
                    <h3 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 15, fontWeight: 800,
                        color: "#155724", marginBottom: 8,
                    }}>
                        🚚 Your order has been shipped!
                    </h3>
                    <p style={{ fontSize: 14, color: "#155724", marginBottom: 16 }}>
                        Once you receive your order, confirm delivery to earn loyalty points.
                    </p>
                    {confirmed ? (
                        <div style={{ fontWeight: 700, color: "#155724" }}>
                            ✅ Delivery confirmed! Loyalty points have been added.
                        </div>
                    ) : (
                        <button
                            onClick={handleConfirmDelivery}
                            disabled={confirming}
                            style={{
                                background: "#155724", color: "white",
                                border: "none", borderRadius: 10,
                                padding: "12px 24px", fontSize: 14,
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontWeight: 700, cursor: confirming ? "not-allowed" : "pointer",
                                opacity: confirming ? 0.7 : 1,
                                display: "flex", alignItems: "center", gap: 8,
                            }}
                        >
                            {confirming ? <Spinner size={16} text="" /> : null}
                            {confirming ? "Confirming..." : "Confirm Delivery"}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
import { useEffect, useState } from "react";
import { T } from "../../styles/theme";
import {
    fetchPurchaseOrders,
    respondToPurchaseOrder,
    confirmDispatch,
} from "../../api/supplier";

export default function SupplierOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [showDispatchModal, setShowDispatchModal] = useState(false);
    const [selectedPO, setSelectedPO] = useState(null);
    const [deliveryDate, setDeliveryDate] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function load() {
        const data = await fetchPurchaseOrders(statusFilter);
        if (data) setOrders(data.purchase_orders);
        setLoading(false);
    }

    useEffect(() => { load(); }, [statusFilter]);

    async function handleRespond(po_id, action) {
        setSaving(true);
        const data = await respondToPurchaseOrder(po_id, action);
        setSaving(false);
        if (data?.error) { alert(data.error); return; }
        load();
    }

    async function handleDispatch() {
        if (!deliveryDate) { setError("Delivery date is required"); return; }
        setSaving(true);
        setError("");
        const data = await confirmDispatch(selectedPO.po_id, deliveryDate);
        setSaving(false);
        if (data?.error) { setError(data.error); return; }
        setShowDispatchModal(false);
        load();
    }

    function statusBadge(status) {
        const map = {
            pending:   { bg: "#fff3cd", color: "#856404" },
            accepted:  { bg: "#d4edda", color: "#155724" },
            rejected:  { bg: "#f8d7da", color: "#721c24" },
            fulfilled: { bg: "#cce5ff", color: "#004085" },
        };
        return map[status] || { bg: "#e2e3e5", color: "#383d41" };
    }

    const statuses = ["", "pending", "accepted", "rejected", "fulfilled"];

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 24, fontWeight: 800, color: T.blue, marginBottom: 4,
                }}>
                    Purchase Orders
                </h1>
                <p style={{ color: T.gray500, fontSize: 14 }}>
                    Review and respond to stock replenishment requests from Sokoni.
                </p>
            </div>

            {/* Status filter tabs */}
            <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                {statuses.map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        style={{
                            padding: "8px 18px",
                            borderRadius: 20,
                            border: "none",
                            fontSize: 13,
                            fontWeight: 600,
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

            {loading ? (
                <div style={{ color: T.gray500, padding: 40, textAlign: "center" }}>
                    Loading purchase orders...
                </div>
            ) : orders.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: 80,
                    background: "white", borderRadius: 14,
                    boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                    <div style={{ fontWeight: 700, color: T.blue, fontSize: 18, marginBottom: 8 }}>
                        No purchase orders
                    </div>
                    <div style={{ color: T.gray500, fontSize: 14 }}>
                        {statusFilter
                            ? `No ${statusFilter} purchase orders found.`
                            : "Sokoni will raise purchase orders when stock runs low."}
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {orders.map(po => {
                        const badge = statusBadge(po.status);
                        return (
                            <div key={po.po_id} style={{
                                background: "white", borderRadius: 14,
                                padding: 24,
                                boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                            }}>
                                <div style={{
                                    display: "flex", justifyContent: "space-between",
                                    alignItems: "flex-start", marginBottom: 16,
                                }}>
                                    <div>
                                        <div style={{
                                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                                            fontSize: 16, fontWeight: 800, color: T.blue,
                                            marginBottom: 4,
                                        }}>
                                            PO #{po.po_id} — {po.product_name}
                                        </div>
                                        <div style={{ fontSize: 13, color: T.gray500 }}>
                                            {po.auto_generated ? "🤖 Auto-generated" : "👤 Manual request"} ·
                                            Raised by {po.requested_by_name || "Sokoni"} ·
                                            {new Date(po.created_at).toLocaleDateString("en-KE")}
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: "5px 14px", borderRadius: 20,
                                        fontSize: 13, fontWeight: 700,
                                        background: badge.bg, color: badge.color,
                                    }}>
                                        {po.status}
                                    </span>
                                </div>

                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, 1fr)",
                                    gap: 16, marginBottom: 20,
                                    background: "#f8f9fc",
                                    borderRadius: 10, padding: 16,
                                }}>
                                    {[
                                        ["Quantity Requested", `${po.quantity_requested.toLocaleString()} ${po.unit}`],
                                        ["Unit", po.unit],
                                        ["Last Updated", new Date(po.updated_at).toLocaleDateString("en-KE")],
                                    ].map(([label, value]) => (
                                        <div key={label}>
                                            <div style={{ fontSize: 12, color: T.gray500, marginBottom: 4 }}>
                                                {label}
                                            </div>
                                            <div style={{ fontSize: 15, fontWeight: 700, color: T.blue }}>
                                                {value}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div style={{ display: "flex", gap: 10 }}>
                                    {po.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => handleRespond(po.po_id, "accept")}
                                                disabled={saving}
                                                style={{
                                                    background: "#d4edda", color: "#155724",
                                                    border: "none", borderRadius: 8,
                                                    padding: "10px 20px", fontSize: 14,
                                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                                    fontWeight: 700, cursor: "pointer",
                                                }}
                                            >
                                                ✅ Accept
                                            </button>
                                            <button
                                                onClick={() => handleRespond(po.po_id, "reject")}
                                                disabled={saving}
                                                style={{
                                                    background: "#f8d7da", color: "#721c24",
                                                    border: "none", borderRadius: 8,
                                                    padding: "10px 20px", fontSize: 14,
                                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                                    fontWeight: 700, cursor: "pointer",
                                                }}
                                            >
                                                ❌ Reject
                                            </button>
                                        </>
                                    )}
                                    {po.status === "accepted" && (
                                        <button
                                            onClick={() => {
                                                setSelectedPO(po);
                                                setDeliveryDate("");
                                                setError("");
                                                setShowDispatchModal(true);
                                            }}
                                            style={{
                                                background: T.blue, color: "white",
                                                border: "none", borderRadius: 8,
                                                padding: "10px 20px", fontSize: 14,
                                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                                fontWeight: 700, cursor: "pointer",
                                            }}
                                        >
                                            🚚 Confirm Dispatch
                                        </button>
                                    )}
                                    {po.status === "fulfilled" && (
                                        <span style={{
                                            fontSize: 14, color: "#155724",
                                            fontWeight: 600, padding: "10px 0",
                                        }}>
                                            ✅ Dispatched — check Shipments for delivery status
                                        </span>
                                    )}
                                    {po.status === "rejected" && (
                                        <span style={{
                                            fontSize: 14, color: "#721c24",
                                            fontWeight: 600, padding: "10px 0",
                                        }}>
                                            This purchase order was rejected.
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Dispatch Modal */}
            {showDispatchModal && selectedPO && (
                <div style={{
                    position: "fixed", inset: 0,
                    background: "rgba(10,46,110,0.45)",
                    zIndex: 500, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    padding: 24,
                }}>
                    <div style={{
                        background: "white", borderRadius: 16,
                        padding: 32, width: "100%", maxWidth: 440,
                    }}>
                        <h2 style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 18, fontWeight: 800,
                            color: T.blue, marginBottom: 6,
                        }}>
                            Confirm Dispatch
                        </h2>
                        <p style={{ color: T.gray500, fontSize: 13, marginBottom: 24 }}>
                            PO #{selectedPO.po_id} — {selectedPO.product_name} ·
                            {selectedPO.quantity_requested.toLocaleString()} units
                        </p>

                        {error && (
                            <div style={{
                                background: "#f8d7da", color: "#721c24",
                                padding: "10px 16px", borderRadius: 8,
                                fontSize: 14, marginBottom: 16,
                            }}>
                                {error}
                            </div>
                        )}

                        <label style={{
                            display: "block", fontSize: 13,
                            fontWeight: 600, color: T.gray500, marginBottom: 6,
                        }}>
                            Expected Delivery Date *
                        </label>
                        <input
                            type="date"
                            value={deliveryDate}
                            onChange={e => setDeliveryDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            style={{
                                width: "100%", padding: "10px 14px",
                                border: `1.5px solid ${T.gray100}`,
                                borderRadius: 8, fontSize: 14,
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                color: T.blue, boxSizing: "border-box",
                                marginBottom: 24,
                            }}
                        />

                        <div style={{ display: "flex", gap: 12 }}>
                            <button
                                onClick={handleDispatch}
                                disabled={saving}
                                style={{
                                    flex: 1, background: T.blue, color: "white",
                                    border: "none", borderRadius: 10,
                                    padding: "13px 0", fontSize: 15,
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
                                    opacity: saving ? 0.7 : 1,
                                }}
                            >
                                {saving ? "Confirming..." : "Confirm Dispatch"}
                            </button>
                            <button
                                onClick={() => setShowDispatchModal(false)}
                                style={{
                                    flex: 1, background: "#f0f2f8", color: T.blue,
                                    border: "none", borderRadius: 10,
                                    padding: "13px 0", fontSize: 15,
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    fontWeight: 700, cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
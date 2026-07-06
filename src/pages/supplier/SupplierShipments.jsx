import { useEffect, useState } from "react";
import { T } from "../../styles/theme";
import { fetchShipments, updateShipmentStatus } from "../../api/supplier";

export default function SupplierShipments() {
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [saving, setSaving] = useState(null);

    async function load() {
        const data = await fetchShipments(statusFilter);
        if (data) setShipments(data.shipments);
        setLoading(false);
    }

    useEffect(() => { load(); }, [statusFilter]);

    async function handleStatusUpdate(delivery_id, newStatus) {
        setSaving(delivery_id);
        const data = await updateShipmentStatus(delivery_id, newStatus);
        setSaving(null);
        if (data?.error) { alert(data.error); return; }
        load();
    }

    function statusBadge(status) {
        const map = {
            scheduled:  { bg: "#e2e3e5", color: "#383d41" },
            in_transit: { bg: "#cce5ff", color: "#004085" },
            delivered:  { bg: "#d4edda", color: "#155724" },
            cancelled:  { bg: "#f8d7da", color: "#721c24" },
        };
        return map[status] || { bg: "#e2e3e5", color: "#383d41" };
    }

    function nextAction(status) {
        const map = {
            scheduled:  { label: "Mark In Transit", next: "in_transit", bg: "#cce5ff", color: "#004085" },
            in_transit: { label: "Mark Delivered",  next: "delivered",  bg: "#d4edda", color: "#155724" },
        };
        return map[status] || null;
    }

    const statuses = ["", "scheduled", "in_transit", "delivered", "cancelled"];

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 24, fontWeight: 800, color: T.blue, marginBottom: 4,
                }}>
                    Shipments
                </h1>
                <p style={{ color: T.gray500, fontSize: 14 }}>
                    Track and update the status of your deliveries to Sokoni.
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
                        {s === "" ? "All" : s.replace("_", " ").replace(/^\w/, c => c.toUpperCase())}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ color: T.gray500, padding: 40, textAlign: "center" }}>
                    Loading shipments...
                </div>
            ) : shipments.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: 80,
                    background: "white", borderRadius: 14,
                    boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🚚</div>
                    <div style={{ fontWeight: 700, color: T.blue, fontSize: 18, marginBottom: 8 }}>
                        No shipments yet
                    </div>
                    <div style={{ color: T.gray500, fontSize: 14 }}>
                        Shipments are created when you confirm dispatch on a purchase order.
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {shipments.map(s => {
                        const badge = statusBadge(s.status);
                        const action = nextAction(s.status);
                        const isSaving = saving === s.delivery_id;

                        return (
                            <div key={s.delivery_id} style={{
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
                                            fontSize: 16, fontWeight: 800,
                                            color: T.blue, marginBottom: 4,
                                        }}>
                                            Shipment #{s.delivery_id} — {s.product_name}
                                        </div>
                                        <div style={{ fontSize: 13, color: T.gray500 }}>
                                            PO #{s.po_id} · Created {new Date(s.created_at).toLocaleDateString("en-KE")}
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: "5px 14px", borderRadius: 20,
                                        fontSize: 13, fontWeight: 700,
                                        background: badge.bg, color: badge.color,
                                    }}>
                                        {s.status.replace("_", " ")}
                                    </span>
                                </div>

                                {/* Shipment details */}
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(3, 1fr)",
                                    gap: 16, marginBottom: 20,
                                    background: "#f8f9fc",
                                    borderRadius: 10, padding: 16,
                                }}>
                                    {[
                                        ["Quantity", `${s.quantity_delivered.toLocaleString()} ${s.unit}`],
                                        ["Delivery Date", s.delivery_date
                                            ? new Date(s.delivery_date).toLocaleDateString("en-KE")
                                            : "TBD"],
                                        ["Received By", s.received_by_name || "Pending"],
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

                                {/* Status progress bar */}
                                <div style={{
                                    display: "flex", alignItems: "center",
                                    gap: 0, marginBottom: 20,
                                }}>
                                    {["scheduled", "in_transit", "delivered"].map((step, i) => {
                                        const steps = ["scheduled", "in_transit", "delivered"];
                                        const currentIndex = steps.indexOf(s.status);
                                        const stepIndex = i;
                                        const done = stepIndex <= currentIndex;
                                        return (
                                            <div key={step} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                                                <div style={{
                                                    width: 28, height: 28, borderRadius: "50%",
                                                    background: done ? T.blue : "#e2e3e5",
                                                    color: done ? "white" : T.gray500,
                                                    display: "flex", alignItems: "center",
                                                    justifyContent: "center", fontSize: 12,
                                                    fontWeight: 700, flexShrink: 0,
                                                }}>
                                                    {done ? "✓" : i + 1}
                                                </div>
                                                <div style={{ fontSize: 11, color: done ? T.blue : T.gray500, marginLeft: 6, fontWeight: done ? 700 : 400 }}>
                                                    {step.replace("_", " ")}
                                                </div>
                                                {i < 2 && (
                                                    <div style={{
                                                        flex: 1, height: 2, marginLeft: 8,
                                                        background: stepIndex < currentIndex ? T.blue : "#e2e3e5",
                                                    }} />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Action button */}
                                {action && s.status !== "cancelled" && (
                                    <button
                                        onClick={() => handleStatusUpdate(s.delivery_id, action.next)}
                                        disabled={isSaving}
                                        style={{
                                            background: action.bg, color: action.color,
                                            border: "none", borderRadius: 8,
                                            padding: "10px 24px", fontSize: 14,
                                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                                            fontWeight: 700, cursor: isSaving ? "not-allowed" : "pointer",
                                            opacity: isSaving ? 0.7 : 1,
                                        }}
                                    >
                                        {isSaving ? "Updating..." : action.label}
                                    </button>
                                )}

                                {s.status === "delivered" && (
                                    <div style={{
                                        fontSize: 14, color: "#155724",
                                        fontWeight: 600,
                                    }}>
                                        ✅ Delivered and received by Sokoni warehouse.
                                    </div>
                                )}

                                {s.status === "cancelled" && (
                                    <div style={{ fontSize: 14, color: "#721c24", fontWeight: 600 }}>
                                        ❌ This shipment was cancelled.
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
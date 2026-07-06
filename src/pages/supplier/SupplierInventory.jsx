import { useEffect, useState } from "react";
import { T } from "../../styles/theme";
import {
    fetchSupplierInventory,
    updateInventory,
    fetchInventoryHistory,
} from "../../api/supplier";

export default function SupplierInventory() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [form, setForm] = useState({
        quantity: "",
        movement_type: "stock_in",
        note: "",
        low_stock_threshold: "",
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function load() {
        const data = await fetchSupplierInventory();
        if (data) setInventory(data.inventory);
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    function openUpdate(item) {
        setSelected(item);
        setForm({
            quantity: "",
            movement_type: "stock_in",
            note: "",
            low_stock_threshold: item.low_stock_threshold,
        });
        setError("");
        setShowUpdateModal(true);
    }

    async function openHistory(item) {
        setSelected(item);
        setShowHistoryModal(true);
        setHistoryLoading(true);
        const data = await fetchInventoryHistory(item.inventory_id);
        if (data) setHistory(data.history);
        setHistoryLoading(false);
    }

    async function handleUpdate() {
        if (!form.quantity) { setError("Quantity is required"); return; }
        setSaving(true);
        setError("");
        const data = await updateInventory(selected.inventory_id, {
            quantity: Number(form.quantity),
            movement_type: form.movement_type,
            note: form.note,
            low_stock_threshold: form.low_stock_threshold
                ? Number(form.low_stock_threshold)
                : undefined,
        });
        setSaving(false);
        if (data?.error) { setError(data.error); return; }
        setShowUpdateModal(false);
        load();
    }

    function stockStatusBadge(status) {
        const map = {
            in_stock:     { bg: "#d4edda", color: "#155724", label: "In Stock" },
            low_stock:    { bg: "#fff3cd", color: "#856404", label: "Low Stock" },
            out_of_stock: { bg: "#f8d7da", color: "#721c24", label: "Out of Stock" },
        };
        return map[status] || map.in_stock;
    }

    const movementTypes = [
        { value: "stock_in",   label: "Stock In — add to current quantity" },
        { value: "stock_out",  label: "Stock Out — subtract from quantity" },
        { value: "adjustment", label: "Adjustment — set exact quantity" },
        { value: "return",     label: "Return — add returned stock" },
        { value: "damage",     label: "Damage — subtract damaged units" },
    ];

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 24, fontWeight: 800, color: T.blue, marginBottom: 4,
                }}>
                    Inventory Management
                </h1>
                <p style={{ color: T.gray500, fontSize: 14 }}>
                    Track stock levels and log inventory movements.
                </p>
            </div>

            {loading ? (
                <div style={{ color: T.gray500, padding: 40, textAlign: "center" }}>
                    Loading inventory...
                </div>
            ) : inventory.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: 80,
                    background: "white", borderRadius: 14,
                    boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🏭</div>
                    <div style={{ fontWeight: 700, color: T.blue, fontSize: 18, marginBottom: 8 }}>
                        No inventory records
                    </div>
                    <div style={{ color: T.gray500, fontSize: 14 }}>
                        Add products first — inventory records are created automatically.
                    </div>
                </div>
            ) : (
                <div style={{
                    background: "white", borderRadius: 14,
                    boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                    overflow: "hidden",
                }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f8f9fc" }}>
                                {["Product", "Current Stock", "Threshold", "Status", "Last Updated", "Actions"].map(h => (
                                    <th key={h} style={{
                                        padding: "14px 16px", textAlign: "left",
                                        fontSize: 13, fontWeight: 700,
                                        color: T.gray500,
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item, i) => {
                                const badge = stockStatusBadge(item.stock_status);
                                return (
                                    <tr key={item.inventory_id} style={{
                                        borderTop: `1px solid ${T.gray100}`,
                                        background: i % 2 === 0 ? "white" : "#fafbfd",
                                    }}>
                                        <td style={{ padding: "14px 16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                {item.product_photo ? (
                                                    <img
                                                        src={item.product_photo}
                                                        alt={item.product_name}
                                                        style={{ width: 36, height: 36, borderRadius: 6, objectFit: "cover" }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: 36, height: 36, borderRadius: 6,
                                                        background: "#f0f2f8",
                                                        display: "flex", alignItems: "center",
                                                        justifyContent: "center", fontSize: 18,
                                                    }}>
                                                        📦
                                                    </div>
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 700, color: T.blue, fontSize: 14 }}>
                                                        {item.product_name}
                                                    </div>
                                                    <div style={{ fontSize: 12, color: T.gray500 }}>
                                                        {item.unit}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <span style={{
                                                fontSize: 20, fontWeight: 800,
                                                color: item.stock_status === "out_of_stock" ? "#721c24" :
                                                       item.stock_status === "low_stock" ? "#856404" : T.blue,
                                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                            }}>
                                                {item.quantity.toLocaleString()}
                                            </span>
                                            <span style={{ fontSize: 12, color: T.gray500, marginLeft: 4 }}>
                                                units
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px 16px", fontSize: 14, color: T.gray500 }}>
                                            {item.low_stock_threshold} units
                                        </td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <span style={{
                                                padding: "4px 12px", borderRadius: 20,
                                                fontSize: 12, fontWeight: 700,
                                                background: badge.bg, color: badge.color,
                                            }}>
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px 16px", fontSize: 13, color: T.gray500 }}>
                                            {new Date(item.updated_at).toLocaleDateString("en-KE")}
                                        </td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <button
                                                    onClick={() => openUpdate(item)}
                                                    style={{
                                                        background: "#e8f0fe", color: T.blue,
                                                        border: "none", borderRadius: 6,
                                                        padding: "6px 12px", fontSize: 12,
                                                        fontWeight: 600, cursor: "pointer",
                                                    }}
                                                >
                                                    Update Stock
                                                </button>
                                                <button
                                                    onClick={() => openHistory(item)}
                                                    style={{
                                                        background: "#f0f2f8", color: T.blue,
                                                        border: "none", borderRadius: 6,
                                                        padding: "6px 12px", fontSize: 12,
                                                        fontWeight: 600, cursor: "pointer",
                                                    }}
                                                >
                                                    History
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Update Stock Modal */}
            {showUpdateModal && selected && (
                <div style={{
                    position: "fixed", inset: 0,
                    background: "rgba(10,46,110,0.45)",
                    zIndex: 500, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    padding: 24,
                }}>
                    <div style={{
                        background: "white", borderRadius: 16,
                        padding: 32, width: "100%", maxWidth: 480,
                    }}>
                        <h2 style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 18, fontWeight: 800,
                            color: T.blue, marginBottom: 6,
                        }}>
                            Update Stock
                        </h2>
                        <p style={{ color: T.gray500, fontSize: 13, marginBottom: 24 }}>
                            {selected.product_name} — current stock: {selected.quantity} units
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

                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                            <div>
                                <label style={{
                                    display: "block", fontSize: 13,
                                    fontWeight: 600, color: T.gray500, marginBottom: 6,
                                }}>
                                    Movement Type
                                </label>
                                <select
                                    value={form.movement_type}
                                    onChange={e => setForm(f => ({ ...f, movement_type: e.target.value }))}
                                    style={{
                                        width: "100%", padding: "10px 14px",
                                        border: `1.5px solid ${T.gray100}`,
                                        borderRadius: 8, fontSize: 14,
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        color: T.blue, background: "white",
                                        boxSizing: "border-box",
                                    }}
                                >
                                    {movementTypes.map(m => (
                                        <option key={m.value} value={m.value}>{m.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label style={{
                                    display: "block", fontSize: 13,
                                    fontWeight: 600, color: T.gray500, marginBottom: 6,
                                }}>
                                    Quantity *
                                </label>
                                <input
                                    type="number"
                                    value={form.quantity}
                                    onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                                    placeholder="Enter quantity"
                                    style={{
                                        width: "100%", padding: "10px 14px",
                                        border: `1.5px solid ${T.gray100}`,
                                        borderRadius: 8, fontSize: 14,
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        color: T.blue, boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: "block", fontSize: 13,
                                    fontWeight: 600, color: T.gray500, marginBottom: 6,
                                }}>
                                    Low Stock Threshold
                                </label>
                                <input
                                    type="number"
                                    value={form.low_stock_threshold}
                                    onChange={e => setForm(f => ({ ...f, low_stock_threshold: e.target.value }))}
                                    placeholder="e.g. 50"
                                    style={{
                                        width: "100%", padding: "10px 14px",
                                        border: `1.5px solid ${T.gray100}`,
                                        borderRadius: 8, fontSize: 14,
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        color: T.blue, boxSizing: "border-box",
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{
                                    display: "block", fontSize: 13,
                                    fontWeight: 600, color: T.gray500, marginBottom: 6,
                                }}>
                                    Note
                                </label>
                                <input
                                    value={form.note}
                                    onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                                    placeholder="e.g. New batch received"
                                    style={{
                                        width: "100%", padding: "10px 14px",
                                        border: `1.5px solid ${T.gray100}`,
                                        borderRadius: 8, fontSize: 14,
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        color: T.blue, boxSizing: "border-box",
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                            <button
                                onClick={handleUpdate}
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
                                {saving ? "Saving..." : "Update Stock"}
                            </button>
                            <button
                                onClick={() => setShowUpdateModal(false)}
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

            {/* History Modal */}
            {showHistoryModal && selected && (
                <div style={{
                    position: "fixed", inset: 0,
                    background: "rgba(10,46,110,0.45)",
                    zIndex: 500, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    padding: 24,
                }}>
                    <div style={{
                        background: "white", borderRadius: 16,
                        padding: 32, width: "100%", maxWidth: 560,
                        maxHeight: "80vh", overflowY: "auto",
                    }}>
                        <div style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "center", marginBottom: 24,
                        }}>
                            <h2 style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: 18, fontWeight: 800, color: T.blue,
                            }}>
                                Movement History — {selected.product_name}
                            </h2>
                            <button
                                onClick={() => setShowHistoryModal(false)}
                                style={{
                                    background: "none", border: "none",
                                    fontSize: 20, cursor: "pointer", color: T.gray500,
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {historyLoading ? (
                            <div style={{ textAlign: "center", padding: 40, color: T.gray500 }}>
                                Loading history...
                            </div>
                        ) : history.length === 0 ? (
                            <div style={{ textAlign: "center", padding: 40, color: T.gray500 }}>
                                No movements recorded yet.
                            </div>
                        ) : (
                            history.map(h => {
                                const typeColors = {
                                    stock_in:   { bg: "#d4edda", color: "#155724" },
                                    stock_out:  { bg: "#f8d7da", color: "#721c24" },
                                    adjustment: { bg: "#cce5ff", color: "#004085" },
                                    return:     { bg: "#d4edda", color: "#155724" },
                                    damage:     { bg: "#f8d7da", color: "#721c24" },
                                };
                                const tc = typeColors[h.movement_type] || { bg: "#e2e3e5", color: "#383d41" };
                                return (
                                    <div key={h.movement_id} style={{
                                        display: "flex", justifyContent: "space-between",
                                        alignItems: "center", padding: "12px 0",
                                        borderBottom: `1px solid ${T.gray100}`,
                                    }}>
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                                <span style={{
                                                    padding: "2px 10px", borderRadius: 20,
                                                    fontSize: 11, fontWeight: 700,
                                                    background: tc.bg, color: tc.color,
                                                }}>
                                                    {h.movement_type.replace("_", " ")}
                                                </span>
                                                <span style={{ fontSize: 13, fontWeight: 700, color: T.blue }}>
                                                    {h.quantity} units
                                                </span>
                                            </div>
                                            {h.note && (
                                                <div style={{ fontSize: 12, color: T.gray500 }}>{h.note}</div>
                                            )}
                                        </div>
                                        <div style={{ fontSize: 12, color: T.gray500, textAlign: "right" }}>
                                            {new Date(h.created_at).toLocaleDateString("en-KE")}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
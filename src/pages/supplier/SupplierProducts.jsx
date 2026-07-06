import { useEffect, useState } from "react";
import { T } from "../../styles/theme";
import {
    fetchSupplierProducts,
    addSupplierProduct,
    updateSupplierProduct,
    archiveSupplierProduct,
    deleteSupplierProduct,
} from "../../api/supplier";
import { fetchCategories } from "../../api/product";

export default function SupplierProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        product_name: "",
        product_cost: "",
        product_desc: "",
        stock: "",
        min_order_qty: "",
        unit: "piece",
        country: "Kenya",
        category_id: "",
    });
    const [photo, setPhoto] = useState(null);

    async function load() {
        const [prodData, catData] = await Promise.all([
            fetchSupplierProducts(),
            fetchCategories(),
        ]);
        if (prodData) setProducts(prodData.products);
        if (catData) setCategories(catData.categories);
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    function openAdd() {
        setEditProduct(null);
        setForm({
            product_name: "", product_cost: "", product_desc: "",
            stock: "", min_order_qty: "", unit: "piece",
            country: "Kenya", category_id: "",
        });
        setPhoto(null);
        setError("");
        setShowModal(true);
    }

    function openEdit(p) {
        setEditProduct(p);
        setForm({
            product_name: p.product_name,
            product_cost: p.product_cost,
            product_desc: p.product_desc || "",
            stock: p.stock,
            min_order_qty: p.min_order_qty,
            unit: p.unit,
            country: p.country,
            category_id: p.category_id || "",
        });
        setPhoto(null);
        setError("");
        setShowModal(true);
    }

    async function handleSave() {
        setError("");
        setSaving(true);
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => { if (v !== "") fd.append(k, v); });
        if (photo) fd.append("product_photo", photo);

        const data = editProduct
            ? await updateSupplierProduct(editProduct.product_id, fd)
            : await addSupplierProduct(fd);

        setSaving(false);

        if (data?.error) { setError(data.error); return; }
        setShowModal(false);
        load();
    }

    async function handleArchive(p) {
        await archiveSupplierProduct(p.product_id);
        load();
    }

    async function handleDelete(p) {
        if (!window.confirm(`Delete "${p.product_name}"? This cannot be undone.`)) return;
        await deleteSupplierProduct(p.product_id);
        load();
    }

    function statusBadge(p) {
        if (!p.is_active) return { label: "Archived", bg: "#e2e3e5", color: "#383d41" };
        if (p.stock === 0) return { label: "Out of Stock", bg: "#f8d7da", color: "#721c24" };
        return { label: "Active", bg: "#d4edda", color: "#155724" };
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                    <h1 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 24, fontWeight: 800, color: T.blue, marginBottom: 4,
                    }}>
                        Product Management
                    </h1>
                    <p style={{ color: T.gray500, fontSize: 14 }}>
                        {products.length} products listed
                    </p>
                </div>
                <button
                    onClick={openAdd}
                    style={{
                        background: T.blue, color: "white",
                        border: "none", borderRadius: 10,
                        padding: "12px 24px", fontSize: 14,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 700, cursor: "pointer",
                    }}
                >
                    + Add Product
                </button>
            </div>

            {loading ? (
                <div style={{ color: T.gray500, padding: 40, textAlign: "center" }}>Loading products...</div>
            ) : products.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: 80,
                    background: "white", borderRadius: 14,
                    boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
                    <div style={{ fontWeight: 700, color: T.blue, fontSize: 18, marginBottom: 8 }}>
                        No products yet
                    </div>
                    <div style={{ color: T.gray500, fontSize: 14, marginBottom: 20 }}>
                        Add your first product to get started.
                    </div>
                    <button
                        onClick={openAdd}
                        style={{
                            background: T.blue, color: "white", border: "none",
                            borderRadius: 10, padding: "12px 24px",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 700, cursor: "pointer", fontSize: 14,
                        }}
                    >
                        + Add Product
                    </button>
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
                                {["Product", "Category", "Price", "Stock", "Min Order", "Status", "Actions"].map(h => (
                                    <th key={h} style={{
                                        padding: "14px 16px", textAlign: "left",
                                        fontSize: 13, fontWeight: 700,
                                        color: T.gray500, fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p, i) => {
                                const badge = statusBadge(p);
                                return (
                                    <tr key={p.product_id} style={{
                                        borderTop: `1px solid ${T.gray100}`,
                                        background: i % 2 === 0 ? "white" : "#fafbfd",
                                    }}>
                                        <td style={{ padding: "14px 16px" }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                                {p.product_photo ? (
                                                    <img
                                                        src={p.product_photo}
                                                        alt={p.product_name}
                                                        style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        width: 40, height: 40, borderRadius: 8,
                                                        background: "#f0f2f8",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        fontSize: 20,
                                                    }}>
                                                        📦
                                                    </div>
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 700, color: T.blue, fontSize: 14 }}>
                                                        {p.product_name}
                                                    </div>
                                                    <div style={{ fontSize: 12, color: T.gray500 }}>
                                                        {p.unit}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: "14px 16px", fontSize: 14, color: T.gray500 }}>
                                            {p.category || "—"}
                                        </td>
                                        <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: T.blue }}>
                                            KES {Number(p.product_cost).toLocaleString()}
                                        </td>
                                        <td style={{ padding: "14px 16px", fontSize: 14, color: T.blue }}>
                                            {p.stock.toLocaleString()}
                                        </td>
                                        <td style={{ padding: "14px 16px", fontSize: 14, color: T.gray500 }}>
                                            {p.min_order_qty} {p.unit}s
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
                                        <td style={{ padding: "14px 16px" }}>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <button
                                                    onClick={() => openEdit(p)}
                                                    style={{
                                                        background: "#e8f0fe", color: T.blue,
                                                        border: "none", borderRadius: 6,
                                                        padding: "6px 12px", fontSize: 12,
                                                        fontWeight: 600, cursor: "pointer",
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleArchive(p)}
                                                    style={{
                                                        background: "#fff3cd", color: "#856404",
                                                        border: "none", borderRadius: 6,
                                                        padding: "6px 12px", fontSize: 12,
                                                        fontWeight: 600, cursor: "pointer",
                                                    }}
                                                >
                                                    {p.is_active ? "Archive" : "Restore"}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p)}
                                                    style={{
                                                        background: "#f8d7da", color: "#721c24",
                                                        border: "none", borderRadius: 6,
                                                        padding: "6px 12px", fontSize: 12,
                                                        fontWeight: 600, cursor: "pointer",
                                                    }}
                                                >
                                                    Delete
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

            {/* Add/Edit Modal */}
            {showModal && (
                <div style={{
                    position: "fixed", inset: 0,
                    background: "rgba(10,46,110,0.45)",
                    zIndex: 500, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    padding: 24,
                }}>
                    <div style={{
                        background: "white", borderRadius: 16,
                        padding: 32, width: "100%", maxWidth: 600,
                        maxHeight: "90vh", overflowY: "auto",
                    }}>
                        <h2 style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 20, fontWeight: 800,
                            color: T.blue, marginBottom: 24,
                        }}>
                            {editProduct ? "Edit Product" : "Add New Product"}
                        </h2>

                        {error && (
                            <div style={{
                                background: "#f8d7da", color: "#721c24",
                                padding: "10px 16px", borderRadius: 8,
                                fontSize: 14, marginBottom: 16,
                            }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            {[
                                { label: "Product Name *", name: "product_name", full: true },
                                { label: "Price (KES) *", name: "product_cost", type: "number" },
                                { label: "Stock Quantity *", name: "stock", type: "number" },
                                { label: "Min Order Qty", name: "min_order_qty", type: "number" },
                                { label: "Unit", name: "unit" },
                                { label: "Country", name: "country" },
                            ].map(({ label, name, type = "text", full }) => (
                                <div key={name} style={{ gridColumn: full ? "1 / -1" : "auto" }}>
                                    <label style={{
                                        display: "block", fontSize: 13,
                                        fontWeight: 600, color: T.gray500, marginBottom: 6,
                                    }}>
                                        {label}
                                    </label>
                                    <input
                                        type={type}
                                        value={form[name]}
                                        onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                                        style={{
                                            width: "100%", padding: "10px 14px",
                                            border: `1.5px solid ${T.gray100}`,
                                            borderRadius: 8, fontSize: 14,
                                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                                            color: T.blue, outline: "none",
                                            boxSizing: "border-box",
                                        }}
                                    />
                                </div>
                            ))}

                            {/* Category */}
                            <div>
                                <label style={{
                                    display: "block", fontSize: 13,
                                    fontWeight: 600, color: T.gray500, marginBottom: 6,
                                }}>
                                    Category
                                </label>
                                <select
                                    value={form.category_id}
                                    onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                                    style={{
                                        width: "100%", padding: "10px 14px",
                                        border: `1.5px solid ${T.gray100}`,
                                        borderRadius: 8, fontSize: 14,
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        color: T.blue, outline: "none",
                                        boxSizing: "border-box", background: "white",
                                    }}
                                >
                                    <option value="">Select category</option>
                                    {categories.map(c => (
                                        <option key={c.category_id} value={c.category_id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Photo */}
                            <div>
                                <label style={{
                                    display: "block", fontSize: 13,
                                    fontWeight: 600, color: T.gray500, marginBottom: 6,
                                }}>
                                    Product Photo
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setPhoto(e.target.files[0])}
                                    style={{ fontSize: 13, color: T.gray500 }}
                                />
                            </div>

                            {/* Description */}
                            <div style={{ gridColumn: "1 / -1" }}>
                                <label style={{
                                    display: "block", fontSize: 13,
                                    fontWeight: 600, color: T.gray500, marginBottom: 6,
                                }}>
                                    Description
                                </label>
                                <textarea
                                    value={form.product_desc}
                                    onChange={e => setForm(f => ({ ...f, product_desc: e.target.value }))}
                                    rows={3}
                                    style={{
                                        width: "100%", padding: "10px 14px",
                                        border: `1.5px solid ${T.gray100}`,
                                        borderRadius: 8, fontSize: 14,
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        color: T.blue, outline: "none",
                                        resize: "vertical", boxSizing: "border-box",
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                            <button
                                onClick={handleSave}
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
                                {saving ? "Saving..." : editProduct ? "Update Product" : "Add Product"}
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
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
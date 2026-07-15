import { useState, useEffect } from "react";
import useIsMobile from "../hooks/useIsMobile";

const API = "https://sokoni-1-4i1f.onrender.com/api";

function getToken() { return localStorage.getItem("sokoni_token") || ""; }
function authHeaders() { return { Authorization: `Bearer ${getToken()}` }; }

const EMPTY = { product_name: "", product_cost: "", product_desc: "", stock: "" };

export default function AdminPage({ user, showToast }) {
    const isMobile = useIsMobile();
    const [products, setProducts]     = useState([]);
    const [loading, setLoading]       = useState(true);
    const [search, setSearch]         = useState("");
    const [form, setForm]             = useState(EMPTY);
    const [photoFile, setPhotoFile]   = useState(null);
    const [editId, setEditId]         = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deleteId, setDeleteId]     = useState(null);
    const [panel, setPanel]           = useState("products");
    const [dashStats, setDashStats]   = useState(null);
    const [users, setUsers]           = useState([]);
    const [userSearch, setUserSearch] = useState("");
    const [suppliers, setSuppliers]   = useState([]);
    const [adminForm, setAdminForm]   = useState({ username: "", email: "", password: "" });
    const [adminSubmitting, setAdminSubmitting] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen]   = useState(false);

    if (!user || user.role !== "admin") {
        return (
            <div style={{ textAlign: "center", padding: 80 }}>
                <div style={{ fontSize: 48 }}>🚫</div>
                <h2 style={{ color: "#0A2E6E", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    Admin access only
                </h2>
            </div>
        );
    }

    async function loadDashboard() {
        try {
            const res = await fetch(`${API}/admin/dashboard`, { headers: authHeaders() });
            const data = await res.json();
            setDashStats(data);
        } catch { showToast("Failed to load dashboard", "error"); }
    }

    async function loadUsers(q = "") {
        try {
            const url = q ? `${API}/admin/users?search=${encodeURIComponent(q)}` : `${API}/admin/users`;
            const res = await fetch(url, { headers: authHeaders() });
            const data = await res.json();
            setUsers(data.users || []);
        } catch { showToast("Failed to load users", "error"); }
    }

    async function loadSuppliers() {
        try {
            const res = await fetch(`${API}/admin/suppliers?approved=0`, { headers: authHeaders() });
            const data = await res.json();
            setSuppliers(data.suppliers || []);
        } catch { showToast("Failed to load suppliers", "error"); }
    }

    async function loadProducts(q = "") {
        setLoading(true);
        try {
            const url = q ? `${API}/products/?search=${encodeURIComponent(q)}&limit=100` : `${API}/products/?limit=100`;
            const res = await fetch(url);
            const data = await res.json();
            setProducts(data.products || []);
        } catch { showToast("Failed to load products", "error"); }
        finally { setLoading(false); }
    }

    useEffect(() => {
        if (panel === "dashboard") loadDashboard();
        if (panel === "users")     loadUsers();
        if (panel === "suppliers") loadSuppliers();
        if (panel === "products")  loadProducts();
    }, [panel]);

    useEffect(() => {
        const t = setTimeout(() => loadProducts(search), 350);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        const t = setTimeout(() => loadUsers(userSearch), 350);
        return () => clearTimeout(t);
    }, [userSearch]);

    async function toggleActive(userId, currentStatus) {
        try {
            await fetch(`${API}/admin/users/${userId}/toggle-active`, { method: "PATCH", headers: authHeaders() });
            setUsers(u => u.map(x => x.user_id === userId ? { ...x, is_active: currentStatus ? 0 : 1 } : x));
            showToast("User status updated", "success");
        } catch { showToast("Failed to update user", "error"); }
    }

    async function deleteUser(userId) {
        try {
            await fetch(`${API}/admin/users/${userId}`, { method: "DELETE", headers: authHeaders() });
            setUsers(u => u.filter(x => x.user_id !== userId));
            showToast("User deleted", "success");
        } catch { showToast("Failed to delete user", "error"); }
    }

    async function approveSupplier(userId) {
        try {
            await fetch(`${API}/admin/suppliers/${userId}/approve`, { method: "PATCH", headers: authHeaders() });
            setSuppliers(s => s.filter(x => x.user_id !== userId));
            showToast("Supplier approved!", "success");
        } catch { showToast("Failed to approve supplier", "error"); }
    }

    async function handleCreateAdmin() {
        if (!adminForm.username || !adminForm.email || !adminForm.password) {
            showToast("All fields required", "warn"); return;
        }
        setAdminSubmitting(true);
        try {
            const res = await fetch(`${API}/admin/create-admin`, {
                method: "POST",
                headers: { ...authHeaders(), "Content-Type": "application/json" },
                body: JSON.stringify(adminForm),
            });
            const data = await res.json();
            if (!res.ok) { showToast(data.error || "Failed", "error"); return; }
            showToast(`Admin created for ${adminForm.username}!`, "success");
            setAdminForm({ username: "", email: "", password: "" });
        } catch { showToast("Network error", "error"); }
        finally { setAdminSubmitting(false); }
    }

    function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

    function openAdd() {
        setEditId(null); setForm(EMPTY); setPhotoFile(null); setPanel("add");
        setMobileMenuOpen(false);
    }

    function openEdit(p) {
        setEditId(p.product_id);
        setForm({ product_name: p.product_name, product_cost: p.product_cost, product_desc: p.product_desc || "", stock: p.stock });
        setPhotoFile(null); setPanel("add");
    }

    async function handleSubmit() {
        if (!form.product_name.trim()) { showToast("Product name required", "warn"); return; }
        if (!form.product_cost) { showToast("Price required", "warn"); return; }
        setSubmitting(true);
        try {
            if (editId) {
                const res = await fetch(`${API}/products/${editId}`, {
                    method: "PUT",
                    headers: { ...authHeaders(), "Content-Type": "application/json" },
                    body: JSON.stringify({ product_name: form.product_name, product_cost: parseFloat(form.product_cost), product_desc: form.product_desc, stock: parseInt(form.stock) || 0 }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Update failed");
                showToast("Product updated ✓", "success");
            } else {
                const fd = new FormData();
                fd.append("product_name", form.product_name);
                fd.append("product_cost", parseFloat(form.product_cost));
                fd.append("product_desc", form.product_desc);
                fd.append("stock", parseInt(form.stock) || 0);
                if (photoFile) fd.append("product_photo", photoFile);
                const res = await fetch(`${API}/products/`, { method: "POST", headers: authHeaders(), body: fd });
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Add failed");
                showToast("Product added ✓", "success");
            }
            setPanel("products"); setForm(EMPTY); setEditId(null); loadProducts(search);
        } catch (err) { showToast(err.message, "error"); }
        finally { setSubmitting(false); }
    }

    async function handleDelete(id) {
        try {
            const res = await fetch(`${API}/products/${id}`, { method: "DELETE", headers: authHeaders() });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Delete failed");
            showToast("Product deleted", "success");
            setDeleteId(null); loadProducts(search);
        } catch (err) { showToast(err.message, "error"); }
    }

    const NAV_ITEMS = [
        { id: "dashboard",    icon: "📊", label: "Dashboard" },
        { id: "products",     icon: "📦", label: "Products" },
        { id: "add",          icon: "➕", label: editId ? "Edit Product" : "Add Product" },
        { id: "users",        icon: "👥", label: "Users" },
        { id: "suppliers",    icon: "🏭", label: "Suppliers" },
        { id: "create-admin", icon: "🔑", label: "Create Admin" },
    ];

    function handleNav(id) {
        if (id === "add") openAdd();
        else { setPanel(id); setMobileMenuOpen(false); }
    }

    // ── SIDEBAR (desktop) ──
    const Sidebar = () => (
        <aside style={S.sidebar}>
            <div style={S.sidebarLogo}>SOKONI<span style={{ color: "#F5C518" }}>ADMIN</span></div>
            <nav style={{ marginTop: 32 }}>
                {NAV_ITEMS.map(item => (
                    <div
                        key={item.id}
                        style={{
                            ...S.sidebarItem,
                            background: panel === item.id ? "rgba(245,197,24,0.15)" : "transparent",
                            color:      panel === item.id ? "#F5C518" : "#94A3B8",
                            fontWeight: panel === item.id ? 700 : 500,
                        }}
                        onClick={() => handleNav(item.id)}
                    >
                        <span style={{ fontSize: 18 }}>{item.icon}</span>
                        {item.label}
                    </div>
                ))}
            </nav>
            <div style={S.sidebarFooter}>
                <div style={S.adminBadge}>{user.username[0].toUpperCase()}</div>
                <div>
                    <div style={{ color: "#F1F5F9", fontWeight: 700, fontSize: 13 }}>{user.username}</div>
                    <div style={{ color: "#64748B", fontSize: 11 }}>Administrator</div>
                </div>
            </div>
        </aside>
    );

    // ── MOBILE TOP BAR ──
    const MobileBar = () => (
    <>
        <div style={{
            background: "#0A2E6E", padding: "12px 16px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            position: "sticky", top: 0, zIndex: 100,
        }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900, fontSize: 16, color: "#fff" }}>
                SOKONI<span style={{ color: "#F5C518" }}>ADMIN</span>
            </div>
            <button
                onClick={() => setMobileMenuOpen(o => !o)}
                style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 20 }}
            >
                {mobileMenuOpen ? "✕" : "☰"}
            </button>
        </div>

        {mobileMenuOpen && (
            <>
                <div
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                        position: "fixed", inset: 0,
                        zIndex: 9998,
                        background: "rgba(0,0,0,0.3)",
                    }}
                />
                <div style={{
                    background: "#0A2E6E",
                    position: "fixed",
                    top: 49, left: 0, right: 0,
                    zIndex: 9999,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                }}>
                    {NAV_ITEMS.map(item => (
                        <div
                            key={item.id}
                            onClick={() => handleNav(item.id)}
                            style={{
                                display: "flex", alignItems: "center", gap: 12,
                                padding: "13px 20px", cursor: "pointer",
                                background: panel === item.id ? "rgba(245,197,24,0.15)" : "none",
                                color: panel === item.id ? "#F5C518" : "#94A3B8",
                                fontWeight: panel === item.id ? 700 : 500,
                                fontSize: 14,
                                fontFamily: "'Plus Jakarta Sans',sans-serif",
                            }}
                        >
                            <span style={{ fontSize: 18 }}>{item.icon}</span>
                            {item.label}
                        </div>
                    ))}
                    <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={S.adminBadge}>{user.username[0].toUpperCase()}</div>
                        <div style={{ color: "#94A3B8", fontSize: 13 }}>{user.username} · Admin</div>
                    </div>
                </div>
            </>
        )}
    </>
);

    const mainContent = (
        <main style={{ ...S.main, padding: isMobile ? "16px" : "32px 36px" }}>

            {/* DASHBOARD */}
            {panel === "dashboard" && (
                <>
                    <div style={S.topbar}>
                        <div>
                            <h1 style={S.pageTitle}>Dashboard</h1>
                            <p style={S.pageSub}>Platform overview</p>
                        </div>
                    </div>
                    {dashStats ? (
                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(auto-fill, minmax(180px,1fr))", gap: 12, marginBottom: 28 }}>
                            {[
                                { label: "Total Orders",     value: dashStats.orders?.total_orders },
                                { label: "Total Revenue",    value: `KES ${Number(dashStats.orders?.total_revenue || 0).toLocaleString()}` },
                                { label: "Pending Orders",   value: dashStats.orders?.pending_orders },
                                { label: "Total Users",      value: dashStats.users?.total_users },
                                { label: "Suppliers",        value: dashStats.users?.total_suppliers },
                                { label: "Pending Suppliers",value: dashStats.users?.pending_suppliers },
                                { label: "Total Products",   value: dashStats.products?.total_products },
                            ].map(k => (
                                <div key={k.label} style={{ background: "#fff", borderRadius: 12, padding: isMobile ? "14px 16px" : "20px 22px", borderLeft: "4px solid #F5C800", boxShadow: "0 2px 8px rgba(10,46,110,0.06)" }}>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>{k.label}</div>
                                    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: isMobile ? 20 : 26, fontWeight: 800, color: "#0A2E6E" }}>{k.value}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={S.center}>Loading dashboard...</div>
                    )}
                </>
            )}

            {/* PRODUCTS */}
            {panel === "products" && (
                <>
                    <div style={{ ...S.topbar, flexWrap: "wrap", gap: 12 }}>
                        <div>
                            <h1 style={S.pageTitle}>Products</h1>
                            <p style={S.pageSub}>{products.length} items in catalogue</p>
                        </div>
                        <button style={S.btnPrimary} onClick={openAdd}>+ Add Product</button>
                    </div>
                    <div style={S.searchWrap}>
                        <span style={{ fontSize: 16 }}>🔍</span>
                        <input style={S.searchInput} placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    {loading ? (
                        <div style={S.center}>Loading products...</div>
                    ) : products.length === 0 ? (
                        <div style={S.center}>No products found.</div>
                    ) : isMobile ? (
                        // Mobile card view
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {products.map(p => (
                                <div key={p.product_id} style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(10,46,110,0.06)" }}>
                                    <div style={{ fontWeight: 700, color: "#0A2E6E", fontSize: 15, marginBottom: 4 }}>{p.product_name}</div>
                                    {p.product_desc && <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>{p.product_desc.slice(0, 80)}…</div>}
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: "#0A2E6E" }}>KES {Number(p.product_cost).toLocaleString()}</span>
                                        <span style={{
                                            ...S.badge,
                                            background: p.stock > 10 ? "#D1FAE5" : p.stock > 0 ? "#FEF3C7" : "#FEE2E2",
                                            color:      p.stock > 10 ? "#065F46" : p.stock > 0 ? "#92400E" : "#991B1B",
                                        }}>
                                            {p.stock} units
                                        </span>
                                    </div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button style={{ ...S.btnEdit, flex: 1 }} onClick={() => openEdit(p)}>Edit</button>
                                        <button style={{ ...S.btnDelete, flex: 1 }} onClick={() => setDeleteId(p.product_id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={S.table}>
                                <thead>
                                    <tr>{["#", "Product", "Price (KES)", "Stock", "Added", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {products.map((p, i) => (
                                        <tr key={p.product_id} style={S.tr}>
                                            <td style={S.td}>{i + 1}</td>
                                            <td style={S.td}>
                                                <div style={{ fontWeight: 700, color: "#0A2E6E" }}>{p.product_name}</div>
                                                {p.product_desc && <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{p.product_desc.slice(0, 60)}…</div>}
                                            </td>
                                            <td style={{ ...S.td, fontWeight: 700, color: "#0A2E6E" }}>{Number(p.product_cost).toLocaleString()}</td>
                                            <td style={S.td}>
                                                <span style={{ ...S.badge, background: p.stock > 10 ? "#D1FAE5" : p.stock > 0 ? "#FEF3C7" : "#FEE2E2", color: p.stock > 10 ? "#065F46" : p.stock > 0 ? "#92400E" : "#991B1B" }}>
                                                    {p.stock} units
                                                </span>
                                            </td>
                                            <td style={{ ...S.td, color: "#6B7280", fontSize: 13 }}>{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</td>
                                            <td style={S.td}>
                                                <div style={{ display: "flex", gap: 8 }}>
                                                    <button style={S.btnEdit} onClick={() => openEdit(p)}>Edit</button>
                                                    <button style={S.btnDelete} onClick={() => setDeleteId(p.product_id)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* ADD/EDIT */}
            {panel === "add" && (
                <>
                    <div style={{ ...S.topbar, flexWrap: "wrap", gap: 12 }}>
                        <div>
                            <h1 style={S.pageTitle}>{editId ? "Edit Product" : "Add New Product"}</h1>
                            <p style={S.pageSub}>{editId ? `Editing product #${editId}` : "Fill in the details below"}</p>
                        </div>
                        <button style={S.btnSecondary} onClick={() => setPanel("products")}>← Back</button>
                    </div>
                    <div style={{ ...S.formCard, maxWidth: isMobile ? "100%" : 620 }}>
                        <div style={S.formGroup}>
                            <label style={S.label}>Product Name *</label>
                            <input style={S.input} placeholder="e.g. Unga Pembe 2kg" value={form.product_name} onChange={e => set("product_name", e.target.value)} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
                            <div style={S.formGroup}>
                                <label style={S.label}>Price (KES) *</label>
                                <input style={S.input} type="number" placeholder="e.g. 250" value={form.product_cost} onChange={e => set("product_cost", e.target.value)} />
                            </div>
                            <div style={S.formGroup}>
                                <label style={S.label}>Stock (units)</label>
                                <input style={S.input} type="number" placeholder="e.g. 100" value={form.stock} onChange={e => set("stock", e.target.value)} />
                            </div>
                        </div>
                        <div style={S.formGroup}>
                            <label style={S.label}>Description</label>
                            <textarea style={{ ...S.input, height: 90, resize: "vertical" }} placeholder="Optional product description..." value={form.product_desc} onChange={e => set("product_desc", e.target.value)} />
                        </div>
                        {!editId && (
                            <div style={S.formGroup}>
                                <label style={S.label}>Product Photo</label>
                                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" style={S.input} onChange={e => setPhotoFile(e.target.files[0] || null)} />
                                {photoFile && <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>Selected: {photoFile.name}</div>}
                            </div>
                        )}
                        <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
                            <button style={{ ...S.btnPrimary, opacity: submitting ? 0.6 : 1, flex: isMobile ? 1 : "unset" }} onClick={handleSubmit} disabled={submitting}>
                                {submitting ? "Saving..." : editId ? "Save Changes" : "Add Product"}
                            </button>
                            <button style={{ ...S.btnSecondary, flex: isMobile ? 1 : "unset" }} onClick={() => { setPanel("products"); setEditId(null); setForm(EMPTY); }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* USERS */}
            {panel === "users" && (
                <>
                    <div style={S.topbar}>
                        <div>
                            <h1 style={S.pageTitle}>Users</h1>
                            <p style={S.pageSub}>{users.length} registered users</p>
                        </div>
                    </div>
                    <div style={S.searchWrap}>
                        <span style={{ fontSize: 16 }}>🔍</span>
                        <input style={S.searchInput} placeholder="Search by username, email..." value={userSearch} onChange={e => setUserSearch(e.target.value)} />
                    </div>
                    {isMobile ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {users.map(u => (
                                <div key={u.user_id} style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(10,46,110,0.06)" }}>
                                    <div style={{ fontWeight: 700, color: "#0A2E6E", fontSize: 14, marginBottom: 2 }}>{u.username}</div>
                                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 8 }}>{u.email}</div>
                                    <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                                        <span style={{ ...S.badge, background: u.role === "supplier" ? "#EFF6FF" : u.role === "admin" ? "#FDF4FF" : "#F0FDF4", color: u.role === "supplier" ? "#1D4ED8" : u.role === "admin" ? "#7E22CE" : "#15803D" }}>{u.role}</span>
                                        <span style={{ ...S.badge, background: u.is_active ? "#D1FAE5" : "#FEE2E2", color: u.is_active ? "#065F46" : "#991B1B" }}>{u.is_active ? "Active" : "Inactive"}</span>
                                    </div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button style={{ ...S.btnEdit, flex: 1 }} onClick={() => toggleActive(u.user_id, u.is_active)}>{u.is_active ? "Deactivate" : "Activate"}</button>
                                        <button style={{ ...S.btnDelete, flex: 1 }} onClick={() => deleteUser(u.user_id)}>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={S.table}>
                                <thead>
                                    <tr>{["Username", "Email", "Role", "Status", "Joined", "Actions"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.user_id} style={S.tr}>
                                            <td style={{ ...S.td, fontWeight: 700, color: "#0A2E6E" }}>{u.username}</td>
                                            <td style={{ ...S.td, color: "#6B7280" }}>{u.email}</td>
                                            <td style={S.td}><span style={{ ...S.badge, background: u.role === "supplier" ? "#EFF6FF" : u.role === "admin" ? "#FDF4FF" : "#F0FDF4", color: u.role === "supplier" ? "#1D4ED8" : u.role === "admin" ? "#7E22CE" : "#15803D" }}>{u.role}</span></td>
                                            <td style={S.td}><span style={{ ...S.badge, background: u.is_active ? "#D1FAE5" : "#FEE2E2", color: u.is_active ? "#065F46" : "#991B1B" }}>{u.is_active ? "Active" : "Inactive"}</span></td>
                                            <td style={{ ...S.td, color: "#6B7280", fontSize: 13 }}>{new Date(u.created_at).toLocaleDateString()}</td>
                                            <td style={S.td}>
                                                <div style={{ display: "flex", gap: 8 }}>
                                                    <button style={S.btnEdit} onClick={() => toggleActive(u.user_id, u.is_active)}>{u.is_active ? "Deactivate" : "Activate"}</button>
                                                    <button style={S.btnDelete} onClick={() => deleteUser(u.user_id)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* SUPPLIERS */}
            {panel === "suppliers" && (
                <>
                    <div style={S.topbar}>
                        <div>
                            <h1 style={S.pageTitle}>Pending Suppliers</h1>
                            <p style={S.pageSub}>{suppliers.length} awaiting approval</p>
                        </div>
                    </div>
                    {suppliers.length === 0 ? (
                        <div style={S.center}>No pending suppliers 🎉</div>
                    ) : isMobile ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {suppliers.map(s => (
                                <div key={s.user_id} style={{ background: "#fff", borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(10,46,110,0.06)" }}>
                                    <div style={{ fontWeight: 700, color: "#0A2E6E", fontSize: 14 }}>{s.business_name || s.username}</div>
                                    <div style={{ fontSize: 12, color: "#6B7280", margin: "4px 0 8px" }}>{s.email} · {s.phone}</div>
                                    <button style={{ ...S.btnEdit, background: "#D1FAE5", color: "#065F46", width: "100%" }} onClick={() => approveSupplier(s.user_id)}>✓ Approve</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table style={S.table}>
                                <thead>
                                    <tr>{["Business", "Username", "Email", "Phone", "Joined", "Action"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                    {suppliers.map(s => (
                                        <tr key={s.user_id} style={S.tr}>
                                            <td style={{ ...S.td, fontWeight: 700, color: "#0A2E6E" }}>{s.business_name || "—"}</td>
                                            <td style={S.td}>{s.username}</td>
                                            <td style={{ ...S.td, color: "#6B7280" }}>{s.email}</td>
                                            <td style={S.td}>{s.phone}</td>
                                            <td style={{ ...S.td, color: "#6B7280", fontSize: 13 }}>{new Date(s.created_at).toLocaleDateString()}</td>
                                            <td style={S.td}><button style={{ ...S.btnEdit, background: "#D1FAE5", color: "#065F46" }} onClick={() => approveSupplier(s.user_id)}>✓ Approve</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* CREATE ADMIN */}
            {panel === "create-admin" && (
                <>
                    <div style={S.topbar}>
                        <div>
                            <h1 style={S.pageTitle}>Create Admin</h1>
                            <p style={S.pageSub}>Add a new administrator account</p>
                        </div>
                    </div>
                    <div style={{ ...S.formCard, maxWidth: isMobile ? "100%" : 620 }}>
                        {[
                            { label: "Username", key: "username", type: "text", placeholder: "admin_username" },
                            { label: "Email", key: "email", type: "email", placeholder: "admin@sokoni.co.ke" },
                            { label: "Password", key: "password", type: "password", placeholder: "Min 8 chars..." },
                        ].map(({ label, key, type, placeholder }) => (
                            <div key={key} style={S.formGroup}>
                                <label style={S.label}>{label}</label>
                                <input style={S.input} type={type} placeholder={placeholder} value={adminForm[key]} onChange={e => setAdminForm(f => ({ ...f, [key]: e.target.value }))} />
                            </div>
                        ))}
                        <button style={{ ...S.btnPrimary, opacity: adminSubmitting ? 0.6 : 1, width: isMobile ? "100%" : "auto" }} disabled={adminSubmitting} onClick={handleCreateAdmin}>
                            {adminSubmitting ? "Creating..." : "Create Admin Account"}
                        </button>
                    </div>
                </>
            )}
        </main>
    );

    return (
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", minHeight: "100vh", background: "#F8FAFC" }}>
            {isMobile ? (
                <>
                    <MobileBar />
                    {mainContent}
                </>
            ) : (
                <>
                    <Sidebar />
                    {mainContent}
                </>
            )}

            {deleteId && (
                <div style={S.overlay} onClick={() => setDeleteId(null)}>
                    <div style={S.dialog} onClick={e => e.stopPropagation()}>
                        <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
                        <h3 style={{ color: "#0A2E6E", fontFamily: "'Plus Jakarta Sans',sans-serif", marginBottom: 8 }}>Delete product?</h3>
                        <p style={{ color: "#6B7280", fontSize: 14, marginBottom: 24 }}>This action cannot be undone.</p>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                            <button style={S.btnDelete} onClick={() => handleDelete(deleteId)}>Yes, delete</button>
                            <button style={S.btnSecondary} onClick={() => setDeleteId(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const S = {
    sidebar:      { width: 220, background: "#0A2E6E", display: "flex", flexDirection: "column", padding: "24px 16px", position: "sticky", top: 0, height: "100vh" },
    sidebarLogo:  { fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900, fontSize: 18, color: "#fff", letterSpacing: 1 },
    sidebarItem:  { display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, cursor: "pointer", fontSize: 14, marginBottom: 4, transition: "all 0.15s" },
    sidebarFooter:{ marginTop: "auto", display: "flex", alignItems: "center", gap: 10 },
    adminBadge:   { width: 36, height: 36, borderRadius: "50%", background: "#F5C518", color: "#0A2E6E", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, flexShrink: 0 },
    main:         { flex: 1, maxWidth: "100%" },
    topbar:       { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
    pageTitle:    { fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, fontWeight: 800, color: "#0A2E6E", margin: 0 },
    pageSub:      { color: "#6B7280", fontSize: 14, marginTop: 4 },
    searchWrap:   { display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "10px 14px", marginBottom: 16 },
    searchInput:  { border: "none", outline: "none", fontSize: 14, flex: 1, background: "transparent" },
    table:        { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(10,46,110,0.06)" },
    th:           { padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#6B7280", background: "#F8FAFC", borderBottom: "1px solid #E5E7EB", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" },
    tr:           { borderBottom: "1px solid #F3F4F6" },
    td:           { padding: "12px 16px", fontSize: 13, color: "#374151", verticalAlign: "middle" },
    badge:        { display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
    formCard:     { background: "#fff", borderRadius: 14, padding: 24, boxShadow: "0 2px 8px rgba(10,46,110,0.06)" },
    formGroup:    { marginBottom: 16 },
    label:        { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 },
    input:        { width: "100%", padding: "10px 14px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
    btnPrimary:   { background: "#0A2E6E", color: "#fff", border: "none", padding: "10px 22px", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" },
    btnSecondary: { background: "#F1F5F9", color: "#374151", border: "none", padding: "10px 22px", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer" },
    btnEdit:      { background: "#EFF6FF", color: "#1D4ED8", border: "none", padding: "6px 14px", borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: "pointer" },
    btnDelete:    { background: "#FEE2E2", color: "#991B1B", border: "none", padding: "6px 14px", borderRadius: 6, fontWeight: 600, fontSize: 13, cursor: "pointer" },
    center:       { textAlign: "center", padding: 60, color: "#6B7280" },
    overlay:      { position: "fixed", inset: 0, background: "rgba(10,46,110,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 500 },
    dialog:       { background: "#fff", borderRadius: 16, padding: 32, textAlign: "center", maxWidth: 340, width: "90%" },
};
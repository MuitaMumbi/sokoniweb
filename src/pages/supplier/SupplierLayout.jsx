import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { T } from "../../styles/theme";
import Spinner from "../../components/Spinner";
import useIsMobile from "../../hooks/useIsMobile";

const NAV = [
    { path: "/supplier/dashboard",     icon: "📊", label: "Dashboard" },
    { path: "/supplier/products",      icon: "📦", label: "Products" },
    { path: "/supplier/inventory",     icon: "🏭", label: "Inventory" },
    { path: "/supplier/orders",        icon: "📋", label: "Purchase Orders" },
    { path: "/supplier/shipments",     icon: "🚚", label: "Shipments" },
    { path: "/supplier/notifications", icon: "🔔", label: "Notifications" },
    { path: "/supplier/profile",       icon: "👤", label: "Profile" },
];

export default function SupplierLayout({ user, onLogout, loggingOut, children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useIsMobile();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (isMobile) {
        return (
            <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#f4f6fb" }}>
                {/* Mobile top bar */}
                <div style={{
                    background: T.blue, padding: "12px 16px",
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between",
                    position: "sticky", top: 0, zIndex: 100,
                }}>
                    <div style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 800, fontSize: 18, color: T.yellow,
                    }}>
                        Sokoni
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 400, marginLeft: 6 }}>
                            Supplier
                        </span>
                    </div>
                    <button
                        onClick={() => setMobileMenuOpen(o => !o)}
                        style={{
                            background: "rgba(255,255,255,0.1)", border: "none",
                            color: "white", borderRadius: 8,
                            padding: "6px 12px", cursor: "pointer", fontSize: 20,
                        }}
                    >
                        {mobileMenuOpen ? "✕" : "☰"}
                    </button>
                </div>

                {/* Mobile dropdown menu */}
                {mobileMenuOpen && (
                    <div style={{
                        background: T.blue, padding: "8px 0",
                        position: "sticky", top: 49, zIndex: 99,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    }}>
                        {NAV.map(({ path, icon, label }) => {
                            const active = location.pathname === path;
                            return (
                                <div
                                    key={path}
                                    onClick={() => { navigate(path); setMobileMenuOpen(false); }}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 12,
                                        padding: "12px 20px", cursor: "pointer",
                                        background: active ? "rgba(255,255,255,0.12)" : "none",
                                        color: active ? T.yellow : "rgba(255,255,255,0.85)",
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontWeight: active ? 700 : 500, fontSize: 14,
                                    }}
                                >
                                    <span style={{ fontSize: 18 }}>{icon}</span>
                                    <span>{label}</span>
                                </div>
                            );
                        })}
                        <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 8 }}>
                            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>
                                {user?.username}
                            </div>
                            <button
                                onClick={onLogout}
                                disabled={loggingOut}
                                style={{
                                    background: "rgba(255,255,255,0.1)", border: "none",
                                    borderRadius: 8, color: "rgba(255,255,255,0.8)",
                                    padding: "8px 16px", cursor: "pointer",
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    fontWeight: 600, fontSize: 13,
                                    display: "flex", alignItems: "center", gap: 8,
                                }}
                            >
                                {loggingOut ? <Spinner size={14} text="" /> : "🚪"}
                                {loggingOut ? "Signing out..." : "Sign Out"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Content */}
                <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
                    {children}
                </div>
            </div>
        );
    }

    // Desktop layout
    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fb" }}>
            <div style={{
                width: collapsed ? 64 : 240,
                background: T.blue, display: "flex",
                flexDirection: "column", padding: "24px 0",
                transition: "width 0.2s", flexShrink: 0,
                position: "sticky", top: 0, height: "100vh",
            }}>
                <div style={{
                    padding: "0 20px 24px",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    marginBottom: 16, display: "flex",
                    alignItems: "center", justifyContent: "space-between",
                }}>
                    {!collapsed && (
                        <div style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 800, fontSize: 20, color: T.yellow,
                        }}>
                            Sokoni
                            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
                                Supplier Portal
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(c => !c)}
                        style={{
                            background: "none", border: "none",
                            color: "rgba(255,255,255,0.6)", cursor: "pointer",
                            fontSize: 18, padding: 4,
                        }}
                    >
                        {collapsed ? "→" : "←"}
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: "auto" }}>
                    {NAV.map(({ path, icon, label }) => {
                        const active = location.pathname === path;
                        return (
                            <div
                                key={path}
                                onClick={() => navigate(path)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 12,
                                    padding: "12px 20px", cursor: "pointer",
                                    background: active ? "rgba(255,255,255,0.12)" : "none",
                                    borderLeft: active ? `3px solid ${T.yellow}` : "3px solid transparent",
                                    color: active ? T.yellow : "rgba(255,255,255,0.75)",
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    fontWeight: active ? 700 : 500, fontSize: 14,
                                    transition: "all 0.15s",
                                }}
                                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "none"; }}
                            >
                                <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                                {!collapsed && <span>{label}</span>}
                            </div>
                        );
                    })}
                </div>

                <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                    {!collapsed && (
                        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 10, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            {user?.username}
                        </div>
                    )}
                    <button
                        onClick={onLogout}
                        disabled={loggingOut}
                        style={{
                            width: "100%", background: "rgba(255,255,255,0.08)",
                            border: "none", borderRadius: 8,
                            color: "rgba(255,255,255,0.7)", padding: "8px 12px",
                            cursor: loggingOut ? "not-allowed" : "pointer", fontSize: 13,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            gap: 8, opacity: loggingOut ? 0.7 : 1,
                        }}
                    >
                        {loggingOut ? <Spinner size={16} text="" /> : <><span>🚪</span>{!collapsed && "Sign Out"}</>}
                    </button>
                </div>
            </div>

            <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
                {children}
            </div>
        </div>
    );
}
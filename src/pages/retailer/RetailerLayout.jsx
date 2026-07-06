import { useNavigate, useLocation } from "react-router-dom";
import { T } from "../../styles/theme";
import Spinner from "../../components/Spinner";

const NAV = [
    { path: "/dashboard",          icon: "📊", label: "Dashboard" },
    { path: "/retailer/orders",    icon: "📋", label: "My Orders" },
    { path: "/retailer/loyalty",   icon: "🎁", label: "Loyalty Points" },
    { path: "/retailer/profile",   icon: "👤", label: "My Profile" },
    { path: "/products",           icon: "🛒", label: "Browse Products" },
];

export default function RetailerLayout({ user, onLogout, loggingOut, children }) {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6fb" }}>
            {/* Sidebar */}
            <div style={{
                width: 240, background: T.blue,
                display: "flex", flexDirection: "column",
                padding: "24px 0", flexShrink: 0,
                position: "sticky", top: 0, height: "100vh",
            }}>
                {/* Logo */}
                <div style={{
                    padding: "0 20px 24px",
                    borderBottom: "1px solid rgba(255,255,255,0.1)",
                    marginBottom: 16,
                }}>
                    <div style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 800, fontSize: 20, color: T.yellow,
                    }}>
                        Sokoni
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 400 }}>
                            Retailer Portal
                        </div>
                    </div>
                </div>

                {/* Nav */}
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
                                    fontWeight: active ? 700 : 500,
                                    fontSize: 14, transition: "all 0.15s",
                                }}
                                onMouseEnter={e => {
                                    if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                                }}
                                onMouseLeave={e => {
                                    if (!active) e.currentTarget.style.background = "none";
                                }}
                            >
                                <span style={{ fontSize: 18 }}>{icon}</span>
                                <span>{label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* User + logout */}
                <div style={{
                    padding: "16px 20px",
                    borderTop: "1px solid rgba(255,255,255,0.1)",
                }}>
                    <div style={{
                        fontSize: 13, color: "rgba(255,255,255,0.6)",
                        marginBottom: 10,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}>
                        {user?.username}
                        <div style={{ fontSize: 11, opacity: 0.6 }}>{user?.email}</div>
                    </div>
                    <button
                        onClick={onLogout}
                        disabled={loggingOut}
                        style={{
                            width: "100%", background: "rgba(255,255,255,0.08)",
                            border: "none", borderRadius: 8,
                            color: "rgba(255,255,255,0.7)", padding: "8px 12px",
                            cursor: loggingOut ? "not-allowed" : "pointer",
                            fontSize: 13,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            display: "flex", alignItems: "center",
                            justifyContent: "center", gap: 8,
                            opacity: loggingOut ? 0.7 : 1,
                        }}
                    >
                        {loggingOut
                            ? <Spinner size={16} text="" />
                            : <><span>🚪</span> Sign Out</>
                        }
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
                {children}
            </div>
        </div>
    );
}
import { useEffect, useState } from "react";
import { T } from "../../styles/theme";
import {
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
} from "../../api/supplier";

export default function SupplierNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [unreadOnly, setUnreadOnly] = useState(false);
    const [marking, setMarking] = useState(false);

    async function load() {
        const data = await fetchNotifications(unreadOnly);
        if (data) {
            setNotifications(data.notifications);
            setUnreadCount(data.unread_count);
        }
        setLoading(false);
    }

    useEffect(() => { load(); }, [unreadOnly]);

    async function handleMarkRead(notification_id) {
        await markNotificationRead(notification_id);
        load();
    }

    async function handleMarkAllRead() {
        setMarking(true);
        await markAllNotificationsRead();
        setMarking(false);
        load();
    }

    function notifIcon(type) {
        const map = {
            product_approved:  "✅",
            product_rejected:  "❌",
            po_created:        "📋",
            po_updated:        "📝",
            shipment_received: "🚚",
            payment_completed: "💰",
            low_stock:         "⚠️",
            announcement:      "📢",
        };
        return map[type] || "🔔";
    }

    function notifColor(type) {
        const map = {
            product_approved:  { bg: "#d4edda", color: "#155724" },
            product_rejected:  { bg: "#f8d7da", color: "#721c24" },
            po_created:        { bg: "#cce5ff", color: "#004085" },
            po_updated:        { bg: "#cce5ff", color: "#004085" },
            shipment_received: { bg: "#d4edda", color: "#155724" },
            payment_completed: { bg: "#d4edda", color: "#155724" },
            low_stock:         { bg: "#fff3cd", color: "#856404" },
            announcement:      { bg: "#e2e3e5", color: "#383d41" },
        };
        return map[type] || { bg: "#e2e3e5", color: "#383d41" };
    }

    return (
        <div>
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 28,
            }}>
                <div>
                    <h1 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 24, fontWeight: 800, color: T.blue, marginBottom: 4,
                    }}>
                        Notifications
                        {unreadCount > 0 && (
                            <span style={{
                                marginLeft: 12,
                                background: T.yellow,
                                color: T.blue,
                                fontSize: 13,
                                fontWeight: 800,
                                padding: "2px 10px",
                                borderRadius: 20,
                                verticalAlign: "middle",
                            }}>
                                {unreadCount} unread
                            </span>
                        )}
                    </h1>
                    <p style={{ color: T.gray500, fontSize: 14 }}>
                        Stay updated on your products, orders and payments.
                    </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                    <button
                        onClick={() => setUnreadOnly(u => !u)}
                        style={{
                            background: unreadOnly ? T.blue : "#f0f2f8",
                            color: unreadOnly ? "white" : T.gray500,
                            border: "none", borderRadius: 8,
                            padding: "10px 18px", fontSize: 13,
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 600, cursor: "pointer",
                            transition: "all 0.15s",
                        }}
                    >
                        {unreadOnly ? "Showing Unread" : "Show Unread Only"}
                    </button>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            disabled={marking}
                            style={{
                                background: "#f0f2f8", color: T.blue,
                                border: "none", borderRadius: 8,
                                padding: "10px 18px", fontSize: 13,
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontWeight: 600, cursor: marking ? "not-allowed" : "pointer",
                                opacity: marking ? 0.7 : 1,
                            }}
                        >
                            {marking ? "Marking..." : "Mark All Read"}
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div style={{ color: T.gray500, padding: 40, textAlign: "center" }}>
                    Loading notifications...
                </div>
            ) : notifications.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: 80,
                    background: "white", borderRadius: 14,
                    boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
                    <div style={{ fontWeight: 700, color: T.blue, fontSize: 18, marginBottom: 8 }}>
                        No notifications
                    </div>
                    <div style={{ color: T.gray500, fontSize: 14 }}>
                        {unreadOnly
                            ? "No unread notifications."
                            : "You're all caught up!"}
                    </div>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {notifications.map(n => {
                        const tc = notifColor(n.type);
                        return (
                            <div
                                key={n.notification_id}
                                style={{
                                    background: n.is_read ? "white" : "#f0f4ff",
                                    borderRadius: 14,
                                    padding: "18px 24px",
                                    boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 16,
                                    borderLeft: n.is_read
                                        ? "4px solid transparent"
                                        : `4px solid ${T.blue}`,
                                    transition: "all 0.15s",
                                }}
                            >
                                {/* Icon */}
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: tc.bg, flexShrink: 0,
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", fontSize: 20,
                                }}>
                                    {notifIcon(n.type)}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontSize: 15, fontWeight: n.is_read ? 600 : 800,
                                        color: T.blue, marginBottom: 4,
                                    }}>
                                        {n.title}
                                    </div>
                                    <div style={{
                                        fontSize: 13, color: T.gray500,
                                        lineHeight: 1.5, marginBottom: 8,
                                    }}>
                                        {n.message}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <span style={{
                                            padding: "2px 10px", borderRadius: 20,
                                            fontSize: 11, fontWeight: 700,
                                            background: tc.bg, color: tc.color,
                                        }}>
                                            {n.type.replace(/_/g, " ")}
                                        </span>
                                        <span style={{ fontSize: 12, color: T.gray500 }}>
                                            {new Date(n.created_at).toLocaleDateString("en-KE", {
                                                day: "numeric", month: "short",
                                                year: "numeric", hour: "2-digit", minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                </div>

                                {/* Mark read button */}
                                {!n.is_read && (
                                    <button
                                        onClick={() => handleMarkRead(n.notification_id)}
                                        style={{
                                            background: "none", border: `1.5px solid ${T.blue}`,
                                            borderRadius: 8, padding: "6px 14px",
                                            fontSize: 12, fontWeight: 700,
                                            color: T.blue, cursor: "pointer",
                                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                                            flexShrink: 0, whiteSpace: "nowrap",
                                        }}
                                    >
                                        Mark Read
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
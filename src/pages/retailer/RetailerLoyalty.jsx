import { useEffect, useState } from "react";
import { T } from "../../styles/theme";
import Spinner from "../../components/Spinner";
import { fetchLoyaltyPoints } from "../../api/retailer";

export default function RetailerLoyalty() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLoyaltyPoints().then(d => {
            if (d) setData(d);
            setLoading(false);
        });
    }, []);

    if (loading) return <Spinner fullPage text="Loading loyalty points..." />;

    const pointsValue = Math.floor((data?.total_points || 0) / 100);

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 24, fontWeight: 800, color: T.blue, marginBottom: 4,
                }}>
                    Loyalty Rewards
                </h1>
                <p style={{ color: T.gray500, fontSize: 14 }}>
                    Earn 1 point for every KES 100 spent. Redeem at checkout.
                </p>
            </div>

            {/* Points banner */}
            <div style={{
                background: `linear-gradient(120deg, ${T.blue}, #1a4fa0)`,
                borderRadius: 16, padding: "32px 40px",
                marginBottom: 24, color: "white",
                display: "flex", justifyContent: "space-between",
                alignItems: "center", flexWrap: "wrap", gap: 20,
            }}>
                <div>
                    <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>
                        Your Loyalty Balance
                    </div>
                    <div style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 52, fontWeight: 800, color: T.yellow,
                        lineHeight: 1,
                    }}>
                        {Number(data?.total_points || 0).toLocaleString()}
                    </div>
                    <div style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>
                        points
                    </div>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>
                        Redeemable Value
                    </div>
                    <div style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 32, fontWeight: 800,
                    }}>
                        KES {pointsValue.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                        100 points = KES 1 discount
                    </div>
                </div>
            </div>

            {/* How it works */}
            <div style={{
                background: "white", borderRadius: 14, padding: 24,
                boxShadow: "0 2px 8px rgba(10,46,110,0.07)", marginBottom: 24,
            }}>
                <h3 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 15, fontWeight: 800, color: T.blue, marginBottom: 16,
                }}>
                    How It Works
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                    {[
                        { icon: "🛒", title: "Place Orders", desc: "Shop from our catalogue and place wholesale orders" },
                        { icon: "✅", title: "Confirm Delivery", desc: "Confirm receipt of your order to earn points" },
                        { icon: "🎁", title: "Redeem Rewards", desc: "Use points as discounts on future orders" },
                    ].map(({ icon, title, desc }) => (
                        <div key={title} style={{
                            textAlign: "center", padding: 20,
                            background: "#f8f9fc", borderRadius: 12,
                        }}>
                            <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
                            <div style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontWeight: 800, color: T.blue,
                                fontSize: 14, marginBottom: 6,
                            }}>
                                {title}
                            </div>
                            <div style={{ fontSize: 12, color: T.gray500, lineHeight: 1.5 }}>
                                {desc}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* History */}
            <div style={{
                background: "white", borderRadius: 14, padding: 24,
                boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
            }}>
                <h3 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 15, fontWeight: 800, color: T.blue, marginBottom: 16,
                }}>
                    Points History
                </h3>
                {!data?.history?.length ? (
                    <div style={{ textAlign: "center", padding: 40, color: T.gray500 }}>
                        <div style={{ fontSize: 36, marginBottom: 10 }}>🎁</div>
                        No points earned yet. Place your first order to get started!
                    </div>
                ) : (
                    data.history.map((h, i) => (
                        <div key={i} style={{
                            display: "flex", justifyContent: "space-between",
                            alignItems: "center", padding: "12px 0",
                            borderBottom: `1px solid ${T.gray100}`,
                        }}>
                            <div>
                                <div style={{ fontWeight: 700, color: T.blue, fontSize: 14 }}>
                                    {h.reason === "order_delivery"
                                        ? `Order #${h.order_id} delivered`
                                        : h.reason}
                                </div>
                                <div style={{ fontSize: 12, color: T.gray500, marginTop: 2 }}>
                                    {new Date(h.created_at).toLocaleDateString("en-KE", {
                                        day: "numeric", month: "short", year: "numeric",
                                    })}
                                    {h.total_amount && ` · KES ${Number(h.total_amount).toLocaleString()} order`}
                                </div>
                            </div>
                            <div style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontWeight: 800, fontSize: 16,
                                color: "#155724",
                            }}>
                                +{h.points} pts
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { T } from "../styles/theme";
import Spinner from "../components/Spinner";
import { placeOrder, stkPush, pollOrderStatus } from "../api/retailer";
import useIsMobile from "../hooks/useIsMobile";

export default function CheckoutPage({ user, cart, setCart, showToast }) {
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const [step, setStep] = useState("details"); // details | payment | polling | success
    const [placingOrder, setPlacingOrder] = useState(false);
    const [pushing, setPushing] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [error, setError] = useState("");
    const pollRef = useRef(null);

    const [form, setForm] = useState({
        delivery_address: "",
        delivery_city: "",
        country: "Kenya",
        phone: user?.phone || "",
    });

    const total = cart.reduce((s, i) => s + Number(i.product_cost) * i.qty, 0);

    // Redirect if cart empty
    useEffect(() => {
        if (cart.length === 0 && step !== "success") {
            navigate("/products");
        }
    }, [cart]);

    // Cleanup polling on unmount
    useEffect(() => {
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, []);

    function handleChange(e) {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    }

    async function handlePlaceOrder() {
        setError("");
        if (!form.delivery_address.trim() || !form.delivery_city.trim()) {
            setError("Delivery address and city are required");
            return;
        }

        setPlacingOrder(true);

        // Build order items from cart
        const orderData = {
            delivery_address: form.delivery_address.trim(),
            delivery_city: form.delivery_city.trim(),
            country: form.country,
        };

        const data = await placeOrder(orderData);
        setPlacingOrder(false);

        if (!data || data.error) {
            setError(data?.error || "Failed to place order. Please try again.");
            return;
        }

        setOrderId(data.order_id);
        setStep("payment");
        showToast(`Order #${data.order_id} created!`, "success");
    }

    async function handleStkPush() {
        if (!form.phone.trim()) {
            setError("Phone number is required for M-Pesa payment");
            return;
        }
        setError("");
        setPushing(true);

        const data = await stkPush(orderId, form.phone.trim());
        setPushing(false);

        if (!data || data.error) {
            setError(data?.error || "Failed to send M-Pesa prompt. Try again.");
            return;
        }

        setStep("polling");
        startPolling();
    }

    function startPolling() {
        let attempts = 0;
        const maxAttempts = 20; // poll for up to ~60 seconds

        pollRef.current = setInterval(async () => {
            attempts++;
            const data = await pollOrderStatus(orderId);

            if (data?.status === "paid") {
                clearInterval(pollRef.current);
                setCart([]);
                setStep("success");
                showToast("Payment confirmed! 🎉", "success");
            } else if (attempts >= maxAttempts) {
                clearInterval(pollRef.current);
                setStep("payment");
                setError("Payment not confirmed yet. Check your phone or try again.");
            }
        }, 3000);
    }

    const inputStyle = {
        width: "100%", padding: "11px 14px",
        border: `1.5px solid ${T.gray100}`,
        borderRadius: 8, fontSize: 14,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: T.blue, outline: "none",
        boxSizing: "border-box",
    };

    const labelStyle = {
        display: "block", fontSize: 13,
        fontWeight: 600, color: T.gray500, marginBottom: 6,
    };

    return (
        <div style={{
            maxWidth: 960, margin: "40px auto",
            padding: "0 24px",
        }}>
            <button
                onClick={() => navigate("/products")}
                style={{
                    background: "none", border: "none",
                    color: T.blueLight, fontSize: 14, fontWeight: 600,
                    cursor: "pointer", padding: 0, marginBottom: 24,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    display: "flex", alignItems: "center", gap: 6,
                }}
            >
                ← Continue Shopping
            </button>

            <h1 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 28, fontWeight: 800,
                color: T.blue, marginBottom: 32,
            }}>
                Checkout
            </h1>

            {/* SUCCESS STATE */}
            {step === "success" && (
                <div style={{
                    background: "#d4edda", borderRadius: 16,
                    padding: "48px 40px", textAlign: "center",
                    border: "1px solid #c3e6cb",
                }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                    <h2 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 24, fontWeight: 800,
                        color: "#155724", marginBottom: 8,
                    }}>
                        Order Paid Successfully!
                    </h2>
                    <p style={{ color: "#155724", fontSize: 15, marginBottom: 28 }}>
                        Your order #{orderId} has been confirmed and is being processed.
                    </p>
                    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                        <button
                            onClick={() => navigate(`/retailer/orders/${orderId}`)}
                            style={{
                                background: "#155724", color: "white",
                                border: "none", borderRadius: 10,
                                padding: "13px 28px", fontSize: 14,
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontWeight: 700, cursor: "pointer",
                            }}
                        >
                            View Order →
                        </button>
                        <button
                            onClick={() => navigate("/products")}
                            style={{
                                background: "white", color: "#155724",
                                border: "1px solid #c3e6cb", borderRadius: 10,
                                padding: "13px 28px", fontSize: 14,
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontWeight: 700, cursor: "pointer",
                            }}
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}

            {/* POLLING STATE */}
            {step === "polling" && (
                <div style={{
                    background: "white", borderRadius: 16,
                    padding: "48px 40px", textAlign: "center",
                    boxShadow: "0 2px 12px rgba(10,46,110,0.08)",
                }}>
                    <Spinner size={48} text="" />
                    <h2 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 22, fontWeight: 800,
                        color: T.blue, marginTop: 24, marginBottom: 8,
                    }}>
                        Waiting for Payment...
                    </h2>
                    <p style={{ color: T.gray500, fontSize: 15, marginBottom: 8 }}>
                        Check your phone and enter your M-Pesa PIN.
                    </p>
                    <p style={{ color: T.gray500, fontSize: 13 }}>
                        This page will update automatically once payment is confirmed.
                    </p>
                    <div style={{
                        marginTop: 24, padding: "16px 24px",
                        background: "#f8f9fc", borderRadius: 10,
                        display: "inline-block",
                    }}>
                        <div style={{ fontSize: 13, color: T.gray500 }}>Amount to pay</div>
                        <div style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 24, fontWeight: 800, color: T.blue,
                        }}>
                            KES {total.toLocaleString()}
                        </div>
                    </div>
                </div>
            )}

            {/* DETAILS + PAYMENT STEPS */}
            {(step === "details" || step === "payment") && (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 380px",
                    gap: 24, alignItems: "start",
                }}>
                    {/* Left — form */}
                    <div>
                        {/* Delivery details */}
                        <div style={{
                            background: "white", borderRadius: 14,
                            padding: 28, marginBottom: 20,
                            boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                        }}>
                            <h2 style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: 18, fontWeight: 800,
                                color: T.blue, marginBottom: 20,
                            }}>
                                📍 Delivery Details
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

                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Delivery Address *</label>
                                <input
                                    name="delivery_address"
                                    value={form.delivery_address}
                                    onChange={handleChange}
                                    placeholder="e.g. Mombasa Road, Industrial Area"
                                    style={inputStyle}
                                    disabled={step === "payment"}
                                    onFocus={e => e.target.style.borderColor = T.blue}
                                    onBlur={e => e.target.style.borderColor = T.gray100}
                                />
                            </div>

                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: 16, marginBottom: 16,
                            }}>
                                <div>
                                    <label style={labelStyle}>City *</label>
                                    <input
                                        name="delivery_city"
                                        value={form.delivery_city}
                                        onChange={handleChange}
                                        placeholder="e.g. Nairobi"
                                        style={inputStyle}
                                        disabled={step === "payment"}
                                        onFocus={e => e.target.style.borderColor = T.blue}
                                        onBlur={e => e.target.style.borderColor = T.gray100}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Country</label>
                                    <select
                                        name="country"
                                        value={form.country}
                                        onChange={handleChange}
                                        disabled={step === "payment"}
                                        style={{ ...inputStyle, background: "white" }}
                                    >
                                        {["Kenya", "Tanzania", "Uganda", "Rwanda", "Ethiopia"].map(c => (
                                            <option key={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>M-Pesa Phone Number *</label>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="07XXXXXXXX"
                                    style={inputStyle}
                                    onFocus={e => e.target.style.borderColor = T.blue}
                                    onBlur={e => e.target.style.borderColor = T.gray100}
                                />
                                <div style={{ fontSize: 12, color: T.gray500, marginTop: 4 }}>
                                    M-Pesa prompt will be sent to this number
                                </div>
                            </div>
                        </div>

                        {/* Payment step */}
                        {step === "payment" && (
                            <div style={{
                                background: "white", borderRadius: 14,
                                padding: 28,
                                boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                            }}>
                                <h2 style={{
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    fontSize: 18, fontWeight: 800,
                                    color: T.blue, marginBottom: 8,
                                }}>
                                    💳 Pay with M-Pesa
                                </h2>
                                <p style={{ color: T.gray500, fontSize: 14, marginBottom: 20 }}>
                                    Order #{orderId} created. Click below to receive the M-Pesa STK push on your phone.
                                </p>

                                <div style={{
                                    background: "#f0f2f8", borderRadius: 10,
                                    padding: "16px 20px", marginBottom: 20,
                                }}>
                                    {[
                                        ["Paybill Number", "542542"],
                                        ["Account Number", `Sokoni-${orderId}`],
                                        ["Amount", `KES ${total.toLocaleString()}`],
                                        ["Phone", form.phone],
                                    ].map(([k, v]) => (
                                        <div key={k} style={{
                                            display: "flex", justifyContent: "space-between",
                                            padding: "6px 0",
                                            borderBottom: `1px solid ${T.gray100}`,
                                            fontSize: 14,
                                        }}>
                                            <span style={{ color: T.gray500 }}>{k}</span>
                                            <span style={{ fontWeight: 700, color: T.blue }}>{v}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={handleStkPush}
                                    disabled={pushing}
                                    style={{
                                        width: "100%", background: "#4CAF50",
                                        color: "white", border: "none", borderRadius: 10,
                                        padding: "14px 0", fontSize: 16,
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontWeight: 800, cursor: pushing ? "not-allowed" : "pointer",
                                        opacity: pushing ? 0.7 : 1,
                                        display: "flex", alignItems: "center",
                                        justifyContent: "center", gap: 8,
                                    }}
                                >
                                    {pushing ? <Spinner size={18} text="" /> : "📱"}
                                    {pushing ? "Sending prompt..." : "Send M-Pesa Prompt"}
                                </button>

                                {/* <div style={{
                                    textAlign: "center", marginTop: 12,
                                    fontSize: 13, color: T.gray500,
                                }}>
                                    Or pay manually via Paybill <strong>542542</strong>, Account: <strong>Sokoni-{orderId}</strong>
                                </div> */}
                            </div>
                        )}
                    </div>

                    {/* Right — order summary */}
                    <div style={{
                        background: "white", borderRadius: 14,
                        padding: 24, position: "sticky", top: 20,
                        boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                    }}>
                        <h3 style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: 16, fontWeight: 800,
                            color: T.blue, marginBottom: 16,
                        }}>
                            Order Summary
                        </h3>

                        {cart.map(item => (
                            <div key={item.product_id} style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "flex-start", padding: "10px 0",
                                borderBottom: `1px solid ${T.gray100}`,
                                gap: 12,
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{
                                        fontSize: 13, fontWeight: 600,
                                        color: T.blue, marginBottom: 2,
                                    }}>
                                        {item.product_name}
                                    </div>
                                    <div style={{ fontSize: 12, color: T.gray500 }}>
                                        {item.qty} {item.unit}s × KES {Number(item.product_cost).toLocaleString()}
                                    </div>
                                </div>
                                <div style={{ fontWeight: 700, color: T.blue, fontSize: 14, flexShrink: 0 }}>
                                    KES {(Number(item.product_cost) * item.qty).toLocaleString()}
                                </div>
                            </div>
                        ))}

                        <div style={{
                            display: "flex", justifyContent: "space-between",
                            padding: "14px 0 0", fontSize: 16,
                        }}>
                            <span style={{ fontWeight: 800, color: T.blue }}>Total</span>
                            <span style={{ fontWeight: 800, color: T.blue }}>
                                KES {total.toLocaleString()}
                            </span>
                        </div>

                        {step === "details" && (
                            <button
                                onClick={handlePlaceOrder}
                                disabled={placingOrder}
                                style={{
                                    width: "100%", background: T.blue,
                                    color: "white", border: "none", borderRadius: 10,
                                    padding: "14px 0", fontSize: 15, marginTop: 20,
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    fontWeight: 700, cursor: placingOrder ? "not-allowed" : "pointer",
                                    opacity: placingOrder ? 0.7 : 1,
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", gap: 8,
                                }}
                            >
                                {placingOrder ? <Spinner size={18} text="" /> : null}
                                {placingOrder ? "Placing Order..." : "Place Order →"}
                            </button>
                        )}

                        <div style={{
                            marginTop: 16, padding: "12px 16px",
                            background: "#f8f9fc", borderRadius: 8,
                            fontSize: 12, color: T.gray500, textAlign: "center",
                        }}>
                            🔒 Secured by M-Pesa · Safaricom Daraja API
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
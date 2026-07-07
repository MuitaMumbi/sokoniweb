import { T } from "../styles/theme";
import { useNavigate } from "react-router-dom";

export default function CartSidebar({ open, setOpen, cart, setCart, showToast, user, setModalOpen }) {
    const navigate = useNavigate();
    const total = cart.reduce((s, i) => s + Number(i.product_cost) * i.qty, 0);

    function remove(product_id) {
        setCart(prev => prev.filter(i => i.product_id !== product_id));
    }

    function updateQty(product_id, delta, min_order_qty) {
        setCart(prev => prev.map(i =>
            i.product_id === product_id
                ? { ...i, qty: Math.max(min_order_qty || 1, i.qty + delta) }
                : i
        ));
    }

    function handleCheckout() {
        if (!user) {
            setOpen(false);
            setModalOpen(true);
            showToast("Please sign in to place an order", "warn");
            return;
        }
        setOpen(false);
        navigate("/checkout");
    }

    return (
        <div className={`cart-sidebar ${open ? "open" : ""}`}>
            <div className="cart-header">
                <span className="cart-title">
                    My Order ({cart.length} items)
                </span>
                <button className="cart-close" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="cart-body">
                {cart.length === 0 ? (
                    <div className="cart-empty">
                        <div className="cart-empty-icon">🛒</div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: T.blue, marginBottom: 6 }}>
                            Your cart is empty
                        </p>
                        <p style={{ fontSize: 13 }}>
                            Browse our products and add items to get started.
                        </p>
                    </div>
                ) : (
                    cart.map(item => (
                        <div className="cart-item" key={item.product_id}>
                            <div className="cart-item-img">
                                {item.product_photo ? (
                                    <img
                                        src={item.product_photo}
                                        alt={item.product_name}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 6 }}
                                    />
                                ) : "📦"}
                            </div>
                            <div className="cart-item-info">
                                <div className="cart-item-name">{item.product_name}</div>
                                <div style={{ fontSize: 12, color: T.gray500, margin: "3px 0" }}>
                                    <button
                                        onClick={() => updateQty(item.product_id, -(item.min_order_qty || 1), item.min_order_qty)}
                                        style={{
                                            background: T.gray100, border: "none",
                                            borderRadius: 4, width: 22, height: 22,
                                            cursor: "pointer", fontWeight: 700,
                                            fontSize: 14, lineHeight: 1,
                                        }}
                                    >−</button>
                                    <span style={{ margin: "0 8px", fontWeight: 600, color: T.blue }}>
                                        {item.qty}
                                    </span>
                                    <button
                                        onClick={() => updateQty(item.product_id, item.min_order_qty || 1, item.min_order_qty)}
                                        style={{
                                            background: T.gray100, border: "none",
                                            borderRadius: 4, width: 22, height: 22,
                                            cursor: "pointer", fontWeight: 700,
                                            fontSize: 14, lineHeight: 1,
                                        }}
                                    >+</button>
                                    <span style={{ marginLeft: 8 }}>{item.unit}s</span>
                                </div>
                                <div className="cart-item-price">
                                    KES {(Number(item.product_cost) * item.qty).toLocaleString()}
                                </div>
                            </div>
                            <button
                                className="cart-item-remove"
                                onClick={() => remove(item.product_id)}
                            >✕</button>
                        </div>
                    ))
                )}
            </div>

            {cart.length > 0 && (
                <div className="cart-footer">
                    <div className="cart-total-row">
                        <span className="cart-total-label">Order Total</span>
                        <span className="cart-total-amount">
                            KES {total.toLocaleString()}
                        </span>
                    </div>
                    <button
                        className="btn-full yellow"
                        style={{ marginBottom: 10 }}
                        onClick={handleCheckout}
                    >
                        Proceed to Checkout →
                    </button>
                    <button
                        className="btn-full"
                        style={{ background: T.gray100, color: T.blue }}
                        onClick={() => setOpen(false)}
                    >
                        Continue Shopping
                    </button>
                </div>
            )}
        </div>
    );
}

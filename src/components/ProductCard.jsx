export default function ProductCard({ product, user, cart, setCart, showToast, setModalOpen }) {
    const inCart = cart.find(i => i.product_id === product.product_id);

    function handleAdd() {
        if (!user) {
            setModalOpen(true);
            showToast("Please sign in to add items to cart", "warn");
            return;
        }
        if (!inCart) {
            setCart(prev => [...prev, { ...product, qty: product.min_order_qty || 1 }]);
            showToast(`${product.product_name} added to cart ✓`, "success");
        }
    }

    function updateQty(delta) {
        setCart(prev => prev.map(i =>
            i.product_id === product.product_id
                ? { ...i, qty: Math.max(product.min_order_qty || 1, i.qty + delta) }
                : i
        ));
    }

    return (
        <div className="product-card">
            <div className="product-img">
                {product.product_photo ? (
                    <img
                        src={product.product_photo}
                        alt={product.product_name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }}
                    />
                ) : (
                    <span style={{ fontSize: 56 }}>📦</span>
                )}
            </div>
            <div className="product-body">
                <div className="product-cat">{product.category || "General"}</div>
                <div className="product-name">{product.product_name}</div>
                <div className="product-price-row">
                    <span className="product-price">
                        KES {Number(product.product_cost).toLocaleString()}
                    </span>
                    <span className="product-unit">/{product.unit || "piece"}</span>
                </div>
                <div className="product-moq">
                    Min. order: {product.min_order_qty || 1} {product.unit || "piece"}s
                </div>
                {inCart ? (
                    <div className="product-qty-row">
                        <button className="qty-btn" onClick={() => updateQty(-(product.min_order_qty || 1))}>−</button>
                        <span className="qty-num">{inCart.qty}</span>
                        <button className="qty-btn" onClick={() => updateQty(product.min_order_qty || 1)}>+</button>
                    </div>
                ) : (
                    <button
                        className={`product-add-btn ${!user ? "locked" : ""}`}
                        onClick={handleAdd}
                    >
                        {user ? "Add to Order" : "🔒 Sign in to Order"}
                    </button>
                )}
            </div>
        </div>
    );
}
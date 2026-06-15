function ProductCard({ product, user, onAdd, cart, setCart, showToast, setModalOpen }) {
  const inCart = cart.find(i => i.id === product.id);
 
  function handleAdd() {
    if (!user) { setModalOpen(true); showToast("Please sign in to add items to cart", "warn"); return; }
    if (!inCart) {
      setCart(prev => [...prev, { ...product, qty: product.moq }]);
      showToast(`${product.name} added to cart ✓`, "success");
    }
  }
 
  function updateQty(delta) {
    setCart(prev => prev.map(i => i.id === product.id
      ? { ...i, qty: Math.max(product.moq, i.qty + delta) }
      : i
    ));
  }
 
  return (
    <div className="product-card">
      <div className="product-img">
        <span style={{ fontSize: 56 }}>{product.icon}</span>
        {product.badge && <span className="product-badge">{product.badge}</span>}
      </div>
      <div className="product-body">
        <div className="product-cat">{product.cat}</div>
        <div className="product-name">{product.name}</div>
        <div className="product-sku">SKU: {product.sku}</div>
        <div className="product-price-row">
          <span className="product-price">KES {product.price.toLocaleString()}</span>
          <span className="product-unit">/{product.unit}</span>
        </div>
        <div className="product-moq">Min. order: {product.moq} {product.unit}s</div>
        {inCart ? (
          <div className="product-qty-row">
            <button className="qty-btn" onClick={() => updateQty(-product.moq)}>−</button>
            <span className="qty-num">{inCart.qty}</span>
            <button className="qty-btn" onClick={() => updateQty(product.moq)}>+</button>
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
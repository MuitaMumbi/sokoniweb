import { T } from "../styles/theme";

export default function CartSidebar({
	open,
	setOpen,
	cart,
	setCart,
	showToast,
}) {
	const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

	function remove(id) {
		setCart((prev) => prev.filter((i) => i.id !== id));
	}

	function checkout() {
		showToast("Order placed successfully! 🎉", "success");
		setCart([]);
		setOpen(false);
	}

	return (
		<div className={`cart-sidebar ${open ? "open" : ""}`}>
			<div className="cart-header">
				<span className="cart-title">
					My Order ({cart.length} items)
				</span>
				<button className="cart-close" onClick={() => setOpen(false)}>
					✕
				</button>
			</div>
			<div className="cart-body">
				{cart.length === 0 ? (
					<div className="cart-empty">
						<div className="cart-empty-icon">🛒</div>
						<p
							style={{
								fontSize: 15,
								fontWeight: 600,
								color: T.blue,
								marginBottom: 6,
							}}
						>
							Your cart is empty
						</p>
						<p style={{ fontSize: 13 }}>
							Browse our products and add items to get started.
						</p>
					</div>
				) : (
					cart.map((item) => (
						<div className="cart-item" key={item.id}>
							<div className="cart-item-img">{item.icon}</div>
							<div className="cart-item-info">
								<div className="cart-item-name">
									{item.name}
								</div>
								<div
									style={{
										fontSize: 12,
										color: T.gray500,
										margin: "3px 0",
									}}
								>
									Qty: {item.qty} {item.unit}s
								</div>
								<div className="cart-item-price">
									KES{" "}
									{(item.price * item.qty).toLocaleString()}
								</div>
							</div>
							<button
								className="cart-item-remove"
								onClick={() => remove(item.id)}
							>
								✕
							</button>
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
						onClick={checkout}
					>
						Place Order →
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

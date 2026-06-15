export default function ProductsPage({
	user,
	cart,
	setCart,
	showToast,
	setModalOpen,
}) {
	const [search, setSearch] = useState("");
	const [catFilter, setCatFilter] = useState("all");
	const [sortBy, setSortBy] = useState("default");

	let products = [...PRODUCTS];
	if (catFilter !== "all")
		products = products.filter((p) => p.cat === catFilter);
	if (search)
		products = products.filter((p) =>
			p.name.toLowerCase().includes(search.toLowerCase()),
		);
	if (sortBy === "price-asc") products.sort((a, b) => a.price - b.price);
	if (sortBy === "price-desc") products.sort((a, b) => b.price - a.price);
	if (sortBy === "name")
		products.sort((a, b) => a.name.localeCompare(b.name));

	return (
		<div className="products-page">
			<div className="section-header" style={{ marginBottom: 8 }}>
				<h2 className="section-title">
					All <span>Products</span>
				</h2>
				<span style={{ fontSize: 14, color: T.gray500 }}>
					{products.length} products found
				</span>
			</div>
			<p style={{ fontSize: 14, color: T.gray500, marginBottom: 24 }}>
				{!user && (
					<span style={{ color: T.danger, fontWeight: 600 }}>
						🔒 Sign in to place orders.{" "}
					</span>
				)}
				Browse our full catalogue below.
			</p>
			<div className="filters-bar">
				<input
					className="search-box"
					placeholder="🔍  Search products..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<select
					className="filter-select"
					value={catFilter}
					onChange={(e) => setCatFilter(e.target.value)}
				>
					{CATEGORIES.map((c) => (
						<option key={c.id} value={c.id}>
							{c.name}
						</option>
					))}
				</select>
				<select
					className="filter-select"
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value)}
				>
					<option value="default">Sort: Default</option>
					<option value="price-asc">Price: Low to High</option>
					<option value="price-desc">Price: High to Low</option>
					<option value="name">Name: A-Z</option>
				</select>
			</div>
			<div className="product-grid">
				{products.map((p) => (
					<ProductCard
						key={p.id}
						product={p}
						user={user}
						cart={cart}
						setCart={setCart}
						showToast={showToast}
						setModalOpen={setModalOpen}
					/>
				))}
			</div>
			{products.length === 0 && (
				<div
					style={{
						textAlign: "center",
						padding: "80px 20px",
						color: T.gray500,
					}}
				>
					<div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
					<p style={{ fontSize: 16, fontWeight: 600, color: T.blue }}>
						No products found
					</p>
					<p style={{ fontSize: 14, marginTop: 6 }}>
						Try adjusting your search or filter.
					</p>
				</div>
			)}
		</div>
	);
}

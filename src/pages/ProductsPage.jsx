import { useState, useEffect, useRef } from "react";
import { T } from "../styles/theme";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import { fetchProducts, fetchCategories } from "../api/product";

export default function ProductsPage({ user, cart, setCart, showToast, setModalOpen }) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [catFilter, setCatFilter] = useState("all");
    const [sortBy, setSortBy] = useState("default");
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingCats, setLoadingCats] = useState(true);
    const debounceRef = useRef(null);

    // Load categories once
    useEffect(() => {
        fetchCategories().then(data => {
            if (data) setCategories([
                { category_id: "all", name: "All Categories" },
                ...data.categories,
            ]);
            setLoadingCats(false);
        });
    }, []);

    // Debounce search input — wait 400ms after user stops typing
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(search);
        }, 400);
        return () => clearTimeout(debounceRef.current);
    }, [search]);

    // Fetch products when debounced search or category changes
    useEffect(() => {
        setLoadingProducts(true);
        fetchProducts({
            search: debouncedSearch,
            category_id: catFilter === "all" ? "" : catFilter,
            limit: 50,
        }).then(data => {
            if (data) setProducts(data.products);
            setLoadingProducts(false);
        });
    }, [debouncedSearch, catFilter]);

    let sorted = [...products];
    if (sortBy === "price-asc") sorted.sort((a, b) => a.product_cost - b.product_cost);
    if (sortBy === "price-desc") sorted.sort((a, b) => b.product_cost - a.product_cost);
    if (sortBy === "name") sorted.sort((a, b) => a.product_name.localeCompare(b.product_name));

    return (
        <div className="products-page">
            <div className="section-header" style={{ marginBottom: 8 }}>
                <h2 className="section-title">All <span>Products</span></h2>
                <span style={{ fontSize: 14, color: T.gray500 }}>
                    {loadingProducts ? "Loading..." : `${sorted.length} products found`}
                </span>
            </div>

            <p style={{ fontSize: 14, color: T.gray500, marginBottom: 24 }}>
                {!user && (
                    <span style={{ color: T.danger, fontWeight: 600 }}>
                        🔒 Sign in to place orders.{" "}
                    </span>
                )}
                Wholesale prices for registered businesses. Minimum order quantities apply.
            </p>

            {/* Filters */}
            <div className="filters-bar">
                <input
                    className="search-box"
                    placeholder="🔍  Search products..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <select
                    className="filter-select"
                    value={catFilter}
                    onChange={e => setCatFilter(e.target.value)}
                    disabled={loadingCats}
                >
                    {loadingCats ? (
                        <option>Loading...</option>
                    ) : categories.map(c => (
                        <option key={c.category_id} value={c.category_id}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <select
                    className="filter-select"
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                >
                    <option value="default">Sort: Default</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name: A-Z</option>
                </select>
            </div>

            {/* Category pills */}
            {!loadingCats && (
                <div style={{
                    display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24,
                }}>
                    {categories.map(c => (
                        <button
                            key={c.category_id}
                            onClick={() => setCatFilter(c.category_id)}
                            style={{
                                padding: "6px 16px", borderRadius: 20,
                                border: "none", fontSize: 13, fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                background: catFilter === c.category_id ? T.blue : "#f0f2f8",
                                color: catFilter === c.category_id ? "white" : T.gray500,
                                transition: "all 0.15s",
                            }}
                        >
                            {c.name}
                            {c.product_count !== undefined && (
                                <span style={{ marginLeft: 6, opacity: 0.7, fontSize: 11 }}>
                                    ({c.product_count})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {loadingProducts ? (
                <Spinner fullPage text="Loading products..." />
            ) : sorted.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 20px", color: T.gray500 }}>
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                    <p style={{ fontSize: 16, fontWeight: 600, color: T.blue }}>
                        No products found
                    </p>
                    <p style={{ fontSize: 14, marginTop: 6 }}>
                        Try adjusting your search or filter.
                    </p>
                    {catFilter !== "all" && (
                        <button
                            onClick={() => setCatFilter("all")}
                            style={{
                                marginTop: 16, background: T.blue, color: "white",
                                border: "none", borderRadius: 10,
                                padding: "10px 24px", fontSize: 13,
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontWeight: 700, cursor: "pointer",
                            }}
                        >
                            Clear Filter
                        </button>
                    )}
                </div>
            ) : (
                <div className="product-grid">
                    {sorted.map(p => (
                        <ProductCard
                            key={p.product_id}
                            product={p}
                            user={user}
                            cart={cart}
                            setCart={setCart}
                            showToast={showToast}
                            setModalOpen={setModalOpen}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
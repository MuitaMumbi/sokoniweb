function HomePage({ user, setModalOpen, cart, setCart, showToast, activeCat, setActiveCat }) {
  const filtered = activeCat === "all" ? PRODUCTS : PRODUCTS.filter(p => p.cat === activeCat);
 
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <span className="hero-eyebrow">🇰🇪 Trusted Wholesale Platform</span>
            <h1 className="hero-title">
              East Africa's #1<br /><span>B2B Marketplace</span><br />for Retailers
            </h1>
            <p className="hero-sub">
              Stock your shelves faster. Order directly from manufacturers and distributors — wholesale prices, next-day delivery across Nairobi and beyond.
            </p>
            <div className="hero-cta-row">
              {user ? (
                <button className="btn-primary" onClick={() => {}}>Browse Products →</button>
              ) : (
                <>
                  <button className="btn-primary" onClick={() => setModalOpen(true)}>Get Started Free</button>
                  <button className="btn-outline-white" onClick={() => {}}>View Catalogue</button>
                </>
              )}
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-num">12K+</div>
                <div className="hero-stat-label">Active Retailers</div>
              </div>
              <div>
                <div className="hero-stat-num">240+</div>
                <div className="hero-stat-label">Product SKUs</div>
              </div>
              <div>
                <div className="hero-stat-num">48hr</div>
                <div className="hero-stat-label">Max Delivery</div>
              </div>
            </div>
          </div>
          <div className="hero-graphic">
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.6)" }}>
              <div style={{ fontSize: 64, marginBottom: 12 }}>📦</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: T.yellow }}>Next-day delivery</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Nairobi & surrounding areas</div>
            </div>
          </div>
        </div>
      </section>
 
      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="trust-bar-inner">
          {["🚚 Free delivery over KES 10,000","📦 Wholesale prices","🔒 Secure payments","📞 Dedicated account manager","⭐ 50,000+ orders fulfilled"].map((t, i) => (
            <div className="trust-item" key={i}>{t}</div>
          ))}
        </div>
      </div>
 
      <div className="main-layout">
        {/* CATEGORY CARDS */}
        <div className="section-header">
          <h2 className="section-title">Shop by <span>Category</span></h2>
        </div>
        <div className="cat-grid">
          {CATEGORIES.filter(c => c.id !== "all").map(cat => (
            <div
              key={cat.id}
              className={`cat-card ${activeCat === cat.id ? "active" : ""}`}
              onClick={() => setActiveCat(activeCat === cat.id ? "all" : cat.id)}
            >
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-name">{cat.name}</div>
              <div className="cat-count">{cat.count} products</div>
            </div>
          ))}
        </div>
 
        {/* PRODUCTS */}
        <div className="section-header">
          <h2 className="section-title">
            {activeCat === "all" ? <>Featured <span>Products</span></> : CATEGORIES.find(c => c.id === activeCat)?.name}
          </h2>
          {!user && (
            <span style={{ fontSize: 13, color: T.gray500 }}>
              <span style={{ color: T.danger }}>🔒</span> Sign in to order
            </span>
          )}
        </div>
        <div className="product-grid">
          {filtered.map(p => (
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
 
        {/* BANNER */}
        {!user && (
          <div style={{
            background: `linear-gradient(120deg, ${T.blue} 0%, ${T.blueLight} 100%)`,
            borderRadius: 20, padding: "40px 48px", display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: 24, flexWrap: "wrap", marginBottom: 48
          }}>
            <div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 24, fontWeight: 800, color: T.white, marginBottom: 8 }}>
                Ready to stock smarter?
              </h3>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15 }}>
                Join 12,000+ retailers already ordering on Sokoni. Free to register.
              </p>
            </div>
            <button className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }} onClick={() => setModalOpen(true)}>
              Create Free Account →
            </button>
          </div>
        )}
      </div>
    </>
  );
}
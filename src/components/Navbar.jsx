import { useState, useEffect } from "react";

export default function Navbar({
  activePath,
  onNav,
  setModalOpen,
  cartCount,
  setCartOpen,
  user,
  setUser,
  authChecked,
  onLogout,
  loggingOut,
}) {

  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
      if (!loggingOut) setShowMenu(false);
    }, [loggingOut]);

  const isAdminPage = activePath.startsWith("/admin");
  
  return (
    <nav className="nav">
      <div className="nav-inner">

        {/* LOGO */}
        <div className="nav-logo" onClick={() => onNav("/")}>
          SOKONI<span>B2B</span>
        </div>

        {/* SEARCH — hide on admin page too, optional but cleaner
        {!isAdminPage && (
          <div className="nav-search">
            <span className="nav-search-icon">🔍</span>
            <input placeholder="Search products, brands, categories..." />
          </div>
        )} */}

        {/* LINKS */}
        <div className="nav-links">
          {!isAdminPage && (
            <>
              <span
                className={`nav-link ${activePath === "/" ? "active" : ""}`}
                onClick={() => onNav("/")}
              >
                Home
              </span>

              <span
                className={`nav-link ${activePath === "/products" ? "active" : ""}`}
                onClick={() => onNav("/products")}
              >
                Products
              </span>

              {user && (
                <span
                  className={`nav-link ${activePath === "/dashboard" ? "active" : ""}`}
                  onClick={() => onNav("/dashboard")}
                >
                  Dashboard
                </span>
              )}

              {user?.role === "admin" && (
                <span
                  className={`nav-link ${activePath === "/admin" ? "active" : ""}`}
                  onClick={() => onNav("/admin")}
                >
                  Admin
                </span>
              )}

              {/* CART — hide on admin page */}
              <button
                className="nav-cart"
                onClick={() => {
                  if (!user) setModalOpen(true);
                  else setCartOpen(true);
                }}
              >
                🛒
                {cartCount > 0 && (
                  <span className="nav-cart-badge">{cartCount}</span>
                )}
              </button>
            </>
          )}

          {/* AUTH — only render once auth check is done */}
          {user ? (
             <div style={{ position: "relative" }}>
                  <div
                      className="nav-avatar"
                      title={user.username}
                      onClick={() => setShowMenu(!showMenu)}
                  >
                      {user.username[0].toUpperCase()}
                  </div>

                  {showMenu && (
                      <>
                          {/* invisible backdrop to close menu on outside click */}
                          <div
                              style={{ position: "fixed", inset: 0, zIndex: 998 }}
                              onClick={() => setShowMenu(false)}
                          />
                          <div style={{
                              position: "absolute",
                              top: "calc(100% + 8px)",
                              right: 0,
                              background: "#fff",
                              borderRadius: 10,
                              boxShadow: "0 8px 24px rgba(10,46,110,0.18)",
                              minWidth: 180,
                              zIndex: 999,
                              overflow: "hidden",
                          }}>
                              <div style={{ padding: "12px 16px", borderBottom: "1px solid #F1F5F9" }}>
                                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0A2E6E" }}>{user.username}</div>
                                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>{user.email}</div>
                              </div>
                              <div
                                  style={{
                                      padding: "10px 16px",
                                      fontSize: 13,
                                      fontWeight: 600,
                                      color: "#D93025",
                                      cursor: "pointer",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 8,
                                  }}
                                  onClick={() => {
                                      if (loggingOut) return;
                                      onLogout();   // don't close the menu here
                                  }}
                              >
                                {loggingOut ? (
                                    <>
                                        <span style={{
                                            width: 14,
                                            height: 14,
                                            border: "2px solid rgba(10,46,110,0.2)",
                                            borderTop: "2px solid #0A2E6E",
                                            borderRadius: "50%",
                                            display: "inline-block",
                                            animation: "spin 0.7s linear infinite",
                                        }} />
                                        Signing out...
                                    </>
                                ) : "Sign Out"}
                              </div>
                          </div>
                      </>
                  )}
              </div>
          ) : (
              <button className="nav-btn-yellow" onClick={() => setModalOpen(true)}>
                  Sign In / Register
              </button>
          )}
        </div>

      </div>
    </nav>
  );
}
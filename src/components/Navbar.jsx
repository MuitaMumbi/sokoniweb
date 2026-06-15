// import { Link } from "react-router-dom";

// function Navbar({ page, setPage, setModalOpen, cartCount, setCartOpen, user, setUser }) {
//   return (
//     <nav className="nav">
//       <div className="nav-inner">
//         <div className="nav-logo" onClick={() => setPage("home")} style={{ cursor: "pointer" }}>
//           SOKONI<span>B2B</span>
//         </div>
//         <div className="nav-search">
//           <span className="nav-search-icon">🔍</span>
//           <input placeholder="Search products, brands, categories..." />
//         </div>
//         <div className="nav-links">
//           <Link to="/" className={`nav-link ${page === "home" ? "active" : ""}`} onClick={() => setPage("home")}>Home</Link>
//           <Link to="/products" className={`nav-link ${page === "products" ? "active" : ""}`} onClick={() => setPage("products")}>Products</Link>
//           {user && (
//             <Link to="/dashboard" className={`nav-link ${page === "dashboard" ? "active" : ""}`} onClick={() => setPage("dashboard")}>Dashboard</Link>
//           )}
//           <button className="nav-cart" onClick={() => {
//             if (!user) { setModalOpen(true); } else { setCartOpen(true); }
//           }}>
//             🛒
//             {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
//           </button>
//           {user ? (
//             <div className="nav-avatar" title={user.username} onClick={() => setUser(null)}>
//               {user.username[0].toUpperCase()}
//             </div>
//           ) : (
//             <button className="nav-btn-yellow" onClick={() => setModalOpen(true)}>Sign In / Register</button>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// src/components/Navbar.jsx

export default function Navbar({
  activePath,
  onNav,
  setModalOpen,
  cartCount,
  setCartOpen,
  user,
  setUser,
}) {
  return (
    <nav className="nav">
      <div className="nav-inner">

        {/* LOGO */}
        <div className="nav-logo" onClick={() => onNav("/")}>
          SOKONI<span>B2B</span>
        </div>

        {/* SEARCH */}
        <div className="nav-search">
          <span className="nav-search-icon">🔍</span>
          <input placeholder="Search products, brands, categories..." />
        </div>

        {/* LINKS */}
        <div className="nav-links">
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

          {/* CART */}
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

          {/* AUTH */}
          {user ? (
            <div
              className="nav-avatar"
              title={`Signed in as ${user.username} — click to sign out`}
              onClick={() => setUser(null)}
            >
              {user.username[0].toUpperCase()}
            </div>
          ) : (
            <button
              className="nav-btn-yellow"
              onClick={() => setModalOpen(true)}
            >
              Sign In / Register
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}
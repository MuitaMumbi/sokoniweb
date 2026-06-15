import { useState, useEffect } from "react";
import {
	BrowserRouter,
	Routes,
	Route,
	useNavigate,
	useLocation,
} from "react-router-dom";

import { css } from "./styles/globalStyles";

import Navbar from "./components/Navbar";
import CategoryBar from "./components/CategoryBar";
import CartSidebar from "./components/CartSidebar";
import Toast from "./components/Toast";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import DashboardPage from "./pages/DashboardPage";
import AuthModal from "./auth/AuthModal";

// ─── INNER APP (has access to router hooks) ───────────────────────────────────
function InnerApp() {
	const navigate = useNavigate();
	const location = useLocation();

	const [user, setUser] = useState(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [cartOpen, setCartOpen] = useState(false);
	const [cart, setCart] = useState([]);
	const [toast, setToast] = useState(null);
	const [activeCat, setActiveCat] = useState("all");

	function showToast(msg, type = "success") {
		setToast({ msg, type });
		setTimeout(() => setToast(null), 3200);
	}

	// If user logs out while on dashboard, redirect home
	useEffect(() => {
		if (!user && location.pathname === "/dashboard") {
			navigate("/");
			setModalOpen(true);
		}
	}, [user, location.pathname]);

	function handleSetUser(u) {
		setUser(u);
		if (u) navigate("/dashboard");
		else navigate("/");
	}

	function handleCatClick(cat) {
		setActiveCat(cat);
		navigate("/"); // always go home when a category is picked
	}

	return (
		<>
			{/* Inject all global CSS into the page */}
			<style>{css}</style>

			<Navbar
				activePath={location.pathname}
				onNav={navigate}
				setModalOpen={setModalOpen}
				cartCount={cart.length}
				setCartOpen={setCartOpen}
				user={user}
				setUser={handleSetUser}
			/>

			<CategoryBar activeCat={activeCat} setActiveCat={handleCatClick} />

			<Routes>
				<Route
					path="/"
					element={
						<HomePage
							user={user}
							setModalOpen={setModalOpen}
							cart={cart}
							setCart={setCart}
							showToast={showToast}
							activeCat={activeCat}
							setActiveCat={handleCatClick}
						/>
					}
				/>
				<Route
					path="/products"
					element={
						<ProductsPage
							user={user}
							cart={cart}
							setCart={setCart}
							showToast={showToast}
							setModalOpen={setModalOpen}
						/>
					}
				/>
				<Route
					path="/dashboard"
					element={
						user ? (
							<DashboardPage user={user} />
						) : null /* useEffect above will redirect */
					}
				/>
			</Routes>

			<Footer />

			{modalOpen && (
				<AuthModal
					setUser={handleSetUser}
					setModalOpen={setModalOpen}
					showToast={showToast}
				/>
			)}

			{/* Cart overlay backdrop */}
			{cartOpen && (
				<div
					style={{
						position: "fixed",
						inset: 0,
						background: "rgba(10,46,110,0.4)",
						zIndex: 290,
						backdropFilter: "blur(2px)",
					}}
					onClick={() => setCartOpen(false)}
				/>
			)}

			<CartSidebar
				open={cartOpen}
				setOpen={setCartOpen}
				cart={cart}
				setCart={setCart}
				showToast={showToast}
			/>

			<Toast toast={toast} />
		</>
	);
}

// ─── ROOT APP — wraps everything in BrowserRouter ─────────────────────────────
export default function App() {
	return (
		<BrowserRouter>
			<InnerApp />
		</BrowserRouter>
	);
}

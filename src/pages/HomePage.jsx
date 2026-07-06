import { useState, useEffect } from "react";
import { T } from "../styles/theme";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../api/product";

export default function HomePage({ user, setModalOpen, cart, setCart, showToast }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts({ limit: 8 }).then(data => {
            if (data) setProducts(data.products);
            setLoading(false);
        });
    }, []);

    return (
        <>
            {/* HERO */}
            <section className="hero">
                <div className="hero-inner">
                    <div className="hero-text">
                        <span className="hero-eyebrow">
                            🇰🇪 Trusted Wholesale Platform
                        </span>
                        <h1 className="hero-title">
                            East Africa's #1
                            <br />
                            <span>B2B Marketplace</span>
                            <br />
                            for Retailers
                        </h1>
                        <p className="hero-sub">
                            Stock your shelves faster. Order directly from
                            manufacturers and distributors — wholesale prices,
                            next-day delivery across Nairobi and beyond.
                        </p>
                        <div className="hero-cta-row">
                            {user ? (
                                <button
                                    className="btn-primary"
                                    onClick={() => navigate("/products")}
                                >
                                    Browse Products →
                                </button>
                            ) : (
                                <>
                                    <button
                                        className="btn-primary"
                                        onClick={() => setModalOpen(true)}
                                    >
                                        Get Started Free
                                    </button>
                                    <button
                                        className="btn-outline-white"
                                        onClick={() => navigate("/products")}
                                    >
                                        View Catalogue
                                    </button>
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
                            <div style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: 15, fontWeight: 700, color: T.yellow,
                            }}>
                                Next-day delivery
                            </div>
                            <div style={{ fontSize: 13, marginTop: 4 }}>
                                Nairobi & surrounding areas
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRUST BAR */}
            <div className="trust-bar">
                <div className="trust-bar-inner">
                    {[
                        "🚚 Free delivery over KES 10,000",
                        "📦 Wholesale prices",
                        "🔒 Secure payments",
                        "📞 Dedicated account manager",
                        "⭐ 50,000+ orders fulfilled",
                    ].map((t, i) => (
                        <div className="trust-item" key={i}>{t}</div>
                    ))}
                </div>
            </div>

            <div className="main-layout">

                {/* FEATURED PRODUCTS
                <div className="section-header">
                    <h2 className="section-title">
                        Featured <span>Products</span>
                    </h2>
                    <span
                        onClick={() => navigate("/products")}
                        style={{
                            fontSize: 14, color: T.blueLight,
                            fontWeight: 600, cursor: "pointer",
                        }}
                    >
                        View all →
                    </span>
                </div>

                {loading ? (
                    <Spinner fullPage text="Loading products..." />
                ) : products.length === 0 ? (
                    <div style={{ textAlign: "center", padding: 40, color: T.gray500 }}>
                        No products available yet.
                    </div>
                ) : (
                    <div className="product-grid">
                        {products.map(p => (
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
                )} */}

                {/* ABOUT SECTION */}
                <section id="about" style={{
                    margin: "64px 0 0",
                    padding: "56px 0",
                    borderTop: `1px solid ${T.gray100}`,
                }}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 48, alignItems: "center",
                    }}>
                        <div>
                            <h2 style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: 32, fontWeight: 800,
                                color: T.blue, marginBottom: 16, lineHeight: 1.2,
                            }}>
                                About <span style={{ color: T.yellow }}>Sokoni</span>
                            </h2>
                            <p style={{
                                fontSize: 15, color: T.gray500,
                                lineHeight: 1.8, marginBottom: 16,
                            }}>
                                Sokoni is an intelligent B2B supply chain platform built for East Africa's wholesale and retail ecosystem. We connect suppliers, distributors, and retailers through a single digital platform — eliminating inefficiencies and bringing transparency to the supply chain.
                            </p>
                            <p style={{
                                fontSize: 15, color: T.gray500, lineHeight: 1.8,
                            }}>
                                Founded in Nairobi, we serve supermarkets, wholesalers, and growing retail businesses across Kenya, Tanzania, Uganda, Rwanda, and Ethiopia. Our platform enables real-time inventory tracking, automated purchase orders, and next-day delivery logistics.
                            </p>
                        </div>
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 16,
                        }}>
                            {[
                                { icon: "🏪", title: "12,000+", sub: "Active Retailers" },
                                { icon: "🏭", title: "500+", sub: "Verified Suppliers" },
                                { icon: "📦", title: "240+", sub: "Product SKUs" },
                                { icon: "🌍", title: "5", sub: "Countries Served" },
                            ].map(({ icon, title, sub }) => (
                                <div key={sub} style={{
                                    background: "#f8f9fc", borderRadius: 14,
                                    padding: 24, textAlign: "center",
                                }}>
                                    <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
                                    <div style={{
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        fontSize: 24, fontWeight: 800, color: T.blue,
                                    }}>
                                        {title}
                                    </div>
                                    <div style={{ fontSize: 13, color: T.gray500, marginTop: 4 }}>
                                        {sub}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* DELIVERY INFO SECTION */}
                <section id="delivery" style={{
                    margin: "0",
                    padding: "56px 0",
                    borderTop: `1px solid ${T.gray100}`,
                }}>
                    <h2 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 32, fontWeight: 800,
                        color: T.blue, marginBottom: 8, textAlign: "center",
                    }}>
                        Delivery <span style={{ color: T.yellow }}>Information</span>
                    </h2>
                    <p style={{
                        textAlign: "center", color: T.gray500,
                        fontSize: 15, marginBottom: 40,
                    }}>
                        Fast, reliable wholesale delivery across East Africa.
                    </p>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 20, marginBottom: 40,
                    }}>
                        {[
                            {
                                icon: "🚚",
                                title: "Next-Day Delivery",
                                desc: "Orders placed before 2PM are delivered the next business day within Nairobi and surrounding areas.",
                            },
                            {
                                icon: "📦",
                                title: "Minimum Order",
                                desc: "Minimum order values apply per product category. Wholesale quantities ensure the best pricing for your business.",
                            },
                            {
                                icon: "🆓",
                                title: "Free Delivery",
                                desc: "Free delivery on all orders above KES 10,000. A flat delivery fee of KES 500 applies to smaller orders.",
                            },
                            {
                                icon: "🌍",
                                title: "Regional Coverage",
                                desc: "We deliver across Kenya with extended coverage to Tanzania, Uganda, Rwanda, and Ethiopia for bulk orders.",
                            },
                            {
                                icon: "⏱️",
                                title: "Delivery Windows",
                                desc: "Choose morning (8AM–12PM) or afternoon (1PM–6PM) delivery windows at checkout.",
                            },
                            {
                                icon: "📍",
                                title: "Real-Time Tracking",
                                desc: "Track your order from warehouse to doorstep with live updates via your Sokoni dashboard.",
                            },
                        ].map(({ icon, title, desc }) => (
                            <div key={title} style={{
                                background: "white", borderRadius: 14,
                                padding: 24,
                                boxShadow: "0 2px 8px rgba(10,46,110,0.06)",
                            }}>
                                <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
                                <div style={{
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    fontWeight: 800, fontSize: 15,
                                    color: T.blue, marginBottom: 8,
                                }}>
                                    {title}
                                </div>
                                <div style={{ fontSize: 13, color: T.gray500, lineHeight: 1.7 }}>
                                    {desc}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Delivery zones table */}
                    <div style={{
                        background: "white", borderRadius: 14, overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(10,46,110,0.06)",
                    }}>
                        <div style={{
                            background: T.blue, padding: "16px 24px",
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontWeight: 800, fontSize: 15, color: "white",
                        }}>
                            Delivery Zones & Timelines
                        </div>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ background: "#f8f9fc" }}>
                                    {["Zone", "Area", "Lead Time", "Min. Order"].map(h => (
                                        <th key={h} style={{
                                            padding: "12px 20px", textAlign: "left",
                                            fontSize: 13, fontWeight: 700, color: T.gray500,
                                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ["Zone 1", "Nairobi CBD & Westlands", "Next day", "KES 5,000"],
                                    ["Zone 2", "Greater Nairobi", "1–2 days", "KES 8,000"],
                                    ["Zone 3", "Central & Rift Valley", "2–3 days", "KES 15,000"],
                                    ["Zone 4", "Coast & Western Kenya", "3–4 days", "KES 20,000"],
                                    ["Zone 5", "Tanzania, Uganda, Rwanda", "5–7 days", "KES 50,000"],
                                ].map(([zone, area, time, min], i) => (
                                    <tr key={zone} style={{
                                        borderTop: `1px solid ${T.gray100}`,
                                        background: i % 2 === 0 ? "white" : "#fafbfd",
                                    }}>
                                        <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 700, color: T.blue }}>{zone}</td>
                                        <td style={{ padding: "12px 20px", fontSize: 14, color: T.gray500 }}>{area}</td>
                                        <td style={{ padding: "12px 20px", fontSize: 14, color: T.gray500 }}>{time}</td>
                                        <td style={{ padding: "12px 20px", fontSize: 14, fontWeight: 600, color: T.blue }}>{min}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* CONTACT SECTION */}
                <section id="contact" style={{
                    padding: "56px 0 80px",
                    borderTop: `1px solid ${T.gray100}`,
                }}>
                    <h2 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 32, fontWeight: 800,
                        color: T.blue, marginBottom: 8, textAlign: "center",
                    }}>
                        Contact <span style={{ color: T.yellow }}>Us</span>
                    </h2>
                    <p style={{
                        textAlign: "center", color: T.gray500,
                        fontSize: 15, marginBottom: 40,
                    }}>
                        Our team is available Monday–Friday, 8AM–6PM EAT.
                    </p>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 24,
                    }}>
                        {/* Contact details */}
                        <div style={{
                            background: "white", borderRadius: 14,
                            padding: 32,
                            boxShadow: "0 2px 8px rgba(10,46,110,0.06)",
                        }}>
                            <h3 style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: 18, fontWeight: 800,
                                color: T.blue, marginBottom: 24,
                            }}>
                                Get In Touch
                            </h3>
                            {[
                                { icon: "📧", label: "Email", value: "hello@sokoni.co.ke" },
                                { icon: "📞", label: "Phone", value: "+254 700 000 000" },
                                { icon: "💬", label: "WhatsApp", value: "+254 700 000 000" },
                                { icon: "📍", label: "Address", value: "Westlands, Nairobi, Kenya" },
                                { icon: "🕐", label: "Hours", value: "Mon–Fri, 8AM–6PM EAT" },
                            ].map(({ icon, label, value }) => (
                                <div key={label} style={{
                                    display: "flex", alignItems: "center", gap: 16,
                                    padding: "12px 0",
                                    borderBottom: `1px solid ${T.gray100}`,
                                }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 10,
                                        background: "#f0f2f8",
                                        display: "flex", alignItems: "center",
                                        justifyContent: "center", fontSize: 18, flexShrink: 0,
                                    }}>
                                        {icon}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 12, color: T.gray500, marginBottom: 2 }}>
                                            {label}
                                        </div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: T.blue }}>
                                            {value}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Contact form */}
                        <div style={{
                            background: "white", borderRadius: 14,
                            padding: 32,
                            boxShadow: "0 2px 8px rgba(10,46,110,0.06)",
                        }}>
                            <h3 style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: 18, fontWeight: 800,
                                color: T.blue, marginBottom: 24,
                            }}>
                                Send a Message
                            </h3>
                            {[
                                { label: "Your Name", placeholder: "Jane Wanjiru", type: "text" },
                                { label: "Email Address", placeholder: "jane@yourshop.co.ke", type: "email" },
                                { label: "Phone Number", placeholder: "07XXXXXXXX", type: "tel" },
                                { label: "Business Name", placeholder: "Wanjiru Wholesalers", type: "text" },
                            ].map(({ label, placeholder, type }) => (
                                <div key={label} style={{ marginBottom: 14 }}>
                                    <label style={{
                                        display: "block", fontSize: 13,
                                        fontWeight: 600, color: T.gray500, marginBottom: 6,
                                    }}>
                                        {label}
                                    </label>
                                    <input
                                        type={type}
                                        placeholder={placeholder}
                                        style={{
                                            width: "100%", padding: "10px 14px",
                                            border: `1.5px solid ${T.gray100}`,
                                            borderRadius: 8, fontSize: 14,
                                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                                            color: T.blue, boxSizing: "border-box",
                                            outline: "none",
                                        }}
                                        onFocus={e => e.target.style.borderColor = T.blue}
                                        onBlur={e => e.target.style.borderColor = T.gray100}
                                    />
                                </div>
                            ))}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{
                                    display: "block", fontSize: 13,
                                    fontWeight: 600, color: T.gray500, marginBottom: 6,
                                }}>
                                    Message
                                </label>
                                <textarea
                                    placeholder="Tell us how we can help..."
                                    rows={4}
                                    style={{
                                        width: "100%", padding: "10px 14px",
                                        border: `1.5px solid ${T.gray100}`,
                                        borderRadius: 8, fontSize: 14,
                                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                                        color: T.blue, boxSizing: "border-box",
                                        resize: "vertical", outline: "none",
                                    }}
                                    onFocus={e => e.target.style.borderColor = T.blue}
                                    onBlur={e => e.target.style.borderColor = T.gray100}
                                />
                            </div>
                            <button
                                style={{
                                    width: "100%", background: T.blue,
                                    color: "white", border: "none", borderRadius: 10,
                                    padding: "13px 0", fontSize: 15,
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    fontWeight: 700, cursor: "pointer",
                                }}
                                onClick={() => alert("Message sent! We'll get back to you within 24 hours.")}
                            >
                                Send Message →
                            </button>
                        </div>
                    </div>
                </section>

                {/* CTA BANNER */}
                {!user && (
                    <div style={{
                        background: `linear-gradient(120deg, ${T.blue} 0%, ${T.blueLight} 100%)`,
                        borderRadius: 20, padding: "40px 48px",
                        display: "flex", alignItems: "center",
                        justifyContent: "space-between",
                        gap: 24, flexWrap: "wrap", marginBottom: 48,
                    }}>
                        <div>
                            <h3 style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                fontSize: 24, fontWeight: 800,
                                color: T.white, marginBottom: 8,
                            }}>
                                Ready to stock smarter?
                            </h3>
                            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15 }}>
                                Join 12,000+ retailers already ordering on Sokoni. Free to register.
                            </p>
                        </div>
                        <button
                            className="btn-primary"
                            style={{ fontSize: 16, padding: "14px 32px" }}
                            onClick={() => setModalOpen(true)}
                        >
                            Create Free Account →
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
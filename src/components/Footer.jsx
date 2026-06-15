function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">SOKONI<span>B2B</span></div>
            <p className="footer-desc">East Africa's leading B2B wholesale marketplace. Connecting retailers with manufacturers and distributors for faster, smarter stock replenishment.</p>
            <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
              {["📘","🐦","📷","▶️"].map((icon, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{icon}</div>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-heading">Company</div>
            {["About Us","How It Works","Careers","Press","Blog"].map(l => <span key={l} className="footer-link">{l}</span>)}
          </div>
          <div>
            <div className="footer-heading">Support</div>
            {["Help Centre","Contact Us","Delivery Info","Returns Policy","FAQs"].map(l => <span key={l} className="footer-link">{l}</span>)}
          </div>
          <div>
            <div className="footer-heading">Contact</div>
            <span className="footer-link">📞 +254 700 000 000</span>
            <span className="footer-link">✉️ hello@sokoni.co.ke</span>
            <span className="footer-link">📍 Westlands, Nairobi</span>
            <div style={{ marginTop: 16 }}>
              <div className="footer-heading">Download App</div>
              <span className="footer-link">📱 App Store</span>
              <span className="footer-link">🤖 Google Play</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2025 Sokoni B2B Limited. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy","Terms of Service","Cookie Policy"].map(l => (
              <span key={l} style={{ fontSize: 12, cursor: "pointer" }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
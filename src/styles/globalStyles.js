import { T } from "./theme";

export const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: ${T.offWhite}; color: ${T.gray700}; }
  button { cursor: pointer; border: none; outline: none; font-family: inherit; }
  input, select, textarea { font-family: inherit; outline: none; }
  a { text-decoration: none; color: inherit; }
 
  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${T.gray100}; }
  ::-webkit-scrollbar-thumb { background: ${T.gray300}; border-radius: 3px; }
 
  /* NAVBAR */
  .nav { position: sticky; top: 0; z-index: 100; background: ${T.blue}; box-shadow: 0 2px 16px rgba(10,46,110,0.18); }
  .nav-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; gap: 16px; height: 64px; }
  .nav-logo { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 26px; color: ${T.yellow}; letter-spacing: -0.5px; margin-right: 8px; flex-shrink: 0; }
  .nav-logo span { color: ${T.white}; }
  .nav-search { flex: 1; max-width: 440px; position: relative; }
  .nav-search input { width: 100%; padding: 9px 16px 9px 40px; border-radius: 8px; border: none; background: rgba(255,255,255,0.12); color: ${T.white}; font-size: 14px; }
  .nav-search input::placeholder { color: rgba(255,255,255,0.5); }
  .nav-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.5); font-size: 16px; }
  .nav-links { display: flex; align-items: center; gap: 4px; margin-left: auto; }
  .nav-link { padding: 8px 14px; border-radius: 6px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.8); transition: all 0.15s; }
  .nav-link:hover, .nav-link.active { background: rgba(255,255,255,0.12); color: ${T.white}; }
  .nav-btn-yellow { background: ${T.yellow}; color: ${T.blue}; font-weight: 700; font-size: 14px; padding: 8px 18px; border-radius: 6px; transition: background 0.15s; }
  .nav-btn-yellow:hover { background: ${T.yellowDark}; }
  .nav-cart { position: relative; padding: 8px 14px; color: rgba(255,255,255,0.8); font-size: 20px; }
  .nav-cart-badge { position: absolute; top: 2px; right: 6px; background: ${T.yellow}; color: ${T.blue}; font-size: 10px; font-weight: 800; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .nav-avatar { width: 34px; height: 34px; border-radius: 50%; background: ${T.yellow}; color: ${T.blue}; font-weight: 800; font-size: 14px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
 
  /* CATEGORY BAR */
  .cat-bar { background: ${T.blueMid}; overflow-x: auto; scrollbar-width: none; }
  .cat-bar::-webkit-scrollbar { display: none; }
  .cat-bar-inner { max-width: 1280px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; gap: 4px; height: 44px; }
  .cat-pill { padding: 5px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.75); white-space: nowrap; cursor: pointer; transition: all 0.15s; }
  .cat-pill:hover, .cat-pill.active { background: ${T.yellow}; color: ${T.blue}; font-weight: 700; }
 
  /* HERO */
  .hero { background: linear-gradient(120deg, ${T.blue} 0%, ${T.blueMid} 60%, ${T.blueLight} 100%); padding: 64px 24px; position: relative; overflow: hidden; }
  .hero::after { content: ''; position: absolute; right: -80px; top: -80px; width: 420px; height: 420px; background: ${T.yellow}; opacity: 0.07; border-radius: 50%; }
  .hero-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; gap: 48px; }
  .hero-text { flex: 1; position: relative; z-index: 1; }
  .hero-eyebrow { display: inline-block; background: ${T.yellow}; color: ${T.blue}; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 4px; letter-spacing: 0.5px; margin-bottom: 16px; text-transform: uppercase; }
  .hero-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: clamp(32px, 4vw, 52px); font-weight: 800; color: ${T.white}; line-height: 1.1; margin-bottom: 16px; }
  .hero-title span { color: ${T.yellow}; }
  .hero-sub { font-size: 17px; color: rgba(255,255,255,0.75); line-height: 1.6; max-width: 460px; margin-bottom: 32px; }
  .hero-cta-row { display: flex; gap: 12px; flex-wrap: wrap; }
  .btn-primary { background: ${T.yellow}; color: ${T.blue}; font-weight: 700; font-size: 15px; padding: 13px 28px; border-radius: 8px; transition: all 0.15s; display: inline-block; }
  .btn-primary:hover { background: ${T.yellowDark}; transform: translateY(-1px); }
  .btn-outline-white { background: transparent; border: 2px solid rgba(255,255,255,0.4); color: ${T.white}; font-weight: 600; font-size: 15px; padding: 11px 28px; border-radius: 8px; transition: all 0.15s; }
  .btn-outline-white:hover { border-color: ${T.white}; background: rgba(255,255,255,0.08); }
  .hero-stats { display: flex; gap: 32px; margin-top: 40px; }
  .hero-stat-num { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; font-weight: 800; color: ${T.yellow}; }
  .hero-stat-label { font-size: 13px; color: rgba(255,255,255,0.6); margin-top: 2px; }
  .hero-graphic { flex-shrink: 0; width: 340px; height: 260px; background: rgba(255,255,255,0.06); border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; }
 
  /* TRUST BAR */
  .trust-bar { background: ${T.yellow}; padding: 14px 24px; }
  .trust-bar-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-around; gap: 24px; flex-wrap: wrap; }
  .trust-item { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: ${T.blue}; }
 
  /* MAIN LAYOUT */
  .main-layout { max-width: 1280px; margin: 0 auto; padding: 40px 24px; }
 
  /* SECTION HEADER */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .section-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 22px; font-weight: 800; color: ${T.blue}; }
  .section-title span { color: ${T.blueLight}; }
  .see-all { font-size: 14px; font-weight: 600; color: ${T.blueLight}; cursor: pointer; }
  .see-all:hover { color: ${T.blue}; }
 
  /* CATEGORY CARDS */
  .cat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px; margin-bottom: 48px; }
  .cat-card { background: ${T.white}; border-radius: 14px; padding: 20px 16px; text-align: center; cursor: pointer; border: 2px solid transparent; transition: all 0.18s; box-shadow: 0 2px 8px rgba(10,46,110,0.06); }
  .cat-card:hover, .cat-card.active { border-color: ${T.yellow}; box-shadow: 0 4px 20px rgba(10,46,110,0.12); transform: translateY(-2px); }
  .cat-icon { font-size: 32px; margin-bottom: 10px; }
  .cat-name { font-size: 13px; font-weight: 600; color: ${T.blue}; }
  .cat-count { font-size: 11px; color: ${T.gray500}; margin-top: 3px; }
 
  /* PRODUCT GRID */
  .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; margin-bottom: 48px; }
  .product-card { background: ${T.white}; border-radius: 14px; overflow: hidden; border: 1px solid ${T.gray100}; box-shadow: 0 2px 8px rgba(10,46,110,0.05); transition: all 0.18s; display: flex; flex-direction: column; }
  .product-card:hover { box-shadow: 0 8px 28px rgba(10,46,110,0.12); transform: translateY(-3px); }
  .product-img { height: 160px; background: ${T.gray100}; display: flex; align-items: center; justify-content: center; font-size: 56px; position: relative; }
  .product-badge { position: absolute; top: 10px; left: 10px; background: ${T.yellow}; color: ${T.blue}; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 4px; }
  .product-body { padding: 14px; flex: 1; display: flex; flex-direction: column; }
  .product-cat { font-size: 11px; font-weight: 600; color: ${T.blueLight}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .product-name { font-size: 14px; font-weight: 700; color: ${T.blue}; margin-bottom: 6px; line-height: 1.3; }
  .product-sku { font-size: 11px; color: ${T.gray500}; margin-bottom: 10px; }
  .product-price-row { display: flex; align-items: baseline; gap: 6px; margin-bottom: 12px; margin-top: auto; }
  .product-price { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: 800; color: ${T.blue}; }
  .product-unit { font-size: 12px; color: ${T.gray500}; }
  .product-moq { font-size: 11px; color: ${T.gray500}; margin-bottom: 12px; }
  .product-add-btn { width: 100%; padding: 10px; border-radius: 8px; background: ${T.blue}; color: ${T.white}; font-size: 13px; font-weight: 700; transition: all 0.15s; }
  .product-add-btn:hover { background: ${T.blueLight}; }
  .product-add-btn.locked { background: ${T.gray300}; color: ${T.gray500}; cursor: default; }
  .product-qty-row { display: flex; align-items: center; gap: 8px; }
  .qty-btn { width: 30px; height: 30px; border-radius: 6px; background: ${T.gray100}; color: ${T.blue}; font-size: 18px; font-weight: 700; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; }
  .qty-btn:hover { background: ${T.yellow}; }
  .qty-num { font-size: 15px; font-weight: 700; color: ${T.blue}; min-width: 24px; text-align: center; }
 
  /* MODAL OVERLAY */
  .overlay { position: fixed; inset: 0; background: rgba(10,46,110,0.55); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 16px; }
  .modal { background: ${T.white}; border-radius: 20px; width: 100%; max-width: 440px; overflow: hidden; box-shadow: 0 24px 80px rgba(10,46,110,0.22); }
  .modal-header { background: ${T.blue}; padding: 28px 32px 24px; text-align: center; }
  .modal-logo { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 28px; color: ${T.yellow}; }
  .modal-logo span { color: ${T.white}; }
  .modal-tagline { font-size: 13px; color: rgba(255,255,255,0.6); margin-top: 4px; }
  .modal-body { padding: 28px 32px; }
  .modal-tabs { display: flex; border-bottom: 2px solid ${T.gray100}; margin-bottom: 24px; }
  .modal-tab { flex: 1; padding: 10px; text-align: center; font-size: 14px; font-weight: 600; color: ${T.gray500}; cursor: pointer; border-bottom: 3px solid transparent; margin-bottom: -2px; transition: all 0.15s; }
  .modal-tab.active { color: ${T.blue}; border-bottom-color: ${T.yellow}; }
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 12px; font-weight: 600; color: ${T.gray700}; margin-bottom: 6px; display: block; text-transform: uppercase; letter-spacing: 0.5px; }
  .form-input { width: 100%; padding: 11px 14px; border-radius: 8px; border: 1.5px solid ${T.gray300}; font-size: 14px; color: ${T.gray700}; transition: border-color 0.15s; background: ${T.offWhite}; }
  .form-input:focus { border-color: ${T.blueLight}; background: ${T.white}; }
  .form-input.error { border-color: ${T.danger}; }
  .form-error { font-size: 12px; color: ${T.danger}; margin-top: 4px; }
  .form-hint { font-size: 12px; color: ${T.gray500}; margin-top: 4px; }
  .btn-full { width: 100%; padding: 13px; border-radius: 8px; background: ${T.blue}; color: ${T.white}; font-size: 15px; font-weight: 700; transition: background 0.15s; margin-top: 4px; }
  .btn-full:hover { background: ${T.blueLight}; }
  .btn-full.yellow { background: ${T.yellow}; color: ${T.blue}; }
  .btn-full.yellow:hover { background: ${T.yellowDark}; }
  .divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
  .divider hr { flex: 1; border: none; border-top: 1px solid ${T.gray100}; }
  .divider span { font-size: 12px; color: ${T.gray500}; font-weight: 500; }
  .otp-row { display: flex; gap: 10px; justify-content: center; margin: 20px 0; }
  .otp-input { width: 48px; height: 52px; border-radius: 8px; border: 2px solid ${T.gray300}; font-size: 22px; font-weight: 800; text-align: center; color: ${T.blue}; transition: border-color 0.15s; }
  .otp-input:focus { border-color: ${T.blueLight}; }
  .modal-close { position: absolute; top: 16px; right: 20px; color: rgba(255,255,255,0.6); font-size: 22px; cursor: pointer; background: none; }
  .modal-close:hover { color: ${T.white}; }
  .modal-header-wrap { position: relative; }
  .success-icon { width: 64px; height: 64px; border-radius: 50%; background: ${T.success}; color: ${T.white}; font-size: 30px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
 
  /* CART SIDEBAR */
  .cart-sidebar { position: fixed; right: 0; top: 0; bottom: 0; width: 380px; background: ${T.white}; box-shadow: -8px 0 40px rgba(10,46,110,0.15); z-index: 300; display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.28s cubic-bezier(0.4,0,0.2,1); }
  .cart-sidebar.open { transform: translateX(0); }
  .cart-header { background: ${T.blue}; padding: 20px 24px; display: flex; align-items: center; justify-content: space-between; }
  .cart-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: 800; color: ${T.white}; }
  .cart-close { color: rgba(255,255,255,0.7); font-size: 22px; background: none; }
  .cart-close:hover { color: ${T.white}; }
  .cart-body { flex: 1; overflow-y: auto; padding: 20px 24px; }
  .cart-empty { text-align: center; padding: 60px 20px; color: ${T.gray500}; }
  .cart-empty-icon { font-size: 48px; margin-bottom: 12px; }
  .cart-item { display: flex; gap: 12px; padding: 14px 0; border-bottom: 1px solid ${T.gray100}; }
  .cart-item-img { width: 56px; height: 56px; border-radius: 8px; background: ${T.gray100}; display: flex; align-items: center; justify-content: center; font-size: 26px; flex-shrink: 0; }
  .cart-item-info { flex: 1; }
  .cart-item-name { font-size: 13px; font-weight: 700; color: ${T.blue}; margin-bottom: 3px; }
  .cart-item-price { font-size: 13px; font-weight: 600; color: ${T.blueLight}; }
  .cart-item-remove { color: ${T.danger}; font-size: 18px; background: none; align-self: flex-start; padding: 0 4px; }
  .cart-footer { padding: 20px 24px; border-top: 1px solid ${T.gray100}; }
  .cart-total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .cart-total-label { font-size: 14px; color: ${T.gray500}; }
  .cart-total-amount { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 22px; font-weight: 800; color: ${T.blue}; }
 
  /* DASHBOARD */
  .dashboard { max-width: 1280px; margin: 0 auto; padding: 40px 24px; }
  .dash-welcome { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 26px; font-weight: 800; color: ${T.blue}; margin-bottom: 4px; }
  .dash-sub { font-size: 14px; color: ${T.gray500}; margin-bottom: 32px; }
  .dash-kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
  .kpi-card { background: ${T.white}; border-radius: 14px; padding: 20px 22px; border-left: 4px solid ${T.yellow}; box-shadow: 0 2px 8px rgba(10,46,110,0.06); }
  .kpi-card.blue-border { border-left-color: ${T.blueLight}; }
  .kpi-label { font-size: 12px; font-weight: 600; color: ${T.gray500}; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
  .kpi-value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; font-weight: 800; color: ${T.blue}; }
  .kpi-change { font-size: 12px; color: ${T.success}; margin-top: 4px; }
  .dash-orders-table { background: ${T.white}; border-radius: 14px; padding: 24px; box-shadow: 0 2px 8px rgba(10,46,110,0.06); margin-bottom: 32px; overflow-x: auto; }
  .table { width: 100%; border-collapse: collapse; }
  .table th { text-align: left; font-size: 12px; font-weight: 700; color: ${T.gray500}; text-transform: uppercase; letter-spacing: 0.5px; padding: 10px 12px; border-bottom: 2px solid ${T.gray100}; }
  .table td { padding: 12px 12px; font-size: 14px; color: ${T.gray700}; border-bottom: 1px solid ${T.gray100}; }
  .table tr:last-child td { border-bottom: none; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .badge-delivered { background: #D4EDDA; color: ${T.success}; }
  .badge-processing { background: #FFF3CD; color: #856404; }
  .badge-pending { background: ${T.gray100}; color: ${T.gray500}; }
 
  /* FOOTER */
  .footer { background: ${T.blue}; color: rgba(255,255,255,0.7); padding: 48px 24px 24px; margin-top: 64px; }
  .footer-inner { max-width: 1280px; margin: 0 auto; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 40px; }
  .footer-logo { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; font-weight: 800; color: ${T.yellow}; margin-bottom: 12px; }
  .footer-logo span { color: ${T.white}; }
  .footer-desc { font-size: 13px; line-height: 1.7; }
  .footer-heading { font-size: 13px; font-weight: 700; color: ${T.white}; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
  .footer-link { display: block; font-size: 13px; margin-bottom: 8px; cursor: pointer; }
  .footer-link:hover { color: ${T.yellow}; }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
  .footer-copy { font-size: 12px; }
 
  /* TOAST */
  .toast { position: fixed; bottom: 28px; right: 28px; background: ${T.blue}; color: ${T.white}; padding: 14px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; z-index: 500; box-shadow: 0 8px 32px rgba(10,46,110,0.22); display: flex; align-items: center; gap: 10px; animation: slideIn 0.25s ease; }
  .toast.success { border-left: 4px solid ${T.success}; }
  .toast.warn { border-left: 4px solid ${T.yellow}; }
  @keyframes slideIn { from { transform: translateX(80px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
 
  /* PRODUCTS PAGE */
  .products-page { max-width: 1280px; margin: 0 auto; padding: 40px 24px; }
  .filters-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; flex-wrap: wrap; }
  .filter-select { padding: 9px 14px; border-radius: 8px; border: 1.5px solid ${T.gray300}; font-size: 14px; color: ${T.gray700}; background: ${T.white}; }
  .search-box { flex: 1; min-width: 220px; padding: 9px 14px; border-radius: 8px; border: 1.5px solid ${T.gray300}; font-size: 14px; }
  .search-box:focus { border-color: ${T.blueLight}; }
 
  /* RESPONSIVE */
  @media (max-width: 768px) {
    .hero-graphic { display: none; }
    .hero-inner { flex-direction: column; }
    .hero-stats { gap: 16px; }
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 24px; }
    .cat-grid { grid-template-columns: repeat(3, 1fr); }
    .nav-search { display: none; }
    .cart-sidebar { width: 100%; }
  }
`;

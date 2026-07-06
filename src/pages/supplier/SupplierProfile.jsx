import { useEffect, useState } from "react";
import { T } from "../../styles/theme";
import { fetchSupplierProfile, saveSupplierProfile } from "../../api/supplier";

export default function SupplierProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [form, setForm] = useState({
        company_name: "",
        business_reg_number: "",
        kra_pin: "",
        vat_number: "",
        contact_person: "",
        phone: "",
        business_address: "",
        warehouse_address: "",
        bank_name: "",
        bank_account_number: "",
        bank_account_name: "",
        mpesa_number: "",
        mpesa_name: "",
    });

    useEffect(() => {
        fetchSupplierProfile().then(data => {
            if (data?.profile) {
                setProfile(data.profile);
                setForm(f => ({ ...f, ...data.profile }));
            }
            setLoading(false);
        });
    }, []);

    function handleChange(e) {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    }

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        const data = await saveSupplierProfile(form);
        setSaving(false);
        if (data?.message) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    }

    if (loading) return <div style={{ color: T.blue, padding: 40 }}>Loading profile...</div>;

    const Section = ({ title, children }) => (
        <div style={{
            background: "white", borderRadius: 14,
            padding: 24, marginBottom: 20,
            boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
        }}>
            <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 15, fontWeight: 800,
                color: T.blue, marginBottom: 20,
                paddingBottom: 12,
                borderBottom: `1px solid ${T.gray100}`,
            }}>
                {title}
            </h3>
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
            }}>
                {children}
            </div>
        </div>
    );

    const Field = ({ label, name, required, placeholder }) => (
        <div>
            <label style={{
                display: "block", fontSize: 13,
                fontWeight: 600, color: T.gray500,
                marginBottom: 6,
            }}>
                {label} {required && <span style={{ color: "red" }}>*</span>}
            </label>
            <input
                name={name}
                value={form[name] || ""}
                onChange={handleChange}
                placeholder={placeholder || label}
                style={{
                    width: "100%", padding: "10px 14px",
                    border: `1.5px solid ${T.gray100}`,
                    borderRadius: 8, fontSize: 14,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: T.blue, outline: "none",
                    boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = T.blue}
                onBlur={e => e.target.style.borderColor = T.gray100}
            />
        </div>
    );

    const TextArea = ({ label, name, required }) => (
        <div style={{ gridColumn: "1 / -1" }}>
            <label style={{
                display: "block", fontSize: 13,
                fontWeight: 600, color: T.gray500, marginBottom: 6,
            }}>
                {label} {required && <span style={{ color: "red" }}>*</span>}
            </label>
            <textarea
                name={name}
                value={form[name] || ""}
                onChange={handleChange}
                rows={3}
                style={{
                    width: "100%", padding: "10px 14px",
                    border: `1.5px solid ${T.gray100}`,
                    borderRadius: 8, fontSize: 14,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: T.blue, outline: "none",
                    resize: "vertical", boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = T.blue}
                onBlur={e => e.target.style.borderColor = T.gray100}
            />
        </div>
    );

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 24, fontWeight: 800, color: T.blue, marginBottom: 4,
                }}>
                    Business Profile
                </h1>
                <p style={{ color: T.gray500, fontSize: 14 }}>
                    Complete your business details to activate your supplier account.
                </p>
            </div>

            {/* Completion status */}
            <div style={{
                background: profile?.is_complete ? "#d4edda" : "#fff3cd",
                border: `1px solid ${profile?.is_complete ? "#c3e6cb" : "#ffeeba"}`,
                borderRadius: 10, padding: "12px 20px",
                marginBottom: 24, fontSize: 14,
                color: profile?.is_complete ? "#155724" : "#856404",
                fontWeight: 600,
            }}>
                {profile?.is_complete
                    ? "✅ Profile complete — your account is fully set up."
                    : "⚠️ Profile incomplete — please fill in all required fields."}
            </div>

            <form onSubmit={handleSave}>
                <Section title="🏢 Business Information">
                    <Field label="Company Name" name="company_name" required />
                    <Field label="Business Reg. Number" name="business_reg_number" placeholder="CPR/2021/XXXX" />
                    <Field label="KRA PIN" name="kra_pin" required placeholder="A001234567B" />
                    <Field label="VAT Number" name="vat_number" placeholder="Optional" />
                    <Field label="Contact Person" name="contact_person" required />
                    <Field label="Phone" name="phone" required placeholder="07XXXXXXXX" />
                    <TextArea label="Business Address" name="business_address" required />
                    <TextArea label="Warehouse Address" name="warehouse_address" />
                </Section>

                <Section title="🏦 Bank Details">
                    <Field label="Bank Name" name="bank_name" placeholder="e.g. KCB Bank" />
                    <Field label="Account Number" name="bank_account_number" />
                    <Field label="Account Name" name="bank_account_name" />
                </Section>

                <Section title="📱 Mobile Money">
                    <Field label="M-Pesa Number" name="mpesa_number" placeholder="07XXXXXXXX" />
                    <Field label="M-Pesa Name" name="mpesa_name" />
                </Section>

                <button
                    type="submit"
                    disabled={saving}
                    style={{
                        background: T.blue, color: "white",
                        border: "none", borderRadius: 10,
                        padding: "14px 32px", fontSize: 15,
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
                        opacity: saving ? 0.7 : 1,
                        transition: "opacity 0.2s",
                    }}
                >
                    {saving ? "Saving..." : "Save Profile"}
                </button>

                {saved && (
                    <span style={{
                        marginLeft: 16, color: "#155724",
                        fontWeight: 600, fontSize: 14,
                    }}>
                        ✅ Saved successfully!
                    </span>
                )}
            </form>
        </div>
    );
}
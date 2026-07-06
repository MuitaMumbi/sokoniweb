import { useEffect, useState } from "react";
import { T } from "../../styles/theme";
import Spinner from "../../components/Spinner";
import { fetchRetailerProfile, updateRetailerProfile } from "../../api/retailer";

export default function RetailerProfile({ user, setUser }) {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        username: "",
        phone: "",
        business_name: "",
        country: "Kenya",
    });

    useEffect(() => {
        fetchRetailerProfile().then(data => {
            if (data?.profile) {
                setProfile(data.profile);
                setForm({
                    username: data.profile.username || "",
                    phone: data.profile.phone || "",
                    business_name: data.profile.business_name || "",
                    country: data.profile.country || "Kenya",
                });
            }
            setLoading(false);
        });
    }, []);

    async function handleSave(e) {
        e.preventDefault();
        setError("");
        setSaving(true);
        const data = await updateRetailerProfile(form);
        setSaving(false);
        if (data?.error) { setError(data.error); return; }
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    }

    if (loading) return <Spinner fullPage text="Loading profile..." />;

    const fields = [
        { label: "Username", name: "username", placeholder: "your_username" },
        { label: "Phone Number", name: "phone", placeholder: "07XXXXXXXX" },
        { label: "Business Name", name: "business_name", placeholder: "Your shop name" },
        { label: "Country", name: "country", placeholder: "Kenya" },
    ];

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h1 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 24, fontWeight: 800, color: T.blue, marginBottom: 4,
                }}>
                    My Profile
                </h1>
                <p style={{ color: T.gray500, fontSize: 14 }}>
                    Manage your account details.
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                {/* Edit form */}
                <div style={{
                    background: "white", borderRadius: 14, padding: 28,
                    boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                }}>
                    <h3 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 15, fontWeight: 800, color: T.blue, marginBottom: 20,
                    }}>
                        Edit Details
                    </h3>

                    {error && (
                        <div style={{
                            background: "#f8d7da", color: "#721c24",
                            padding: "10px 16px", borderRadius: 8,
                            fontSize: 14, marginBottom: 16,
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSave}>
                        {fields.map(({ label, name, placeholder }) => (
                            <div key={name} style={{ marginBottom: 16 }}>
                                <label style={{
                                    display: "block", fontSize: 13,
                                    fontWeight: 600, color: T.gray500, marginBottom: 6,
                                }}>
                                    {label}
                                </label>
                                <input
                                    value={form[name]}
                                    onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
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

                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 24 }}>
                            <button
                                type="submit"
                                disabled={saving}
                                style={{
                                    background: T.blue, color: "white",
                                    border: "none", borderRadius: 10,
                                    padding: "12px 28px", fontSize: 14,
                                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                                    fontWeight: 700, cursor: saving ? "not-allowed" : "pointer",
                                    opacity: saving ? 0.7 : 1,
                                    display: "flex", alignItems: "center", gap: 8,
                                }}
                            >
                                {saving ? <Spinner size={16} text="" /> : null}
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                            {saved && (
                                <span style={{ color: "#155724", fontWeight: 600, fontSize: 14 }}>
                                    ✅ Saved!
                                </span>
                            )}
                        </div>
                    </form>
                </div>

                {/* Read-only info */}
                <div style={{
                    background: "white", borderRadius: 14, padding: 28,
                    boxShadow: "0 2px 8px rgba(10,46,110,0.07)",
                }}>
                    <h3 style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontSize: 15, fontWeight: 800, color: T.blue, marginBottom: 20,
                    }}>
                        Account Information
                    </h3>
                    {[
                        ["Email", profile?.email],
                        ["Account Type", "Retailer"],
                        ["Account Status", profile?.is_active ? "✅ Active" : "⚠️ Inactive"],
                        ["Member Since", new Date(profile?.created_at || Date.now()).toLocaleDateString("en-KE", {
                            day: "numeric", month: "long", year: "numeric",
                        })],
                    ].map(([k, v]) => (
                        <div key={k} style={{
                            display: "flex", justifyContent: "space-between",
                            padding: "12px 0", borderBottom: `1px solid ${T.gray100}`,
                            fontSize: 14,
                        }}>
                            <span style={{ color: T.gray500 }}>{k}</span>
                            <span style={{ fontWeight: 600, color: T.blue }}>{v}</span>
                        </div>
                    ))}

                    <div style={{
                        marginTop: 24, background: "#f8f9fc",
                        borderRadius: 10, padding: 16,
                    }}>
                        <div style={{
                            fontSize: 13, fontWeight: 700,
                            color: T.blue, marginBottom: 6,
                        }}>
                            🔒 Email & Password
                        </div>
                        <div style={{ fontSize: 13, color: T.gray500, lineHeight: 1.5 }}>
                            To change your email or password, use the forgot password flow from the sign-in page.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
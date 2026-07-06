import { T } from "../styles/theme";

export default function Spinner({ size = 36, fullPage = false, text = "Loading..." }) {
    const spinner = (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
        }}>
            <div style={{
                width: size,
                height: size,
                border: `3px solid ${T.gray100}`,
                borderTop: `3px solid ${T.blue}`,
                borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
            }} />
            {text && (
                <div style={{
                    fontSize: 13,
                    color: T.gray500,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 500,
                }}>
                    {text}
                </div>
            )}
            <style>{`
                @keyframes spin {
                    0%   { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );

    if (fullPage) {
        return (
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 400,
                width: "100%",
            }}>
                {spinner}
            </div>
        );
    }

    return spinner;
}
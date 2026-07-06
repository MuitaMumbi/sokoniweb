export const API_BASE = "https://sokoni-1-4i1f.onrender.com/api";

export async function apiFetch(url, options = {}, onExpired) {
    const token = localStorage.getItem("sokoni_token");
    
    const headers = {
        "Content-Type": "application/json",
    };
    
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    
    if (options.headers) {
        Object.assign(headers, options.headers);
    }

    const res = await fetch(url, {
        ...options,
        headers,
    });

    if (res.status === 401) {
        localStorage.removeItem("sokoni_token");
        if (onExpired) onExpired();
        return null;
    }
    return res;
}
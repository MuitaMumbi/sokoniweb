import { API_BASE, apiFetch } from "./config";

export async function fetchRetailerDashboard(onExpired) {
    const res = await apiFetch(`${API_BASE}/retailer/dashboard`, {}, onExpired);
    if (!res) return null;
    return res.json();
}

export async function fetchRetailerProfile(onExpired) {
    const res = await apiFetch(`${API_BASE}/retailer/profile`, {}, onExpired);
    if (!res) return null;
    return res.json();
}

export async function updateRetailerProfile(data, onExpired) {
    const res = await apiFetch(`${API_BASE}/retailer/profile`, {
        method: "PUT",
        body: JSON.stringify(data),
    }, onExpired);
    if (!res) return null;
    return res.json();
}

export async function fetchRetailerOrders(onExpired) {
    const res = await apiFetch(`${API_BASE}/orders/`, {}, onExpired);
    if (!res) return null;
    return res.json();
}

export async function fetchOrderDetail(order_id, onExpired) {
    const res = await apiFetch(`${API_BASE}/orders/${order_id}`, {}, onExpired);
    if (!res) return null;
    return res.json();
}

export async function placeOrder(data, onExpired) {
    const res = await apiFetch(`${API_BASE}/orders/`, {
        method: "POST",
        body: JSON.stringify(data),
    }, onExpired);
    if (!res) return null;
    return res.json();
}

export async function confirmDelivery(order_id, onExpired) {
    const res = await apiFetch(`${API_BASE}/retailer/orders/${order_id}/confirm-delivery`, {
        method: "PATCH",
    }, onExpired);
    if (!res) return null;
    return res.json();
}

export async function fetchLoyaltyPoints(onExpired) {
    const res = await apiFetch(`${API_BASE}/retailer/loyalty`, {}, onExpired);
    if (!res) return null;
    return res.json();
}

export async function stkPush(order_id, phone, onExpired) {
    const res = await apiFetch(`${API_BASE}/mpesa/stk-push`, {
        method: "POST",
        body: JSON.stringify({ order_id, phone }),
    }, onExpired);
    if (!res) return null;
    return res.json();
}

export async function pollOrderStatus(order_id, onExpired) {
    const res = await apiFetch(`${API_BASE}/mpesa/order-status/${order_id}`, {}, onExpired);
    if (!res) return null;
    return res.json();
}
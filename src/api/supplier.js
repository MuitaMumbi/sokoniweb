import { API_BASE, apiFetch } from "./config";

export async function fetchSupplierProfile(onExpired) {
    const res = await apiFetch(`${API_BASE}/supplier/profile`, {}, onExpired);
    if (!res) return null;
    return res.json();
}

export async function saveSupplierProfile(data, onExpired) {
    const res = await apiFetch(`${API_BASE}/supplier/profile`, {
        method: "POST",
        body: JSON.stringify(data),
    }, onExpired);
    if (!res) return null;
    return res.json();
}

export async function fetchSupplierDashboard(onExpired) {
    const res = await apiFetch(`${API_BASE}/supplier/dashboard`, {}, onExpired);
    if (!res) return null;
    return res.json();
}

export async function fetchSupplierProducts(page = 1, onExpired) {
    const res = await apiFetch(`${API_BASE}/supplier/products?page=${page}`, {}, onExpired);
    if (!res) return null;
    return res.json();
}

export async function addSupplierProduct(formData, onExpired) {
    const token = localStorage.getItem("sokoni_token");
    const res = await fetch(`${API_BASE}/supplier/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });
    if (res.status === 401) { if (onExpired) onExpired(); return null; }
    return res.json();
}

export async function updateSupplierProduct(product_id, formData, onExpired) {
    const token = localStorage.getItem("sokoni_token");
    const res = await fetch(`${API_BASE}/supplier/products/${product_id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });
    if (res.status === 401) { if (onExpired) onExpired(); return null; }
    return res.json();
}

export async function archiveSupplierProduct(product_id, onExpired) {
    const res = await apiFetch(`${API_BASE}/supplier/products/${product_id}/archive`, {
        method: "PATCH",
    }, onExpired);
    if (!res) return null;
    return res.json();
}

export async function deleteSupplierProduct(product_id, onExpired) {
    const res = await apiFetch(`${API_BASE}/supplier/products/${product_id}`, {
        method: "DELETE",
    }, onExpired);
    if (!res) return null;
    return res.json();
}

export async function fetchSupplierInventory(onExpired) {
    const res = await apiFetch(`${API_BASE}/supplier/inventory`, {}, onExpired);
    if (!res) return null;
    return res.json();
}

export async function updateInventory(inventory_id, data, onExpired) {
    const res = await apiFetch(`${API_BASE}/supplier/inventory/${inventory_id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
    }, onExpired);
    if (!res) return null;
    return res.json();
}

export async function fetchInventoryHistory(inventory_id, onExpired) {
    const res = await apiFetch(`${API_BASE}/supplier/inventory/${inventory_id}/history`, {}, onExpired);
    if (!res) return null;
    return res.json();
}

export async function fetchPurchaseOrders(status = "", onExpired) {
    const url = status
        ? `${API_BASE}/supplier/purchase-orders?status=${status}`
        : `${API_BASE}/supplier/purchase-orders`;
    const res = await apiFetch(url, {}, onExpired);
    if (!res) return null;
    return res.json();
}

export async function respondToPurchaseOrder(po_id, action, onExpired) {
    const res = await apiFetch(`${API_BASE}/supplier/purchase-orders/${po_id}/respond`, {
        method: "PATCH",
        body: JSON.stringify({ action }),
    }, onExpired);
    if (!res) return null;
    return res.json();
}

export async function confirmDispatch(po_id, delivery_date, onExpired) {
    const res = await apiFetch(`${API_BASE}/supplier/purchase-orders/${po_id}/dispatch`, {
        method: "PATCH",
        body: JSON.stringify({ delivery_date }),
    }, onExpired);
    if (!res) return null;
    return res.json();
}

export async function fetchShipments(status = "", onExpired) {
    const url = status
        ? `${API_BASE}/supplier/shipments?status=${status}`
        : `${API_BASE}/supplier/shipments`;
    const res = await apiFetch(url, {}, onExpired);
    if (!res) return null;
    return res.json();
}

export async function updateShipmentStatus(delivery_id, status, onExpired) {
    const res = await apiFetch(`${API_BASE}/supplier/shipments/${delivery_id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    }, onExpired);
    if (!res) return null;
    return res.json();
}

export async function fetchNotifications(unread = false, onExpired) {
    const url = unread
        ? `${API_BASE}/supplier/notifications?unread=true`
        : `${API_BASE}/supplier/notifications`;
    const res = await apiFetch(url, {}, onExpired);
    if (!res) return null;
    return res.json();
}

export async function markNotificationRead(notification_id, onExpired) {
    const res = await apiFetch(`${API_BASE}/supplier/notifications/${notification_id}/read`, {
        method: "PATCH",
    }, onExpired);
    if (!res) return null;
    return res.json();
}

export async function markAllNotificationsRead(onExpired) {
    const res = await apiFetch(`${API_BASE}/supplier/notifications/read-all`, {
        method: "PATCH",
    }, onExpired);
    if (!res) return null;
    return res.json();
}
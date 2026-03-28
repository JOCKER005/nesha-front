// src/lib/api.ts

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request<T>(
  path: string,
  options: RequestInit = {},
  adminToken?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (adminToken) headers["x-admin-token"] = adminToken;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Error en la API");
  }
  return res.json();
}

// FIX: El fallback a import.meta.env.VITE_ADMIN_SECRET exponía la clave en el
// bundle de JS — cualquiera que inspeccionara el código fuente del navegador
// podía leerla. Ahora solo se usa sessionStorage, que se popula tras el login.
// Si no hay token en sessionStorage el string queda vacío y el backend devuelve 401.
function getAdminToken(): string {
  return sessionStorage.getItem("luxe_admin_token") ?? "";
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Product {
  id:          number;
  name:        string;
  category:    string;
  price:       number;
  stock:       number;
  featured:    boolean;
  active:      boolean;
  rating:      number;
  reviews:     number;
  description: string;
  image:       string;
  images:      string[];   // imágenes adicionales del carrusel
  created_at?: string;
  updated_at?: string;
}

export interface OrderItem {
  id:           number;
  product_id:   number | null;
  product_name: string;
  quantity:     number;
  unit_price:   number;
}

export interface Order {
  id:               number;
  mp_preference_id: string | null;
  mp_payment_id:    string | null;
  status:           string;
  total:            number;
  created_at:       string | null;
  items:            OrderItem[];
  // Datos del comprador (desde MP webhook)
  payer_name:       string | null;
  payer_email:      string | null;
  payer_dni:        string | null;
  payer_phone:      string | null;
  // Datos de envío (desde el checkout)
  shipping_name:    string | null;
  shipping_dni:     string | null;
  shipping_phone:   string | null;
  shipping_address: string | null;
  shipping_zip:     string | null;
  shipping_notes:   string | null;
}

export interface PaymentPreferenceResponse {
  id:               string;
  initPoint:        string;
  sandboxInitPoint: string;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const api = {
  products: {
    list: (params?: { featured?: boolean; category?: string }) => {
      const qs = new URLSearchParams();
      if (params?.featured !== undefined) qs.set("featured", String(params.featured));
      if (params?.category) qs.set("category", params.category);
      return request<Product[]>(`/api/products?${qs}`);
    },
    get: (id: number) => request<Product>(`/api/products/${id}`),
  },

  payments: {
    createPreference: (body: {
      items: { productId: number; name: string; price: number; quantity: number; image: string }[];
      backUrls: { success: string; failure: string; pending: string };
      shippingData: {
        name: string; dni: string; phone: string;
        address: string; zip: string; notes: string;
      };
    }) =>
      request<PaymentPreferenceResponse>("/api/payments/create-preference", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },

  admin: {
    // Verificar token contra el backend — si devuelve 401 el token es inválido.
    // Se usa el token recién ingresado, no el de sessionStorage (que puede no existir aún).
    verifyToken: (token: string) =>
      request<Product[]>("/api/admin/products", {}, token),

    products: {
      list:   ()                              => request<Product[]>("/api/admin/products", {}, getAdminToken()),
      create: (data: Omit<Product, "id" | "created_at" | "updated_at">) =>
                request<Product>("/api/admin/products", { method: "POST", body: JSON.stringify(data) }, getAdminToken()),
      update: (id: number, data: Partial<Product>) =>
                request<Product>(`/api/admin/products/${id}`, { method: "PATCH", body: JSON.stringify(data) }, getAdminToken()),
      delete: (id: number) =>
                request<{ ok: boolean }>(`/api/admin/products/${id}`, { method: "DELETE" }, getAdminToken()),
    },

    orders: {
      list: (status?: string) => {
        const qs = status ? `?status=${status}` : "";
        return request<Order[]>(`/api/admin/orders${qs}`, {}, getAdminToken());
      },
      updateStatus: (id: number, status: string) =>
        request<{ ok: boolean }>(`/api/admin/orders/${id}/status`, {
          method: "PATCH", body: JSON.stringify({ status }),
        }, getAdminToken()),
    },

    exportExcel: (dateFrom?: string, dateTo?: string) => {
      const qs = new URLSearchParams();
      if (dateFrom) qs.set("date_from", dateFrom);
      if (dateTo)   qs.set("date_to", dateTo);
      return `${BASE_URL}/api/admin/export/libro-diario?${qs}`;
    },
  },
};

// src/pages/Admin.tsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAdminProducts, useAdminOrders,
  useCreateProduct, useUpdateProduct, useDeleteProduct, useUpdateOrderStatus
} from "@/hooks/useProducts";
import { formatPrice, formatDate, STATUS_LABELS } from "@/lib/utils";
import { api } from "@/lib/api";
import type { Product } from "@/lib/api";
import {
  Plus, Pencil, Trash2, Package, ShoppingCart,
  Download, Search, X, Check, ChevronDown, Loader2,
  BarChart3, Star, AlertTriangle, Lock, Eye, EyeOff, LogOut
} from "lucide-react";

type Tab = "products" | "orders";

// ─── Login Guard ──────────────────────────────────────────────────────────────
// FIX #6: El token se valida CONTRA EL BACKEND antes de mostrar el panel.
// Escribir cualquier cosa en sessionStorage no funciona porque el backend
// devuelve 401 y el estado de autenticación vuelve a false.

function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      // Verifica el token contra el backend real — no hay forma de evadir esto
      await api.admin.verifyToken(password);
      sessionStorage.setItem("luxe_admin_token", password);
      onLogin(password);
    } catch {
      setError(true);
      sessionStorage.removeItem("luxe_admin_token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border p-10 w-full max-w-sm shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-primary" />
          </div>
          <h1 className="font-display text-3xl mb-1">Panel Admin</h1>
          <p className="text-muted-foreground text-sm">Luxe Joyería — Acceso restringido</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              placeholder="Clave de administrador"
              autoFocus
              className={`w-full bg-background border px-4 py-3 pr-10 text-sm focus:outline-none focus:border-primary transition-colors ${
                error ? "border-red-500" : "border-border"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-xs">Clave incorrecta. Intentá de nuevo.</p>
          )}

          <button
            type="submit"
            disabled={!password || loading}
            className="w-full bg-primary text-primary-foreground py-3 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
            Ingresar
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Product Form Modal ───────────────────────────────────────────────────────

interface ProductFormProps {
  initial?: Partial<Product>;
  onSave: (data: Partial<Product>) => void;
  onClose: () => void;
  loading?: boolean;
}

function ProductForm({ initial, onSave, onClose, loading }: ProductFormProps) {
  const [form, setForm] = useState<Partial<Product>>({
    name: "", category: "anillos", price: 0, stock: 0,
    featured: false, active: true, rating: 5, reviews: 0,
    description: "", image: "",
    ...initial,
  });

  const set = (field: keyof Product, val: any) =>
    setForm(f => ({ ...f, [field]: val }));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card border border-border w-full max-w-2xl rounded-md shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="font-display text-2xl">{initial?.id ? "Editar Producto" : "Nuevo Producto"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Nombre *</label>
              <input value={form.name} onChange={e => set("name", e.target.value)}
                className="w-full bg-background border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                placeholder="Ej: Anillo Eternity Diamantes" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Categoría *</label>
              <select value={form.category} onChange={e => set("category", e.target.value)}
                className="w-full bg-background border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer">
                {["anillos", "collares", "aretes", "pulseras"].map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Precio (ARS) *</label>
              <input type="number" value={form.price} onChange={e => set("price", parseFloat(e.target.value))}
                className="w-full bg-background border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                placeholder="0" min="0" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Stock</label>
              {/* FIX #12: stock mínimo 0, máximo 9999 */}
              <input type="number" value={form.stock} onChange={e => set("stock", Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-background border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                placeholder="0" min="0" max="9999" />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Rating (1–5)</label>
              <input type="number" value={form.rating} onChange={e => set("rating", parseFloat(e.target.value))}
                className="w-full bg-background border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                step="0.1" min="1" max="5" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">URL de Imagen</label>
              <input value={form.image} onChange={e => set("image", e.target.value)}
                className="w-full bg-background border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                placeholder="https://..." />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Descripción</label>
              <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3}
                className="w-full bg-background border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"
                placeholder="Descripción del producto..." />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} className="w-4 h-4 accent-primary" />
                <span className="text-sm">Destacado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => set("active", e.target.checked)} className="w-4 h-4 accent-primary" />
                <span className="text-sm">Activo</span>
              </label>
            </div>
          </div>

          {/* FIX #13: preview con fallback si la imagen falla */}
          {form.image && (
            <div className="border border-border overflow-hidden w-32 h-32 bg-muted flex items-center justify-center">
              <img
                src={form.image}
                alt="preview"
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose}
            className="flex-1 border border-border py-3 text-sm uppercase tracking-widest hover:bg-card transition-colors">
            Cancelar
          </button>
          <button onClick={() => onSave(form)} disabled={loading || !form.name || !form.price}
            className="flex-1 bg-primary text-primary-foreground py-3 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            {initial?.id ? "Actualizar" : "Crear Producto"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("products");
  const [search, setSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const { data: products, isLoading: loadingProducts } = useAdminProducts();

  // FIX #7: refetchInterval solo activo cuando la tab de órdenes está visible
  const { data: orders, isLoading: loadingOrders } = useAdminOrders(
    orderStatusFilter || undefined,
    tab === "orders" // solo hace polling cuando estás mirando órdenes
  );

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const statusMutation = useUpdateOrderStatus();

  const filteredProducts = (products ?? []).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  // FIX: Sin try/catch, los errores del backend (ej: validación) se tragaban silenciosamente
  // y el modal se cerraba sin informar al usuario qué falló.
  const handleCreate = async (data: Partial<Product>) => {
    try {
      await createMutation.mutateAsync(data as any);
      setIsCreating(false);
    } catch (err: any) {
      setDeleteError(err.message || "Error al crear el producto");
    }
  };

  const handleUpdate = async (data: Partial<Product>) => {
    if (!editingProduct?.id) return;
    try {
      await updateMutation.mutateAsync({ id: editingProduct.id, data });
      setEditingProduct(null);
    } catch (err: any) {
      setDeleteError(err.message || "Error al actualizar el producto");
    }
  };

  // FIX #8: Mostrar error del backend si el producto tiene órdenes pendientes
  const handleDelete = async (id: number) => {
    setDeleteError(null);
    try {
      await deleteMutation.mutateAsync(id);
      setDeleteConfirm(null);
    } catch (err: any) {
      setDeleteError(err.message || "No se pudo eliminar el producto");
      setDeleteConfirm(null);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    setExportError(null);
    try {
      const token = sessionStorage.getItem("luxe_admin_token") || "";
      if (!token) throw new Error("No hay sesión activa");

      const url = api.admin.exportExcel(dateFrom || undefined, dateTo || undefined);
      const res = await fetch(url, { headers: { "x-admin-token": token } });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Error ${res.status}`);
      }

      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `libro_diario_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err: any) {
      setExportError(err.message || "Error al exportar");
    } finally {
      setExportLoading(false);
    }
  };

  const totalRevenue = (orders ?? [])
    .filter(o => o.status === "approved")
    .reduce((s, o) => s + o.total, 0);
  const approvedOrders = (orders ?? []).filter(o => o.status === "approved").length;
  const lowStockCount = (products ?? []).filter(p => p.stock <= 2 && p.active).length;

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display mb-1">Panel de Administración</h1>
            <p className="text-muted-foreground text-sm">Luxe Joyería — Gestión interna</p>
          </div>
          <button onClick={onLogout}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground border border-border px-4 py-2 transition-colors">
            <LogOut size={13} /> Cerrar sesión
          </button>
        </div>

        {/* Error global de delete */}
        {deleteError && (
          <div className="bg-destructive/10 border border-destructive/30 text-red-400 px-4 py-3 text-sm mb-6 flex items-center justify-between rounded">
            <span>{deleteError}</span>
            <button onClick={() => setDeleteError(null)}><X size={14} /></button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: BarChart3, label: "Ingresos Aprobados", value: formatPrice(totalRevenue), color: "text-primary" },
            { icon: ShoppingCart, label: "Órdenes Aprobadas", value: String(approvedOrders), color: "text-green-400" },
            { icon: AlertTriangle, label: "Stock Bajo (≤2)", value: String(lowStockCount), color: "text-yellow-500" },
          ].map(stat => (
            <div key={stat.label} className="bg-card border border-border p-5 flex items-center gap-4">
              <stat.icon size={28} className={stat.color} />
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-display mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {([
            { id: "products", label: "Productos", icon: Package },
            { id: "orders", label: "Órdenes", icon: ShoppingCart },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-widest border-b-2 transition-colors -mb-px ${
                tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              <t.icon size={16} />{t.label}
            </button>
          ))}
        </div>

        {/* ── Products Tab ── */}
        {tab === "products" && (
          <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
              <div className="relative flex-1 max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar producto..."
                  className="w-full bg-card border border-border pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <button onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors">
                <Plus size={16} />Nuevo Producto
              </button>
            </div>

            {loadingProducts ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={28} className="animate-spin text-primary" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-card/50">
                      {["Producto", "Categoría", "Precio", "Stock", "Estado", "Destacado", "Acciones"].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="border-b border-border/50 hover:bg-card/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {/* FIX #13: fallback si la imagen no carga */}
                            <div className="w-10 h-10 bg-muted border border-border flex-shrink-0 overflow-hidden flex items-center justify-center text-muted-foreground text-xs">
                              {product.image
                                ? <img src={product.image} alt="" className="w-full h-full object-cover"
                                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                : "—"}
                            </div>
                            <div>
                              <p className="font-medium line-clamp-1">{product.name}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star size={10} className="fill-primary text-primary" />
                                {product.rating} ({product.reviews})
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 capitalize text-muted-foreground">{product.category}</td>
                        <td className="px-4 py-3 text-primary font-medium">{formatPrice(product.price)}</td>
                        <td className="px-4 py-3">
                          <span className={`font-medium ${product.stock <= 2 ? "text-yellow-500" : "text-foreground"}`}>
                            {product.stock} {product.stock <= 2 && "⚠️"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => updateMutation.mutate({ id: product.id, data: { active: !product.active } })}
                            className={`px-3 py-1 text-xs uppercase tracking-wider rounded-sm transition-colors ${
                              product.active ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}>
                            {product.active ? "Activo" : "Inactivo"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => updateMutation.mutate({ id: product.id, data: { featured: !product.featured } })}
                            className={`px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                              product.featured ? "text-primary border border-primary/50 hover:bg-primary/10" : "text-muted-foreground border border-border hover:border-primary/30"
                            }`}>
                            {product.featured ? "Sí" : "No"}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEditingProduct(product)}
                              className="p-1.5 text-muted-foreground hover:text-primary transition-colors hover:bg-primary/10 rounded">
                              <Pencil size={15} />
                            </button>
                            {deleteConfirm === product.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleDelete(product.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded">
                                  <Check size={15} />
                                </button>
                                <button onClick={() => setDeleteConfirm(null)} className="p-1.5 text-muted-foreground hover:bg-card rounded">
                                  <X size={15} />
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirm(product.id)}
                                className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors hover:bg-red-500/10 rounded">
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && (
                  <p className="text-center text-muted-foreground py-12">No hay productos.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Orders Tab ── */}
        {tab === "orders" && (
          <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-between items-start flex-wrap">
              <div className="relative">
                <select value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)}
                  className="bg-card border border-border pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer">
                  <option value="">Todos los estados</option>
                  {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                  className="bg-card border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                <span className="text-muted-foreground text-sm">—</span>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                  className="bg-card border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary" />
                <button onClick={handleExport} disabled={exportLoading}
                  className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white px-4 py-2 text-sm uppercase tracking-widest transition-colors disabled:opacity-60">
                  {exportLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                  Exportar Excel
                </button>
              </div>
            </div>

            {exportError && (
              <div className="bg-destructive/10 border border-destructive/30 text-red-400 px-4 py-3 text-sm mb-4 flex items-center justify-between">
                <span>Error al exportar: {exportError}</span>
                <button onClick={() => setExportError(null)}><X size={14} /></button>
              </div>
            )}

            {loadingOrders ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={28} className="animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-3">
                {(orders ?? []).map(order => (
                  <div key={order.id} className="bg-card border border-border p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="font-display text-lg">Orden #{order.id}</span>
                          <span className={`text-xs uppercase tracking-widest font-medium ${STATUS_LABELS[order.status]?.color ?? "text-muted-foreground"}`}>
                            {STATUS_LABELS[order.status]?.label ?? order.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{formatDate(order.created_at)}</p>
                        <div className="text-sm text-muted-foreground">
                          {order.items.map(item => (
                            <span key={item.id} className="inline-block mr-3">{item.product_name} ×{item.quantity}</span>
                          ))}
                        </div>
                        {order.mp_payment_id && (
                          <p className="text-xs text-muted-foreground mt-2">MP: {order.mp_payment_id}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-primary font-display text-xl">{formatPrice(order.total)}</span>
                        <select value={order.status}
                          onChange={e => statusMutation.mutate({ id: order.id, status: e.target.value })}
                          className="bg-background border border-border px-3 py-1.5 text-xs uppercase tracking-wider focus:outline-none focus:border-primary appearance-none cursor-pointer">
                          {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                            <option key={key} value={key}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                {(orders ?? []).length === 0 && (
                  <p className="text-center text-muted-foreground py-12">No hay órdenes.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isCreating && (
          <ProductForm onSave={handleCreate} onClose={() => setIsCreating(false)} loading={createMutation.isPending} />
        )}
        {editingProduct && (
          <ProductForm initial={editingProduct} onSave={handleUpdate} onClose={() => setEditingProduct(null)} loading={updateMutation.isPending} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Root: decide login o panel ───────────────────────────────────────────────

export default function Admin() {
  // FIX #6: El token guardado en sessionStorage se re-valida contra el backend
  // al montar el componente. Si el token fue manipulado manualmente, el backend
  // devuelve 401 y el usuario vuelve al login.
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem("luxe_admin_token");
    if (!saved) {
      setChecking(false);
      return;
    }
    // Re-validar token guardado contra el backend
    api.admin.verifyToken(saved)
      .then(() => setAuthToken(saved))
      .catch(() => {
        sessionStorage.removeItem("luxe_admin_token");
      })
      .finally(() => setChecking(false));
  }, []);

  const handleLogin = (token: string) => setAuthToken(token);

  const handleLogout = () => {
    sessionStorage.removeItem("luxe_admin_token");
    setAuthToken(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!authToken) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminPanel onLogout={handleLogout} />;
}

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
  BarChart3, Star, AlertTriangle, Lock, Eye, EyeOff,
  LogOut, TrendingUp, TrendingDown, DollarSign, Minus,
  Activity, AlertCircle, ClipboardList, Calendar, ArrowUpDown,
  ArrowUp, ArrowDown, Clock, Hash
} from "lucide-react";
import { formatPrice as fp } from "@/lib/utils";

type Tab = "dashboard" | "products" | "orders" | "pending" | "categorias";
// ─── Categorías desde API ─────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface CategoryItem { id: number; name: string; }

function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const token = () => sessionStorage.getItem("luxe_admin_token") ?? "";

  const fetchCats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (e) {
      console.error("Error cargando categorías", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCats(); }, []);

  const add = async (name: string): Promise<boolean> => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-token": token() },
        body: JSON.stringify({ name: name.trim().toLowerCase() }),
      });
      if (!res.ok) return false;
      await fetchCats();
      return true;
    } catch { return false; }
  };

  const remove = async (id: number): Promise<boolean> => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: { "x-admin-token": token() },
      });
      if (!res.ok) return false;
      await fetchCats();
      return true;
    } catch { return false; }
  };

  const rename = async (id: number, newName: string): Promise<boolean> => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-token": token() },
        body: JSON.stringify({ name: newName.trim().toLowerCase() }),
      });
      if (!res.ok) return false;
      await fetchCats();
      return true;
    } catch { return false; }
  };

  return { categories, loading, refresh: fetchCats, add, remove, rename };
}



// ─── Login ────────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(false);
    try {
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
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border p-10 w-full max-w-sm shadow-2xl">
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
              className={`w-full bg-background border px-4 py-3 pr-10 text-sm focus:outline-none focus:border-primary transition-colors ${error ? "border-red-500" : "border-border"}`}
            />
            <button type="button" onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs">Clave incorrecta. Intentá de nuevo.</p>}
          <button type="submit" disabled={!password || loading}
            className="w-full bg-primary text-primary-foreground py-3 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
            Ingresar
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Market Dashboard ─────────────────────────────────────────────────────────
interface MarketData {
  goldUSD: number | null;
  goldARS: number | null;
  dolarBlue: number | null;
  dolarMEP: number | null;
  dolarOficial: number | null;
  loading: boolean;
  error: string | null;
  lastUpdate: string;
}

function useMarketData(): MarketData {
  const [data, setData] = useState<MarketData>({
    goldUSD: null, goldARS: null, dolarBlue: null,
    dolarMEP: null, dolarOficial: null,
    loading: true, error: null, lastUpdate: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/market/prices`
        );
        const data = await res.json();
        const goldUSD = data.goldUSD ?? null;
        const blue    = data.dolarBlue ?? null;
        const oficial = data.dolarOficial ?? null;
        const goldARS = goldUSD && blue ? (goldUSD / 31.1035) * blue : null;
        setData({
          goldUSD, goldARS, dolarBlue: blue,
          dolarMEP: null, dolarOficial: oficial,
          loading: false, error: null,
          lastUpdate: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
        });
      } catch (e) {
        setData(prev => ({ ...prev, loading: false, error: "No se pudo cargar el mercado" }));
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return data;
}

function MarketCard({ title, value, subtitle, source, trend }: {
  title: string; value: string | null; subtitle?: string;
  source?: string; trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="bg-card border border-border p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">{title}</p>
        {source && <span className="text-[10px] text-muted-foreground/50 text-right max-w-[120px] leading-tight">{source}</span>}
      </div>
      {value === null ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <p className="text-muted-foreground text-sm">Cargando...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-sans font-semibold text-primary tabular-nums tracking-tight">{value}</p>
            {trend === "up" && <TrendingUp size={16} className="text-green-400" />}
            {trend === "down" && <TrendingDown size={16} className="text-red-400" />}
          </div>
          {subtitle && <p className="text-xs text-muted-foreground mt-1.5">{subtitle}</p>}
        </>
      )}
    </div>
  );
}

function Dashboard({ orders, products }: { orders: any[]; products: any[] }) {
  const market = useMarketData();

  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => o.created_at && new Date(o.created_at).toDateString() === today);
  const todaySales = todayOrders.filter(o => o.status === "approved").reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const lowStock = products.filter(p => p.stock <= 2 && p.active).length;
  const totalApproved = orders.filter(o => o.status === "approved").reduce((s, o) => s + o.total, 0);

  // Costo fabricación estimado: precio oro por gramo en ARS
  const goldPerGram = market.goldUSD ? (market.goldUSD / 31.1035) : null; // troy oz → gramo
  const goldPerGramARS = goldPerGram && market.dolarBlue ? goldPerGram * market.dolarBlue : null;

  // Alerta de volatilidad (si dólar sube más del 3% en el día — simulado con diferencia oficial/blue)
  const volatilityAlert = market.dolarBlue && market.dolarOficial
    ? ((market.dolarBlue - market.dolarOficial) / market.dolarOficial) * 100
    : null;
  const highVolatility = volatilityAlert !== null && volatilityAlert > 100; // brecha > 100%

  return (
    <div className="space-y-8">

      {/* Alerta de volatilidad */}
      {highVolatility && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 flex items-center gap-3 rounded">
          <AlertCircle size={18} />
          <p className="text-sm font-medium">
            Brecha cambiaria alta ({volatilityAlert?.toFixed(0)}%) — revisá tus precios antes de publicar.
          </p>
        </div>
      )}

      {/* Sección A: Monitor de mercado */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display">Monitor de Mercado</h2>
          {market.lastUpdate && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Activity size={12} /> Actualizado {market.lastUpdate}
            </span>
          )}
        </div>

        {market.error && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-3 text-sm mb-4 rounded">
            {market.error} — los datos de mercado no están disponibles.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MarketCard
            title="Oro (USD/oz)"
            value={market.goldUSD ? `$${market.goldUSD.toFixed(2)}` : null}
            subtitle="COMEX · Cotización internacional"
            source="data-asg.goldprice.org"
          />
          <MarketCard
            title="Oro (ARS/gramo)"
            value={goldPerGramARS ? formatPrice(goldPerGramARS) : null}
            subtitle={`Calculado con dólar blue`}
            source="Cálculo propio"
          />
          <MarketCard
            title="Dólar Blue"
            value={market.dolarBlue ? `$${market.dolarBlue.toFixed(0)}` : null}
            subtitle="Precio de venta"
            source="bluelytics.com.ar"
          />
          <MarketCard
            title="Dólar Oficial"
            value={market.dolarOficial ? `$${market.dolarOficial.toFixed(0)}` : null}
            subtitle={volatilityAlert ? `Brecha: ${volatilityAlert.toFixed(0)}%` : "Precio de venta"}
            source="bluelytics.com.ar"
          />
        </div>

        {/* Costo de fabricación sugerido */}
        {goldPerGramARS && (
          <div className="mt-4 bg-card border border-primary/20 p-5">
            <p className="text-xs uppercase tracking-widest text-primary mb-2">Calculadora de costo de fabricación</p>
            <p className="text-sm text-muted-foreground">
              Anillo 18k (3g oro): <span className="text-foreground font-medium">{formatPrice(goldPerGramARS * 3 * 0.75)}</span> solo en material ·
              Anillo 18k (5g oro): <span className="text-foreground font-medium">{formatPrice(goldPerGramARS * 5 * 0.75)}</span> ·
              Collar 18k (8g oro): <span className="text-foreground font-medium">{formatPrice(goldPerGramARS * 8 * 0.75)}</span>
            </p>
            <p className="text-[11px] text-muted-foreground/60 mt-1">18k = 75% oro puro. No incluye mano de obra ni piedras.</p>
          </div>
        )}
      </div>

      {/* Sección B: Resumen del negocio */}
      <div>
        <h2 className="text-xl font-display mb-4">Resumen del Negocio</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Ventas del día", value: formatPrice(todaySales), color: "text-primary", icon: DollarSign },
            { label: "Consultas activas", value: String(pendingOrders), color: "text-yellow-400", icon: ShoppingCart },
            { label: "Productos bajo stock", value: String(lowStock), color: "text-red-400", icon: AlertTriangle },
            { label: "Total aprobado", value: formatPrice(totalApproved), color: "text-green-400", icon: BarChart3 },
          ].map(stat => (
            <div key={stat.label} className="bg-card border border-border p-5 text-center">
              <stat.icon size={24} className={`${stat.color} mx-auto mb-2`} />
              <p className={`text-4xl font-sans font-bold tabular-nums ${stat.color} mb-1`}>{stat.value}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Órdenes recientes */}
      <div>
        <h2 className="text-xl font-display mb-4">Órdenes Recientes</h2>
        <div className="space-y-2">
          {orders.slice(0, 5).map(order => (
            <div key={order.id} className="bg-card border border-border px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">#{order.id}</span>
                <span className={`text-xs uppercase tracking-wider ${STATUS_LABELS[order.status]?.color ?? "text-muted-foreground"}`}>
                  {STATUS_LABELS[order.status]?.label ?? order.status}
                </span>
                <span className="text-xs text-muted-foreground">{formatDate(order.created_at)}</span>
              </div>
              <span className="text-primary font-medium">{formatPrice(order.total)}</span>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-8">No hay órdenes todavía.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Product Form ─────────────────────────────────────────────────────────────
interface ProductFormProps {
  initial?: Partial<Product>;
  onSave: (data: Partial<Product>) => void;
  onClose: () => void;
  loading?: boolean;
}

function ProductForm({ initial, onSave, onClose, loading }: ProductFormProps) {
  const { categories } = useCategories();
  const [form, setForm] = useState<Partial<Product>>({
    name: "", category: categories[0]?.name || "anillos", price: 0, stock: 0,
    featured: false, active: true, rating: 5, reviews: 0,
    description: "", image: "", images: [], ...initial,
  });
  const set = (field: keyof Product, val: any) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card border border-border w-full max-w-2xl rounded-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="font-display text-2xl">{initial?.id ? "Editar Producto" : "Nuevo Producto"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
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
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name.charAt(0).toUpperCase() + c.name.slice(1)}</option>
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
            {/* Imagen principal */}
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Imagen Principal *</label>
              <input value={form.image} onChange={e => set("image", e.target.value)}
                className="w-full bg-background border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
                placeholder="https://..." />
            </div>

            {/* Imágenes adicionales del carrusel */}
            <div className="sm:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Imágenes adicionales (carrusel — máx. 10)
              </label>
              <div className="space-y-2">
                {((form.images ?? []) as string[]).map((url, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      value={url}
                      onChange={e => {
                        const arr = [...((form.images ?? []) as string[])];
                        arr[idx] = e.target.value;
                        set("images", arr);
                      }}
                      className="flex-1 bg-background border border-border px-4 py-2 text-sm focus:outline-none focus:border-primary"
                      placeholder={`Imagen ${idx + 2} — https://...`}
                    />
                    {url && (
                      <div className="w-10 h-10 border border-border flex-shrink-0 overflow-hidden">
                        <img src={url} alt="" className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                    )}
                    <button type="button"
                      onClick={() => {
                        const arr = ((form.images ?? []) as string[]).filter((_, i) => i !== idx);
                        set("images", arr);
                      }}
                      className="p-2 text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {((form.images ?? []) as string[]).length < 10 && (
                  <button type="button"
                    onClick={() => set("images", [...((form.images ?? []) as string[]), ""])}
                    className="flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors uppercase tracking-widest mt-1">
                    <Plus size={13} /> Agregar imagen
                  </button>
                )}
              </div>
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
          {form.image && (
            <div className="border border-border overflow-hidden w-32 h-32 bg-muted flex items-center justify-center">
              <img src={form.image} alt="preview" className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
          )}
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 border border-border py-3 text-sm uppercase tracking-widest hover:bg-card transition-colors">
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


// ─── Pending Panel ────────────────────────────────────────────────────────────
interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: "alta" | "media" | "baja";
  done: boolean;
  createdAt: string;
}

const PRIORITY_COLORS = {
  alta:  "text-red-400 bg-red-500/10 border-red-500/30",
  media: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
  baja:  "text-green-400 bg-green-500/10 border-green-500/30",
};

function PendingPanel({ products }: { products: any[] }) {
  const LOW_STOCK_THRESHOLD = 10;
  // Incluye productos activos e inactivos — si tiene poco stock hay que saber igual
  const lowStockProducts = products.filter(p => p.stock !== null && p.stock <= LOW_STOCK_THRESHOLD);

  const [tasks, setTasks] = useState<Task[]>(() => {
    try { return JSON.parse(localStorage.getItem("luxe_tasks") || "[]"); } catch { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", deadline: "", priority: "media" as Task["priority"] });
  const [formError, setFormError] = useState("");

  const saveTasks = (t: Task[]) => {
    setTasks(t);
    localStorage.setItem("luxe_tasks", JSON.stringify(t));
  };

  const handleAdd = () => {
    if (!form.title.trim()) { setFormError("El título es requerido"); return; }
    if (!form.deadline) { setFormError("La fecha límite es requerida"); return; }
    const t: Task = {
      id: Date.now().toString(),
      title: form.title.trim(),
      description: form.description.trim(),
      deadline: form.deadline,
      priority: form.priority,
      done: false,
      createdAt: new Date().toISOString(),
    };
    saveTasks([t, ...tasks]);
    setForm({ title: "", description: "", deadline: "", priority: "media" });
    setShowForm(false);
    setFormError("");
  };

  const toggleDone = (id: string) =>
    saveTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));

  const deleteTask = (id: string) =>
    saveTasks(tasks.filter(t => t.id !== id));

  const pendingTasks = tasks.filter(t => !t.done);
  const doneTasks    = tasks.filter(t => t.done);

  const isOverdue = (deadline: string) => new Date(deadline) < new Date() && deadline;

  return (
    <div className="space-y-8">

      {/* ── Stock bajo ── */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <AlertTriangle size={18} className="text-red-400" />
          <h2 className="text-xl font-display">Productos con Stock Bajo</h2>
          <span className="bg-red-500/10 text-red-400 border border-red-500/30 text-xs px-2 py-0.5 font-medium">
            {lowStockProducts.length} producto{lowStockProducts.length !== 1 ? "s" : ""}
          </span>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="bg-green-500/5 border border-green-500/20 p-6 text-center">
            <Check size={28} className="text-green-400 mx-auto mb-2" />
            <p className="text-sm text-green-400 font-medium">¡Todo el stock está en orden!</p>
            <p className="text-xs text-muted-foreground mt-1">Ningún producto tiene stock menor o igual a {LOW_STOCK_THRESHOLD} unidades.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockProducts.map(p => (
              <div key={p.id} className={`bg-card border p-4 flex items-center gap-4 ${
                p.stock === 0 ? "border-red-500/40" : "border-yellow-500/30"
              }`}>
                <div className="w-12 h-12 bg-muted border border-border flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {p.image
                    ? <img src={p.image} alt="" className="w-full h-full object-cover" onError={e => {(e.target as HTMLImageElement).style.display="none"}}/>
                    : <span className="text-xs text-muted-foreground">—</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{p.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {p.stock === 0 ? (
                      <span className="text-xs font-bold text-red-400">SIN STOCK</span>
                    ) : (
                      <span className="text-xs font-bold text-yellow-400">{p.stock} unidad{p.stock !== 1 ? "es" : ""} restante{p.stock !== 1 ? "s" : ""}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Tareas y pedidos custom ── */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <ClipboardList size={18} className="text-primary" />
            <h2 className="text-xl font-display">Tareas y Pedidos a Medida</h2>
            {pendingTasks.length > 0 && (
              <span className="bg-primary/10 text-primary border border-primary/30 text-xs px-2 py-0.5 font-medium">
                {pendingTasks.length} pendiente{pendingTasks.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <button onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors">
            <Plus size={14} />{showForm ? "Cancelar" : "Nueva Tarea"}
          </button>
        </div>

        {/* Formulario nueva tarea */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="bg-card border border-border p-6 mb-6 space-y-4">
              <h3 className="text-sm uppercase tracking-widest text-primary font-medium">Nueva Tarea / Pedido a Medida</h3>
              {formError && <p className="text-red-400 text-xs">{formError}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1.5">Título / Cliente *</label>
                  <input value={form.title} onChange={e => {setForm(f=>({...f,title:e.target.value}));setFormError("")}}
                    placeholder="Ej: Anillo a medida para María García"
                    className="w-full bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary"/>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1.5">Descripción / Requerimientos</label>
                  <textarea value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))}
                    placeholder="Ej: Anillo de oro 18k talle 16, con iniciales grabadas M.G., piedra roja central..."
                    rows={3}
                    className="w-full bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-none"/>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1.5">Plazo de Entrega *</label>
                  <input type="date" value={form.deadline} onChange={e => {setForm(f=>({...f,deadline:e.target.value}));setFormError("")}}
                    className="w-full bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary"/>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground block mb-1.5">Prioridad</label>
                  <select value={form.priority} onChange={e => setForm(f=>({...f,priority:e.target.value as Task["priority"]}))}
                    className="w-full bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary appearance-none">
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => {setShowForm(false);setFormError("")}}
                  className="px-4 py-2 text-xs uppercase tracking-widest text-muted-foreground border border-border hover:text-foreground transition-colors">
                  Cancelar
                </button>
                <button onClick={handleAdd}
                  className="flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Check size={13} />Guardar Tarea
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de tareas pendientes */}
        {pendingTasks.length === 0 && doneTasks.length === 0 ? (
          <div className="bg-card border border-border p-8 text-center">
            <ClipboardList size={32} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No hay tareas pendientes.</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Agregá pedidos a medida o recordatorios.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingTasks.map(task => (
              <div key={task.id} className={`bg-card border p-4 flex gap-4 items-start ${
                isOverdue(task.deadline) ? "border-red-500/30" : "border-border"
              }`}>
                <button onClick={() => toggleDone(task.id)}
                  className="w-5 h-5 border-2 border-border flex-shrink-0 mt-0.5 flex items-center justify-center hover:border-primary transition-colors rounded-sm">
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-medium">{task.title}</p>
                    <span className={`text-[10px] px-2 py-0.5 border rounded-sm font-medium uppercase tracking-wider ${PRIORITY_COLORS[task.priority]}`}>
                      {task.priority}
                    </span>
                    {isOverdue(task.deadline) && (
                      <span className="text-[10px] px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-sm font-medium uppercase tracking-wider">
                        Vencida
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{task.description}</p>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar size={11} />
                    <span>Entrega: <span className={isOverdue(task.deadline) ? "text-red-400 font-medium" : "text-foreground"}>
                      {new Date(task.deadline + "T12:00:00").toLocaleDateString("es-AR", {day:"2-digit",month:"2-digit",year:"numeric"})}
                    </span></span>
                  </div>
                </div>
                <button onClick={() => deleteTask(task.id)}
                  className="text-muted-foreground hover:text-red-400 transition-colors flex-shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            {/* Tareas completadas */}
            {doneTasks.length > 0 && (
              <details className="mt-4">
                <summary className="text-xs uppercase tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors flex items-center gap-2 py-2">
                  <Check size={12} className="text-green-400" />
                  {doneTasks.length} tarea{doneTasks.length !== 1 ? "s" : ""} completada{doneTasks.length !== 1 ? "s" : ""}
                </summary>
                <div className="space-y-2 mt-2">
                  {doneTasks.map(task => (
                    <div key={task.id} className="bg-card/50 border border-border/50 p-3 flex gap-3 items-start opacity-60">
                      <button onClick={() => toggleDone(task.id)}
                        className="w-5 h-5 border-2 border-green-500 flex-shrink-0 mt-0.5 flex items-center justify-center rounded-sm bg-green-500/10">
                        <Check size={10} className="text-green-400" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-through text-muted-foreground">{task.title}</p>
                      </div>
                      <button onClick={() => deleteTask(task.id)}
                        className="text-muted-foreground hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


// ─── Categories Panel ─────────────────────────────────────────────────────────
function CategoriesPanel() {
  const { categories, loading, add, remove, rename } = useCategories();
  const [newCat, setNewCat] = useState("");
  const [editingCat, setEditingCat] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!newCat.trim()) { setError("Escribí el nombre de la categoría"); return; }
    setSaving(true);
    const ok = await add(newCat);
    setSaving(false);
    if (!ok) { setError("Esa categoría ya existe"); return; }
    setNewCat(""); setError("");
  };

  const handleRename = async (id: number) => {
    if (!editValue.trim()) { setError("El nombre no puede estar vacío"); return; }
    setSaving(true);
    const ok = await rename(id, editValue);
    setSaving(false);
    if (!ok) { setError("Ese nombre ya existe"); return; }
    setEditingCat(null); setEditValue(""); setError("");
  };

  const handleRemove = async (id: number) => {
    if (categories.length <= 1) { setError("Debe haber al menos una categoría"); return; }
    setSaving(true);
    const ok = await remove(id);
    setSaving(false);
    if (!ok) setError("No se pudo eliminar la categoría");
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-xl font-display mb-2">Categorías de Productos</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Estas categorías aparecen en el formulario de nuevo producto y en los filtros del catálogo.
          Los cambios se guardan automáticamente.
        </p>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-red-400 px-4 py-2 text-sm mb-4 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError("")}><X size={13} /></button>
          </div>
        )}

        {/* Lista de categorías */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="animate-spin text-primary" />
          </div>
        ) : (
        <div className="space-y-2 mb-6">
          {categories.map(cat => (
            <div key={cat.id} className="bg-card border border-border px-4 py-3 flex items-center gap-3">
              {editingCat === cat.id ? (
                <>
                  <input
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleRename(cat.id); if (e.key === "Escape") { setEditingCat(null); setError(""); } }}
                    autoFocus
                    className="flex-1 bg-background border border-primary px-3 py-1.5 text-sm focus:outline-none"
                  />
                  <button onClick={() => handleRename(cat.id)} disabled={saving}
                    className="p-1.5 text-green-400 hover:bg-green-500/10 rounded transition-colors disabled:opacity-50">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  </button>
                  <button onClick={() => { setEditingCat(null); setError(""); }}
                    className="p-1.5 text-muted-foreground hover:bg-card rounded transition-colors">
                    <X size={14} />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm capitalize font-medium">{cat.name}</span>
                  <button
                    onClick={() => { setEditingCat(cat.id); setEditValue(cat.name); setError(""); }}
                    className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleRemove(cat.id)} disabled={saving}
                    className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50">
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-6">No hay categorías. Agregá la primera.</p>
          )}
        </div>
        )}

        {/* Agregar nueva categoría */}
        <div className="border border-border p-4 bg-card/50">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Nueva Categoría</p>
          <div className="flex gap-2">
            <input
              value={newCat}
              onChange={e => { setNewCat(e.target.value); setError(""); }}
              onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}
              placeholder="Ej: pulseras, broches, tobilleras..."
              className="flex-1 bg-background border border-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
            <button onClick={handleAdd}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors">
              <Plus size={13} /> Agregar
            </button>
          </div>
        </div>

        {/* Nota */}
        <p className="text-xs text-muted-foreground/60 mt-4">
          ⚠️ Renombrar o eliminar una categoría no afecta los productos que ya la tienen asignada. 
          Para reasignarlos editá cada producto manualmente.
        </p>
      </div>
    </div>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [search, setSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [orderSort, setOrderSort] = useState<"date_desc" | "date_asc" | "total_desc" | "total_asc" | "qty_desc" | "qty_asc">("date_desc");

  const { data: products = [], isLoading: loadingProducts } = useAdminProducts();
  const { data: orders = [], isLoading: loadingOrders } = useAdminOrders(orderStatusFilter || undefined, tab === "orders" || tab === "dashboard");

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const statusMutation = useUpdateOrderStatus();

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (data: Partial<Product>) => {
    try { await createMutation.mutateAsync(data as any); setIsCreating(false); }
    catch (err: any) { setGlobalError(err.message || "Error al crear el producto"); }
  };

  const handleUpdate = async (data: Partial<Product>) => {
    if (!editingProduct?.id) return;
    try { await updateMutation.mutateAsync({ id: editingProduct.id, data }); setEditingProduct(null); }
    catch (err: any) { setGlobalError(err.message || "Error al actualizar"); }
  };

  const handleDelete = async (id: number) => {
    try { await deleteMutation.mutateAsync(id); setDeleteConfirm(null); }
    catch (err: any) { setGlobalError(err.message || "No se pudo eliminar"); setDeleteConfirm(null); }
  };

  const handleExport = async () => {
    setExportLoading(true); setExportError(null);
    try {
      const token = sessionStorage.getItem("luxe_admin_token") || "";
      if (!token) throw new Error("No hay sesión activa");
      const url = api.admin.exportExcel(dateFrom || undefined, dateTo || undefined);
      const res = await fetch(url, { headers: { "x-admin-token": token } });
      if (!res.ok) throw new Error(`Error ${res.status}`);
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

  const TABS = [
    { id: "dashboard",   label: "Dashboard",    icon: BarChart3 },
    { id: "products",    label: "Productos",    icon: Package },
    { id: "orders",      label: "Órdenes",      icon: ShoppingCart },
    { id: "pending",     label: "Pendientes",   icon: ClipboardList },
    { id: "categorias",  label: "Categorías",   icon: Hash },
  ] as const;

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-display mb-1">Panel del Negocio</h1>
          </div>
          <button onClick={onLogout}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground border border-border px-4 py-2 transition-colors">
            <LogOut size={13} /> Salir
          </button>
        </div>

        {globalError && (
          <div className="bg-destructive/10 border border-destructive/30 text-red-400 px-4 py-3 text-sm mb-6 flex items-center justify-between rounded">
            <span>{globalError}</span>
            <button onClick={() => setGlobalError(null)}><X size={14} /></button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm uppercase tracking-widest border-b-2 transition-colors -mb-px ${
                tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              <t.icon size={15} />{t.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {tab === "dashboard" && (
          <Dashboard orders={orders} products={products} />
        )}

        {/* Pending Tab */}
        {tab === "pending" && (
          <PendingPanel products={products} />
        )}

        {/* Categorías Tab */}
        {tab === "categorias" && (
          <CategoriesPanel />
        )}

        {/* Products Tab */}
        {tab === "products" && (
          <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
              <div className="relative flex-1 max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto..."
                  className="w-full bg-card border border-border pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary" />
              </div>
              <button onClick={() => setIsCreating(true)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-sm uppercase tracking-widest hover:bg-primary/90 transition-colors">
                <Plus size={16} />Nuevo Producto
              </button>
            </div>

            {loadingProducts ? (
              <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin text-primary" /></div>
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
                            <div className="w-10 h-10 bg-muted border border-border flex-shrink-0 overflow-hidden flex items-center justify-center text-xs">
                              {product.image
                                ? <img src={product.image} alt="" className="w-full h-full object-cover"
                                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                                : "—"}
                            </div>
                            <div>
                              <p className="font-medium line-clamp-1">{product.name}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star size={10} className="fill-primary text-primary" />{product.rating} ({product.reviews})
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
                          <button onClick={() => updateMutation.mutate({ id: product.id, data: { active: !product.active } })}
                            className={`px-3 py-1 text-xs uppercase tracking-wider rounded-sm transition-colors ${
                              product.active ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-muted text-muted-foreground"
                            }`}>{product.active ? "Activo" : "Inactivo"}</button>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => updateMutation.mutate({ id: product.id, data: { featured: !product.featured } })}
                            className={`px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                              product.featured ? "text-primary border border-primary/50 hover:bg-primary/10" : "text-muted-foreground border border-border"
                            }`}>{product.featured ? "Sí" : "No"}</button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setEditingProduct(product)}
                              className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded">
                              <Pencil size={15} />
                            </button>
                            {deleteConfirm === product.id ? (
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleDelete(product.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded"><Check size={15} /></button>
                                <button onClick={() => setDeleteConfirm(null)} className="p-1.5 text-muted-foreground hover:bg-card rounded"><X size={15} /></button>
                              </div>
                            ) : (
                              <button onClick={() => setDeleteConfirm(product.id)}
                                className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded">
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && <p className="text-center text-muted-foreground py-12">No hay productos.</p>}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-between items-start flex-wrap">
              <div className="flex items-center gap-3 flex-wrap">
                {/* Filtro por estado */}
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
                {/* Ordenamiento */}
                <div className="relative">
                  <select value={orderSort} onChange={e => setOrderSort(e.target.value as any)}
                    className="bg-card border border-border pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer">
                    <optgroup label="Por fecha">
                      <option value="date_desc">Más recientes primero</option>
                      <option value="date_asc">Más antiguas primero</option>
                    </optgroup>
                    <optgroup label="Por monto">
                      <option value="total_desc">Mayor monto primero</option>
                      <option value="total_asc">Menor monto primero</option>
                    </optgroup>
                    <optgroup label="Por cantidad">
                      <option value="qty_desc">Mayor cantidad primero</option>
                      <option value="qty_asc">Menor cantidad primero</option>
                    </optgroup>
                  </select>
                  <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
                </div>
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
                <span>{exportError}</span>
                <button onClick={() => setExportError(null)}><X size={14} /></button>
              </div>
            )}

            {loadingOrders ? (
              <div className="flex items-center justify-center py-20"><Loader2 size={28} className="animate-spin text-primary" /></div>
            ) : (
              <div className="space-y-3">
                {[...orders]
                  .sort((a, b) => {
                    switch(orderSort) {
                      case "date_desc": return new Date(b.created_at||0).getTime() - new Date(a.created_at||0).getTime();
                      case "date_asc":  return new Date(a.created_at||0).getTime() - new Date(b.created_at||0).getTime();
                      case "total_desc": return (b.total||0) - (a.total||0);
                      case "total_asc":  return (a.total||0) - (b.total||0);
                      case "qty_desc": return (b.items?.reduce((s:number,i:any)=>s+i.quantity,0)||0) - (a.items?.reduce((s:number,i:any)=>s+i.quantity,0)||0);
                      case "qty_asc":  return (a.items?.reduce((s:number,i:any)=>s+i.quantity,0)||0) - (b.items?.reduce((s:number,i:any)=>s+i.quantity,0)||0);
                      default: return 0;
                    }
                  })
                  .map(order => (
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
                        <div className="text-sm text-muted-foreground mb-3">
                          {order.items.map((item: any) => (
                            <span key={item.id} className="inline-block mr-3">{item.product_name} ×{item.quantity}</span>
                          ))}
                        </div>

                        {/* Datos de envío — ingresados por el cliente */}
                        {order.shipping_address && (
                          <div className="mt-3 p-3 bg-background border border-border/50 rounded-sm space-y-1.5">
                            <p className="text-xs uppercase tracking-widest text-primary font-medium mb-2">Datos de Envío</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                              {order.shipping_name && (
                                <span className="flex items-center gap-1.5 text-xs text-foreground">
                                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                  {order.shipping_name}
                                </span>
                              )}
                              {order.shipping_dni && (
                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                                  DNI: {order.shipping_dni}
                                </span>
                              )}
                              {order.shipping_phone && (
                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.09 6.09l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                  {order.shipping_phone}
                                </span>
                              )}
                              {order.shipping_zip && (
                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                  CP: {order.shipping_zip}
                                </span>
                              )}
                              {order.shipping_address && (
                                <span className="flex items-center gap-1.5 text-xs text-muted-foreground sm:col-span-2">
                                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                                  {order.shipping_address}
                                </span>
                              )}
                              {order.shipping_notes && (
                                <span className="flex items-start gap-1.5 text-xs text-muted-foreground/70 sm:col-span-2 italic">
                                  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="mt-0.5 flex-shrink-0"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                                  {order.shipping_notes}
                                </span>
                              )}
                            </div>
                          </div>
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
                {orders.length === 0 && <p className="text-center text-muted-foreground py-12">No hay órdenes.</p>}
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {isCreating && <ProductForm onSave={handleCreate} onClose={() => setIsCreating(false)} loading={createMutation.isPending} />}
        {editingProduct && <ProductForm initial={editingProduct} onSave={handleUpdate} onClose={() => setEditingProduct(null)} loading={updateMutation.isPending} />}
      </AnimatePresence>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function Admin() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const saved = sessionStorage.getItem("luxe_admin_token");
    if (!saved) { setChecking(false); return; }
    api.admin.verifyToken(saved)
      .then(() => setAuthToken(saved))
      .catch(() => sessionStorage.removeItem("luxe_admin_token"))
      .finally(() => setChecking(false));
  }, []);

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-primary" />
    </div>
  );

  if (!authToken) return <AdminLogin onLogin={setAuthToken} />;
  return <AdminPanel onLogout={() => { sessionStorage.removeItem("luxe_admin_token"); setAuthToken(null); }} />;
}

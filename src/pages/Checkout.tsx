// src/pages/Checkout.tsx
import { useState, useEffect } from "react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/utils";
import { Link } from "wouter";
import {
  ShieldCheck, ArrowLeft, CheckCircle2, Loader2,
  AlertTriangle, Clock, XCircle, User, CreditCard,
  Phone, MapPin, Hash
} from "lucide-react";
import { api } from "@/lib/api";
import type { Product } from "@/lib/api";

type ReturnStatus = "success" | "failure" | "pending" | null;
type PriceChange  = { name: string; oldPrice: number; newPrice: number };

interface ShippingForm {
  name:    string;
  dni:     string;
  phone:   string;
  address: string;
  zip:     string;
  notes:   string;
}

function getMPReturnStatus(): ReturnStatus {
  const s = new URLSearchParams(window.location.search).get("status");
  if (s === "success") return "success";
  if (s === "failure")  return "failure";
  if (s === "pending")  return "pending";
  return null;
}

function ReturnScreen({ status }: { status: NonNullable<ReturnStatus> }) {
  const cfg = {
    success: { icon: CheckCircle2, iconClass: "text-primary",    bgClass: "bg-primary/20",    title: "¡Compra Exitosa!",  msg: "Tu orden fue procesada. En breve recibirás confirmación del envío." },
    failure: { icon: XCircle,      iconClass: "text-red-400",    bgClass: "bg-red-500/20",    title: "Pago rechazado",    msg: "No se pudo procesar el pago. Podés intentarlo de nuevo." },
    pending: { icon: Clock,        iconClass: "text-yellow-400", bgClass: "bg-yellow-500/20", title: "Pago pendiente",    msg: "Tu pago está siendo procesado. Te notificaremos cuando se acredite." },
  }[status];
  const Icon = cfg.icon;
  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-background px-4">
      <div className="bg-card p-10 border border-border rounded-lg text-center max-w-lg w-full shadow-2xl">
        <div className={`w-20 h-20 ${cfg.bgClass} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <Icon size={40} className={cfg.iconClass} />
        </div>
        <h1 className="text-4xl font-display mb-4">{cfg.title}</h1>
        <p className="text-muted-foreground mb-8">{cfg.msg}</p>
        <Link href="/productos" className="inline-block bg-primary text-primary-foreground px-8 py-3 uppercase tracking-widest text-sm font-medium hover:bg-primary/90 transition-colors w-full text-center">
          {status === "failure" ? "Volver al catálogo" : "Seguir Comprando"}
        </Link>
      </div>
    </div>
  );
}

function InputField({
  label, icon: Icon, value, onChange, placeholder, type = "text", required = true
}: {
  label: string; icon: any; value: string;
  onChange: (v: string) => void; placeholder: string;
  type?: string; required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground flex items-center gap-1.5">
        <Icon size={11} />
        {label}{required && <span className="text-primary">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-background border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50"
      />
    </div>
  );
}

export default function Checkout() {
  const { items, clearCart } = useCart();
  const [isLoading,     setIsLoading]     = useState(false);
  const [isVerifying,   setIsVerifying]   = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [freshProducts, setFreshProducts] = useState<Product[]>([]);
  const [priceChanges,  setPriceChanges]  = useState<PriceChange[]>([]);
  const [formErrors,    setFormErrors]    = useState<Partial<ShippingForm>>({});

  const [shipping, setShipping] = useState<ShippingForm>({
    name: "", dni: "", phone: "", address: "", zip: "", notes: ""
  });

  const setField = (field: keyof ShippingForm) => (value: string) => {
    setShipping(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: undefined }));
  };

  useEffect(() => {
    if (items.length === 0) { setIsVerifying(false); return; }
    Promise.all(items.map(item => api.products.get(item.product.id)))
      .then(fresh => {
        setFreshProducts(fresh);
        const changes: PriceChange[] = [];
        items.forEach(item => {
          const f = fresh.find(p => p.id === item.product.id);
          if (f && f.price !== item.product.price)
            changes.push({ name: item.product.name, oldPrice: item.product.price, newPrice: f.price });
        });
        setPriceChanges(changes);
      })
      .catch(() => {})
      .finally(() => setIsVerifying(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const returnStatus = getMPReturnStatus();
  if (returnStatus) return <ReturnScreen status={returnStatus} />;

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-background px-4">
        <h1 className="text-3xl font-display mb-4">Tu carrito está vacío</h1>
        <Link href="/productos" className="text-primary hover:underline uppercase tracking-widest text-sm">
          Explorar productos
        </Link>
      </div>
    );
  }

  const getPrice  = (id: number, fallback: number) => freshProducts.find(p => p.id === id)?.price ?? fallback;
  const cartTotal = items.reduce((s, i) => s + getPrice(i.product.id, i.product.price) * i.quantity, 0);

  const validateForm = (): boolean => {
    const errors: Partial<ShippingForm> = {};
    if (!shipping.name.trim())    errors.name    = "Requerido";
    if (!shipping.dni.trim())     errors.dni     = "Requerido";
    if (!shipping.phone.trim())   errors.phone   = "Requerido";
    if (!shipping.address.trim()) errors.address = "Requerido";
    if (!shipping.zip.trim())     errors.zip     = "Requerido";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePay = async () => {
    if (!validateForm()) {
      setError("Completá todos los campos obligatorios antes de continuar.");
      return;
    }
    setIsLoading(true); setError(null);
    try {
      const origin = window.location.origin;
      const result = await api.payments.createPreference({
        items: items.map(i => ({
          productId: i.product.id, name: i.product.name,
          price: i.product.price,  quantity: i.quantity, image: i.product.image,
        })),
        backUrls: {
          success: `${origin}/checkout?status=success`,
          failure: `${origin}/checkout?status=failure`,
          pending: `${origin}/checkout?status=pending`,
        },
        shippingData: {
          name:    shipping.name.trim(),
          dni:     shipping.dni.trim(),
          phone:   shipping.phone.trim(),
          address: shipping.address.trim(),
          zip:     shipping.zip.trim(),
          notes:   shipping.notes.trim(),
        },
      });

      const isProd = import.meta.env.VITE_MP_PRODUCTION === "true";
      const url    = isProd ? result.initPoint : result.sandboxInitPoint;

      if (url) {
        clearCart();
        window.location.href = url;
      } else {
        clearCart();
        window.location.search = "?status=success";
      }
    } catch (err: any) {
      setError(err?.message ?? "Error al procesar el pago.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/productos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} />Seguir comprando
          </Link>
        </div>
        <h1 className="text-4xl font-display mb-10">Finalizar Compra</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 order-2 lg:order-1 space-y-6">

            {/* ── Formulario de envío ── */}
            <div className="bg-card border border-border p-8 rounded-md shadow-lg">
              <h2 className="text-xl font-display mb-6 flex items-center gap-2">
                <MapPin className="text-primary" size={22} />
                Datos de Envío
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <InputField
                    label="Nombre completo" icon={User}
                    value={shipping.name} onChange={setField("name")}
                    placeholder="Juan García"
                  />
                  {formErrors.name && <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <InputField
                    label="DNI" icon={CreditCard}
                    value={shipping.dni} onChange={setField("dni")}
                    placeholder="12345678"
                  />
                  {formErrors.dni && <p className="text-red-400 text-xs mt-1">{formErrors.dni}</p>}
                </div>

                <div>
                  <InputField
                    label="Teléfono / WhatsApp" icon={Phone}
                    value={shipping.phone} onChange={setField("phone")}
                    placeholder="+54 9 11 1234-5678" type="tel"
                  />
                  {formErrors.phone && <p className="text-red-400 text-xs mt-1">{formErrors.phone}</p>}
                </div>

                <div className="sm:col-span-2">
                  <InputField
                    label="Dirección de envío" icon={MapPin}
                    value={shipping.address} onChange={setField("address")}
                    placeholder="Av. Corrientes 1234, Piso 3, Dpto B"
                  />
                  {formErrors.address && <p className="text-red-400 text-xs mt-1">{formErrors.address}</p>}
                </div>

                <div>
                  <InputField
                    label="Código Postal" icon={Hash}
                    value={shipping.zip} onChange={setField("zip")}
                    placeholder="1414"
                  />
                  {formErrors.zip && <p className="text-red-400 text-xs mt-1">{formErrors.zip}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
                    Notas adicionales <span className="normal-case text-muted-foreground/50">(opcional)</span>
                  </label>
                  <textarea
                    value={shipping.notes}
                    onChange={e => setField("notes")(e.target.value)}
                    placeholder="Instrucciones para el envío, horarios, etc."
                    rows={3}
                    className="w-full bg-background border border-border px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-muted-foreground/50 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* ── Pago ── */}
            <div className="bg-card border border-border p-8 rounded-md shadow-lg">
              <h2 className="text-xl font-display mb-6 flex items-center gap-2">
                <ShieldCheck className="text-primary" size={24} />Pago Seguro con Mercado Pago
              </h2>

              {priceChanges.length > 0 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 p-4 rounded mb-6 text-sm">
                  <div className="flex items-center gap-2 font-medium mb-2"><AlertTriangle size={16} />Precios actualizados</div>
                  {priceChanges.map(c => (
                    <p key={c.name} className="text-xs mt-1">
                      {c.name}: <span className="line-through opacity-60">{formatPrice(c.oldPrice)}</span> → {formatPrice(c.newPrice)}
                    </p>
                  ))}
                </div>
              )}

              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                Serás redirigido de forma segura a Mercado Pago para completar tu compra.
              </p>

              {error && (
                <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded mb-6 text-sm">
                  <p className="font-medium mb-1">Error al procesar el pago</p>
                  <p>{error}</p>
                </div>
              )}

              <button onClick={handlePay} disabled={isLoading || isVerifying}
                className="w-full bg-primary text-primary-foreground py-5 uppercase tracking-widest text-sm font-medium flex items-center justify-center gap-3 hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(204,153,51,0.3)]">
                {isLoading || isVerifying
                  ? <><Loader2 size={18} className="animate-spin" />{isVerifying ? "Verificando precios..." : "Procesando..."}</>
                  : <><ShieldCheck size={18} />Pagar con Mercado Pago</>}
              </button>
            </div>

            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
              <ShieldCheck size={14} /> Pagos encriptados por Mercado Pago.
            </p>
          </div>

          {/* ── Resumen del pedido ── */}
          <div className="w-full lg:w-[400px] order-1 lg:order-2">
            <div className="bg-card border border-border p-6 sticky top-28 shadow-xl">
              <h3 className="text-xl font-display mb-6 border-b border-border pb-4">Resumen del Pedido</h3>
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.map(item => {
                  const price   = getPrice(item.product.id, item.product.price);
                  const changed = freshProducts.length > 0
                    && freshProducts.find(p => p.id === item.product.id)?.price !== item.product.price;
                  return (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="w-16 h-16 bg-muted border border-border flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {item.product.image
                          ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover"
                              onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          : <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm line-clamp-1">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">Cant: {item.quantity}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-primary text-sm font-medium">{formatPrice(price * item.quantity)}</p>
                          {changed && <span className="text-xs text-yellow-500 line-through">{formatPrice(item.product.price * item.quantity)}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span><span>{isVerifying ? "…" : formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Envío</span><span className="text-primary uppercase text-xs">Gratis</span>
                </div>
                <div className="flex justify-between text-lg font-display text-foreground pt-4 border-t border-border font-medium">
                  <span>Total</span><span className="text-primary">{isVerifying ? "…" : formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

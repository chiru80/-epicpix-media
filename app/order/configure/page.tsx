"use client";

import { useState, useEffect, Suspense } from "react";
import { z } from "zod";
import { formatINRSimple, calculateDepositINR, calculateTotalWithGSTINR } from "@/lib/utils";
import { SERVICES_CATALOG } from "@/app/services/catalog";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Sparkles, Check, ArrowRight, ShieldCheck, Clock, Zap } from "lucide-react";
import { GlassCard, GlassPanel, GlassBadge, GlassButton, GlassSwitch } from "@/components/ui/glisse";

interface AddOn {
  id: string;
  name: string;
  price: number;
  description?: string;
  selected?: boolean;
}

interface OrderFormState {
  service: string;
  tier: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  projectDescription: string;
  deliveryNotes?: string;
  addOns: AddOn[];
  rushDelivery: boolean;
}

const RUSH_DELIVERY_FEE = 2500;

const getAddOnsForService = (service: string): AddOn[] => {
  const catalogService = SERVICES_CATALOG[service as keyof typeof SERVICES_CATALOG];
  if (!catalogService) return [];
  return catalogService.addOns || [];
};

const getBasePrice = (service: string): number => {
  const catalogService = SERVICES_CATALOG[service as keyof typeof SERVICES_CATALOG];
  return catalogService?.basePrice || 0;
};

const getTiersForService = (service: string): string[] => {
  const catalogService = SERVICES_CATALOG[service as keyof typeof SERVICES_CATALOG];
  const tier = (catalogService as any)?.tier;
  return tier ? [tier] : ["Standard"];
};

const calculateTotal = (
  service: string,
  addOns: AddOn[],
  rushDelivery: boolean
): number => {
  let total = getBasePrice(service);
  const addOnTotal = addOns.filter((a) => a.selected).reduce((sum, a) => sum + a.price, 0);
  total += addOnTotal;
  if (rushDelivery) total += RUSH_DELIVERY_FEE;
  return total;
};

const getServiceName = (service: string): string => {
  const catalogService = SERVICES_CATALOG[service as keyof typeof SERVICES_CATALOG];
  return catalogService?.name || service;
};

function ConfigureOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service") || "video_pro";

  const initializeForm = (svc: string): OrderFormState => ({
    service: svc,
    tier: getTiersForService(svc)[0] || "Standard",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    projectDescription: "",
    deliveryNotes: "",
    addOns: getAddOnsForService(svc).map((a) => ({ ...a, selected: false })),
    rushDelivery: false,
  });

  const [form, setForm] = useState<OrderFormState>(() => initializeForm(serviceParam));
  const [total, setTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (serviceParam && serviceParam !== form.service && SERVICES_CATALOG[serviceParam as keyof typeof SERVICES_CATALOG]) {
      setForm(initializeForm(serviceParam));
    }
  }, [serviceParam, form.service]);

  useEffect(() => {
    setTotal(calculateTotal(form.service, form.addOns, form.rushDelivery));
  }, [form.service, form.addOns, form.rushDelivery]);

  const formSchema = z.object({
    service: z.string(),
    tier: z.string(),
    clientName: z.string().min(2, "Client name must be at least 2 characters"),
    clientEmail: z.string().email("Please enter a valid email address"),
    clientPhone: z.string().optional(),
    projectDescription: z.string().min(10, "Description must be at least 10 characters"),
    deliveryNotes: z.string().optional(),
    rushDelivery: z.boolean().default(false),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    const result = formSchema.safeParse(form);
    if (!result.success) {
      const newFieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) newFieldErrors[issue.path[0].toString()] = issue.message;
      });
      setFieldErrors(newFieldErrors);
      setFormError("Please resolve the highlighted fields below.");
      setSubmitting(false);
      return;
    }

    try {
      const supabase = createClient();
      const gstDetails = calculateTotalWithGSTINR(total);
      const { deposit, remaining } = calculateDepositINR(gstDetails.total);
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("orders")
        .insert({
          client_id: currentUser?.id || null,
          service_type: form.service,
          package_tier: form.tier,
          status: "pending",
          payment_status: "pending",
          base_price: getBasePrice(form.service),
          add_ons_price: form.addOns.filter((a) => a.selected).reduce((sum, a) => sum + a.price, 0),
          total_price: gstDetails.total,
          deposit_percentage: 25,
          deposit_amount: deposit,
          remaining_balance: remaining,
          project_description: form.projectDescription,
          client_notes: `Client: ${form.clientName} (${form.clientEmail})`,
        })
        .select()
        .single();

      if (error) throw error;

      if (data?.id) {
        router.push(`/order/pay/${data.id}`);
      } else {
        router.push("/services");
      }
    } catch (err: any) {
      console.error("Order creation error:", err);
      setFormError(err.message || "Failed to create order. Please check inputs and retry.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddOnToggle = (id: string) => {
    setForm((prev) => ({
      ...prev,
      addOns: prev.addOns.map((a) => (a.id === id ? { ...a, selected: !a.selected } : a)),
    }));
  };

  const gstDetails = calculateTotalWithGSTINR(total);
  const { deposit, remaining } = calculateDepositINR(gstDetails.total);

  return (
    <main className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <GlassBadge variant="primary" size="default" className="mb-3">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Project Configurator</span>
          </GlassBadge>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-3">
            Configure Your Production
          </h1>
          <p className="text-sm text-muted-foreground">
            Select packages, optional add-ons, and provide your creative brief.
          </p>
        </div>

        {formError && (
          <div className="mb-8 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <GlassPanel className="p-7">
              <h3 className="font-display font-bold text-xl text-foreground mb-6">
                1. Service & Package
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                    Selected Service
                  </label>
                  <select
                    value={form.service}
                    onChange={(e) => setForm(initializeForm(e.target.value))}
                    className="w-full h-11 rounded-xl bg-black/50 border border-white/10 px-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all backdrop-blur-md"
                  >
                    {Object.values(SERVICES_CATALOG).map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({formatINRSimple(s.basePrice)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                    Package Tier
                  </label>
                  <div className="flex gap-2">
                    {getTiersForService(form.service).map((tier) => (
                      <span
                        key={tier}
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary/20 text-primary border border-primary/30"
                      >
                        {tier} Tier
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassPanel>

            <GlassPanel className="p-7">
              <h3 className="font-display font-bold text-xl text-foreground mb-6">
                2. Add-ons & Fast Delivery
              </h3>

              <div className="space-y-3 mb-6">
                {form.addOns.map((addOn) => (
                  <div
                    key={addOn.id}
                    onClick={() => handleAddOnToggle(addOn.id)}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      addOn.selected
                        ? "bg-primary/10 border-primary/40 ring-1 ring-primary/20"
                        : "bg-black/30 border-white/5 hover:border-white/15"
                    }`}
                  >
                    <div>
                      <span className="text-sm font-semibold text-foreground block">{addOn.name}</span>
                      {addOn.description && (
                        <span className="text-xs text-muted-foreground">{addOn.description}</span>
                      )}
                    </div>
                    <span className="text-sm font-bold text-sky-400">
                      +{formatINRSimple(addOn.price)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl glass-card border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-foreground block">⚡ Rush Delivery</span>
                  <span className="text-xs text-muted-foreground">Reduces standard delivery turnaround by ~50%</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-primary">+{formatINRSimple(RUSH_DELIVERY_FEE)}</span>
                  <input
                    type="checkbox"
                    checked={form.rushDelivery}
                    onChange={(e) => setForm((prev) => ({ ...prev, rushDelivery: e.target.checked }))}
                    className="w-5 h-5 rounded border-white/20 text-primary focus:ring-primary/40"
                  />
                </div>
              </div>
            </GlassPanel>

            <GlassPanel className="p-7">
              <h3 className="font-display font-bold text-xl text-foreground mb-6">
                3. Creative Brief & Contact
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.clientName}
                      onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-black/40 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50"
                      placeholder="e.g. Vikram Singhania"
                    />
                    {fieldErrors.clientName && (
                      <p className="text-xs text-destructive mt-1">{fieldErrors.clientName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.clientEmail}
                      onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl bg-black/40 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50"
                      placeholder="name@company.com"
                    />
                    {fieldErrors.clientEmail && (
                      <p className="text-xs text-destructive mt-1">{fieldErrors.clientEmail}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/80 mb-2">
                    Project Brief & Goals *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.projectDescription}
                    onChange={(e) => setForm({ ...form, projectDescription: e.target.value })}
                    className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 resize-none"
                    placeholder="Describe your creative requirements, target platforms (YouTube, Reels, TV), branding guidelines, and links to raw assets..."
                  />
                  {fieldErrors.projectDescription && (
                    <p className="text-xs text-destructive mt-1">{fieldErrors.projectDescription}</p>
                  )}
                </div>
              </div>
            </GlassPanel>
          </div>

          {/* Pricing & Checkout Summary Sidebar (1 col) */}
          <div className="space-y-6">
            <GlassPanel glow className="p-6 sticky top-24">
              <h3 className="font-display font-bold text-lg text-foreground mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs pb-4 border-b border-white/10">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Base</span>
                  <span className="text-foreground font-medium">{formatINRSimple(getBasePrice(form.service))}</span>
                </div>

                {form.addOns.filter((a) => a.selected).map((a) => (
                  <div key={a.id} className="flex justify-between text-muted-foreground">
                    <span>+ {a.name}</span>
                    <span>{formatINRSimple(a.price)}</span>
                  </div>
                ))}

                {form.rushDelivery && (
                  <div className="flex justify-between text-sky-400">
                    <span>+ Rush Delivery</span>
                    <span>{formatINRSimple(RUSH_DELIVERY_FEE)}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 py-4 border-b border-white/10 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-semibold">{formatINRSimple(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span className="text-foreground font-semibold">{formatINRSimple(gstDetails.gst)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-primary pt-2">
                  <span>Total with Tax:</span>
                  <span>{formatINRSimple(gstDetails.total)}</span>
                </div>
              </div>

              <div className="py-4 space-y-1 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Escrow Deposit (25%):</span>
                  <strong className="text-foreground">{formatINRSimple(deposit)}</strong>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Remaining on Delivery:</span>
                  <span>{formatINRSimple(remaining)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 shadow-lg shadow-primary/25 border border-primary/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
              >
                {submitting ? (
                  <span>Generating Order...</span>
                ) : (
                  <>
                    <span>Proceed to Escrow Pay</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <span className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Backed by YouPI-PG Escrow Protection</span>
                </span>
              </div>
            </GlassPanel>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function ConfigureOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading configurator...</p>
        </div>
      }
    >
      <ConfigureOrderContent />
    </Suspense>
  );
}

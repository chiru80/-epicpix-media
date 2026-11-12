"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { formatINR, formatINRSimple, calculateDepositINR, calculateTotalWithGSTINR } from "@/lib/utils";
import { SERVICES_CATALOG } from "@/app/services/catalog";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

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

// Rush delivery flat fee in INR
const RUSH_DELIVERY_FEE = 2500; // ₹2,500

// Map service to add-ons from catalog
const getAddOnsForService = (service: string): AddOn[] => {
  const catalogService = SERVICES_CATALOG[service as keyof typeof SERVICES_CATALOG];
  if (!catalogService) return [];
  return catalogService.addOns || [];
};

// Calculate base price from catalog
const getBasePrice = (service: string): number => {
  const catalogService = SERVICES_CATALOG[service as keyof typeof SERVICES_CATALOG];
  return catalogService?.basePrice || 0;
};

// Get tier options
const getTiersForService = (service: string): string[] => {
  const catalogService = SERVICES_CATALOG[service as keyof typeof SERVICES_CATALOG];
  const tier = (catalogService as any)?.tier;
  return tier ? [tier] : ["Standard"];
};

// Calculate total price with rush delivery
const calculateTotal = (
  service: string,
  addOns: AddOn[],
  rushDelivery: boolean
): number => {
  let total = getBasePrice(service);
  const addOnTotal = addOns.filter((a) => a.selected).reduce(
    (sum, a) => sum + a.price,
    0
  );
  total += addOnTotal;
  if (rushDelivery) total += RUSH_DELIVERY_FEE;
  return total;
};

// Service name
const getServiceName = (service: string): string => {
  const catalogService = SERVICES_CATALOG[service as keyof typeof SERVICES_CATALOG];
  return catalogService?.name || service;
};

// Initialize form state
const initializeForm = (service: string): OrderFormState => ({
  service,
  tier: getTiersForService(service)[0] || "Standard",
  clientName: "",
  clientEmail: "",
  clientPhone: "",
  projectDescription: "",
  deliveryNotes: "",
  addOns: getAddOnsForService(service).map((a) => ({ ...a, selected: false })),
  rushDelivery: false,
});

export default function OrderConfigurationPage({
  params,
}: {
  params: Promise<{ service?: string }>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<OrderFormState>(
    initializeForm((params as any).service || "thumbnail")
  );
  const [total, setTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Recalculate total when form changes
  useEffect(() => {
    setTotal(calculateTotal(form.service, form.addOns, form.rushDelivery));
  }, [form.service, form.addOns, form.rushDelivery]);

  // Validation schema
  const formSchema = z.object({
    service: z.string(),
    tier: z.string(),
    clientName: z.string().min(2, "Name must be at least 2 characters"),
    clientEmail: z.string().email("Valid email required"),
    clientPhone: z.string().optional(),
    projectDescription: z.string().min(10, "Description must be at least 10 characters"),
    deliveryNotes: z.string().optional(),
    rushDelivery: z.boolean().default(false),
    addOns: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        price: z.number(),
        selected: z.boolean(),
      })
    ),
  });

  const onSubmit = async () => {
    setSubmitting(true);
    setFormError(null);
    setFieldErrors({});

    // Validate with Zod
    const result = formSchema.safeParse({
      ...form,
      addOns: form.addOns.map((a) => ({ ...a, selected: a.selected })),
    });

    if (!result.success) {
      // Extract errors for accessible error summary
      const errors = result.error.issues.map(issue => issue.message);
      const newFieldErrors: Record<string, string> = {};

      if (result.error.issues.find(i => i.path[0] === 'clientName')) {
        newFieldErrors.clientName = 'Client name must be at least 2 characters';
      }
      if (result.error.issues.find(i => i.path[0] === 'clientEmail')) {
        newFieldErrors.clientEmail = 'Please enter a valid email address';
      }
      if (result.error.issues.find(i => i.path[0] === 'projectDescription')) {
        newFieldErrors.projectDescription = 'Project description must be at least 10 characters';
      }

      setFieldErrors(newFieldErrors);
      setFormError(`Please fix the ${errors.length} error(s) below`);
      setSubmitting(false);
      return;
    }

    // Import supabase client
    let supabase: any;
    try {
      const { createClient } = await import("@/lib/supabase");
      supabase = createClient();
    } catch (err) {
      console.error("Failed to import supabase:", err);
      setFormError("Failed to initialize order system. Please try again.");
      setSubmitting(false);
      return;
    }

    try {
      // Create order in Supabase with INR pricing
      const { deposit, remaining } = calculateDepositINR(total);
      const gstDetails = calculateTotalWithGSTINR(total);

      const { error, data } = await supabase.from("orders").insert({
        client_id: "", // Will be set after auth
        service_type: form.service,
        package_tier: form.tier,
        status: "pending",
        payment_status: "pending",
        base_price: getBasePrice(form.service),
        add_ons_price: form.addOns.filter((a) => a.selected).reduce(
          (sum, a) => sum + a.price,
          0
        ),
        total_price: gstDetails.total, // Total with GST
        deposit_percentage: 25,
        deposit_amount: deposit,
        remaining_balance: remaining,
        project_description: form.projectDescription,
        client_notes: `Client: ${form.clientName} (${form.clientEmail})`,
        delivery_deadline: calculateDeadline(form.service, form.rushDelivery),
      });

      if (error) throw error;

      // Redirect to payment page
      router.push(`/order/pay/${data.id}`);

    } catch (err) {
      console.error("Order creation error:", err);
      setFormError("Failed to create order. Please check the form and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate delivery deadline
  const calculateDeadline = (service: string, rushDelivery: boolean): string => {
    const catalogService = SERVICES_CATALOG[service as keyof typeof SERVICES_CATALOG];
    if (!catalogService) return new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

    // Parse delivery time from catalog (e.g., "5 days" -> 5)
    const deliveryStr = catalogService.delivery;
    const days = parseInt(deliveryStr.split(" ")[0]) || 5;

    // Rush delivery reduces by half
    const actualDays = rushDelivery ? Math.ceil(days / 2) : days;

    const date = new Date();
    date.setDate(date.getDate() + actualDays);
    return date.toISOString();
  };

  // Add-on click handler
  const handleAddOnToggle = (addOnId: string) =>
    setForm((prev) => ({
      ...prev,
      addOns: prev.addOns.map((a) =>
        a.id === addOnId
          ? { ...a, selected: !a.selected }
          : a
      ),
    }));

  // Rush delivery toggle
  const handleRushToggle = () =>
    setForm((prev) => ({ ...prev, rushDelivery: !prev.rushDelivery }));

  // Calculate GST and deposit for display
  const gstDetails = calculateTotalWithGSTINR(total);
  const { deposit, remaining } = calculateDepositINR(gstDetails.total);

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-display mb-8">
          Order & Pricing
        </h1>

        {/* Error Summary - accessible error container */}
        {formError && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <p className="text-sm text-destructive font-medium">{formError}</p>
          </div>
        )}

        {/* Summary card */}
        <div className="p-6 bg-card rounded-xl mb-10">
          <h3 className="text-xl font-display mb-4">Order Summary</h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Service:</span>
              <span className="font-medium">{getServiceName(form.service)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Package:</span>
              <span className="font-medium">{form.tier}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Client:</span>
              <span className="font-medium">{form.clientName || "TBD"}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium font-normal underline">
                {form.clientEmail || "TBD"}
              </span>
            </div>
          </div>

          {/* Add-ons list */}
          <div className="mt-4 pt-4 border-t">
            {form.addOns.filter((a) => a.selected).map((addOn) => (
              <div
                key={addOn.id}
                className="flex justify-between text-muted-foreground text-sm py-1"
              >
                <span>{addOn.name}</span>
                <span>{formatINRSimple(addOn.price)}</span>
              </div>
            ))}
            {form.rushDelivery && (
              <div className="flex justify-between text-muted-foreground text-sm py-1">
                <span>Rush Delivery</span>
                <span>{formatINRSimple(RUSH_DELIVERY_FEE)}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">{formatINRSimple(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">GST (18%):</span>
              <span className="font-medium">{formatINRSimple(gstDetails.gst)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t">
              <span>Total with GST:</span>
              <span>{formatINRSimple(gstDetails.total)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2">
              <span className="text-muted-foreground">Deposit (25%):</span>
              <span className="font-medium">{formatINRSimple(deposit)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Remaining:</span>
              <span className="font-medium">{formatINRSimple(remaining)}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Service</label>
            <input
              type="hidden"
              name="service"
              value={form.service}
            />
            <p className="text-muted-foreground text-sm">
              {getServiceDescription(form.service)}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Package Tier</label>
            <div className="w-full flex justify-between items-center rounded-md border border-input px-4 py-3 bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <span>{form.tier}</span>
              <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {getTiersForService(form.service).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setForm({ ...form, tier })}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 min-w-[80px] text-center"
                  tabIndex={0}
                  aria-pressed={form.tier === tier}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Client Name</label>
            <input
              type="text"
              name="clientName"
              onChange={(e) =>
                setForm({ ...form, clientName: e.target.value })
              }
              required
              className="w-full rounded-md border border-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
              placeholder="Your name"
            />
            {fieldErrors.clientName && (
              <p className="text-sm text-destructive mt-1" role="alert">{fieldErrors.clientName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              name="clientEmail"
              onChange={(e) =>
                setForm({ ...form, clientEmail: e.target.value })
              }
              required
              className="w-full rounded-md border border-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
              placeholder="you@email.com"
            />
            {fieldErrors.clientEmail && (
              <p className="text-sm text-destructive mt-1" role="alert">{fieldErrors.clientEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone (optional)</label>
            <input
              type="tel"
              name="clientPhone"
              onChange={(e) =>
                setForm({ ...form, clientPhone: e.target.value })
              }
              className="w-full rounded-md border border-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Project Description
            </label>
            <textarea
              name="projectDescription"
              onChange={(e) =>
                setForm({ ...form, projectDescription: e.target.value })
              }
              required
              rows={3}
              className="w-full rounded-md border border-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none transition-colors"
              placeholder="Describe your project... What type of video? For which platform? Any specific requirements?"
            />
            {fieldErrors.projectDescription && (
              <p className="text-sm text-destructive mt-1" role="alert">{fieldErrors.projectDescription}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Delivery Notes
            </label>
            <textarea
              name="deliveryNotes"
              onChange={(e) =>
                setForm({ ...form, deliveryNotes: e.target.value })
              }
              rows={2}
              className="w-full rounded-md border border-input px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none transition-colors"
              placeholder="Any specific requirements, brand guidelines, etc."
            />
          </div>

          {/* Add-ons section */}
          <div className="mt-8">
            <h3 className="text-lg font-display mb-4">Add-ons</h3>

            {form.service === "thumbnail" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getAddOnsForService("thumbnail").map((addOn) => (
                  <button
                    key={addOn.id}
                    type="button"
                    onClick={() => handleAddOnToggle(addOn.id)}
                    className="flex justify-between items-center w-full border rounded-lg p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    style={{
                      borderColor: form.addOns.find((a) => a.id === addOn.id)?.selected
                        ? "hsl(var(--accent))"
                        : "hsl(var(--border))",
                      backgroundColor: form.addOns.find((a) => a.id === addOn.id)?.selected
                        ? "hsl(var(--accent)/5)"
                        : "transparent",
                    }}
                  >
                    <div>
                      <span className="font-medium">{addOn.name}</span>
                      <div className="text-xs text-muted-foreground mt-0.5">{addOn.description}</div>
                    </div>
                    <span className="text-accent font-medium ml-4">{formatINRSimple(addOn.price)}</span>
                  </button>
                ))}
              </div>
            )}

            {["video_basic", "video_pro", "video_premium", "color_grading", "motion_graphics"].map((serviceKey) => (
              form.service === serviceKey && (
                <div key={serviceKey} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {getAddOnsForService(serviceKey).map((addOn) => (
                    <button
                      key={addOn.id}
                      type="button"
                      onClick={() => handleAddOnToggle(addOn.id)}
                      className="flex justify-between items-center w-full border rounded-lg p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      style={{
                        borderColor: form.addOns.find((a) => a.id === addOn.id)?.selected
                          ? "hsl(var(--accent))"
                          : "hsl(var(--border))",
                        backgroundColor: form.addOns.find((a) => a.id === addOn.id)?.selected
                          ? "hsl(var(--accent)/5)"
                          : "transparent",
                      }}
                    >
                      <div>
                        <span className="font-medium">{addOn.name}</span>
                        {addOn.description && <div className="text-xs text-muted-foreground mt-0.5">{addOn.description}</div>}
                      </div>
                      <span className="text-accent font-medium ml-4">{formatINRSimple(addOn.price)}</span>
                    </button>
                  ))}
                </div>
              )
            ))}

            <div className="mt-6 flex items-start gap-3">
              <input
                type="checkbox"
                name="rushDelivery"
                onChange={(e) => handleRushToggle()}
                id="rush"
                className="h-4 w-4 rounded border border-input focus:ring-2 focus:ring-ring focus:ring-offset-0 text-primary"
                checked={form.rushDelivery}
              />
              <label htmlFor="rush" className="text-sm text-foreground">
                Rush Delivery (+{formatINRSimple(RUSH_DELIVERY_FEE)}, reduces delivery time by ~50%)
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-primary px-6 py-4 text-base font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Processing..." : `Proceed to Payment (${formatINRSimple(deposit)} deposit)`}
          </button>
        </form>
      </div>
    </section>
  );
}

// Helper: get service description
const getServiceDescription = (service: string): string => {
  const catalogService = SERVICES_CATALOG[service as keyof typeof SERVICES_CATALOG];
  return catalogService?.description || "";
};
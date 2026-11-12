/**
 * Indian Invoice Template for EpicPix Media
 *
 * Format: Indian numbering system (lakhs/crores)
 * GST: 18% on most services
 * Payment: INR (Indian Rupees)
 */

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  clientName: string;
  clientCompany?: string;
  clientAddress?: string;
  clientCity?: string;
  clientState?: string;
  clientPIN?: string;
  clientEmail: string;
  clientPhone: string;
  service: string;
  packageTier: string;
  basePrice: number;
  addOnsPrice: number;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  depositAmount: number;
  remainingBalance: number;
  dueDate: string;
  gstNumber: string;
  paymentMethods: string[];
}

export function generateIndianInvoice(data: InvoiceData): string {
  const {
    invoiceNumber,
    date,
    clientName,
    clientCompany,
    clientAddress,
    clientCity,
    clientState,
    clientPIN,
    clientEmail,
    clientPhone,
    service,
    packageTier,
    basePrice,
    addOnsPrice,
    subtotal,
    gstAmount,
    totalAmount,
    depositAmount,
    remainingBalance,
    dueDate,
    gstNumber,
    paymentMethods,
  } = data;

  // Format numbers in Indian style
  const formatINR = (amount: number): string => {
    return `Rs ${amount.toLocaleString("en-IN")}`;
  };

  const formatDateIndian = (dateStr: string): string => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-IN", options);
  };

  return `
EPIC PIX MEDIA
============================
Invoice #${invoiceNumber}
Date: ${formatDateIndian(date)}
GSTIN: ${gstNumber}

Bill To:
${clientName}
${clientCompany || ""}
${clientAddress || ""}
${clientCity || ""}, ${clientState || ""} ${clientPIN || ""}
${clientEmail}
${clientPhone}

────────────────────────────────
Service: ${service}
Package: ${packageTier}
────────────────────────────────
BASE SERVICE: ${formatINR(basePrice)}
ADD-ONS: ${formatINR(addOnsPrice)} (if any)
────────────────────────────────
SUBTOTAL: ${formatINR(subtotal)}
GST (18%): ${formatINR(gstAmount)} - GST @ 18%
────────────────────────────────
TOTAL AMOUNT: ${formatINR(totalAmount)}
────────────────────────────────
PAID: ${formatINR(depositAmount)} (25% deposit)
REMAINING: ${formatINR(remainingBalance)}
────────────────────────────────
PAYMENT DUE: ${dueDate}
Payment Methods: ${paymentMethods.join(", ")}
GST Number: ${gstNumber}
Terms: Net 20 days, Late fee 2% per month
────────────────────────────────
Thank you for your business!
Contact: support@epicpix.media
`;
}

export function generateInvoiceSummary(data: InvoiceData): string {
  const formatINR = (amount: number): string => {
    return `Rs ${amount.toLocaleString("en-IN")}`;
  };

  return `
Invoice #${data.invoiceNumber}
Date: ${new Date(data.date).toLocaleDateString("en-IN")}
Client: ${data.clientName}
Service: ${data.service}
Package: ${data.packageTier}

Breakdown:
- Base Service: ${formatINR(data.basePrice)}
- Add-ons: ${formatINR(data.addOnsPrice)}
- Subtotal: ${formatINR(data.subtotal)}
- GST (18%): ${formatINR(data.gstAmount)}
- Total: ${formatINR(data.totalAmount)}
- Deposit Paid: ${formatINR(data.depositAmount)} (25%)
- Remaining: ${formatINR(data.remainingBalance)}

Payment Due: ${new Date(data.dueDate).toLocaleDateString("en-IN")}
Payment Methods: ${data.paymentMethods.join(", ")}
  `.trim();
}
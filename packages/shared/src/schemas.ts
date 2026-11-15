import { z } from "zod";

export const PAYMENT_METHODS = ["jazzcash", "easypaisa", "payfast"] as const;
export const paymentMethodSchema = z.enum(PAYMENT_METHODS);
export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  jazzcash: "JazzCash",
  easypaisa: "Easypaisa",
  payfast: "PayFast (Card / Bank)",
};

export const CATEGORIES = [
  "doctor",
  "dentist",
  "salon",
  "plumber",
  "electrician",
  "ac-repair",
  "cleaning",
  "tutor",
] as const;
export const categorySchema = z.enum(CATEGORIES);
export type Category = z.infer<typeof categorySchema>;

export const CATEGORY_LABELS: Record<Category, string> = {
  doctor: "Doctors",
  dentist: "Dentists",
  salon: "Salons",
  plumber: "Plumbers",
  electrician: "Electricians",
  "ac-repair": "AC Repair",
  cleaning: "Cleaning",
  tutor: "Tutors",
};

export const serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  durationMinutes: z.number().int().positive(),
  pricePaisa: z.number().int().nonnegative(),
});
export type Service = z.infer<typeof serviceSchema>;

export const businessSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: categorySchema,
  city: z.string(),
  area: z.string(),
  description: z.string(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().nonnegative(),
  verified: z.boolean(),
  services: z.array(serviceSchema).min(1),
});
export type Business = z.infer<typeof businessSchema>;

export const businessSearchSchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: categorySchema.optional(),
  city: z.string().trim().max(60).optional(),
  page: z.coerce.number().int().min(1).max(1000).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(12),
});
export type BusinessSearch = z.infer<typeof businessSearchSchema>;

/** Pakistani mobile number, e.g. 03001234567 or +923001234567. */
const pkPhone = z
  .string()
  .trim()
  .regex(/^(\+92|0)3\d{9}$/, "Enter a valid Pakistani mobile number (e.g. 03001234567)");

export const quoteRequestSchema = z.object({
  businessId: z.string().min(1),
  serviceId: z.string().min(1),
  customerName: z.string().trim().min(2).max(80),
  customerEmail: z.email().max(254),
  customerPhone: pkPhone,
  preferredDate: z.iso.date(),
  notes: z.string().trim().max(1000).optional(),
});
export type QuoteRequest = z.infer<typeof quoteRequestSchema>;

export const quoteSchema = z.object({
  id: z.string(),
  businessId: z.string(),
  serviceId: z.string(),
  slotStart: z.iso.datetime(),
  slotEnd: z.iso.datetime(),
  totalPaisa: z.number().int().nonnegative(),
  commissionPaisa: z.number().int().nonnegative(),
  providerPayoutPaisa: z.number().int().nonnegative(),
  expiresAt: z.iso.datetime(),
});
export type Quote = z.infer<typeof quoteSchema>;

export const checkoutSchema = z.object({
  quoteId: z.string().min(1),
  paymentMethod: paymentMethodSchema,
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

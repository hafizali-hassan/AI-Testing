import { z } from "zod";

export const LAUNCH_COUNTRY = "PK" as const;

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

export const USER_ROLES = ["customer", "business", "technician", "admin"] as const;
export const userRoleSchema = z.enum(USER_ROLES);
export type UserRole = z.infer<typeof userRoleSchema>;

/**
 * Job lifecycle. Customers pay when the technician reaches the job site:
 * the invoice with a Stripe payment link is sent on `arrived`.
 */
export const JOB_STATUSES = [
  "quoted",
  "confirmed",
  "assigned",
  "en_route",
  "arrived",
  "paid",
  "completed",
  "cancelled",
] as const;
export const jobStatusSchema = z.enum(JOB_STATUSES);
export type JobStatus = z.infer<typeof jobStatusSchema>;

/** Pakistani mobile number, e.g. 03001234567 or +923001234567. */
export const pkPhoneSchema = z
  .string()
  .trim()
  .regex(/^(\+92|0)3\d{9}$/, "Enter a valid Pakistani mobile number (e.g. 03001234567)");

/** Normalise a valid Pakistani mobile number to E.164 (+923001234567). */
export function toE164PK(phone: string): string {
  const p = phone.trim();
  return p.startsWith("+92") ? p : `+92${p.slice(1)}`;
}

export const nameSchema = z.string().trim().min(2, "Enter your full name").max(80);
export const emailSchema = z.email("Enter a valid email address").max(254);

export const signUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: pkPhoneSchema,
  role: z.enum(["customer", "business", "technician"]).default("customer"),
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({ email: emailSchema });
export type SignInInput = z.infer<typeof signInSchema>;

export const serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  durationMinutes: z.number().int().positive(),
  priceCents: z.number().int().nonnegative(),
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

export const quoteRequestSchema = z.object({
  businessId: z.string().min(1),
  serviceId: z.string().min(1),
  address: z.string().trim().min(5).max(300),
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
  totalCents: z.number().int().nonnegative(),
  commissionCents: z.number().int().nonnegative(),
  technicianPayoutCents: z.number().int().nonnegative(),
  expiresAt: z.iso.datetime(),
});
export type Quote = z.infer<typeof quoteSchema>;

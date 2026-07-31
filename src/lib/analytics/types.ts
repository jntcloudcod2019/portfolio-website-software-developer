import { z } from 'zod';

export const DeviceType = z.enum(['mobile', 'tablet', 'desktop']);
export type DeviceType = z.infer<typeof DeviceType>;

export const EventType = z.enum([
  'pageview',
  'scroll_depth',
  'time_on_page',
  'cv_download',
  'project_view',
  'contact_click',
  'external_link',
  'theme_toggle',
  'custom',
]);
export type EventType = z.infer<typeof EventType>;

export const EventName = z.string().min(1).max(128);
export type EventName = z.infer<typeof EventName>;

export const AnalyticsEventSchema = z.object({
  type: EventType,
  name: EventName,
  target: z.string().optional(),
  value: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  page: z.string(),
  timestamp: z.number().optional(),
});
export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;

export const BatchPayloadSchema = z.object({
  sessionId: z.string().uuid(),
  visitorId: z.string(),
  events: z.array(AnalyticsEventSchema).min(1).max(50),
  profile: z.object({
    language: z.string(),
    userAgent: z.string(),
    viewport: z.string(),
    timezone: z.string(),
    screenSize: z.string().optional(),
    deviceModel: z.string().optional(),
    deviceVendor: z.string().optional(),
  }).optional(),
  ip: z.string().optional(),
  utm: z.object({
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
  }).optional(),
  referrer: z.string().optional(),
  consent: z.boolean().default(false),
});
export type BatchPayload = z.infer<typeof BatchPayloadSchema>;

export const QUEUE_FLUSH_INTERVAL = 5000;
export const QUEUE_MAX_SIZE = 10;

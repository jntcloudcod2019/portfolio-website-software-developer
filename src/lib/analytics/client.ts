import {
  type AnalyticsEvent,
  type BatchPayload,
  QUEUE_FLUSH_INTERVAL,
  QUEUE_MAX_SIZE,
} from './types';
import { getOrCreateVisitorId, getOrCreateSessionId, getPublicIP } from './visitor-id';

function getDeviceInfo(): { deviceModel: string; deviceVendor: string } {
  if (typeof navigator === 'undefined') return { deviceModel: '', deviceVendor: '' };

  const ua = navigator.userAgent;
  const lower = ua.toLowerCase();

  let deviceModel = '';
  let deviceVendor = '';

  if (/iphone/i.test(lower)) {
    deviceVendor = 'Apple';
    const match = ua.match(/iPhone\s(?:OS\s)?(\d+[,_]\d+)/);
    deviceModel = match ? `iPhone ${match[1].replace('_', '.')}` : 'iPhone';
  } else if (/ipad/i.test(lower)) {
    deviceVendor = 'Apple';
    deviceModel = 'iPad';
  } else if (/android/i.test(lower)) {
    deviceVendor = 'Google';
    const match = ua.match(/(SM-[A-Z0-9]+|Pixel\s?\d[a-zA-Z]*|Galaxy\s[A-Z0-9]+)/i);
    if (match) {
      deviceModel = match[1];
      if (/SM-/i.test(deviceModel)) deviceVendor = 'Samsung';
      else if (/Pixel/i.test(deviceModel)) deviceVendor = 'Google';
    }
  } else if (/macintosh|mac os/i.test(lower)) {
    deviceVendor = 'Apple';
    deviceModel = 'Mac';
  } else if (/windows/i.test(lower)) {
    deviceVendor = 'Microsoft';
    deviceModel = 'PC';
  } else if (/linux/i.test(lower)) {
    deviceModel = 'Linux';
    deviceVendor = '';
  }

  return { deviceModel, deviceVendor };
}

function getPageTitle(): string {
  if (typeof document === 'undefined') return '';
  return document.title;
}

export class AnalyticsClient {
  private queue: AnalyticsEvent[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private visitorId: string;
  private sessionId: string;
  private apiUrl: string;
  private consent = false;
  private cachedIP: string | null = null;
  private ipPromise: Promise<string | null> | null = null;

  constructor(apiUrl = '/api/analytics') {
    this.visitorId = getOrCreateVisitorId();
    this.sessionId = getOrCreateSessionId();
    this.apiUrl = apiUrl;
    this.ipPromise = this.resolveIP();
  }

  private async resolveIP(): Promise<string | null> {
    this.cachedIP = await getPublicIP();
    return this.cachedIP;
  }

  setConsent(given: boolean): void {
    this.consent = given;
    if (given && this.queue.length > 0) this.flush();
  }

  private enqueue(event: AnalyticsEvent): void {
    this.queue.push(event);
    if (this.queue.length >= QUEUE_MAX_SIZE) this.flush();
    else this.scheduleFlush();
  }

  private scheduleFlush(): void {
    if (this.timer) return;
    this.timer = setTimeout(() => {
      this.timer = null;
      this.flush();
    }, QUEUE_FLUSH_INTERVAL);
  }

  flush(): void {
    if (this.queue.length === 0) return;
    const batch = this.queue.splice(0, QUEUE_MAX_SIZE);
    this.send(batch);
  }

  private async send(events: AnalyticsEvent[]): Promise<void> {
    try {
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      const { deviceModel, deviceVendor } = getDeviceInfo();

      if (this.ipPromise) {
        await this.ipPromise;
        this.ipPromise = null;
      }

      const payload: BatchPayload = {
        sessionId: this.sessionId,
        visitorId: this.visitorId,
        events,
        ip: this.cachedIP || undefined,
        profile: {
          language: typeof navigator !== 'undefined' ? navigator.language : 'unknown',
          userAgent: ua,
          viewport: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'unknown',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          screenSize: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : undefined,
          deviceModel: deviceModel || undefined,
          deviceVendor: deviceVendor || undefined,
        },
        utm: this.getUTMParams(),
        referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
        consent: this.consent,
      };

      const res = await fetch(`${this.apiUrl}/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      });

      if (!res.ok) console.warn('[Analytics] send failed', res.status);
    } catch (err) {
      console.warn('[Analytics] send error', err);
    }
  }

  private getUTMParams(): BatchPayload['utm'] {
    if (typeof URL === 'undefined') return {};
    try {
      const params = new URLSearchParams(window.location.search);
      const source = params.get('utm_source');
      const medium = params.get('utm_medium');
      const campaign = params.get('utm_campaign');
      return source || medium || campaign
        ? { source: source || undefined, medium: medium || undefined, campaign: campaign || undefined }
        : {};
    } catch {
      return {};
    }
  }

  track(type: AnalyticsEvent['type'], name: AnalyticsEvent['name'], data?: {
    target?: string;
    value?: string;
    metadata?: Record<string, unknown>;
  }): void {
    this.enqueue({
      type,
      name,
      target: data?.target,
      value: data?.value,
      metadata: data?.metadata,
      page: typeof window !== 'undefined' ? window.location.pathname : '/',
      timestamp: Date.now(),
    });
  }

  pageView(path?: string): void {
    this.track('pageview', 'page_view', {
      target: path || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      value: getPageTitle(),
    });
  }

  getVisitorId(): string { return this.visitorId; }
  getSessionId(): string { return this.sessionId; }
}

let _instance: AnalyticsClient | null = null;

export function getAnalyticsClient(apiUrl?: string): AnalyticsClient {
  if (!_instance) _instance = new AnalyticsClient(apiUrl);
  return _instance;
}

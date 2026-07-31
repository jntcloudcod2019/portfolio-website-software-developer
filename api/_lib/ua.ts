import UAParser from 'ua-parser-js';

export function parseUA(ua: string) {
  const parser = new UAParser(ua);
  const device = parser.getDevice();
  const browser = parser.getBrowser();
  const os = parser.getOS();

  const lower = ua.toLowerCase();

  return {
    deviceType: device.type || (
      /mobile|android|iphone|ipad|ipod/i.test(lower) ? 'mobile'
      : /tablet|ipad/i.test(lower) ? 'tablet'
      : 'desktop'
    ),
    deviceModel: device.model || '',
    deviceVendor: device.vendor || '',
    os: os.name || 'Unknown',
    browser: browser.name || 'Unknown',
  };
}

import { useCallback, useEffect, useRef } from 'react';
import { getAnalyticsClient } from '@/src/lib/analytics/client';
import type { EventType } from '@/src/lib/analytics/types';

export function useAnalytics() {
  const client = useRef(getAnalyticsClient());

  const track = useCallback(
    (type: EventType, name: string, data?: {
      target?: string;
      value?: string;
      metadata?: Record<string, unknown>;
    }) => {
      client.current.track(type, name, data);
    },
    [],
  );

  const pageView = useCallback((path?: string) => {
    client.current.pageView(path);
  }, []);

  const setConsent = useCallback((given: boolean) => {
    client.current.setConsent(given);
  }, []);

  const flush = useCallback(() => {
    client.current.flush();
  }, []);

  useEffect(() => {
    const handleUnload = () => client.current.flush();
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  return { track, pageView, setConsent, flush };
}

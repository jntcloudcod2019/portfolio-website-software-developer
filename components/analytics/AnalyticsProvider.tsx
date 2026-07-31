import { createContext, useContext, type ReactNode } from 'react';
import { getAnalyticsClient } from '@/src/lib/analytics/client';
import { usePageView } from '@/hooks/usePageView';
import type { EventType } from '@/src/lib/analytics/types';

interface AnalyticsContextValue {
  track: (type: EventType, name: string, data?: {
    target?: string;
    value?: string;
    metadata?: Record<string, unknown>;
  }) => void;
  pageView: (path?: string) => void;
  setConsent: (given: boolean) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  usePageView();

  const value: AnalyticsContextValue = {
    track: (type, name, data) => getAnalyticsClient().track(type, name, data),
    pageView: (path) => getAnalyticsClient().pageView(path),
    setConsent: (given) => getAnalyticsClient().setConsent(given),
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext() {
  const ctx = useContext(AnalyticsContext);
  if (!ctx) throw new Error('useAnalyticsContext must be used within AnalyticsProvider');
  return ctx;
}

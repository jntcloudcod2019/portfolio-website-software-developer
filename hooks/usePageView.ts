import { useEffect, useRef } from 'react';
import { usePathname } from 'expo-router';
import { getAnalyticsClient } from '@/src/lib/analytics/client';

export function usePageView() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      const client = getAnalyticsClient();
      client.pageView(pathname);
      prevPath.current = pathname;
    }
  }, [pathname]);
}

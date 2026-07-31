import { useCallback } from 'react';
import { getAnalyticsClient } from '@/src/lib/analytics/client';
import type { EventType } from '@/src/lib/analytics/types';

export function useEvent() {
  const trackEvent = useCallback(
    (type: EventType, name: string, target?: string, value?: string) => {
      getAnalyticsClient().track(type, name, { target, value });
    },
    [],
  );

  const trackDownload = useCallback((fileName: string) => {
    getAnalyticsClient().track('cv_download', 'cv_download', { target: fileName });
  }, []);

  const trackProjectView = useCallback((projectId: string, projectName?: string) => {
    getAnalyticsClient().track('project_view', 'project_view', {
      target: projectId,
      value: projectName,
    });
  }, []);

  const trackContactClick = useCallback((type: 'email' | 'whatsapp' | 'linkedin') => {
    getAnalyticsClient().track('contact_click', `contact_${type}`, { target: type });
  }, []);

  const trackExternalLink = useCallback((url: string) => {
    getAnalyticsClient().track('external_link', 'external_link', { target: url });
  }, []);

  return { trackEvent, trackDownload, trackProjectView, trackContactClick, trackExternalLink };
}

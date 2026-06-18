import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

type LikesContextValue = {
  getLikes: (projectId: string) => number;
  incrementLike: (projectId: string) => void;
};

const LikesContext = createContext<LikesContextValue | null>(null);

export function LikesProvider({ children }: { children: React.ReactNode }) {
  const [likes, setLikes] = useState<Record<string, number>>({});

  const getLikes = useCallback(
    (projectId: string) => likes[projectId] ?? 0,
    [likes],
  );

  const incrementLike = useCallback((projectId: string) => {
    setLikes((prev) => ({
      ...prev,
      [projectId]: (prev[projectId] ?? 0) + 1,
    }));
  }, []);

  const value = useMemo(
    () => ({ getLikes, incrementLike }),
    [getLikes, incrementLike],
  );

  return <LikesContext.Provider value={value}>{children}</LikesContext.Provider>;
}

export function useLikes() {
  const ctx = useContext(LikesContext);
  if (!ctx) {
    throw new Error('useLikes must be used within LikesProvider');
  }
  return ctx;
}

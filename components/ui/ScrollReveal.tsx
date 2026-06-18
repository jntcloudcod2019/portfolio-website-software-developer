import React from 'react';

/** Native: renders children directly — animations handled per-platform. */
export function ScrollReveal({
  children,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return <>{children}</>;
}

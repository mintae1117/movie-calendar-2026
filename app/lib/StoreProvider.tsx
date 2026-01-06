"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    getSnapshot,
    getServerSnapshot
  );

  if (!isHydrated) {
    return null;
  }

  return <>{children}</>;
}

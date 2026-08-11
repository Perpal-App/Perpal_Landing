import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect on the client, useEffect on the server.
 *
 * Client components are still server-rendered, and React warns about
 * useLayoutEffect during that pass. Motion setup has to run before paint to
 * avoid a flash of un-animated content, so it cannot simply use useEffect.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

import * as React from "react";

/**
 * Hook de vérification de la santé de React (simule un check de base).
 * @returns `true` si React semble fonctionner correctement.
 */
export function useReactHealth(): boolean {
  const [isHealthy, setIsHealthy] = React.useState(false);

  React.useEffect(() => {
    try {
      setIsHealthy(true);
      console.log("✅ React hooks are working correctly");
    } catch (error) {
      console.error("❌ React hooks error:", error);
      setIsHealthy(false);
    }
  }, []);

  return isHealthy;
}

/**
 * Vérifie si `useSyncExternalStore` est disponible (nécessaire pour Zustand).
 * @returns `true` si Zustand est compatible avec React 18+
 */
export function validateZustandReact(): boolean {
  try {
    if (typeof React.useSyncExternalStore === "function") {
      console.log("✅ useSyncExternalStore is available");
      return true;
    } else {
      console.error("❌ useSyncExternalStore is not available");
      return false;
    }
  } catch (error) {
    console.error("❌ Error checking React compatibility:", error);
    return false;
  }
}

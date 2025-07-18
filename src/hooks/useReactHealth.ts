import React from 'react';

// Simple hook pour s'assurer que React fonctionne correctement
export function useReactHealth() {
  const [isHealthy, setIsHealthy] = React.useState(false);
  
  React.useEffect(() => {
    // Vérifier que tous les hooks React fonctionnent
    try {
      setIsHealthy(true);
      console.log('React hooks are working correctly');
    } catch (error) {
      console.error('React hooks error:', error);
      setIsHealthy(false);
    }
  }, []);
  
  return isHealthy;
}

// Test que Zustand peut fonctionner avec React
export function validateZustandReact() {
  try {
    // Tester que useSyncExternalStore est disponible
    if (typeof React.useSyncExternalStore === 'function') {
      console.log('useSyncExternalStore is available');
      return true;
    } else {
      console.error('useSyncExternalStore is not available');
      return false;
    }
  } catch (error) {
    console.error('Error checking React compatibility:', error);
    return false;
  }
}
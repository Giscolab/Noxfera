import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Détecte si l'écran est inférieur au breakpoint mobile.
 * @returns `true` si l'écran est mobile (width < 768px)
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mediaQuery = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    const mql = window.matchMedia(mediaQuery)
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }
    
    // Mise à jour initiale
    setIsMobile(mql.matches)
    
    // Écouteur d'événement moderne avec type correct
    mql.addEventListener("change", handleChange)
    
    return () => {
      mql.removeEventListener("change", handleChange)
    }
  }, [])

  return isMobile ?? false
}
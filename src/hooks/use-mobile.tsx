
import * as React from "react"

// Increased breakpoint to better handle medium-sized screens
const MOBILE_BREAKPOINT = 1024 // Changed from 768 to 1024 (lg breakpoint)

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isInitialized, setIsInitialized] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      if (!isInitialized) setIsInitialized(true)
    }
    
    // Check immediately
    checkMobile()
    
    // Use a safer way to add event listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Use the appropriate event listener based on browser support
    if (mql.addEventListener) {
      mql.addEventListener("change", checkMobile)
    } else {
      // Fallback for older browsers
      window.addEventListener("resize", checkMobile)
    }
    
    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener("change", checkMobile)
      } else {
        window.removeEventListener("resize", checkMobile)
      }
    }
  }, [isInitialized])

  // Return false during SSR, true value only after initialization
  return isInitialized ? isMobile : false
}

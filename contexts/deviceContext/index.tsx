import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { DeviceContextType } from "./deviceContextTypes";

export const DeviceContext = createContext<DeviceContextType>({
  isMobile: false,
  windowWidth: 0,
});

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }

    handleResize(); // Set initial width
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const isMobile = windowWidth <= 992;

  return (
    <DeviceContext.Provider value={{ isMobile, windowWidth }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);

  if (context === undefined) {
    throw new Error("useDevice must be used within a DeviceProvider");
  }

  return context;
}

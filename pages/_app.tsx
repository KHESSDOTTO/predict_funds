
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Analytics } from "@vercel/analytics/react";
import { AppProvider } from "@/contexts/appProvider";
config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  const userContextValue = {
    user: pageProps.user,
  };

  return (
    <>
      <AppProvider user={userContextValue.user}>
        <Toaster position="top-center" />
        <Component {...pageProps} />
        <Analytics />
      </AppProvider>
    </>
  );
}

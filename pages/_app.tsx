import { UserProvider } from "@/contexts/UserContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <UserProvider>
        <Toaster position="top-center" />
        <Component {...pageProps} />
      </UserProvider>
    </>
  );
}

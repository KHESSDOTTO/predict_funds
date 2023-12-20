import { UserProvider } from "@/contexts/UserContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

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

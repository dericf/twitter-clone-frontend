import "../styles/globals.css";
import "tailwindcss/tailwind.css";

import AuthProvider from "../hooks/useAuth";
import StoreProvider from "../hooks/useStore";
// import {} from "../hookes/useBasicAuthx"
// import LoadingProvider, { useIsLoading } from "../hooks/useIsLoading";
import { ToastProvider } from "react-toast-notifications";

function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider placement="top-center">
      <AuthProvider>
        <StoreProvider>
          <Component {...pageProps} />
        </StoreProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default MyApp;

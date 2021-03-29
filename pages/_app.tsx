// import "../styles/globals.css";
import 'tailwindcss/tailwind.css'

import AuthProvider from "../hooks/useAuth";
// import {} from "../hookes/useBasicAuthx"
// import LoadingProvider, { useIsLoading } from "../hooks/useIsLoading";
import { ToastProvider } from "react-toast-notifications";

function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ToastProvider>
  );
}

export default MyApp;

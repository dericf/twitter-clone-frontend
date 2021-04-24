import "../styles/globals.css";
import "tailwindcss/tailwind.css";

// import "../../node_modules/react-quill/dist/quill.snow.css";

import AuthProvider from "../hooks/useAuth";
import StoreProvider from "../hooks/useStore";
// import {} from "../hookes/useBasicAuthx"
// import LoadingProvider, { useIsLoading } from "../hooks/useIsLoading";
import { ToastProvider } from "react-toast-notifications";

function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider placement="bottom-left">
      <AuthProvider>
        <StoreProvider>
          <Component {...pageProps} />
        </StoreProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default MyApp;

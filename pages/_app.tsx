import "../styles/globals.css";
import "tailwindcss/tailwind.css";

// import "../../node_modules/react-quill/dist/quill.snow.css";

import AuthProvider from "../hooks/useAuth";
import StoreProvider from "../hooks/useStore";
// import {} from "../hookes/useBasicAuthx"
// import LoadingProvider, { useIsLoading } from "../hooks/useIsLoading";
import { ToastProvider } from "react-toast-notifications";
import { MittProvider } from "../hooks/useEmitter";

function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider placement="bottom-left">
      <MittProvider>
        <AuthProvider>
          <StoreProvider>
            <Component {...pageProps} />
          </StoreProvider>
        </AuthProvider>
      </MittProvider>
    </ToastProvider>
  );
}

export default MyApp;

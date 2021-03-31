import "../styles/globals.css";
import "tailwindcss/tailwind.css";

import AuthProvider from "../hooks/useAuth";
import TweetContextProvider from "../hooks/useTweetContext";
// import {} from "../hookes/useBasicAuthx"
// import LoadingProvider, { useIsLoading } from "../hooks/useIsLoading";
import { ToastProvider } from "react-toast-notifications";

function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <TweetContextProvider>
          <Component {...pageProps} />
        </TweetContextProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default MyApp;

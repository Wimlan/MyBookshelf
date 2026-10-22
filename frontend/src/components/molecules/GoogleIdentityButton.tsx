import { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";

interface Props {
  onSuccess: (response: CredentialResponse) => void;
  onError: (message: string) => void;
  busy?: boolean;
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

function GoogleIdentityButton({ onSuccess, onError, busy = false }: Props) {
  const [sdkStatus, setSdkStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const canShowGoogleButton = sdkStatus === "ready" && !busy;

  if (!googleClientId) {
    throw new Error(
      "Missing VITE_GOOGLE_CLIENT_ID. Set it in frontend/.env.local and restart Vite.",
    );
  }

  return (
    <GoogleOAuthProvider
      clientId={googleClientId}
      onScriptLoadSuccess={() => setSdkStatus("ready")}
      onScriptLoadError={() => setSdkStatus("error")}
    >
      {sdkStatus === "loading" && (
        <p role="status">Loading Google sign-in...</p>
      )}
      {sdkStatus === "error" && (
        <p role="alert" className="text-red-500 bg-warmgrey p-1">
          Google sign-in could not load. Check your connection or content
          blocker, then refresh the page.
        </p>
      )}
      {canShowGoogleButton && (
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={onSuccess}
            onError={() =>
              onError("Google identity confirmation failed. Please try again.")
            }
            click_listener={() => onError("")}
            text="continue_with"
            size="large"
          />
        </div>
      )}
    </GoogleOAuthProvider>
  );
}

export default GoogleIdentityButton;

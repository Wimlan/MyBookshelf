interface AuthResponse {
  userName?: string;
  requiresUsername?: boolean;
  message?: string;
}

function isAuthResponse(data: unknown): data is AuthResponse {
  const isObject = data !== null && typeof data === "object";
  if (!isObject) return false;

  const hasValidUsername =
    !("userName" in data) || typeof data.userName === "string";
  const hasValidSignupFlag =
    !("requiresUsername" in data) || typeof data.requiresUsername === "boolean";
  const hasValidMessage =
    !("message" in data) || typeof data.message === "string";
  return hasValidUsername && hasValidSignupFlag && hasValidMessage;
}

export async function readAuthResponse(
  response: Response,
): Promise<AuthResponse> {
  const data: unknown = response.headers
    .get("content-type")
    ?.includes("application/json")
    ? await response.json()
    : null;

  if (!isAuthResponse(data)) {
    console.error(
      "The server returned an invalid response. Check that the backend is running.",
      { status: response.status },
    );
    throw new Error("Something went wrong. Please try again.");
  }
  if (!response.ok) {
    throw new Error(
      data.message?.trim() ||
        "Unable to complete the request. Please try again.",
    );
  }
  return data;
}

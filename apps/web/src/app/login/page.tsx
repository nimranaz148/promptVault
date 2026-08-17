import { Suspense } from "react";
import { LoginClient } from "./LoginClient";

function LoginFallback() {
  return <div className="min-h-screen bg-background" />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginClient />
    </Suspense>
  );
}

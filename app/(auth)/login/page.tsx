import AuthForm from "../_components/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
      <AuthForm mode="login" />
    </div>
  );
}

import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { AdminLoginForm } from "@/features/blog/admin/login-form";
import { Logo } from "@/components/brand/logo";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin");

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-surface/60 p-8">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center text-xl font-semibold text-white">Strada CMS</h1>
        <p className="mt-2 text-center text-sm text-slate-400">Blog yönetim paneli</p>
        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}

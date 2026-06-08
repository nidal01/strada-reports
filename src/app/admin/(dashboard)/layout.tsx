import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/auth";
import { LogoutButton } from "@/features/blog/admin/post-actions";
import { ThemeToggleStandalone } from "@/components/layout/theme-toggle";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");

  return (
    <div className="min-h-dvh">
      <header className="border-b border-[var(--border)] bg-surface/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Logo />
            </Link>
            <span className="hidden text-sm text-slate-500 sm:inline">CMS</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggleStandalone />
            <Button asChild variant="ghost" size="sm">
              <Link href="/" target="_blank">
                Siteyi Gör
              </Link>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

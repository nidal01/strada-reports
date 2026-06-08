"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeletePostButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={handleDelete}>
      Sil
    </Button>
  );
}

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
      Çıkış
    </Button>
  );
}

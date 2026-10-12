"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect } from "react";

export default function CheckRole() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;

    const { role, status: userStatus, token } = session.user;

    // No token → access denied
    if (!token) {
      Cookies.remove("token");
      router.replace("/authentication/access-denied");
      return;
    }

    // Suspended
    if (userStatus === "suspended") {
      router.replace("/authentication/account-suspended");
      return;
    }

    // New user → confirm email
    if (userStatus === "new") {
      router.replace("/authentication/confirm-email");
      return;
    }

    // Active
    if (userStatus === "active") {
      Cookies.set("token", token, { expires: 60, secure: true });

      setTimeout(() => {
        if (role === "admin") {
          router.replace("/dashboard");
        } else {
          router.replace("/dashboard"); // change this if non-admins go elsewhere
        }
      }, 500);
    } else {
      Cookies.remove("token");
      router.replace("/authentication/access-denied");
    }
  }, [status, session, router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border-2 border-purple-600 border-t-transparent border-r-transparent border-b-transparent animate-spin" />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PublicProfile from "@/Components/UserProfile/public-profile";

export default function ContractorLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("public-token");
    if (!token) {
      router.push("/authenticate/public-auth/login"); // Redirect to login if no token
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) return null; // Prevent rendering content until auth check is done

  return <>{children}
  <PublicProfile/>
  </>;
}

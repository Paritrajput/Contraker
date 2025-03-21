"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ContractorLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("gov-token");
    if (!token) {
      router.push("/gov-auth/login"); // Redirect to login if no token
    } else {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) return null; // Prevent rendering content until auth check is done

  return <>{children}</>;
}

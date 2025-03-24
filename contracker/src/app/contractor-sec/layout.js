"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ContractorProfile from "@/Components/UserProfile/contractor-profile";

export default function ContractorLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/authenticate/contractor/login"); // Redirect to login if no token
    } else {
      console.log(token)
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) return null; // Prevent rendering content until auth check is done

  return <>{children}
  <ContractorProfile/></>;
}

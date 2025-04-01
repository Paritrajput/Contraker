import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-[#111]  p-4 shadow-md flex justify-center items-center sticky z-50 top-0">
      <Link
        href="/"
        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500"
      >
        Contracker
      </Link>
    </nav>
  );
};

export default Navbar;

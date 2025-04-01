import React from "react";

import Link from "next/link";

const LoginPortals = () => {
  return (
    <div className="flex flex-col h-[81vh] p-4 pt-14">
      <div className="flex flex-1 gap-4">
        <Link
          href="/contractor-sec"
          className="flex flex-1 flex-col items-center justify-center p-6 bg-green-600 text-white rounded-lg cursor-pointer"
        >
          <div className="text-4xl mb-2">👷</div>
          <h2 className="text-lg font-bold">Contractor</h2>
          <p>Contractor login</p>
        </Link>
        <Link
          href="/public-sec"
          className="flex flex-1 flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-lg cursor-pointer"
        >
          <div className="text-4xl mb-2">👥</div>
          <h2 className="text-lg font-bold">People</h2>
          <p>People Login</p>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center mt-4">
        <Link
          href="/gov-sec"
          className="w-11/12 flex flex-col items-center justify-center p-6 bg-gray-700 text-white rounded-lg cursor-pointer"
        >
          <div className="text-4xl mb-2">🏛️</div>
          <h2 className="text-lg font-bold">Government</h2>
          <p>Government login</p>
        </Link>
      </div>
    </div>
  );
};

export default LoginPortals;

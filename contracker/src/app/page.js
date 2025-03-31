'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const LoginPortals = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col h-[81vh] p-4 pt-14">
      <div className="flex flex-1 gap-4">
        <div
          className="flex flex-1 flex-col items-center justify-center p-6 bg-green-600 text-white rounded-lg cursor-pointer"
          onClick={() => router.push('/contractor-sec')}
        >
          <div className="text-4xl mb-2">👷</div>
          <h2 className="text-lg font-bold">Contractor</h2>
          <p>Contractor login</p>
        </div>
        <div
          className="flex flex-1 flex-col items-center justify-center p-6 bg-blue-600 text-white rounded-lg cursor-pointer"
          onClick={() => router.push('/public-sec')}
        >
          <div className="text-4xl mb-2">👥</div>
          <h2 className="text-lg font-bold">People</h2>
          <p>People Login</p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center mt-4">
        <div
          className="w-11/12 flex flex-col items-center justify-center p-6 bg-gray-700 text-white rounded-lg cursor-pointer"
          onClick={() => router.push('/gov-sec')}
        >
          <div className="text-4xl mb-2">🏛️</div>
          <h2 className="text-lg font-bold">Government</h2>
          <p>Government login</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPortals;


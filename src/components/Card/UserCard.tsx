import Image from 'next/image';
import React from 'react';

const UserCard = ({
  type,
  count,
}: {
  type: 'admin' | 'teacher' | 'student' | 'parent';
  count: number;
}) => {
  return (
    <div className="min-w-[120px] flex-1 rounded-xl p-2 odd:bg-purple-300 even:bg-yellow-200">
      <div className="flex items-center justify-between">
        <p className="rounded-2xl bg-white px-1.5 py-0.5 text-[10px] font-medium text-green-500">
          {new Date().toLocaleDateString()}
        </p>
        <Image
          src="/more.png"
          width={18}
          height={18}
          alt=""
          className="cursor-pointer"
        />
      </div>
      <p className="my-1 text-lg font-semibold italic">{count}</p>
      <p className="text-[10px] capitalize text-gray-600">{type}</p>
    </div>
  );
};

export default UserCard;

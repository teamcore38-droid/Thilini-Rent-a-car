import React from 'react';

export const VehicleCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-subtle flex flex-col h-full animate-pulse">
      <div className="aspect-[16/10] bg-gray-200 w-full" />
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="h-6 bg-gray-200 rounded-md w-3/4 mb-2" />
          <div className="h-4 bg-gray-100 rounded-md w-1/2 mb-4" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-8 bg-gray-100 rounded-lg" />
            <div className="h-8 bg-gray-100 rounded-lg" />
            <div className="h-8 bg-gray-100 rounded-lg" />
            <div className="h-8 bg-gray-100 rounded-lg" />
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="h-6 bg-gray-200 rounded-lg w-32" />
            <div className="h-6 bg-gray-100 rounded-md w-20" />
          </div>
          <div className="h-7 bg-gray-200 rounded-md w-1/2 mb-3" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-10 bg-gray-200 rounded-xl" />
            <div className="h-10 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

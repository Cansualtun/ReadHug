import React from 'react';

type Props = {};

const Skeleton = (props: Props) => {
  return (
    <div className="flex flex-col shadow rounded-lg w-full p-4">
      {/* Profil resmi */}
      <div className="animate-pulse">
        <div className="flex flex-col items-center pt-2 pb-2">
          <div className="relative group">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
      {/* İsim Username */}
      <div className="my-2 mb-4 text-center animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mt-2"></div>
      </div>
      {/* Takipçi*/}
      <div className="flex justify-center space-x-8 mb-4 animate-pulse">
        <div className="text-center group cursor-pointer">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="font-semibold w-4 h-4 bg-gray-200 rounded-full"></div>
          </div>
          <div className="text-xs h-4 bg-gray-200 rounded w-12/12 mt-2"></div>
        </div>

        <div className="h-8 w-1 bg-gray-200"></div>

        <div className="text-center group cursor-pointer">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="font-semibold w-4 h-4 bg-gray-200 rounded-full"></div>
          </div>
          <div className="text-xs h-4 bg-gray-200 rounded w-12/12 mt-2"></div>
        </div>
      </div>
      {/* Okuduğu Kitaplar*/}
      <div className="bg-gray-200 rounded-lg p-3 animate-pulse">
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 rounded-md bg-gray-50 flex flex-col justify-center items-center">
            <div className="flex items-center justify-center mb-1">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span className="w-8 h-4 bg-gray-200 rounded ml-2"></span>
            </div>
            <p className="w-[56px] h-4 bg-gray-200 rounded"></p>
          </div>
          <div className="text-center p-2 rounded-md bg-gray-50 flex flex-col justify-center items-center">
            <div className="flex items-center justify-center mb-1">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span className="w-8 h-4 bg-gray-200 rounded ml-2"></span>
            </div>
            <p className="w-[56px] h-4 bg-gray-200 rounded"></p>
          </div>
          <div className="text-center p-2 rounded-md bg-gray-50 flex flex-col justify-center items-center">
            <div className="flex items-center justify-center mb-1">
              <div className="w-4 h-4 bg-gray-200 rounded"></div>
              <span className="w-8 h-4 bg-gray-200 rounded ml-2"></span>
            </div>
            <p className="w-[56px] h-4 bg-gray-200 rounded"></p>
          </div>
        </div>
      </div>
      {/* Kitap Sayısı*/}
      <div className="mt-3 text-center animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
      </div>
    </div>
  );
};

export default Skeleton;

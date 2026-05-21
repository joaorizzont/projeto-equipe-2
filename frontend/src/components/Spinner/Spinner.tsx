import React from 'react';

export const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
  );
};

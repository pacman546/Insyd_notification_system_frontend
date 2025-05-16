import React from 'react';
import { Building2 } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-slate-800" />
            <h1 className="text-2xl font-bold text-slate-800">Insyd</h1>
          </div>
          <div className="text-sm text-slate-500">Architecture Community</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
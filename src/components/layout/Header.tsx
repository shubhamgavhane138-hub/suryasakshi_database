import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell className="h-6 w-6 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-white text-sm">
              S
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Shubham</p>
              <p className="text-xs text-gray-500">Admin</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

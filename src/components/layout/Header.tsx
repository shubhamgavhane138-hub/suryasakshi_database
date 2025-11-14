import React from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';

const Header: React.FC = () => {
    const { user, logout } = useAuth();

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
                <div className="flex items-center space-x-4 ml-4">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Bell className="h-6 w-6 text-gray-600" />
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <div className="flex items-center justify-center h-full w-full bg-gray-200 rounded-full">
                                    <User className="h-6 w-6 text-gray-600" />
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">Logged in as</p>
                                    <p className="text-xs leading-none text-gray-500">{user?.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout} className="cursor-pointer">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default Header;

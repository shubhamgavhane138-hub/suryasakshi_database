import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import {
  LayoutDashboard,
  Leaf,
  Wheat,
  Receipt,
  Bean,
  Package,
  ShoppingCart,
  ChevronRight,
  Database,
  X,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/Collapsible';
import { Button } from '../ui/Button';

const dashboardLink = { href: '/', icon: LayoutDashboard, label: 'Dashboard' };

const suryasakshiFpcTables = [
  { href: '/silage-sales', icon: Leaf, label: 'Silage Sales' },
  { href: '/maize-purchase', icon: Wheat, label: 'Maize Purchase' },
  { href: '/other-expenses', icon: Receipt, label: 'Other Expenses' },
  { href: '/purchases', icon: ShoppingCart, label: 'General Purchases' },
];

const soyabinSeedTables = [
  { href: '/soybean-purchase', icon: Bean, label: 'Soybean Purchase' },
  { href: '/soybean-sales', icon: Package, label: 'Soybean Sales' },
];

const NavItem: React.FC<{ href: string; icon: React.ElementType; label: string; isSubItem?: boolean; onClick?: () => void; }> = ({ href, icon: Icon, label, isSubItem = false, onClick }) => {
  return (
    <NavLink
      to={href}
      end
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
          isSubItem && 'pl-11',
          isActive
            ? 'bg-primary text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        )
      }
    >
      <Icon className="h-5 w-5 mr-3" />
      {label}
    </NavLink>
  );
};

interface SidebarProps {
    isMobileOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onClose }) => {
    const location = useLocation();

    const isSuryasakshiActive = suryasakshiFpcTables.some(item => location.pathname.startsWith(item.href) && item.href !== '/');
    const isSoyabinActive = soyabinSeedTables.some(item => location.pathname.startsWith(item.href) && item.href !== '/');

    const [suryasakshiOpen, setSuryasakshiOpen] = useState(isSuryasakshiActive);
    const [soyabinOpen, setSoyabinOpen] = useState(isSoyabinActive);

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={cn(
          'fixed inset-0 bg-black/60 z-30 lg:hidden',
          isMobileOpen ? 'block' : 'hidden'
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <aside className={cn(
          "flex flex-col w-64 bg-gray-800 text-white fixed h-full z-40 transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-20 border-b border-gray-700 px-4">
          <div className="flex items-center">
            <Leaf className="h-8 w-8 text-primary" />
            <h1 className="ml-3 text-2xl font-bold">SURYASAKSHI</h1>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden rounded-full -mr-2" onClick={onClose}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <NavItem {...dashboardLink} onClick={onClose} />

          <Collapsible open={suryasakshiOpen} onOpenChange={setSuryasakshiOpen}>
              <CollapsibleTrigger className={cn(
                  "flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-gray-700 hover:text-white",
                  isSuryasakshiActive && "text-white"
              )}>
                  <div className="flex items-center">
                      <Database className="h-5 w-5 mr-3" />
                      SURYASAKSHI FPC
                  </div>
                  <ChevronRight className={cn("h-5 w-5 transition-transform", suryasakshiOpen && "rotate-90")} />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                  {suryasakshiFpcTables.map((item) => (
                      <NavItem key={item.href} {...item} isSubItem onClick={onClose} />
                  ))}
              </CollapsibleContent>
          </Collapsible>
          
          <Collapsible open={soyabinOpen} onOpenChange={setSoyabinOpen}>
              <CollapsibleTrigger className={cn(
                  "flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-300 hover:bg-gray-700 hover:text-white",
                  isSoyabinActive && "text-white"
              )}>
                  <div className="flex items-center">
                      <Database className="h-5 w-5 mr-3" />
                      SOYABIN SEED
                  </div>
                  <ChevronRight className={cn("h-5 w-5 transition-transform", soyabinOpen && "rotate-90")} />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                  {soyabinSeedTables.map((item) => (
                      <NavItem key={item.href} {...item} isSubItem onClick={onClose} />
                  ))}
              </CollapsibleContent>
          </Collapsible>

        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

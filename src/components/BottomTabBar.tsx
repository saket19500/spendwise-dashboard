import { Link, useLocation } from '@tanstack/react-router';
import { Home, Send, ScanLine, PieChart, User } from 'lucide-react';

const tabs = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/pay', label: 'Pay', Icon: Send },
  { to: '/scan-pay', label: 'Scan', Icon: ScanLine },
  { to: '/insights', label: 'Insights', Icon: PieChart },
  { to: '/profile', label: 'Profile', Icon: User },
] as const;

export function BottomTabBar() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e8e7e3] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ to, label, Icon }) => {
          const active = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5"
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.2 : 1.7}
                className={active ? 'text-[#534AB7]' : 'text-[#888780]'}
              />
              <span
                className={`text-[10px] ${active ? 'text-[#534AB7] font-medium' : 'text-[#888780]'}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

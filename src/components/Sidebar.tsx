// fastener-frontend-v2/src/components/Sidebar.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getUserMenus } from '@/lib/api-menus';
import { Menu as MenuType } from '@/lib/types';
import { Skeleton } from "@/components/ui/skeleton";
import * as Icons from 'lucide-react';

// 動態獲取 Icon 元件
const getIcon = (iconName: string | null | undefined): React.ElementType => {
    if (!iconName) return Icons.ChevronRight;
    // 將 iconName 從 'icon-name' 或 'IconName' 轉換為 'IconName'
    const formattedName = iconName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    const IconComponent = (Icons as any)[formattedName];
    return IconComponent || Icons.ChevronRight;
};


const renderMenuItems = (items: MenuType[], currentPath: string) => {
  return items.map((item) => {
    const Icon = getIcon(item.icon);
    const hasChildren = item.children && item.children.length > 0;
    const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path || ''));

    if (hasChildren) {
      return (
        <div key={item.id}>
          <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">{item.name}</p>
          <ul>
            {item.children.map(child => {
               const ChildIcon = getIcon(child.icon);
               const isChildActive = currentPath === child.path || (child.path !== '/' && currentPath.startsWith(child.path || ''));
               return (
                <li key={child.id}>
                  <Link
                    href={child.path || '#'}
                    className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                      isChildActive
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <ChildIcon className="w-5 h-5 mr-3" />
                    {child.name}
                  </Link>
                </li>
               )
            })}
          </ul>
        </div>
      );
    }
    
    // 處理沒有 children 的頂層項目
    return (
        <li key={item.id}>
            <Link
                href={item.path || '#'}
                className={`flex items-center px-4 py-2 text-sm rounded-md transition-colors ${
                isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
                <Icon className="w-5 h-5 mr-3" />
                {item.name}
            </Link>
        </li>
    )
  });
};

const SidebarSkeleton = () => (
    <div className="space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
            <div key={i}>
                <Skeleton className="h-4 w-20 mb-3" />
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-8 w-full" />
            </div>
        ))}
    </div>
)


export function Sidebar() {
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState<MenuType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const data = await getUserMenus(); // 直接呼叫專用 API
        setMenuItems(data);
      } catch (error) {
        console.error('Failed to fetch user menus:', error);
        // 在這裡可以處理錯誤，例如顯示錯誤訊息或導向登入頁
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  if (loading) {
    return <SidebarSkeleton />;
  }
  
  return (
    <aside className="hidden md:block w-64 bg-gray-800 text-white flex-shrink-0">
      <div className="p-4">
        <h1 className="text-2xl font-bold">企業 Logo</h1>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2">
            {renderMenuItems(menuItems, pathname)}
        </ul>
      </nav>
    </aside>
  );
}

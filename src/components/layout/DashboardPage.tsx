// src/components/layout/DashboardPage.tsx

import React from 'react';

// 定義這個元件需要接收的參數 (props) 型別
interface DashboardPageProps {
  title: string;                 // 頁面標題，例如 "公司管理"
  actionButton?: React.ReactNode; // 一個可選的按鈕，例如 "新增公司"
  children: React.ReactNode;     // 頁面的主要內容，例如資料表格
}

export function DashboardPage({ title, actionButton, children }: DashboardPageProps) {
  return (
    // 使用 Tailwind CSS 來進行排版
    // p-6: 內邊距
    // space-y-8: 子元素之間的垂直間距
    <div className="p-4 sm:p-6 md:p-8 space-y-8">
      {/* 頁首區域 */}
      <div className="flex items-center justify-between">
        {/* 頁面標題 */}
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>
        {/* 右側的按鈕區域 */}
        <div className="flex items-center space-x-2">
          {actionButton}
        </div>
      </div>
      
      {/* 頁面主要內容區域 */}
      <div>
        {children}
      </div>
    </div>
  );
}

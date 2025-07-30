// src/app/dashboard/definitions/companies/page.tsx

'use client'; // 由於使用了 useState 和 useEffect，這是一個客戶端元件

import { useEffect, useState } from 'react';

// 匯入我們在第一、二步建立的型別與元件
import { getCompanies } from '@/lib/api';
import { Company } from '@/models/company'; 
import { DashboardPage } from '@/components/layout/DashboardPage';

// 匯入 shadcn/ui 元件
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function CompaniesPage() {
  // 狀態管理：使用我們定義的 Company 型別
  const [companies, setCompanies] = useState<Company[]>([]);
  // 新增一個載入狀態，提升使用者體驗
  const [isLoading, setIsLoading] = useState(true);

  // 資料獲取：在元件掛載時獲取公司資料
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
        // 在這裡可以加入錯誤處理的 UI，例如一個提示訊息
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []); // 空陣列表示這個 effect 只在元件第一次渲染時執行一次

  // 渲染載入中的畫面
  const renderSkeleton = () => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]"><Skeleton className="h-4 w-full" /></TableHead>
            <TableHead><Skeleton className="h-4 w-full" /></TableHead>
            <TableHead><Skeleton className="h-4 w-full" /></TableHead>
            <TableHead><Skeleton className="h-4 w-full" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-full" /></TableCell>
              <TableCell><Skeleton className="h-4 w-full" /></TableCell>
              <TableCell><Skeleton className="h-4 w-full" /></TableCell>
              <TableCell><Skeleton className="h-4 w-full" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    // 使用我們建立的 DashboardPage 元件
    <DashboardPage
      title="公司管理"
      actionButton={<Button>新增公司</Button>}
    >
      {/* 根據載入狀態顯示不同的內容 */}
      {isLoading ? (
        renderSkeleton()
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>公司名稱</TableHead>
                <TableHead>地址</TableHead>
                <TableHead>電話</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length > 0 ? (
                companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.id}</TableCell>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>{company.address}</TableCell>
                    <TableCell>{company.phone_number}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    目前沒有資料。
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </DashboardPage>
  );
}

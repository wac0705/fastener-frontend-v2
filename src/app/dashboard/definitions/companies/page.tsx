// src/app/dashboard/definitions/companies/page.tsx
'use client';

import { useEffect, useState } from 'react';

// 匯入我們所有辛苦建立的元件和型別
import { getCompanies } from '@/lib/api';
import { Company } from '@/models/company';
import { DashboardPage } from '@/components/layout/DashboardPage';
import { Button } from '@/components/ui/button';
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from '@/components/shared/DataTable'; // 這是我們的王牌元件！
import { columns } from './columns'; // 還有為它量身打造的欄位定義

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 確保 API 回傳的是陣列，如果不是就給一個空陣列
        const data = await getCompanies();
        setCompanies(data || []);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
        setCompanies([]); // 發生錯誤時也設定為空陣列
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // 一個更簡潔的載入中畫面
  const renderSkeleton = () => (
      <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <div className="rounded-md border">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full border-t" />
              <Skeleton className="h-12 w-full border-t" />
              <Skeleton className="h-12 w-full border-t" />
          </div>
      </div>
  );

  return (
    <DashboardPage
      title="公司管理"
      actionButton={<Button>新增公司</Button>}
    >
      {isLoading ? (
        renderSkeleton()
      ) : (
        // 關鍵改動：用 DataTable 取代了原本的簡單表格
        <DataTable 
          columns={columns} 
          data={companies}
          filterColumnId="name" // 告訴 DataTable 我們要用 'name' 欄位來篩選
        />
      )}
    </DashboardPage>
  );
}

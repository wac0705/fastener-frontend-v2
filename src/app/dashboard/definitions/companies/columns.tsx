// src/app/dashboard/definitions/companies/columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Company } from '@/models/company';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';

// 這是一個陣列，定義了表格的所有欄位
export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: 'id', // 對應 Company 物件中的 'id' 屬性
    header: 'ID',      // 欄位標題顯示為 'ID'
  },
  {
    accessorKey: 'name',
    // 這裡我們自訂 header，讓它可以點擊排序
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          公司名稱
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'address',
    header: '地址',
  },
  {
    accessorKey: 'phone_number',
    header: '電話',
  },
  // 您可以在這裡加入更多欄位，例如一個「操作」欄位
  // {
  //   id: 'actions',
  //   cell: ({ row }) => {
  //     const company = row.original;
  //     return (
  //       <Button variant="ghost" className="h-8 w-8 p-0">
  //         <span className="sr-only">Open menu</span>
  //         {/* 這裡可以放一個 dropdown menu 來做編輯、刪除等操作 */}
  //       </Button>
  //     );
  //   },
  // },
];

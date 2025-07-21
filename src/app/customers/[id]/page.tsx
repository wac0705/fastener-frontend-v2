"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCustomerById } from "@/lib/api";
import CustomerTradeTerms from "@/components/CustomerTradeTerms";
import { Customer } from "@/lib/api";

// ❗【不要用 function CustomerDetailPage({ params })】❗
// 請直接寫成這樣，不要寫參數

export default function CustomerDetailPage() {
  const params = useParams() as { id: string };
  const customerId = Number(params.id);

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    getCustomerById(customerId)
      .then(setCustomer)
      .finally(() => setLoading(false));
  }, [customerId]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">客戶詳細</h1>
      {loading ? (
        <p className="p-4 text-muted-foreground">載入中...</p>
      ) : customer ? (
        <>
          <div className="border rounded-lg bg-card p-4 mb-8">
            <div className="mb-2">
              <strong>群組客戶代碼：</strong>
              {customer.group_customer_code}
            </div>
            <div className="mb-2">
              <strong>群組客戶名稱：</strong>
              {customer.group_customer_name}
            </div>
            <div className="mb-2">
              <strong>備註：</strong>
              {customer.remarks}
            </div>
            <div className="mb-2 text-sm text-muted-foreground">
              建立：{customer.created_at?.substring(0, 10)}　
              更新：{customer.updated_at?.substring(0, 10)}
            </div>
          </div>
          <CustomerTradeTerms customerId={customerId} />
        </>
      ) : (
        <div className="p-4 text-red-500">查無此客戶資料</div>
      )}
    </div>
  );
}

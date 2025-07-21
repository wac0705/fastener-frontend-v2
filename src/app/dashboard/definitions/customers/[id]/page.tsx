"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCustomerById } from "@/lib/api";
import CustomerTradeTerms from "@/components/CustomerTradeTerms";
import { Customer } from "@/lib/api";

export default function CustomerDetailPage() {
  // 從路由 params 取得 id
  const params = useParams();
  // 你的 [id] 路由會自動把 G00001 塞到 params.id
  const customerId = params?.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  // debug 用，確認 customerId 真的有抓到
  useEffect(() => {
    console.log("客戶 id param:", customerId);
  }, [customerId]);

  useEffect(() => {
    if (!customerId) return;
    setLoading(true);
    getCustomerById(customerId)
      .then((data) => {
        setCustomer(data);
        console.log("客戶資料：", data);
      })
      .catch((err) => {
        setCustomer(null);
        console.error("取得客戶失敗", err);
      })
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
          {/* 交易條件元件 */}
          <CustomerTradeTerms customerId={customerId} />
        </>
      ) : (
        <div className="p-4 text-red-500">查無此客戶資料</div>
      )}
    </div>
  );
}

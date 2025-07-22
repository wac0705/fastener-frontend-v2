"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getCustomerById, getCustomerByCode, Customer } from "@/lib/api";
import CustomerTradeTerms from "@/components/CustomerTradeTerms";

export default function CustomerDetailPage() {
  const params = useParams();
  const idOrCode = params?.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!idOrCode) return;
    setLoading(true);

    // 判斷是否為純數字 id
    const fetch = /^\d+$/.test(idOrCode)
      ? getCustomerById(Number(idOrCode))
      : getCustomerByCode(idOrCode);

    fetch
      .then((data) => {
        setCustomer(data);
        console.log("客戶資料：", data);
      })
      .catch((err) => {
        setCustomer(null);
        console.error("取得客戶失敗", err);
      })
      .finally(() => setLoading(false));
  }, [idOrCode]);

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
          {/* 交易條件 */}
          <CustomerTradeTerms customerId={customer.id} />
        </>
      ) : (
        <div className="p-4 text-red-500">查無此客戶資料</div>
      )}
    </div>
  );
}

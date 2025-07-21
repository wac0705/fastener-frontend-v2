import CustomerTradeTerms from "@/components/CustomerTradeTerms";

export default function CustomerDetailPage({ params }) {
  const customerId = Number(params.id);

  // 這裡可以放客戶基本資料區塊
  // ...

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">客戶詳細</h1>
      {/* 客戶基本資料表格/卡片 */}
      {/* ... */}
      {/* 交易條件清單元件 */}
      <CustomerTradeTerms customerId={customerId} />
    </div>
  );
}


"use client";
import { useEffect, useState } from "react";
import { getCustomerTradeTerms } from "@/lib/api";

interface TradeTerm {
  id: number;
  incoterm: string;
  currency_code: string;
  commission_rate: number | null;
  export_port: string;
  destination_country: string;
  is_primary: boolean;
  remarks: string;
  company_id: number;
}

export default function CustomerTradeTerms({ customerId }: { customerId: number }) {
  const [terms, setTerms] = useState<TradeTerm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getCustomerTradeTerms(customerId)
      .then((data) => setTerms(data))
      .finally(() => setLoading(false));
  }, [customerId]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">交易條件清單</h2>
      <div className="border rounded-lg p-2 bg-card overflow-x-auto">
        {loading ? (
          <p className="p-4 text-muted-foreground">載入中...</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="p-2 text-left">交易條件</th>
                <th className="p-2 text-left">幣別</th>
                <th className="p-2 text-left">佣金%</th>
                <th className="p-2 text-left">出口港</th>
                <th className="p-2 text-left">目的國</th>
                <th className="p-2 text-center">主條件</th>
                <th className="p-2 text-left">備註</th>
              </tr>
            </thead>
            <tbody>
              {terms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-muted-foreground">
                    無資料
                  </td>
                </tr>
              ) : (
                terms.map((term) => (
                  <tr key={term.id}>
                    <td className="p-2">{term.incoterm}</td>
                    <td className="p-2">{term.currency_code}</td>
                    <td className="p-2">{term.commission_rate ?? "-"}</td>
                    <td className="p-2">{term.export_port}</td>
                    <td className="p-2">{term.destination_country}</td>
                    <td className="p-2 text-center">{term.is_primary ? "⭐" : ""}</td>
                    <td className="p-2">{term.remarks}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

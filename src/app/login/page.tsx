import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">登入系統</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">帳號</label>
            <Input type="text" placeholder="輸入帳號" />
          </div>
          <div>
            <label className="block text-sm font-medium">密碼</label>
            <Input type="password" placeholder="輸入密碼" />
          </div>
          <Button className="w-full">登入</Button>
        </form>
      </div>
    </div>
  );
}

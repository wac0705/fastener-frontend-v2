import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const IDLE_TIMEOUT = 60 * 1000 * 30; // 30分鐘 (可自行調整)

export default function useIdleLogout() {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      alert("閒置過久已自動登出，請重新登入！");
      router.push("/login");
    };

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(logout, IDLE_TIMEOUT);
    };

    // 監聽用戶活動
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer(); // 進入頁面立即啟動

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [router]);
}

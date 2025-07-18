'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface Account {
  id: number
  username: string
  role: string
  is_active: boolean
}

export default function ManageAccountsPage() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<Account[]>([])
  const [newUsername, setNewUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newRole, setNewRole] = useState("sales")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("role")
    if (!token || role !== "admin") {
      toast.error("您沒有權限訪問，請重新登入")
      router.push("/login")
      return
    }
    fetchAccounts(token)
  }, [])

  const fetchAccounts = async (token: string) => {
    const res = await fetch("/api/manage-accounts", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.ok) {
      const data = await res.json()
      setAccounts(data)
    } else {
      toast.error("無法取得帳號清單")
    }
  }

  const handleCreate = async () => {
    const token = localStorage.getItem("token")
    const res = await fetch("/api/manage-accounts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: newUsername,
        password: newPassword,
        role: newRole
      })
    })
    if (res.ok) {
      toast.success("新增成功")
      setNewUsername("")
      setNewPassword("")
      setNewRole("sales")
      fetchAccounts(token!)
    } else {
      toast.error("新增失敗")
    }
  }

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token")
    const res = await fetch(`/api/manage-accounts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (res.ok) {
      toast.success("刪除成功")
      fetchAccounts(token!)
    } else {
      toast.error("刪除失敗")
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">帳號管理</h1>

      <div className="space-y-2 mb-6">
        <Input placeholder="帳號" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
        <Input placeholder="密碼" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        <select className="border rounded px-2 py-1 w-full" value={newRole} onChange={e => setNewRole(e.target.value)}>
          <option value="sales">sales</option>
          <option value="engineer">engineer</option>
          <option value="logistics">logistics</option>
          <option value="admin">admin</option>
        </select>
        <Button onClick={handleCreate}>新增帳號</Button>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">帳號</th>
            <th className="p-2 border">角色</th>
            <th className="p-2 border">狀態</th>
            <th className="p-2 border">操作</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(acc => (
            <tr key={acc.id}>
              <td className="border p-2">{acc.username}</td>
              <td className="border p-2">{acc.role}</td>
              <td className="border p-2">{acc.is_active ? "啟用" : "停用"}</td>
              <td className="border p-2">
                <Button variant="destructive" size="sm" onClick={() => handleDelete(acc.id)}>刪除</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// fastener-frontend-v2/src/app/dashboard/role-menus/page.tsx

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getAllRoles, getRoleMenus, updateRoleMenus } from '@/lib/api-roles';
import { getAllMenusTree } from '@/lib/api-menus';
import { Role, Menu as MenuType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from 'sonner';

// 遞迴渲染選單樹與 Checkbox
const MenuTree = ({ items, checkedKeys, onCheckChange }: { items: MenuType[], checkedKeys: number[], onCheckChange: (id: number, checked: boolean) => void }) => {
  return (
    <ul className="space-y-2">
      {items.map(item => (
        <li key={item.id} className="ml-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`menu-${item.id}`}
              checked={checkedKeys.includes(item.id)}
              onCheckedChange={(checked) => onCheckChange(item.id, !!checked)}
            />
            <label htmlFor={`menu-${item.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {item.name}
            </label>
          </div>
          {item.children && item.children.length > 0 && (
            <MenuTree items={item.children} checkedKeys={checkedKeys} onCheckChange={onCheckChange} />
          )}
        </li>
      ))}
    </ul>
  );
};


export default function RoleMenusPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [menus, setMenus] = useState<MenuType[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [checkedMenuIds, setCheckedMenuIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, menusData] = await Promise.all([
          getAllRoles(),
          getAllMenusTree(), // 使用獲取樹狀結構的 API
        ]);
        setRoles(rolesData);
        setMenus(menusData);
      } catch (error) {
        toast.error('無法載入基礎資料');
      }
    };
    fetchData();
  }, []);

  const handleRoleClick = async (role: Role) => {
    setSelectedRole(role);
    try {
      const assignedMenus = await getRoleMenus(role.id);
      setCheckedMenuIds(assignedMenus.map(m => m.id));
    } catch (error) {
      toast.error(`無法獲取角色 ${role.name} 的權限`);
      setCheckedMenuIds([]);
    }
  };

  const handleCheckChange = (menuId: number, isChecked: boolean) => {
    setCheckedMenuIds(prev => {
        const newSet = new Set(prev);
        if (isChecked) {
            newSet.add(menuId);
        } else {
            newSet.delete(menuId);
        }
        return Array.from(newSet);
    });
  };

  const handleSave = async () => {
    if (!selectedRole) {
      toast.warning('請先選擇一個角色');
      return;
    }
    setLoading(true);
    try {
      await updateRoleMenus(selectedRole.id, checkedMenuIds);
      toast.success(`角色 ${selectedRole.name} 的權限已更新`);
    } catch (error) {
      toast.error('儲存失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>角色列表</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {roles.map(role => (
              <li key={role.id}>
                <Button
                  variant={selectedRole?.id === role.id ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => handleRoleClick(role)}
                >
                  {role.name}
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {selectedRole ? `設定角色 "${selectedRole.name}" 的權限` : '請選擇一個角色'}
          </CardTitle>
          <Button onClick={handleSave} disabled={!selectedRole || loading}>
            {loading ? '儲存中...' : '儲存變更'}
          </Button>
        </CardHeader>
        <CardContent>
          {selectedRole ? (
            <MenuTree items={menus} checkedKeys={checkedMenuIds} onCheckChange={handleCheckChange} />
          ) : (
            <p className="text-gray-500">從左側選擇一個角色以設定其可見的選單。</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

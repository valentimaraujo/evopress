'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { MenuEditor } from '@/admin/components/MenuEditor';

export default function NewMenuPage() {
  const router = useRouter();

  const handleSave = () => {
    router.push('/admin/menus');
  };

  return (
    <div className="p-6">
      <MenuEditor menu={null} onSave={handleSave} />
    </div>
  );
}


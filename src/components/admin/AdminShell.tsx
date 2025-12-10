'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';

interface AdminShellProps {
  children: React.ReactNode;
  systemName: string;
  user: { name: string; email: string } | null;
}

export function AdminShell({ children, systemName, user }: AdminShellProps) {
  // Estado compartilhado de colapso pode ser movido pra cá se necessário,
  // mas por enquanto a Sidebar gerencia seu próprio estado e o layout precisa se ajustar.
  // A maneira mais limpa é o AdminShell envolver tudo.
  
  // Vamos simplificar: A Sidebar vai ser self-contained e emitir evento ou usar contexto?
  // KISS: Vamos fazer a Sidebar receber uma prop 'onToggle' ou simplesmente
  // fazer o AdminShell ter o estado.
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Sidebar 
        systemName={systemName} 
        user={user} 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
      />
      
      <main 
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-72'
        } p-8 lg:p-12`}
      >
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  );
}


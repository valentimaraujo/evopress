import { count } from 'drizzle-orm';
import { 
  Users, 
  FileText, 
  Image as ImageIcon,
  ArrowUpRight 
} from 'lucide-react';

import { db } from '@/db';
import { users } from '@/db/schema';

async function getStats() {
  const [userCount] = await db.select({ count: count() }).from(users);
  return {
    users: userCount?.count || 0,
    posts: 0,
    media: 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: 'Total de Posts', value: stats.posts, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Arquivos de Mídia', value: stats.media, icon: ImageIcon, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Usuários Ativos', value: stats.users, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Visão Geral
        </h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Bem-vindo de volta. Aqui está o que está acontecendo no seu site hoje.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div 
            key={card.label} 
            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-zinc-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-bold text-zinc-900 dark:text-white">
                  {card.value}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${card.bg} ${card.color} dark:bg-zinc-800`}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center gap-1 text-xs font-medium text-zinc-400">
              <span className="flex items-center text-emerald-600">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +0%
              </span>
              <span>desde o mês passado</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions / Recent Activity Placeholder */}
      <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
            Atividade Recente
          </h2>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
            Ver tudo
          </button>
        </div>
        
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50 text-center dark:border-zinc-800 dark:bg-zinc-800/50">
          <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
            <FileText className="h-6 w-6 text-zinc-400" />
          </div>
          <h3 className="mt-3 text-sm font-medium text-zinc-900 dark:text-white">
            Nenhuma atividade recente
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Comece criando seu primeiro post para ver atividades aqui.
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Search,
  FileText,
  Calendar,
  User,
  ChevronLeft,
  ChevronRight,
  Filter,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useEffect, useRef } from 'react';

import type { PostListItem, ListPostsResult } from '@/core/services/posts.service';
import { showError, showSuccess, showConfirmDelete } from '@/core/utils/swal';

const POST_STATUS_LABELS: Record<string, string> = {
  draft: 'Rascunho',
  published: 'Publicado',
  archived: 'Arquivado',
};

const POST_TYPE_LABELS: Record<string, string> = {
  post: 'Post',
  page: 'Página',
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  published: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
  archived: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400',
};

interface User {
  uuid: string;
  name: string;
  email: string;
}

export function PostsList() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('postType') || '');
  const [authorFilter, setAuthorFilter] = useState(searchParams.get('authorUuid') || '');
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1', 10)
  );
  const [pagination, setPagination] = useState<ListPostsResult['pagination'] | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch {
        // Silenciosamente falha ao buscar usuários
      }
    };

    fetchUsers();
  }, []);

  const fetchPosts = async (
    page: number,
    searchTerm: string,
    status: string,
    postType: string,
    authorUuid: string
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (status) {
        params.append('status', status);
      }

      if (postType) {
        params.append('postType', postType);
      }

      if (authorUuid) {
        params.append('authorUuid', authorUuid);
      }

      const response = await fetch(`/api/posts?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Erro ao buscar posts');
      }

      const data: ListPostsResult = await response.json();
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch {
      // Silenciosamente falha ao buscar posts
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPosts(currentPage, search, statusFilter, typeFilter, authorFilter);
    }, search ? 300 : 0);

    return () => clearTimeout(timeoutId);
  }, [currentPage, search, statusFilter, typeFilter, authorFilter]);

  const updateURL = (updates: {
    search?: string;
    status?: string;
    postType?: string;
    authorUuid?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (updates.search !== undefined) {
      if (updates.search) {
        params.set('search', updates.search);
      } else {
        params.delete('search');
      }
    }
    
    if (updates.status !== undefined) {
      if (updates.status) {
        params.set('status', updates.status);
      } else {
        params.delete('status');
      }
    }
    
    if (updates.postType !== undefined) {
      if (updates.postType) {
        params.set('postType', updates.postType);
      } else {
        params.delete('postType');
      }
    }
    
    if (updates.authorUuid !== undefined) {
      if (updates.authorUuid) {
        params.set('authorUuid', updates.authorUuid);
      } else {
        params.delete('authorUuid');
      }
    }
    
    if (updates.page !== undefined) {
      if (updates.page > 1) {
        params.set('page', updates.page.toString());
      } else {
        params.delete('page');
      }
    }
    
    router.push(`/admin/posts?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      updateURL({ search: value, page: 1 });
    }, 500);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
    updateURL({ status: value, page: 1 });
  };

  const handleTypeChange = (value: string) => {
    setTypeFilter(value);
    setCurrentPage(1);
    updateURL({ postType: value, page: 1 });
  };

  const handleAuthorChange = (value: string) => {
    setAuthorFilter(value);
    setCurrentPage(1);
    updateURL({ authorUuid: value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateURL({ page: newPage });
  };

  const handleDeletePost = async (post: PostListItem) => {
    const result = await showConfirmDelete(post.title);
    
    if (!result.isConfirmed) {
      return;
    }

    setDeletingPostId(post.uuid);
    try {
      const response = await fetch(`/api/posts/${post.uuid}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        const errorMessage = data.error || 'Erro ao excluir post';
        
        if (response.status === 404) {
          await showError('Post não encontrado');
        } else if (response.status === 403) {
          await showError('Você não tem permissão para excluir este post');
        } else {
          await showError(errorMessage);
        }
        return;
      }

      await showSuccess('Post excluído com sucesso');
      
      await fetchPosts(currentPage, search, statusFilter, typeFilter, authorFilter);
    } catch {
      await showError('Erro ao excluir post');
    } finally {
      setDeletingPostId(null);
    }
  };

  const getPageNumbers = () => {
    if (!pagination) return [];
    
    const total = pagination.totalPages;
    const current = pagination.page;
    const pages: (number | string)[] = [];
    
    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 4; i <= total; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(total);
      }
    }
    
    return pages;
  };

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar posts..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-4 text-sm placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 
            dark:bg-zinc-900 dark:text-white dark:placeholder-zinc-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="h-5 w-5 text-zinc-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          >
            <option value="">Todos os status</option>
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="archived">Arquivado</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          >
            <option value="">Todos os tipos</option>
            <option value="post">Post</option>
            <option value="page">Página</option>
          </select>

          <select
            value={authorFilter}
            onChange={(e) => handleAuthorChange(e.target.value)}
            className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
          >
            <option value="">Todos os autores</option>
            {users.map((user) => (
              <option key={user.uuid} value={user.uuid}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 text-center dark:border-zinc-800 dark:bg-zinc-800/50">
          <div className="rounded-full bg-zinc-100 p-3 dark:bg-zinc-800">
            <FileText className="h-6 w-6 text-zinc-400" />
          </div>
          <h3 className="mt-3 text-sm font-medium text-zinc-900 dark:text-white">
            Nenhum post encontrado
          </h3>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {search || statusFilter || typeFilter || authorFilter
              ? 'Tente ajustar os filtros de busca.'
              : 'Comece criando seu primeiro post.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Título
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Autor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Atualizado em
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {posts.map((post) => (
                  <tr
                    key={post.uuid}
                    className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-900 dark:text-white">
                          {post.title}
                        </span>
                        {post.excerpt && (
                          <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                            {post.excerpt}
                          </span>
                        )}
                        <span className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                          /{post.slug}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          STATUS_COLORS[post.status] || STATUS_COLORS.draft
                        }`}
                      >
                        {POST_STATUS_LABELS[post.status] || post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      {POST_TYPE_LABELS[post.postType] || post.postType}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                          <User className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-zinc-900 dark:text-white">
                            {post.authorName}
                          </span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            {post.authorEmail}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(post.createdAt), 'dd/MM/yyyy HH:mm', {
                          locale: ptBR,
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(post.updatedAt), 'dd/MM/yyyy HH:mm', {
                          locale: ptBR,
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/posts/${post.uuid}`)}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400"
                          title="Editar post"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePost(post)}
                          disabled={deletingPostId === post.uuid}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Excluir post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pagination && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Mostrando {((pagination.page - 1) * pagination.limit) + 1} a{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
            {pagination.total} {pagination.total === 1 ? 'post' : 'posts'}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={!pagination.hasPrev}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 text-sm text-zinc-400 dark:text-zinc-500"
                  >
                    ...
                  </span>
                );
              }
              
              const pageNum = page as number;
              const isActive = pageNum === pagination.page;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${ // eslint-disable-line max-len
                    isActive
                      ? 'border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 dark:border-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'  
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNext}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors 
              disabled:opacity-50 
              disabled:cursor-not-allowed hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


import { notFound } from 'next/navigation';

import { PostEditor } from '@/admin/components/PostEditor';
import { getPost } from '@/core/services/posts.service';

interface EditPostPageProps {
  params: Promise<{ uuid: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { uuid } = await params;
  const post = await getPost(uuid);

  if (!post) {
    notFound();
  }

  const mode = (post.metaData as { editorMode?: 'visual' | 'simple' })?.editorMode || 'simple';

  return <PostEditor post={post} mode={mode} />;
}


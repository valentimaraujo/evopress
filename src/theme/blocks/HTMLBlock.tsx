import React from 'react';

import type { HTMLBlock as HTMLBlockType } from '@/admin/components/builder/types';

interface PublicHTMLBlockProps {
    block: HTMLBlockType;
}

export function PublicHTMLBlock({ block }: PublicHTMLBlockProps) {
    if (block.fullWidth) {
        return (
            <div
                className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]"
                dangerouslySetInnerHTML={{ __html: block.content }}
            />
        );
    }

    return (
        <div dangerouslySetInnerHTML={{ __html: block.content }} />
    );
}

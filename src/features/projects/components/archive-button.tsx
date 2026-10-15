'use client';

import { useState, useTransition } from 'react';
import { archiveProjectAction } from '@/features/projects/actions/archive-project';

export function ArchiveButton({ projectId }: { projectId: string }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await archiveProjectAction(projectId);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="block text-sm text-red-600 hover:underline disabled:opacity-50"
      >
        {pending ? 'Archiving...' : 'Archive'}
      </button>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
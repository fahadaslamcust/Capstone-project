import { Suspense } from 'react';
import { SearchBar } from '@/features/projects/components/search-bar';
import { ProjectListServer } from '@/features/projects/components/project-list-server';
import { ProjectListSkeleton } from '@/features/projects/components/skeletons';
import { LogoutButton } from '@/app/components/logout-button';

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProjectsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const status = typeof params.status === 'string' ? params.status : '';
  return (
    <div className="w-full px-6 py-8">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <LogoutButton />
      </header>
      <div className="mb-6">
        <SearchBar />
      </div>
      <Suspense fallback={<ProjectListSkeleton />} key={`${q}-${status}`}>
        <ProjectListServer query={q} status={status} />
      </Suspense>
    </div>
  );
}
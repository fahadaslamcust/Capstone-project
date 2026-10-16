import { Suspense } from 'react';
import { SearchBar } from '@/features/projects/components/search-bar';
import { ProjectListServer } from '@/features/projects/components/project-list-server';
import { ProjectListSkeleton } from '@/features/projects/components/skeletons';

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProjectsPage({ searchParams }: PageProps) {
  // Await the searchParams explicitly
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const status = typeof params.status === 'string' ? params.status : '';

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      <SearchBar />
      
      {/* Streaming Boundary */}
      <Suspense fallback={<ProjectListSkeleton />} key={`${q}-${status}`}>
        <ProjectListServer query={q} status={status} />
      </Suspense>
    </div>
  );
}
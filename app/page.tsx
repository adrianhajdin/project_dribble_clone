import { getCurrentUser } from "@/lib/session";
import { AllProjectsType } from "@/common.types";
import { fetchAllProjects } from "@/lib/actions";
import HomeFilter from "@/components/HomeFilter";
import LoadMore from "@/components/LoadMore";
import ProjectCard from "@/components/ProjectCard";
import { Suspense } from 'react'

type SearchParams = {
  category?: string | null;
  search?: string | null;
  cursor?: string | null;
}

type Props = {
  searchParams: SearchParams
}

const Home = async ({ searchParams }: Props) => {
  const start = Date.now();
  // const session = await getCurrentUser()

  let category = searchParams.category || null;
  let search = searchParams.search || null;
  let cursor = searchParams.cursor || null


  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction ? `${process.env.SERVER_URL || ''}` : `http://localhost:3000/`;
  const response = await fetch(`${baseUrl}/api/posts?category=${category}&search=${search}&cursor=${cursor}`);
  
  // const response = await fetch(`http://localhost:3000/api/posts?category=${category}&search=${search}&cursor=${cursor}`);

  // "default" | "force-cache" | "no-cache" | "no-store" | "only-if-cached" | "reload";

  const projects = await response.json();

  // const projects = await fetchAllProjects(search, category, cursor)

  const end = Date.now();
  console.log(`API call took ${end - start} ms`);

  console.log({ allProjects: projects?.projectSearch?.edges})

  if (projects?.projectSearch?.edges?.length === 0) {
    return (
      <section className="flexStart flex-col paddings">
        <HomeFilter />
        <p className="no-result-text text-center">Sorry no projects found</p>
      </section>
    )
  }

  return (
    <section className="flexStart flex-col paddings mb-16">
      <HomeFilter />
      <section className="projects-grid">
        <Suspense fallback={<p>Loading feed...</p>}>
          {projects?.projectSearch?.edges.map(({ node }: AllProjectsType) => (
            <ProjectCard
              key={`${node?.id}`}
              id={node?.id}
              image={node?.image}
              title={node?.title}
              name={node?.createdBy.name}
              avatarUrl={node?.createdBy.avatarUrl}
              userId={node?.createdBy.id}
              // @ts-ignore
            />
          ))}
        </Suspense>
      </section>
      {projects?.projectSearch?.pageInfo?.hasNextPage && (
        <LoadMore cursor={projects?.projectSearch?.pageInfo?.endCursor} />
      )}
    </section>
  )
};

export default Home;

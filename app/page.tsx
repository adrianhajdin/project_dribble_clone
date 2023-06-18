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
  const session = await getCurrentUser()

  let category = searchParams.category || null;
  let search = searchParams.search || null;
  let cursor = searchParams.cursor || null

  const projects = await fetchAllProjects(search, category, cursor)

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
              sessionUserId={session?.user?.id}
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

import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { Outlet, useParams, useLocation } from '@tanstack/react-router';
import { getWorkspace } from '~/api/workspaces';
import { WorkspaceRoute } from '~/routes/workspaces';
import { useWorkspaceStore } from '~/store/workspace';
import type { Project } from '~/types';
import { FocusViewContainer } from '../common/focus-view';
import { PageHeader } from '../common/page-header';
import { type Label, useElectric } from '../common/electric/electrify.ts';
import { useEffect } from 'react';
import { useLiveQuery } from 'electric-sql/react';

export const workspaceQueryOptions = (idOrSlug: string) =>
  queryOptions({
    queryKey: ['workspaces', idOrSlug],
    queryFn: () => getWorkspace(idOrSlug),
  });

const WorkspacePage = () => {
  const { showPageHeader, setProjects, setMembers, setLabels, setSelectedTasks, setSearchQuery } = useWorkspaceStore();
  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  const Electric = useElectric()!;

  const { idOrSlug } = useParams({ from: WorkspaceRoute.id });
  const { pathname } = useLocation();
  const workspaceQuery = useSuspenseQuery(workspaceQueryOptions(idOrSlug));
  const workspace = workspaceQuery.data.workspace;
  const projects = workspaceQuery.data.relatedProjects;
  const workspaceMembers = workspaceQuery.data.workspaceMembers;
  //TODO create new useMutateWorkspaceQueryData hook or find other solution
  setProjects(projects as Project[]);
  setMembers(workspaceMembers);

  const { results } = useLiveQuery(
    Electric.db.labels.liveMany({
      where: {
        project_id: { in: projects.map((p) => p.id) },
      },
    }),
  ) as {
    results: Label[] | undefined;
  };

  useEffect(() => setSearchQuery(''), [idOrSlug]);
  useEffect(() => setSelectedTasks([]), [pathname]);

  useEffect(() => {
    if (results) setLabels(results);
  }, [results]);

  return (
    <FocusViewContainer>
      {showPageHeader && (
        <PageHeader
          type="workspace"
          id={workspace.id}
          title={workspace.name}
          thumbnailUrl={workspace.thumbnailUrl}
          bannerUrl={workspace.bannerUrl}
          organizationId={workspace.organizationId}
        />
      )}
      <div className="flex flex-col gap-2 md:gap-3 p-2 md:p-3 group/workspace">
        <Outlet />
      </div>
    </FocusViewContainer>
  );
};

export default WorkspacePage;

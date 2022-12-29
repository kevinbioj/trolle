import { Box, Button, Card, Flex, Text, Title } from '@mantine/core';
import { IconTool, IconUsers } from '@tabler/icons';
import { Link, useMatch, useNavigate } from '@tanstack/react-location';
import { useQuery } from '@tanstack/react-query';
import { CreateTaskModal } from 'components/CreateTaskModal';
import { EditTaskModal } from 'components/EditTaskModal';
import { ProjectSettingsModal } from 'components/ProjectSettingsModal';
import * as api from 'core/api';
import { useAuth } from 'core/providers';
import { useState } from 'react';

export default function ProjectPage() {
  const {
    params: { id },
  } = useMatch<{ Params: { id: UUID } }>();
  const navigate = useNavigate();
  const project = useQuery({
    onError: () => navigate({ to: '/' }),
    queryKey: [`project_${id}`],
    queryFn: () => api.projects.get(id),
  });
  const tasks = useQuery({
    enabled: project.isSuccess,
    queryKey: [`project_${id}_tasks`],
    queryFn: () => api.tasks.fromProject(project.data!.id),
  });

  return project.data && tasks.data ? (
    <ProjectView project={project.data} tasks={tasks.data} />
  ) : null;
}

type ProjectViewProps = { project: Project; tasks: Task[] };
function ProjectView({ project, tasks }: ProjectViewProps) {
  const { user } = useAuth();
  const [openedTask, setOpenedTask] = useState<Task | null>(null);
  const [openedSettings, setOpenedSettings] = useState(false);
  const isOwner = user?.username === project.owner.username;
  return (
    <>
      <Flex
        align="center"
        direction={{ base: 'column', sm: 'row' }}
        gap="md"
        justify="space-between"
      >
        <Title order={1} weight="normal">
          {project.name}
        </Title>
        <Flex direction={{ base: 'column', sm: 'row' }} gap="sm">
          <Button
            component={Link}
            leftIcon={<IconUsers size={16} />}
            to={`/projects/${project.id}/members`}
          >
            Gestion des membres
          </Button>
          {isOwner && (
            <Button
              leftIcon={<IconTool size={16} />}
              onClick={() => setOpenedSettings(true)}
            >
              Paramètres du projet
            </Button>
          )}
        </Flex>
      </Flex>
      <ProjectTasks
        columns={project.columns}
        onTaskOpen={setOpenedTask}
        project={project}
        tasks={tasks}
      />
      {openedTask && (
        <EditTaskModal
          onClose={() => setOpenedTask(null)}
          project={project}
          task={openedTask}
        />
      )}
      {openedSettings && (
        <ProjectSettingsModal
          close={() => setOpenedSettings(false)}
          project={project}
          visible={openedSettings}
        />
      )}
    </>
  );
}

type ProjectTasksProps = {
  columns: Column[];
  onTaskOpen: (task: Task) => void;
  project: Project;
  tasks: Task[];
};
function ProjectTasks({
  columns,
  onTaskOpen,
  project,
  tasks,
}: ProjectTasksProps) {
  return (
    <Box component="section" my="xl">
      <Flex gap="md" sx={{ overflowX: 'auto' }} wrap="nowrap">
        {columns.map((column) => {
          const columnTasks = tasks.filter((t) => t.column.id === column.id);
          return (
            <ColumnView
              key={`column_${column.id}`}
              column={column}
              onTaskOpen={onTaskOpen}
              project={project}
              tasks={columnTasks}
            />
          );
        })}
      </Flex>
    </Box>
  );
}

type ColumnViewProps = {
  column: Column;
  onTaskOpen: (task: Task) => void;
  project: Project;
  tasks: Task[];
};
function ColumnView({ column, onTaskOpen, project, tasks }: ColumnViewProps) {
  const { user } = useAuth();
  const [creationPane, setCreationPane] = useState(false);
  return (
    <>
      <Card
        h={500}
        shadow="sm"
        sx={{ flexShrink: 0, overflowY: 'auto' }}
        w={250}
        withBorder
      >
        <Title align="center" mb="md" order={3} weight="lighter">
          {column.name}
        </Title>
        <Flex direction="column">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Card
                key={`task_${task.id}`}
                mb="md"
                onClick={() => onTaskOpen(task)}
                shadow="md"
                sx={{
                  ':hover': {
                    cursor: 'pointer',
                  },
                }}
                withBorder
              >
                <Title align="center" order={4} weight="normal">
                  {task.title}
                </Title>
              </Card>
            ))
          ) : (
            <Text align="center" color="dimmed">
              Aucune tâche n&apos;existe dans cette colonne.
            </Text>
          )}
          {user?.username === project.owner.username && (
            <Button
              mt="md"
              onClick={() => setCreationPane(true)}
              variant="subtle"
            >
              Nouvelle tâche
            </Button>
          )}
        </Flex>
      </Card>
      <CreateTaskModal
        close={() => setCreationPane(false)}
        column={column}
        project={project}
        visible={creationPane}
      />
    </>
  );
}

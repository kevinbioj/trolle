import { Carousel } from '@mantine/carousel';
import {
  Box,
  Button,
  Card,
  Flex,
  Modal,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useMatch, useNavigate } from '@tanstack/react-location';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from 'core/api';
import { useAuth } from 'core/providers';
import dayjs from 'dayjs';
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
  const [openedTask, setOpenedTask] = useState<Task | null>(null);
  return (
    <>
      <Title align="center" order={1} weight="normal">
        {project.name}
      </Title>
      <ProjectDetails owner={project.owner} createdAt={project.createdAt} />
      <ProjectTasks
        columns={project.columns}
        onTaskOpen={setOpenedTask}
        tasks={tasks}
      />
      {openedTask && (
        <TaskModal
          onClose={() => setOpenedTask(null)}
          project={project}
          task={openedTask}
        />
      )}
    </>
  );
}

type ProjectDetailsProps = { owner: User; createdAt: string };
function ProjectDetails({ owner, createdAt }: ProjectDetailsProps) {
  return <></>;
}

type ProjectTasksProps = {
  columns: Column[];
  onTaskOpen: (task: Task) => void;
  tasks: Task[];
};
function ProjectTasks({ columns, onTaskOpen, tasks }: ProjectTasksProps) {
  return (
    <Box component="section" my="xl">
      <Carousel align="start" dragFree h={500} slideGap="md" slideSize="auto">
        {columns.map((column) => {
          const columnTasks = tasks.filter((t) => t.column.id === column.id);
          return (
            <Carousel.Slide key={`column_${column.id}`} w={250}>
              <ColumnView
                column={column}
                onTaskOpen={onTaskOpen}
                tasks={columnTasks}
              />
            </Carousel.Slide>
          );
        })}
      </Carousel>
    </Box>
  );
}

type ColumnViewProps = {
  column: Column;
  onTaskOpen: (task: Task) => void;
  tasks: Task[];
};
function ColumnView({ column, onTaskOpen, tasks }: ColumnViewProps) {
  return (
    <Card h={500} shadow="sm" withBorder>
      <Title align="center" mb="md" order={3} weight="lighter">
        {column.name}
      </Title>
      <Flex direction="column">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Card
              key={`task_${task.id}`}
              onClick={() => onTaskOpen(task)}
              shadow="md"
              withBorder
              sx={{
                ':hover': {
                  cursor: 'pointer',
                },
              }}
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
      </Flex>
    </Card>
  );
}

type TaskModalProps = { onClose: () => void; project: Project; task: Task };
function TaskModal({ onClose, project, task }: TaskModalProps) {
  const { user } = useAuth();
  const form = useForm({
    initialValues: {
      title: task.title,
      description: task.description,
      assignee: task.assignee?.user?.username ?? '',
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
    },
  });
  const queryClient = useQueryClient();

  const handleSubmit = () =>
    api.tasks
      .update(task.id, {
        title: form.values.title,
        description: form.values.description ?? '',
        assignee: form.values.assignee || null,
        dueDate: form.values.dueDate?.toISOString() || null,
      })
      .then(() => {
        queryClient.invalidateQueries([`project_${project.id}_tasks`]);
        onClose();
      });
  const editable = user !== null && project.owner.username === user.username;

  return (
    <Modal
      centered
      closeButtonLabel="Fermer la tâche"
      onClose={onClose}
      opened={!!task}
      title={`${task.title} - Édition`}
      withCloseButton
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          disabled={!editable}
          label="Titre"
          mb="md"
          placeholder="Titre de la tâche"
          required
          {...form.getInputProps('title')}
        />
        <Textarea
          disabled={!editable}
          label="Description"
          mb="md"
          {...form.getInputProps('description')}
        />
        <TextInput
          disabled={
            task.assignee?.user.username === user?.username || !editable
          }
          label="Affectée à"
          mb="md"
          placeholder="jdupont"
          {...form.getInputProps('assignee')}
        />
        <DatePicker
          disabled={!editable}
          label="Date limite de réalisation"
          locale="fr"
          mb="md"
          {...form.getInputProps('dueDate')}
        />
        <Button disabled={!editable} fullWidth mb="md" type="submit">
          Mettre à jour
        </Button>
      </form>
      <Text align="center" color="dimmed">
        Dernière mise à jour il y a {dayjs(task.updatedAt).toNow(true)}.<br />
        Crée le {dayjs(task.createdAt).format('LLLL')}.
      </Text>
    </Modal>
  );
}

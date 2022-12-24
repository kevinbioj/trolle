import { Carousel } from '@mantine/carousel';
import {
  Box,
  Button,
  Card,
  Flex,
  Modal,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconTool, IconTrash, IconUsers } from '@tabler/icons';
import { Link, useMatch, useNavigate } from '@tanstack/react-location';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateTaskModal } from 'components/CreateTaskModal';
import { ProjectSettingsModal } from 'components/ProjectSettingsModal';
import * as api from 'core/api';
import { useAuth } from 'core/providers';
import dayjs from 'dayjs';
import { useState } from 'react';
import * as Yup from 'yup';

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
      <Flex align="center" justify="space-between">
        <Title order={1} weight="normal">
          {project.name}
        </Title>
        {isOwner && (
          <Flex gap="sm">
            <Button
              component={Link}
              leftIcon={<IconUsers size={16} />}
              to={`/projects/${project.id}/members`}
            >
              Gestion des membres
            </Button>
            <Button
              leftIcon={<IconTool size={16} />}
              onClick={() => setOpenedSettings(true)}
            >
              Éditer le projet
            </Button>
          </Flex>
        )}
      </Flex>
      <ProjectDetails owner={project.owner} createdAt={project.createdAt} />
      <ProjectTasks
        columns={project.columns}
        onTaskOpen={setOpenedTask}
        project={project}
        tasks={tasks}
      />
      {openedTask && (
        <TaskModal
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

type ProjectDetailsProps = { owner: User; createdAt: string };
function ProjectDetails({ owner, createdAt }: ProjectDetailsProps) {
  return <></>;
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
      <Carousel align="start" dragFree h={500} slideGap="md" slideSize="auto">
        {columns.map((column) => {
          const columnTasks = tasks.filter((t) => t.column.id === column.id);
          return (
            <Carousel.Slide key={`column_${column.id}`} w={250}>
              <ColumnView
                column={column}
                onTaskOpen={onTaskOpen}
                project={project}
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
  project: Project;
  tasks: Task[];
};
function ColumnView({ column, onTaskOpen, project, tasks }: ColumnViewProps) {
  const { user } = useAuth();
  const [creationPane, setCreationPane] = useState(false);
  return (
    <>
      <Card h={500} shadow="sm" sx={{ overflowY: 'auto' }} withBorder>
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
          {user?.username === project.owner.username && (
            <Button
              onClick={() => setCreationPane(true)}
              mt="md"
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

type TaskModalProps = { onClose: () => void; project: Project; task: Task };
function TaskModal({ onClose, project, task }: TaskModalProps) {
  const { user } = useAuth();
  const isOwner = user?.username === project.owner.username;
  const form = useForm({
    initialValues: {
      title: task.title,
      description: task.description ?? '',
      assignee: task.assignee?.user?.username ?? null,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      column: `${task.column.id}`,
    },
    validate: yupResolver(
      Yup.object().shape({
        title: Yup.string()
          .required('Le titre de la tâche est obligatoire.')
          .min(
            2,
            "Le titre de la tâche doit être composé d'au moins 2 caractères.",
          )
          .max(32, 'Le titre de la tâche ne doit pas excéder 32 caractères.'),
        description: Yup.string()
          .nullable()
          .max(
            2048,
            'La description de la tâche ne doit pas excéder 2048 caractères.',
          ),
        assignee: isOwner
          ? Yup.string().nullable()
          : Yup.string()
              .nullable()
              .oneOf(
                ['', user?.username],
                'Vous ne pouvez assigner que vous-même à cette tâche.',
              ),
        dueDate: Yup.string().nullable(),
        column: Yup.number().integer(),
      }),
    ),
  });
  const queryClient = useQueryClient();

  const handleSubmit = () =>
    api.tasks
      .update(task.id, {
        title: form.values.title,
        description: form.values.description ?? null,
        assignee: form.values.assignee || null,
        dueDate: form.values.dueDate?.toISOString() || null,
        columnId: +form.values.column,
      })
      .then(() => {
        queryClient.invalidateQueries([`project_${project.id}_tasks`]);
        onClose();
        showNotification({
          title: 'Tâche mise à jour',
          message: `La tâche ${task.title} a été mise à jour avec succès.`,
        });
      })
      .catch((e: APIError) => {
        if (e.title === 'MEMBER_NOT_FOUND' || e.title === 'USER_NOT_FOUND')
          form.setFieldError(
            'assignee',
            "Cet utilisateur n'est pas membre du projet.",
          );
      });

  const deleteTask = () =>
    api.tasks.remove(task.id).then(() => {
      queryClient.invalidateQueries([`project_${project.id}_tasks`]);
      onClose();
      showNotification({
        title: 'Tâche supprimée',
        message: `La tâche ${task.title} a été supprimée avec succès.`,
      });
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
            user === null ||
            (task.assignee != null &&
              (task.assignee?.user.username !== user?.username || !editable))
          }
          label="Affectée à"
          mb="md"
          placeholder="jdupont"
          {...form.getInputProps('assignee')}
        />
        <Select
          disabled={!editable}
          label="Colonne"
          data={project.columns.map((c) => ({
            label: c.name,
            value: `${c.id}`,
          }))}
          mb="md"
          {...form.getInputProps('column')}
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
        {isOwner && (
          <Button
            color="red"
            fullWidth
            leftIcon={<IconTrash size={16} />}
            mb="md"
            onClick={deleteTask}
          >
            Supprimer la tâche
          </Button>
        )}
      </form>
      <Text align="center" color="dimmed">
        Dernière mise à jour il y a {dayjs(task.updatedAt).toNow(true)}.<br />
        Crée le {dayjs(task.createdAt).format('LLLL')}.
      </Text>
    </Modal>
  );
}

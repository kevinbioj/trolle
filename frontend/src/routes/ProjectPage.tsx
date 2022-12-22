import { Carousel } from '@mantine/carousel';
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Flex,
  List,
  LoadingOverlay,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus, IconTrash } from '@tabler/icons';
import { useMatch, useNavigate } from '@tanstack/react-location';
import * as api from 'core/api';
import { useAuth } from 'core/providers';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export default function ProjectPage() {
  const { params } = useMatch<{ Params: { id: UUID } }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    api.projects
      .get(params.id)
      .then((p) => setProject(p))
      .catch(() => navigate({ to: '/' }));
  }, []);

  if (!project) return <LoadingOverlay visible />;
  return (
    <>
      <Title align="center" order={1} weight="normal">
        {project.name}
      </Title>
      <Box component="section" my="xl">
        <Title mb="sm" order={2} weight="normal">
          Tâches en cours
        </Title>
        <Carousel align="start" dragFree h={500} slideGap="md" slideSize="auto">
          {project.columns.map((column) => (
            <Carousel.Slide key={`column_${column.id}`} w={250}>
              <ProjectColumn column={column} />
            </Carousel.Slide>
          ))}
        </Carousel>
      </Box>
      <ProjectDetails project={project} />
      <ProjectMembers project={project} />
    </>
  );
}

function ProjectColumn({ column }: { column: Column }) {
  return (
    <Card h={500} shadow="sm" withBorder>
      <Title align="center" order={3} weight="lighter">
        {column.name}
      </Title>
    </Card>
  );
}

function ProjectDetails({ project }: { project: Project }) {
  return (
    <Box component="section" my="xl">
      <Title mb="sm" order={2} weight="normal">
        Informations du projet
      </Title>
      <Text>
        <Text component="span" weight="bold">
          Gérant du projet :
        </Text>{' '}
        {project.owner.displayName}
        <br />
        <Text component="span" weight="bold">
          Date de création :
        </Text>{' '}
        {dayjs(project.createdAt).format('LLLL')}
      </Text>
    </Box>
  );
}

const ERROR_MESSAGES: Record<string, string> = {
  MEMBER_ALREADY_EXISTS: 'Utilisateur déjà dans le projet.',
  USER_NOT_FOUND: 'Utilisateur introuvable.',
  DEFAULT: 'Erreur interne.',
};

function ProjectMembers({ project }: { project: Project }) {
  const { user } = useAuth();
  const form = useForm({ initialValues: { username: '' } });
  const [members, setMembers] = useState<Member[] | null>(null);

  const getMembers = () =>
    api.members
      .get(project.id)
      .then((m) => setMembers(m))
      .catch(() => void 0);
  const addMember = (username: string) =>
    api.members.add(project.id, username).then(() => getMembers());
  const removeMember = (username: string) =>
    api.members.remove(project.id, username).then(() => getMembers());

  const handleSubmit = () =>
    addMember(form.values.username)
      .then(() => form.setFieldValue('username', ''))
      .catch((e: APIError) =>
        form.setFieldError(
          'username',
          ERROR_MESSAGES[e.title] ?? ERROR_MESSAGES.DEFAULT,
        ),
      );

  useEffect(() => void getMembers(), []);

  return (
    <Box component="section" my="xl">
      <Title mb="sm" order={2} weight="normal">
        Membres du projet
      </Title>
      <Table my="lg">
        <thead>
          <tr>
            <th>Pseudonyme</th>
            <th>Nom public</th>
            <th>Date d&apos;arrivée</th>
            {project.owner.username === user?.username ? <th>Action</th> : null}
          </tr>
        </thead>
        <tbody>
          {members
            ? members.map((m) => (
                <tr key={`M-${m.user.username}`}>
                  <td>{m.user.username}</td>
                  <td>{m.user.displayName}</td>
                  <td>{dayjs(m.joinedAt).format('DD/MM/YYYY HH:mm')}</td>
                  {project.owner.username === user?.username ? (
                    <td>
                      {project.owner.username === m.user.username ? (
                        <Text color="dimmed">Vous</Text>
                      ) : (
                        <ActionIcon
                          aria-label="Supprimer le membre"
                          color="red"
                          onClick={() => removeMember(m.user.username)}
                          title="Supprimer le membre"
                        >
                          <IconTrash size={18} />
                        </ActionIcon>
                      )}
                    </td>
                  ) : null}
                </tr>
              ))
            : null}
        </tbody>
      </Table>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex align="stretch" justify="end">
          <TextInput
            placeholder="jdupont"
            {...form.getInputProps('username')}
          />
          <ActionIcon color="green" size="lg" type="submit" variant="filled">
            <IconPlus size={18} />
          </ActionIcon>
        </Flex>
      </form>
    </Box>
  );
}

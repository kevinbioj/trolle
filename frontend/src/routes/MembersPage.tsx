import { ActionIcon, Box, Flex, Table, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconArrowLeft, IconTrash, IconUserPlus } from '@tabler/icons';
import { Link, useMatch } from '@tanstack/react-location';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from 'core/api';
import { useAuth } from 'core/providers';
import dayjs from 'dayjs';

export default function MembersPage() {
  const {
    params: { id },
  } = useMatch<{ Params: { id: UUID } }>();
  const project = useQuery({
    queryKey: [`project_${id}`],
    queryFn: () => api.projects.get(id),
  });
  const members = useQuery({
    queryKey: [`project_${id}_members`],
    queryFn: () => api.members.get(id),
  });
  return members.data && project.data ? (
    <MembersView members={members.data} project={project.data} />
  ) : null;
}

type MembersViewProps = { members: Member[]; project: Project };
function MembersView({ members, project }: MembersViewProps) {
  const { user } = useAuth();
  const form = useForm({ initialValues: { username: '' } });
  const queryClient = useQueryClient();

  const isMutable = user?.username === project.owner.username;

  const addMember = (username: string) =>
    api.members
      .add(project.id, username)
      .then((member) => {
        form.setFieldValue('username', '');
        queryClient.invalidateQueries([`project_${project.id}_members`]);
        showNotification({
          color: 'green',
          message: `${member.user.displayName} a été ajouté aux membres du projet.`,
          title: 'Membre ajouté',
        });
      })
      .catch(() =>
        form.setFieldError('username', 'Ajout impossible, vérifier la saisie.'),
      );
  const removeMember = (username: string) => {
    const member = members.find(
      (m) => m.user.username.toLowerCase() === username.toLowerCase(),
    )!;
    api.members.remove(project.id, username).then(() => {
      queryClient.invalidateQueries([`project_${project.id}_members`]);
      showNotification({
        color: 'red',
        message: `${member.user.displayName} a été retiré des membres du projet.`,
        title: 'Membre retiré',
      });
    });
  };

  return (
    <>
      <Flex align="center" gap="sm" mb="xl">
        <ActionIcon
          component={Link}
          size="lg"
          title="Revenir au projet"
          to={`/projects/${project.id}`}
        >
          <IconArrowLeft size={32} />
        </ActionIcon>
        <Title order={1} weight="normal">
          {project.name}
        </Title>
      </Flex>
      <Title mb="md" order={2} weight="lighter">
        Gestion des membres
      </Title>
      <Box sx={{ overflowX: 'auto' }}>
        <Table
          highlightOnHover
          striped
          sx={{ whiteSpace: 'nowrap' }}
          withBorder
        >
          <thead>
            <tr>
              <th>Pseudonyme</th>
              <th>Nom public</th>
              <th>Date d&apos;arrivée</th>
              {isMutable && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.user.username}>
                <td>{m.user.username}</td>
                <td>{m.user.displayName}</td>
                <td>{dayjs(m.joinedAt).format('DD/MM/YYYY HH:mm')}</td>
                {isMutable && (
                  <td>
                    {m.user.username !== project.owner.username && (
                      <ActionIcon
                        color="red"
                        onClick={() => removeMember(m.user.username)}
                        title="Retirer le membre"
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
      {isMutable && (
        <form onSubmit={form.onSubmit(({ username }) => addMember(username))}>
          <Flex gap="sm" justify="end" mt="md">
            <TextInput
              placeholder="jdupont"
              {...form.getInputProps('username')}
            />
            <ActionIcon
              color="green"
              mt={1}
              type="submit"
              variant="filled"
              size="lg"
            >
              <IconUserPlus size={20} />
            </ActionIcon>
          </Flex>
        </form>
      )}
    </>
  );
}

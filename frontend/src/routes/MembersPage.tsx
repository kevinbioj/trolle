import { ActionIcon, Flex, Table, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconTrash, IconUserPlus } from '@tabler/icons';
import { useMatch } from '@tanstack/react-location';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from 'core/api';
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
  const form = useForm({ initialValues: { username: '' } });
  const queryClient = useQueryClient();

  const addMember = (username: string) =>
    api.members
      .add(project.id, username)
      .then(() =>
        queryClient.invalidateQueries([`project_${project.id}_members`]),
      )
      .catch(() =>
        form.setFieldError('username', 'Ajout impossible, vérifier la saisie.'),
      );
  const removeMember = (username: string) =>
    api.members
      .remove(project.id, username)
      .then(() =>
        queryClient.invalidateQueries([`project_${project.id}_members`]),
      );

  return (
    <>
      <Title mb="xl" weight="normal">
        Membres de {project.name}
      </Title>
      <Table>
        <thead>
          <tr>
            <th>Pseudonyme</th>
            <th>Nom public</th>
            <th>Date d&apos;arrivée</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.user.username}>
              <td>{m.user.username}</td>
              <td>{m.user.displayName}</td>
              <td>{dayjs(m.joinedAt).format('DD/MM/YYYY HH:mm')}</td>
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
            </tr>
          ))}
        </tbody>
      </Table>

      <form onSubmit={form.onSubmit(({ username }) => addMember(username))}>
        <Flex align="center" justify="end" mt="md">
          <TextInput
            placeholder="jdupont"
            {...form.getInputProps('username')}
          />
          <ActionIcon
            color="green"
            type="submit"
            variant="filled"
            size="lg"
            sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          >
            <IconUserPlus size={20} />
          </ActionIcon>
        </Flex>
      </form>
    </>
  );
}

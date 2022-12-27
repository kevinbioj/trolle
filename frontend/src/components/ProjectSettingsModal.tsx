import { Button, Modal, Switch, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconTrash } from '@tabler/icons';
import { useNavigate } from '@tanstack/react-location';
import { useQueryClient } from '@tanstack/react-query';
import * as api from 'core/api';
import * as Yup from 'yup';

interface ProjectSettingsModalProps {
  close: () => void;
  project: Project;
  visible: boolean;
}

export function ProjectSettingsModal({
  close,
  project,
  visible,
}: ProjectSettingsModalProps) {
  const form = useForm({
    initialValues: { name: project.name, isPublic: project.isPublic },
    validate: yupResolver(
      Yup.object().shape({
        name: Yup.string()
          .min(4, "Le nom du projet doit être composé d'au moins 4 caractères.")
          .max(64, 'Le nom de la tâche ne doit pas excéder 64 caractères.'),
      }),
    ),
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = () =>
    api.projects.update(project.id, form.values).then((project) => {
      queryClient.invalidateQueries([`project_${project.id}`]);
      showNotification({
        title: 'Projet mis à jour',
        message: `Le projet ${project.name} a été mis à jour avec succès.`,
      });
      close();
    });

  const deleteProject = () =>
    api.projects.remove(project.id).then(() => {
      showNotification({
        title: 'Projet supprimé',
        message: `Le projet ${project.name} a été supprimé avec succès.`,
      });
      navigate({ to: '/' });
    });

  return (
    <Modal
      onClose={close}
      opened={visible}
      shadow="md"
      title="Paramètres du projet"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Nom"
          mb="md"
          placeholder="Mon superbe projet"
          withAsterisk
          {...form.getInputProps('name')}
        />
        <Switch
          label="Visible par tout le monde"
          mb="md"
          {...form.getInputProps('isPublic')}
        />
        <Button fullWidth mb="md" type="submit">
          Sauvegarder
        </Button>
      </form>
      <Button
        color="red"
        fullWidth
        leftIcon={<IconTrash size={16} />}
        onClick={deleteProject}
      >
        Supprimer le projet
      </Button>
    </Modal>
  );
}

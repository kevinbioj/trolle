import { Button, Modal, TextInput } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import * as api from 'core/api';
import * as Yup from 'yup';

interface CreateTaskModalProps {
  close: () => void;
  column: Column;
  project: Project;
  visible: boolean;
}

export function CreateTaskModal({
  close,
  column,
  project,
  visible,
}: CreateTaskModalProps) {
  const form = useForm({
    initialValues: { title: '' },
    validate: yupResolver(
      Yup.object().shape({
        title: Yup.string()
          .required('Le titre de la tâche est obligatoire.')
          .min(
            2,
            "Le titre de la tâche doit être composé d'au moins 2 caractères.",
          )
          .max(32, 'Le titre de la tâche ne doit pas excéder 32 caractères.'),
      }),
    ),
  });
  const queryClient = useQueryClient();

  const handleSubmit = () =>
    api.tasks
      .create({
        ...form.values,
        columnId: column.id,
        projectId: project.id,
      })
      .then((task) => {
        queryClient.invalidateQueries([`project_${project.id}_tasks`]);
        showNotification({
          title: 'Tâche créée',
          message: `La tâche "${task.title}" a été créée avec succès.`,
        });
        close();
      });

  return (
    <Modal
      onClose={close}
      opened={visible}
      shadow="md"
      title={`Créer une tâche dans ${column.name}`}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Titre"
          mb="md"
          placeholder="Ma superbe tâche"
          {...form.getInputProps('title')}
        />
        <Button fullWidth type="submit">
          Créer une tâche
        </Button>
      </form>
    </Modal>
  );
}

import { useForm, yupResolver } from '@mantine/form';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from 'core/providers';
import * as api from 'core/api';
import * as Yup from 'yup';
import { showNotification } from '@mantine/notifications';
import {
  Button,
  Modal,
  Select,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { IconDeviceFloppy, IconPencil, IconTrash } from '@tabler/icons';
import dayjs from 'dayjs';
import { useState } from 'react';

type EditTaskModalProps = {
  onClose: () => void;
  project: Project;
  members: Member[];
  task: Task;
};
export function EditTaskModal({
  onClose,
  project,
  members,
  task,
}: EditTaskModalProps) {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
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
          .min(2, "Le titre doit être composé d'au moins 2 caractères.")
          .max(32, 'Le titre ne doit pas excéder 32 caractères.'),
        description: Yup.string()
          .nullable()
          .max(2048, 'La description ne doit pas excéder 2048 caractères.'),
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
        setEditMode(false);
        showNotification({
          color: 'green',
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
        color: 'red',
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
      title={`Tâche ${task.title}`}
      withCloseButton
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Titre"
          mb="md"
          placeholder="Ma superbe tâche"
          readOnly={!editMode}
          variant={editMode ? 'default' : 'unstyled'}
          withAsterisk={editMode}
          {...form.getInputProps('title')}
        />
        <Textarea
          label="Description"
          mb="md"
          placeholder="Le contenu de ma tâche"
          readOnly={!editMode}
          variant={editMode ? 'default' : 'unstyled'}
          {...form.getInputProps('description')}
        />
        <Select
          data={[
            { label: 'Personne', value: '' },
            ...members.map((m) => ({
              label: m.user.displayName,
              value: m.user.username,
            })),
          ]}
          label="Affectée à"
          mb="md"
          placeholder={editMode ? 'jdupont' : 'Personne'}
          readOnly={!editMode}
          variant={editMode ? 'default' : 'unstyled'}
          {...form.getInputProps('assignee')}
        />
        <Select
          label="Colonne"
          data={project.columns.map((c) => ({
            label: c.name,
            value: `${c.id}`,
          }))}
          mb="md"
          readOnly={!editMode}
          variant={editMode ? 'default' : 'unstyled'}
          {...form.getInputProps('column')}
        />
        <DatePicker
          allowFreeInput
          inputFormat="DD/MM/YYYY"
          label="Date limite de réalisation"
          locale="fr"
          mb="md"
          placeholder={editMode ? dayjs().format('DD/MM/YYYY') : 'Aucune'}
          readOnly={!editMode}
          variant={editMode ? 'default' : 'unstyled'}
          {...form.getInputProps('dueDate')}
        />
        {editMode && (
          <Button
            fullWidth
            leftIcon={<IconDeviceFloppy size={16} />}
            mb="md"
            type="submit"
          >
            Sauvegarder
          </Button>
        )}
      </form>
      {!editMode && editable && (
        <Button
          fullWidth
          leftIcon={<IconPencil size={16} />}
          mb="md"
          onClick={() => setEditMode(true)}
        >
          Modifier
        </Button>
      )}
      {isOwner && editMode && (
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
      <Text align="center" color="dimmed">
        Dernière mise à jour il y a {dayjs(task.updatedAt).toNow(true)}.<br />
        Crée le {dayjs(task.createdAt).format('LLLL')}.
      </Text>
    </Modal>
  );
}

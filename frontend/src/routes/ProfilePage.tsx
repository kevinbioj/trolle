import { Alert, Button, Container, TextInput, Title } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons';
import { useQueryClient } from '@tanstack/react-query';
import * as api from 'core/api';
import { useAuth } from 'core/providers';
import { useState } from 'react';
import * as Yup from 'yup';

const ERROR_MESSAGES: Record<string, string> = {
  DEFAULT:
    'Une erreur inconnue a empêché la mise à jour du profil, merci de réessayer plus tard.',
};

export default function ProfilePage() {
  const { user } = useAuth();
  const form = useForm({
    initialValues: { displayName: user!.displayName },
    validate: yupResolver(
      Yup.object().shape({
        displayName: Yup.string()
          .min(2, "Le nom public doit être d'au moins 2 caractères.")
          .max(40, 'Le nom public ne doit excéder 40 caractères.'),
      }),
    ),
  });
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleSubmit = () => {
    setError(null);
    api.users
      .update(form.values.displayName)
      .then((user) => queryClient.setQueryData(['user'], user))
      .catch((e: APIError) =>
        setError(ERROR_MESSAGES[e.title] ?? ERROR_MESSAGES.DEFAULT),
      );
  };

  return (
    <>
      <Title align="center" mb="md">
        Mon profil
      </Title>
      <Container size="xs">
        {error ? (
          <Alert
            closeButtonLabel="Ignorer l'erreur"
            color="red"
            icon={<IconAlertCircle size={16} />}
            mb="xs"
            onClose={() => setError(null)}
            title="Échec de la mise à jour du profil"
            withCloseButton
          >
            {error}
          </Alert>
        ) : null}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Nom public"
            mb="xs"
            placeholder="Jean DUPONT"
            withAsterisk
            {...form.getInputProps('displayName')}
          />
          <Button
            disabled={form.values.displayName === user!.displayName}
            fullWidth
            mb="xs"
            type="submit"
          >
            Mettre à jour
          </Button>
        </form>
      </Container>
    </>
  );
}

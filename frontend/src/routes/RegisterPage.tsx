import { Alert, Button, Container, TextInput, Title } from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons';
import { useNavigate } from '@tanstack/react-location';
import * as api from 'core/api';
import { useState } from 'react';
import * as Yup from 'yup';

const ERROR_MESSAGES: Record<string, string> = {
  DEFAULT:
    'Une ou plusieurs erreurs dans le formulaire doivent être corrigées.',
  NETWORK_ERROR:
    "Une erreur inconnue a empêché l'inscription, merci de réessayer plus tard.",
};

export default function RegisterPage() {
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
      displayName: '',
    },
    validate: yupResolver(
      Yup.object().shape({
        username: Yup.string()
          .max(20, 'Le pseudonyme ne peut excéder 20 caractères.')
          .matches(
            new RegExp('^[A-Za-z]'),
            'Le pseudonyme doit débuter par une lettre.',
          )
          .matches(
            new RegExp('[A-Za-z0-9_]$'),
            'Le pseudonyme ne doit contenir que des lettres, des chiffres et le tiret du bas.',
          ),
        password: Yup.string()
          .min(8, "Le mot de passe doit être d'au moins 8 caractères.")
          .max(32, 'Le mot de passe ne peut excéder 32 caractères.'),
        passwordConfirmation: Yup.string().oneOf(
          [Yup.ref('password')],
          'Les deux mots de passe ne correspondent pas.',
        ),
        displayName: Yup.string()
          .min(2, "Le nom public doit être d'au moins 2 caractères.")
          .max(40, 'Le nom public ne doit excéder 40 caractères.'),
      }),
    ),
  });
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    api.users
      .register(
        form.values.username,
        form.values.password,
        form.values.displayName,
      )
      .then(() => navigate({ to: '/login' }))
      .catch((e: APIError) => {
        setError(ERROR_MESSAGES[e.title] ?? ERROR_MESSAGES.DEFAULT);
        if (e.title === 'USERNAME_ALREADY_USED')
          form.setFieldError('username', 'Ce pseudonyme est déjà utilisé.');
      });
  };

  return (
    <>
      <Title align="center" mb="md">
        Inscription
      </Title>
      <Container size="xs">
        {error ? (
          <Alert
            closeButtonLabel="Ignorer l'erreur"
            color="red"
            icon={<IconAlertCircle size={16} />}
            mb="xs"
            onClose={() => setError(null)}
            title="Échec de l'inscription"
            withCloseButton
          >
            {error}
          </Alert>
        ) : null}
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Pseudonyme"
            mb="xs"
            placeholder="jdupont"
            withAsterisk
            {...form.getInputProps('username')}
          />
          <TextInput
            label="Mot de passe"
            mb="xs"
            placeholder="••••••••••"
            type="password"
            withAsterisk
            {...form.getInputProps('password')}
          />
          <TextInput
            label="Confirmation du mot de passe"
            mb="xs"
            placeholder="••••••••••"
            type="password"
            withAsterisk
            {...form.getInputProps('passwordConfirmation')}
          />
          <TextInput
            label="Nom public"
            mb="xs"
            placeholder="Jean DUPONT"
            withAsterisk
            {...form.getInputProps('displayName')}
          />
          <Button fullWidth mb="xs" type="submit">
            S&apos;inscrire
          </Button>
        </form>
      </Container>
    </>
  );
}

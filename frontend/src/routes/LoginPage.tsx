import { Alert, Button, Container, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons';
import { Link, useNavigate } from '@tanstack/react-location';
import { useAuth } from 'core/providers';
import { useState } from 'react';

const ERROR_MESSAGES: Record<string, string> = {
  BAD_CREDENTIALS: 'Les identifiants fournis ne correspondent à aucun compte.',
  DEFAULT:
    'Une erreur inconnue a empêché la connexion, merci de réessayer plus tard.',
};

export default function LoginPage() {
  const { login } = useAuth();
  const form = useForm({
    initialValues: { username: '', password: '' },
  });
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    login(form.values.username, form.values.password)
      .then(() => navigate({ to: '/' }))
      .catch((e: APIError) =>
        setError(ERROR_MESSAGES[e.title] ?? ERROR_MESSAGES.DEFAULT),
      );
  };

  return (
    <>
      <Title align="center" mb="md">
        Connexion
      </Title>
      <Container size="xs">
        {error ? (
          <Alert
            closeButtonLabel="Ignorer l'erreur"
            color="red"
            icon={<IconAlertCircle size={16} />}
            mb="xs"
            onClose={() => setError(null)}
            title="Échec de la connexion"
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
            required
            {...form.getInputProps('username')}
          />
          <TextInput
            label="Mot de passe"
            mb="xs"
            placeholder="••••••••••"
            required
            type="password"
            {...form.getInputProps('password')}
          />
          <Button fullWidth mb="xs" type="submit">
            Se connecter
          </Button>
        </form>
        <Button component={Link} fullWidth to="/register" variant="subtle">
          Je n&apos;ai pas encore de compte
        </Button>
      </Container>
    </>
  );
}

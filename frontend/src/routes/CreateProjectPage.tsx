import {
  ActionIcon,
  Box,
  Button,
  Container,
  Flex,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { IconPlus, IconTrash } from '@tabler/icons';
import { useNavigate } from '@tanstack/react-location';
import * as api from 'core/api';
import * as Yup from 'yup';

export default function CreateProjectPage() {
  const form = useForm<{
    name: string;
    columns: { name: string; key: string }[];
  }>({
    initialValues: { name: '', columns: [] },
    validate: yupResolver(
      Yup.object().shape({
        name: Yup.string()
          .min(4, "Le nom du projet doit être composé d'au moins 4 caractères.")
          .max(32, 'Le nom du projet ne doit pas excéder 32 caractères.'),
        columns: Yup.array().of(
          Yup.object().shape({
            name: Yup.string()
              .required('Ce champ est requis.')
              .min(
                2,
                "Le nom de la colonne doit être composé d'au moins 2 caractères.",
              )
              .max(32, 'Le nom de la colonne ne doit excéder 32 caractères.'),
          }),
        ),
      }),
    ),
  });
  const navigate = useNavigate();

  const handleSubmit = () =>
    api.projects
      .create(
        form.values.name,
        form.values.columns.map((c) => c.name),
      )
      .then((project) => navigate({ to: `/projects/${project.id}` }))
      .catch((e: APIError) => {
        if (e.title === 'PROJECT_NAME_ALREADY_USED')
          form.setFieldError(
            'name',
            'Ce nom est déjà utilisé pour un autre projet.',
          );
      });

  return (
    <Box component="section" my="xl">
      <Container size="sm">
        <Title align="center" mb="md" order={1} weight="normal">
          Nouveau projet
        </Title>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Title mb="xs" order={2} weight="lighter">
            Informations de base
          </Title>
          <TextInput
            label="Nom"
            mb="lg"
            placeholder="Mon superbe projet"
            withAsterisk
            {...form.getInputProps('name')}
          />
          <Title mb="xs" order={2} weight="lighter">
            Colonnes
          </Title>
          <TextInput defaultValue="Stories" disabled mb="md" />
          {form.values.columns.map((column, index) => (
            <Flex align="center" key={column.key} gap="sm" mb="md">
              <TextInput
                withAsterisk
                w="100%"
                {...form.getInputProps(`columns.${index}.name`)}
              />
              <ActionIcon
                color="red"
                onClick={() => form.removeListItem('columns', index)}
              >
                <IconTrash size={18} />
              </ActionIcon>
            </Flex>
          ))}
          {form.values.columns.length < 8 && (
            <ActionIcon
              mb="md"
              mx="auto"
              onClick={() =>
                form.insertListItem('columns', { name: '', key: randomId() })
              }
            >
              <IconPlus size={18} />
            </ActionIcon>
          )}
          <TextInput defaultValue="Terminées" disabled mb="md" />
          <Button fullWidth type="submit">
            Créer
          </Button>
        </form>
      </Container>
    </Box>
  );
}

import {
  Box,
  Button,
  Card,
  Divider,
  Flex,
  LoadingOverlay,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import { Link } from '@tanstack/react-location';
import { useQuery } from '@tanstack/react-query';
import * as api from 'core/api';
import { useAuth } from 'core/providers';
import dayjs from 'dayjs';

export default function HomePage() {
  const { user } = useAuth();
  const myProjects = useQuery({
    enabled: user !== null,
    queryFn: api.projects.findAllInvolved,
    queryKey: [`involved_projects_${user?.username}`],
  });
  const publicProjects = useQuery({
    queryFn: api.projects.findAllPublic,
    queryKey: ['public_projects'],
  });

  if (user === null) {
    return publicProjects.data ? (
      <HomePageView myProjects={null} publicProjects={publicProjects.data} />
    ) : (
      <LoadingOverlay visible />
    );
  }
  return myProjects.data && publicProjects.data ? (
    <HomePageView
      myProjects={myProjects.data}
      publicProjects={publicProjects.data}
    />
  ) : (
    <LoadingOverlay visible />
  );
}

type HomePageViewProps = {
  myProjects: Project[] | null;
  publicProjects: Project[];
};
function HomePageView({ myProjects, publicProjects }: HomePageViewProps) {
  return (
    <>
      {myProjects && <MyProjectsProps myProjects={myProjects} />}
      <PublicProjectsProps publicProjects={publicProjects} />
    </>
  );
}

type MyProjectsProps = { myProjects: Project[] };
function MyProjectsProps({ myProjects }: MyProjectsProps) {
  return (
    <Box component="section" my="xl">
      <Flex align="center" justify="space-between" mb="md">
        <Title order={2} weight="normal">
          Mes projets
        </Title>
        <Button
          component={Link}
          leftIcon={<IconPlus size={16} />}
          to="/projects/create"
          variant="outline"
        >
          Créer un projet
        </Button>
      </Flex>
      {myProjects.length > 0 ? (
        <SimpleGrid
          cols={4}
          breakpoints={[
            { maxWidth: 'sm', cols: 1 },
            { maxWidth: 'md', cols: 2 },
            { maxWidth: 'lg', cols: 3 },
          ]}
        >
          {myProjects.map((project) => (
            <Card
              component={Link}
              key={`PROJECT_${project.id}`}
              shadow="md"
              to={`/projects/${project.id}`}
              withBorder
            >
              <Title align="center" order={3} weight="lighter">
                {project.name}
              </Title>
              <Divider mt="md" mb="xs" />
              <Text align="end" color="dimmed" italic>
                Créé il y a {dayjs(project.createdAt).toNow(true)}.
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Text color="dimmed">Vous ne gérez aucun projet pour le moment.</Text>
      )}
    </Box>
  );
}

type PublicProjectsProps = Pick<HomePageViewProps, 'publicProjects'>;
function PublicProjectsProps({ publicProjects }: PublicProjectsProps) {
  return (
    <Box component="section" my="xl">
      <Title mb="md" order={2} weight="normal">
        Découvrir des projets publics
      </Title>
      {publicProjects.length > 0 ? (
        <SimpleGrid
          cols={4}
          breakpoints={[
            { maxWidth: 'sm', cols: 1 },
            { maxWidth: 'md', cols: 2 },
            { maxWidth: 'lg', cols: 3 },
          ]}
        >
          {publicProjects.map((project) => (
            <Card
              component={Link}
              key={`PROJECT_${project.id}`}
              shadow="md"
              to={`/projects/${project.id}`}
              withBorder
            >
              <Title align="center" order={3} weight="lighter">
                {project.name}
              </Title>
              <Divider mt="md" mb="xs" />
              <Text align="end" color="dimmed" italic>
                Créé il y a {dayjs(project.createdAt).toNow(true)}.
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Text color="dimmed">
          Aucun projet public n&apos;est accessible pour le moment.
        </Text>
      )}
    </Box>
  );
}

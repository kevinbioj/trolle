import {
  Box,
  Card,
  Divider,
  LoadingOverlay,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import { Link } from '@tanstack/react-location';
import * as api from 'core/api';
import { useAuth } from 'core/providers';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    api.projects
      .findAllInvolved()
      .then((p) => setProjects(p))
      .catch(() => setProjects([]));
  }, []);

  return (
    <>
      {user ? (
        <Box component="section">
          <Title mb="xs" order={2} weight="normal">
            Mes projets
          </Title>
          {projects ? (
            <SimpleGrid
              cols={4}
              breakpoints={[
                { maxWidth: 'sm', cols: 1 },
                { maxWidth: 'md', cols: 2 },
                { maxWidth: 'lg', cols: 3 },
              ]}
            >
              {projects.map((p) => (
                <Card
                  component={Link}
                  key={`PROJECT_${p.id}`}
                  shadow="md"
                  to={`/projects/${p.id}`}
                  withBorder
                >
                  <Title align="center" order={3} weight="lighter">
                    {p.name}
                  </Title>
                  <Divider mt="md" mb="xs" />
                  <Text align="end" color="dimmed" italic>
                    Créé il y a {dayjs(p.createdAt).toNow(true)}.
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <LoadingOverlay h={150} pos="relative" visible />
          )}
        </Box>
      ) : null}
    </>
  );
}

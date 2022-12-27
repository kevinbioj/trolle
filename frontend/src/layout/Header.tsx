import { Box, Button, Container, Flex, Menu } from '@mantine/core';
import { IconChevronDown, IconDoorExit, IconUser } from '@tabler/icons';
import { Link } from '@tanstack/react-location';
import { Logo } from 'assets';
import { useAuth } from 'core/providers';

export function Header() {
  const { logout, user } = useAuth();
  return (
    <Box component="header">
      <Container mx="auto" size="xl">
        <Flex align="center" justify="space-between" py="xs">
          <Link to="/">
            <Logo style={{ height: '3rem' }} />
          </Link>
          {user ? (
            <Menu shadow="md">
              <Menu.Target>
                <Button rightIcon={<IconChevronDown size={16} />}>
                  {user.displayName}
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  component={Link}
                  icon={<IconUser size={14} />}
                  to="/profile"
                >
                  Profil
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  icon={<IconDoorExit size={14} />}
                  onClick={logout}
                >
                  Déconnexion
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button component={Link} to="/login" variant="outline">
              Connexion
            </Button>
          )}
        </Flex>
      </Container>
    </Box>
  );
}

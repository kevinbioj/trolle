import {
  Box,
  Container,
  Divider,
  MantineProvider,
  type MantineThemeOverride,
} from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { Outlet, ReactLocation, Router } from '@tanstack/react-location';
import { Footer, Header } from 'layout';
import { AuthProvider } from 'core/providers';
import routes from 'routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const location = new ReactLocation();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});
const theme: MantineThemeOverride = {
  components: {
    Button: {
      defaultProps: {
        color: 'pink',
      },
    },
    LoadingOverlay: {
      defaultProps: {
        loaderProps: {
          color: 'pink',
        },
      },
    },
  },
  loader: 'dots',
};

function App() {
  return (
    <MantineProvider theme={theme} withCSSVariables withNormalizeCSS>
      <NotificationsProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <Router location={location} routes={routes}>
              <Header />
              <Divider mb="xl" />
              <Box component="main">
                <Container size="xl">
                  <Outlet />
                </Container>
              </Box>
              <Divider mt="xl" />
              <Footer />
            </Router>
          </AuthProvider>
        </QueryClientProvider>
      </NotificationsProvider>
    </MantineProvider>
  );
}

export default App;

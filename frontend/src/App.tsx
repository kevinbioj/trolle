import {
  Box,
  Container,
  Divider,
  MantineProvider,
  type MantineThemeOverride,
} from '@mantine/core';
import { Outlet, ReactLocation, Router } from '@tanstack/react-location';
import { Footer, Header } from 'layout';
import { AuthProvider } from 'core/providers';
import routes from 'routes';

const location = new ReactLocation();
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
    </MantineProvider>
  );
}

export default App;

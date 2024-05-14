import React from 'react';
import { ChakraProvider, Box, Button } from '@chakra-ui/react';
import Profile from './components/Profile';
import theme from './config/theme';

import { withAuthenticator } from '@aws-amplify/ui-react';

function App({ signOut, user }) {
  // Assuming 'user' has a unique identifier or a token
  console.log('Authenticated user:', user);

  return (
    <ChakraProvider theme={theme}>
      <Box position="relative">
        {' '}
        <Button
          position="absolute"
          top={6} // Top position
          left={500} // Left position
          onClick={signOut}
          colorScheme="gray" // Neutral color scheme
          variant="solid" // Solid background
          size="md" // Medium size
          borderRadius="md" // Rounded corners
          bg="white" // Set background color to white
          color="black" // Text color
          _hover={{
            bg: 'gray.200', // Hover effect (light gray)
          }}
          _active={{
            bg: 'gray.300', // Active effect (slightly darker gray)
          }}
        >
          LogOut
        </Button>
        <Box textAlign="center" fontSize="2xl" m="3rem auto" p={5} maxW={700}>
          <Profile />
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default withAuthenticator(App);

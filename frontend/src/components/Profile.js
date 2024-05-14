import { Box, VStack, Image, Text, Flex } from '@chakra-ui/react';
import Posts from './Posts';

const Profile = () => {
  return (
    <Box>
      <Flex align="center" justify="space-between">
        {' '}
        {/* Flex container */}
        <VStack p={7} ml={0} width="fit-content" borderRadius={6} bg="gray.700">
          <Image
            borderRadius="full"
            boxSize="80px"
            src="https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
            alt="Profile"
          />
          {/* <Text>Malhar Dhopate</Text> */}
          <Text>Shubham Halvadia</Text>

          <Text fontSize="lg" color="gray.400">
            WELCOME! Shubham
          </Text>
        </VStack>
      </Flex>
      <Posts />
    </Box>
  );
};

export default Profile;

import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction} // Trigger the function when the box is clicked
      cursor="pointer"
      bg="gray.100"
      _hover={{
        background: "teal.400",
        color: "white",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      p={3}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name} // Display user initials if no image
        src={user.pic} // Display user's profile image
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;

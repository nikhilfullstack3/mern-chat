import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import Signup from "../components/authentication/Signup";
import Login from "../components/authentication/Login";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        bg={"white"}
        w={"100%"}
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text
          fontSize={"4xl"}
          color={"black"}
          fontFamily={"'Work Sans', sans-serif"}
          fontWeight={300} // Font weight set to 300 (light)
        >
          Talk-a-Tive
        </Text>
      </Box>
      <Box
        bg={"white"}
        w={"100%"}
        borderRadius={"lg"}
        borderWidth={"1px"}
        p={4}
        color={"black"}
      >
        <Tabs variant="soft-rounded">
          <TabList>
            <Tab w={"50%"}>Login</Tab>
            <Tab w={"50%"}>Sign-up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;

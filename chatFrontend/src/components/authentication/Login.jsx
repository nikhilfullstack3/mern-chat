import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast, // Import useToast
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const toast = useToast(); // Initialize toast
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Ensure fields are filled
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login", // Adjust the route as per your backend
        { email, password },
        config
      );

      // Store user info in local storage
      localStorage.setItem("userInfo", JSON.stringify(data));

      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.name}!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Navigate to the chats page
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: error.response?.data?.message || "Login failed",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const guestLoginHandler = () => {
    setEmail("guest@example.com");
    setPassword("123456");
  };

  return (
    <VStack spacing={"5px"} color={"black"}>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={showPassword ? "text" : "password"} // Toggle visibility
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowPassword(!showPassword)} // Toggle showPassword
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        w={"100%"}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        colorScheme="red"
        w={"100%"}
        style={{ marginTop: 15 }}
        onClick={guestLoginHandler} // Guest login button pre-fills credentials
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;

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

const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast(); // Initialize toast
  const [show, setShow] = useState({ password: false, confirmPassword: false });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Add confirmPassword state
  const [pic, setPic] = useState("");
  const [picLoading, setPicLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    // Check if fields are filled
    if (!name || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        { name, email, password, pic },
        config
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      toast({
        title: "Registration Successful",
        description: `Welcome, ${data.name}!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const postDetails = async (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Error",
        description: "Please upload an image",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setPicLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", pics);
    formData.append("upload_preset", "chat_app");
    formData.append("cloud_name", "duokzjabw");

    try {
      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/duokzjabw/image/upload",
        formData
      );
      setPic(data.url.toString());
      setPicLoading(false);
      toast({
        title: "Image Uploaded",
        description: "Your image has been uploaded successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Image Upload Error",
        description: "There was an error uploading the image",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setPicLoading(false);
    }
  };

  const handleClick = (field) => {
    setShow((prevShow) => ({ ...prevShow, [field]: !prevShow[field] }));
  };

  return (
    <VStack spacing={"5px"} color={"black"}>
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show.password ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => handleClick("password")}
            >
              {show.password ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            pr="4.5rem"
            type={show.confirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)} // Update confirmPassword state
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => handleClick("confirmPassword")}
            >
              {show.confirmPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic" isRequired>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        w={"100%"}
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Sign-up
      </Button>
    </VStack>
  );
};

export default Signup;

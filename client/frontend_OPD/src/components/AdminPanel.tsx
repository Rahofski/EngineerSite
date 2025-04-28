import { useState } from "react";
import { Box, Heading, Input, Button, Stack, Text, Icon } from "@chakra-ui/react";
import { BASE_URL } from "../App";
import { CloseIcon } from "@chakra-ui/icons";
import { accentColor, darkPurple } from "./constants/colors";

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel = ({ onClose }: AdminPanelProps) =>{
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [emailToDelete, setEmailToDelete] = useState("");
  const [message, setMessage] = useState("");

  const handleAddEngineer = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при добавлении инженера");
      }

      setMessage("✅ Инженер успешно добавлен!");
      setEmail("");
      setUsername("");
    } catch (error) {
      setMessage("❌ Ошибка при добавлении инженера");
    }
  };

  const handleDeleteEngineer = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/${emailToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Ошибка при удалении инженера");
      }

      setMessage("✅ Инженер успешно удалён!");
      setEmailToDelete("");
    } catch (error) {
      setMessage("❌ Ошибка при удалении инженера");
    }
  };

  return (
    <Box h="600px">
      <Button onClick={onClose} position="absolute" top={2} right={2} bgColor={darkPurple}>
        <Icon as={CloseIcon}/>
      </Button>
      <Heading as="h2" size="md" mb={4} textAlign="center">
        Управление инженерами
      </Heading>

      <Stack gap={4}>
        {/* Добавление инженера */}
        <Box>
          <Heading as="h3" size="sm" mb={2}>
            Добавить инженера
          </Heading>
          <Input placeholder="Почта" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Пароль  " value={username} onChange={(e) => setUsername(e.target.value)} mt={2} />
          <Button colorScheme="green" mt={2} onClick={handleAddEngineer} bgColor={darkPurple}>
            Добавить
          </Button>
        </Box>

        {/* Удаление инженера */}
        <Box>
          <Heading as="h3" size="sm" mb={2}>
            Удалить инженера
          </Heading>
          <Input placeholder="Почта" value={emailToDelete} onChange={(e) => setEmailToDelete(e.target.value)} />
          <Button colorScheme="red" mt={2} onClick={handleDeleteEngineer} bgColor={accentColor}>
            Удалить
          </Button>
        </Box>
      </Stack>

      {message && (
        <Text mt={4} color="gray.700" textAlign="center">
          {message}
        </Text>
      )}
    </Box>
  );
};


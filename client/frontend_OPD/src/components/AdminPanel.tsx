import { useState } from "react";
import { Box, Heading, Input, Button, Stack, Text } from "@chakra-ui/react";
import { BASE_URL } from "../App";

export const AdminPanel = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [emailToDelete, setEmailToDelete] = useState("");
  const [message, setMessage] = useState("");

  const handleAddEngineer = async () => {
    try {
      const response = await fetch(BASE_URL + "/engineers/add", {
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
      const response = await fetch(BASE_URL + "/engineers/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailToDelete }),
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
    <Box>
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
          <Input placeholder="Логин" value={username} onChange={(e) => setUsername(e.target.value)} mt={2} />
          <Button colorScheme="green" mt={2} onClick={handleAddEngineer}>
            Добавить
          </Button>
        </Box>

        {/* Удаление инженера */}
        <Box>
          <Heading as="h3" size="sm" mb={2}>
            Удалить инженера
          </Heading>
          <Input placeholder="Почта" value={emailToDelete} onChange={(e) => setEmailToDelete(e.target.value)} />
          <Button colorScheme="red" mt={2} onClick={handleDeleteEngineer}>
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

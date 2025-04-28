import { useState } from "react";
import { Box, Heading, Input, Button, Stack, Text, Icon } from "@chakra-ui/react";
import { BASE_URL } from "../App";
import { CloseIcon } from "@chakra-ui/icons";
import { accentColor, darkPurple } from "./constants/colors";

interface AdminPanelProps {
  onClose: () => void;
}

export const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");
  const [name, setFio] = useState("");

  const [password, setPassword] = useState("");
  const [field_id, setField_id] = useState<number>(0); // Явно указываем тип number

  const [emailToRemove, setEmailToDelete] = useState("");
  const [message, setMessage] = useState("");

  const handleAddEngineer = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password, field_id, name }), // field_id уже number
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        throw new Error("Ошибка при добавлении инженера");
      }

      setMessage("✅ Инженер успешно добавлен!");
      setEmail("");
      setPassword("");
      setField_id(0); // Сбрасываем на 0
      setFio("")
    } catch (error) {
      setMessage("❌ Ошибка при добавлении инженера");
    }
  };

  const handleDeleteEngineer = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,

        },
        body: JSON.stringify({ emailToRemove }), // field_id уже number
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
        <Icon as={CloseIcon} />
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
          <Input 
            placeholder="Почта" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            placeholder="Пароль" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            mt={2} 
          />
          <Input 
            placeholder="ID сферы" 
            type="number" // Добавляем type="number" для числового ввода
            value={field_id} 
            onChange={(e) => setField_id(Number(e.target.value))} // Преобразуем в число
            mt={2} 
          />
          <Input 
            placeholder="ФИО" 
            value={name} 
            onChange={(e) => setFio(e.target.value)} // Преобразуем в число
            mt={2} 
          />

          <Button colorScheme="green" mt={2} onClick={handleAddEngineer} bgColor={darkPurple}>
            Добавить
          </Button>
        </Box>

        {/* Удаление инженера */}
        <Box>
          <Heading as="h3" size="sm" mb={2}>
            Удалить инженера
          </Heading>
          <Input 
            placeholder="Почта" 
            value={emailToRemove} 
            onChange={(e) => setEmailToDelete(e.target.value)} 
          />
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
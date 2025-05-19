import { useState } from "react";
import { Box, Heading, Input, Button, Stack, Text, Icon, Wrap, WrapItem, Badge } from "@chakra-ui/react";
import { BASE_URL } from "../App";
import { CloseIcon } from "@chakra-ui/icons";
import { accentColor, darkPurple } from "./constants/colors";

interface AdminPanelProps {
  onClose: () => void;
}

const fields = [
  { id: 1, name: "Водоснабжение" },
  { id: 2, name: "Электроснабжение" },
  // { id: 3, name: "Газоснабжение" },
  { id: 4, name: "Администрирование" },
  { id: 5, name: "Техника" },
  { id: 6, name: "Другое" },
  { id: 7, name: "Плотничество" }
];

export const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");
  const [name, setFio] = useState("");
  const [password, setPassword] = useState("");
  const [field_id, setField_id] = useState<number | null>(null);
  const [emailToRemove, setEmailToDelete] = useState("");
  const [message, setMessage] = useState("");

  const handleAddEngineer = async () => {
    if (!field_id) {
      setMessage("❌ Выберите сферу деятельности");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/user/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password, field_id, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data);
        throw new Error("Ошибка при добавлении инженера");
      }

      setMessage("✅ Инженер успешно добавлен!");
      setEmail("");
      setPassword("");
      setField_id(null);
      setFio("");
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
        body: JSON.stringify({ emailToRemove }),
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
    <Box h="600px" overflowY="auto">
      <Button onClick={onClose} position="absolute" top={2} right={2} bgColor={darkPurple}>
        <Icon as={CloseIcon} boxSize={4}/>
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
            type="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            mt={2} 
          />
          <Input 
            placeholder="ФИО" 
            value={name} 
            onChange={(e) => setFio(e.target.value)}
            mt={2} 
          />

          <Text mt={3} mb={2} fontWeight="medium">
            Выберите сферу деятельности:
          </Text>
          
          <Wrap gap={2}>
            {fields.map((field) => (
              <WrapItem key={field.id}>
                <Badge 
                  px={3} 
                  py={1} 
                  borderRadius="full"
                  cursor="pointer"
                  bg={field_id === field.id ? accentColor : "gray.100"}
                  color={field_id === field.id ? "white" : "gray.800"}
                  onClick={() => setField_id(field.id)}
                  _hover={{
                    bg: field_id === field.id ? accentColor : "gray.200"
                  }}
                >
                  {field.name}
                </Badge>
              </WrapItem>
            ))}
          </Wrap>

          <Button 
            colorScheme="green" 
            mt={4} 
            onClick={handleAddEngineer} 
            bgColor={darkPurple}
            disabled={!field_id}
          >
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
        <Text mt={4} color={message.startsWith("✅") ? "green.500" : "red.500"} textAlign="center">
          {message}
        </Text>
      )}
    </Box>
  );
};
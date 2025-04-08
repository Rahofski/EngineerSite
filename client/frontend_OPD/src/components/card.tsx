import { Button, Card, Input, Stack, Center, Box, IconButton } from "@chakra-ui/react";
import { Field } from "../components/ui/field";
import { useState } from "react";
import { InputGroup } from "./ui/input-group";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Импортируем jwtDecode
import { BASE_URL } from "@/App";

export const CardWithForm = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Инициализация useNavigate

  const handleClear = () => {
    setEmail(""); // Очищаем значение инпута
    setPassword(""); // Очищаем значение инпута
  };
  const handleLogin = async () => {
    try {
      const response = await fetch(BASE_URL + "/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      const status = response.status;
      console.log("HTTP Status Code:", status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Something went wrong");
      }
  
      // Получаем токен
      const data = await response.json();
      console.log(data);
      const token = data.token;

      if (!token) {
        throw new Error("No token received");
      }
  
      // Сохраняем токен в localStorage
      localStorage.setItem("token", token);
  
      // Декодируем токен
      const decodedToken = jwtDecode<{ field_id?: number }>(token);
  
      // Определяем, куда перенаправлять пользователя
      const redirectPath = (decodedToken.field_id === 4) ? "/AdminPage" : "/request";
  
      // Очистка полей
      setEmail("");
      setPassword("");
  
      console.log("Login succeeded, redirecting to", redirectPath);
  
      // Перенаправление на нужную страницу
      setTimeout(() => {
        navigate(redirectPath);
      }, 1000);
    } catch (error) {
      console.log("Ошибка при логине:", error);
  
      // В случае ошибки можно оставить редирект на "/request" по умолчанию
      setTimeout(() => {
        navigate("/AdminPage");
      }, 1000);
    }
  };

  return (
    <Center height="100vh">
      <Card.Root
        w="md"
        maxW="md"
        colorPalette={"green"}
        justifyContent={"center"}
        border="15px solid"
        borderColor="gray.300"
        borderRadius="lg"
        boxShadow="md"
        p={4}
        color={"#F1F5F9"}
        bg="linear-gradient(to bottom, #34D399, #064E3B)" // Градиент от светло-зеленого до зеленого
      >
        <Card.Header>
          <Card.Title fontSize={"24px"} color = {"white"}>Авторизация</Card.Title>
          <Card.Description color={"white"}>
            Заполните форму, чтобы войти
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Stack gap="4" w="full">
            <Field label="Почта">
              <Input
                type="email"
                placeholder="Введите почту"
                _placeholder={{ color: "lightgrey" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Пароль">
              <InputGroup>
                <>
                  <Input
                    type={show ? "text" : "password"} // Меняет тип на "text", когда show == true
                    placeholder="Введите пароль"
                    value={password}
                    _placeholder={{ color: "lightgrey" }}
                    onChange={(e) => setPassword(e.target.value)}
                    w="250px"
                    pr="3rem" // Добавляем отступ справа для кнопки
                  />
                  <Box position="absolute" right="0" top="50%" transform="translateY(-50%)">
                    <IconButton
                      aria-label={show ? "Hide password" : "Show password"}
                      size="sm"
                      onClick={() => setShow(!show)}
                      variant="ghost"
                      _hover={{ bg: "transparent" }} // Убирает цвет при наведении
                      _active={{ bg: "transparent" }} // Убирает цвет при клике
                      _focus={{ boxShadow: "none" }} // Убирает фокусную рамку
                    >
                      {show ? "🚫" : "👁️"} {/* Используем текстовые символы вместо иконок */}
                    </IconButton> 
                  </Box>
                  </>
                  </InputGroup>
            </Field>
          </Stack>
        </Card.Body>
        <Card.Footer justifyContent="space-between">
          <Button variant="solid" onClick={handleClear}>Сбросить</Button>
          <Button variant="solid" onClick={handleLogin}>Войти</Button>
        </Card.Footer>
      </Card.Root>
    </Center>
  );
};
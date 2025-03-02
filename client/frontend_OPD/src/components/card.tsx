import { Button, Card, Input, Stack, Center, Box, IconButton } from "@chakra-ui/react";
import { Field } from "../components/ui/field";
import { useState } from "react";
import { InputGroup } from "./ui/input-group";
import { Link } from "react-router-dom";

export const CardWithForm = () => {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState("");
  const [secondValue, setSecondValue] = useState("");

  const handleClear = () => {
    setValue(""); // Очищаем значение инпута
    setSecondValue(""); // Очищаем значение инпута
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
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </Field>
            <Field label="Пароль">
              <InputGroup>
                <>
                  <Input
                    type={show ? "text" : "password"} // Меняет тип на "text", когда show == true
                    placeholder="Введите пароль"
                    value={secondValue}
                    _placeholder={{ color: "lightgrey" }}
                    onChange={(e) => setSecondValue(e.target.value)}
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
					<Link to="/request">
            <Button variant="solid">Войти</Button>
          </Link>  
        </Card.Footer>
      </Card.Root>
    </Center>
  );
};
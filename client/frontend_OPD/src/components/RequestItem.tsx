import { Box, Button, Card, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useColorModeValue } from "@/components/ui/color-mode";
import { Request } from "./RequestList";
import { BASE_URL } from "../App";

export type Building = {
  _id: number;
  name: string;
  address: string;
  type: string;
};

// Моковые данные зданий
const mockBuildings: Building[] = [
  {
    _id: 0,
    name: "6 общага",
    address: "Хрыщева, 16",
    type: "dorm",
  },
  {
    _id: 1,
    name: "11 корпус",
    address: "ул. Гидротехников, 20",
    type: "stud",
  },
  {
    _id: 2,
    name: "Главный корпус",
    address: "ул. Политехническая, 29",
    type: "stud",
  },
];

export const RequestItem = ({ request }: { request: Request }) => {
  const [show, setShow] = useState(false);
  const textColor = useColorModeValue("white", "green.200");
  const bgColor = useColorModeValue("linear-gradient(to bottom, #34D399, #064E3B)", "#111111");

  // Получаем здания с сервера
  const { data: buildings, isError } = useQuery<Building[]>({
    queryKey: ["buildings"],
    queryFn: async () => {
      try {
        const res = await fetch(`${BASE_URL}/buildings`);
        if (!res.ok) throw new Error("Ошибка загрузки зданий");
        return await res.json();
      } catch (error) {
        console.error("Ошибка загрузки зданий:", error);
        throw error;
      }
    },
    retry: 1, // Попробовать загрузить 1 раз, затем использовать mock
  });

  // Если запрос не удался, используем mockBuildings
  const buildingsList = isError ? mockBuildings : buildings || [];

  // Находим нужное здание по `building_id`
  const building = buildingsList.find((b) => b._id === request.building_id);

  return (
    <Card.Root
      justifyContent="center"
      flexDirection="column"
      overflow="hidden"
      width="400px"
      maxW="sm"
      m="auto"
      mt="30px"
      bg={bgColor}
      p={4} // Добавил общий padding
    >
      <Box>
        <Card.Body>
          <Card.Title mb="2">Заявка №{request._id}</Card.Title>
          <Card.Description>
            <Text color={textColor}>
              {building ? `${building.name}, ${building.address}` : "Неизвестное здание"}
              <br />
              {request.description}
            </Text>
          </Card.Description>
        </Card.Body>
        <Card.Footer>
          <Button>Взять заявку</Button>
          <Button onClick={() => setShow(!show)}>{show ? "Скрыть" : "Подробнее"}</Button>
        </Card.Footer>
      </Box>
      {show && (
        <Image
          objectFit="cover"
          maxW="200px"
          src={request.img}
          alt="broken toilet"
          mt={2} // Отступ сверху, чтобы картинка не сливалась с кнопками
          ml={4} // Отступ слева, равный отступу текста в карточке
        />
      )}
    </Card.Root>
  );
};

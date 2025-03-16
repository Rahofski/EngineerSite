import { Box, Button, Card, Image, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const textColor = useColorModeValue("white", "green.200");
  const numberColor = useColorModeValue("white", "white");

  const bgColor = useColorModeValue(
    "linear-gradient(to bottom, #34D399, #064E3B)",
    "#111111"
  );
  const buttonBgColor = "green.500";
  const buttonTextColor = "white";

  // Получаем здания с сервера
  const { data: buildings, isError } = useQuery<Building[]>({
    queryKey: ["buildings"],
    queryFn: async () => {
      try {
        const res = await fetch(BASE_URL + "/buildings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        return data || [];
      } catch (error: any) {
        console.error("Error fetching buildings:", error);
        throw error;
      }
    },
  });

  // Используем mockBuildings в случае ошибки
  const buildingsList = isError ? mockBuildings : buildings || [];
  const building = buildingsList.find((b) => b._id === request.building_id);

  // Мутация для обновления статуса заявки
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const res = await fetch(`${BASE_URL}/requests/${request._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Ошибка обновления статуса");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] }); // Обновляем список заявок
    },
  });

  // Функция для изменения статуса
  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync(newStatus);
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
    }
  };

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
      p={4}
    >
      <Box>
        <Card.Body>
          <Card.Title mb="2" color={numberColor}>
            Заявка №{request._id}
          </Card.Title>
          <Card.Description>
            <Text color={textColor}>
              {building ? `${building.name}, ${building.address}` : "Неизвестное здание"}
              <br />
              {request.description}
            </Text>
          </Card.Description>
        </Card.Body>
        <Card.Footer>
          {request.status === "not taken" && (
            <Button
              bg={buttonBgColor}
              color={buttonTextColor}
              onClick={() => handleUpdateStatus("in progress")}
            >
              Взять заявку
            </Button>
          )}

          {request.status === "in progress" && (
            <>
              <Button
                bg="blue.500"
                color={buttonTextColor}
                onClick={() => handleUpdateStatus("done")}
              >
                Завершить заявку
              </Button>
              <Button
                bg="red.500"
                color={buttonTextColor}
                onClick={() => handleUpdateStatus("not taken")}
              >
                Отказаться
              </Button>
            </>
          )}
        </Card.Footer>
      </Box>
      {show && (
        <Image
          objectFit="cover"
          maxW="200px"
          src={request.img}
          alt="broken toilet"
          mt={2}
          ml={4}
        />
      )}
      <Button bg={buttonBgColor} color={buttonTextColor} onClick={() => setShow(!show)}>
        {show ? "Скрыть" : "Подробнее"}
      </Button>
    </Card.Root>
  );
};

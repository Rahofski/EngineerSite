import { Box, Button, Flex, Image, Text, Badge, Card, Heading, Stack } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Request } from "./RequestList";
import { BASE_URL } from "../App";

export type Building = {
  _id: number;
  name: string;
  address: string;
  type: string;
};

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

export const RequestItem = ({ 
  request,
  primaryColor,
  secondaryColor,
  accentColor
}: { 
  request: Request;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}) => {
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();

  // Цвета статусов в стиле СПбПУ
  const statusColors = {
    "not taken": secondaryColor, // Красный
    "in progress": primaryColor, // Синий
    "done": accentColor // Желтый
  };

  const statusText = {
    "not taken": "Свободна",
    "in progress": "В работе",
    "done": "Выполнена"
  };

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const timeColor = useColorModeValue("gray.500", "gray.400");

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

  const buildingsList = isError ? mockBuildings : buildings || [];
  const building = buildingsList.find((b) => b._id === request.building_id);

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
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  const deleteRequestMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${BASE_URL}/requests/${request._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Ошибка удаления заявки");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync(newStatus);
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
    }
  };

  const handleDeleteRequest = async () => {
    try {
      await deleteRequestMutation.mutateAsync();
    } catch (error) {
      console.error("Ошибка при удалении заявки:", error);
    }
  };

  return (
    <Card.Root 
      bg={cardBg} 
      border="1px" 
      borderColor={borderColor}
      overflow="hidden"
      borderRadius="lg"
      boxShadow="sm"
      _hover={{ 
        boxShadow: "md", 
        transform: "translateY(-2px)", 
        transition: "all 0.2s",
        borderColor: primaryColor
      }}
    >
      <Card.Body>
        <Stack gap={3}>
          <Flex justify="space-between" align="center">
            <Heading size="md" color={primaryColor}>
              Заявка #{request._id}
            </Heading>
            <Badge 
              bg={statusColors[request.status]} 
              color="white" 
              px={2} 
              py={1} 
              borderRadius="full"
            >
              {statusText[request.status]}
            </Badge>
          </Flex>

          <Box>
            <Text fontWeight="bold" color={textColor}>
              <Box as="span" color={primaryColor}>Здание:</Box>
            </Text>
            <Text color={textColor}>
              {building ? `${building.name}, ${building.address}` : "Неизвестное здание"}
            </Text>
          </Box>

          <Box>
            <Text fontWeight="bold" color={textColor}>
              <Box as="span" color={primaryColor}>Описание:</Box>
            </Text>
            <Text color={textColor}>{request.description}</Text>
          </Box>

          <Text fontSize="sm" color={timeColor}>
            Создано: {request.time}
          </Text>

          {show && (
            <Box mt={2}>
              <Image 
                src={request.img} 
                alt="Фото проблемы" 
                borderRadius="md"
                maxH="200px"
                objectFit="cover"
              />
            </Box>
          )}
        </Stack>
      </Card.Body>

      <Card.Footer>
        <Stack width="full" gap={3}>
          <Button 
            colorScheme="blue" 
            variant={show ? "outline" : "solid"}
            onClick={() => setShow(!show)}
            size="sm"
            color={primaryColor}
            borderColor={primaryColor}
          >
            {show ? "Скрыть фото" : "Показать фото"}
          </Button>

          <Flex wrap="wrap" gap={2}>
            {request.status === "not taken" && (
              <>
                <Button 
                  bg={primaryColor}
                  color="white"
                  _hover={{ bg: "#0a3a6b" }}
                  size="sm" 
                  flex="1"
                  onClick={() => handleUpdateStatus("in progress")}
                >
                  Взять в работу
                </Button>
                <Button 
                  color={secondaryColor}
                  borderColor={secondaryColor}
                  variant="outline" 
                  size="sm" 
                  flex="1"
                  onClick={handleDeleteRequest}
                >
                  Удалить
                </Button>
              </>
            )}

            {request.status === "in progress" && (
              <>
                <Button 
                  bg={accentColor}
                  color="gray.800"
                  _hover={{ bg: "#e6c200" }}
                  size="sm" 
                  flex="1"
                  onClick={() => handleUpdateStatus("done")}
                >
                  Завершить
                </Button>
                <Button 
                  color={primaryColor}
                  borderColor={primaryColor}
                  variant="outline" 
                  size="sm" 
                  flex="1"
                  onClick={() => handleUpdateStatus("not taken")}
                >
                  Вернуть
                </Button>
              </>
            )}

            {request.status === "done" && (
              <Button 
                color={secondaryColor}
                borderColor={secondaryColor}
                variant="outline" 
                size="sm" 
                width="full"
                onClick={handleDeleteRequest}
              >
                Удалить
              </Button>
            )}
          </Flex>
        </Stack>
      </Card.Footer>
    </Card.Root>
  );
};
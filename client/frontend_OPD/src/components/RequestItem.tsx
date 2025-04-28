import { Box, Button, Flex, Image, Text, Badge, Card, Heading, Stack } from "@chakra-ui/react";
import { cardBg, textColor, timeColor, borderColor, darkPurple, darkGreen } from "./constants/colors";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Request } from "./RequestList";
import { BASE_URL } from "../App";
import { mockBuildings } from "./mockData";
import { Building } from "./RequestList";

export const RequestItem = (
  { 
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
    const token = localStorage.getItem("token"); // Получаем токен из localStorage
  
  const [show, setShow] = useState(false);
  const queryClient = useQueryClient();

  // Цвета статусов в стиле СПбПУ
  const statusColors = {
    "not taken": secondaryColor,
    "in progress": accentColor,
    "done": primaryColor
  };

  const statusText = {
    "not taken": "Свободна",
    "in progress": "В работе",
    "done": "Выполнена"
  };

  const { data: buildings, isError } = useQuery<Building[]>({
    queryKey: ["buildings"],
    queryFn: async () => {
      try {
        if (!token) {
          throw new Error("No token provided"); // Проверяем наличие токена
      }
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
  const building = buildingsList.find((b) => b.building_id === request.building_id);

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      const res = await fetch(`${BASE_URL}/request/${request.request_id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json()

      if (!res.ok) {
        console.log(data)
        throw new Error("Ошибка обновления статуса");
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
              Заявка #{request.request_id}
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
              {building ? `${building.building_name}, ${building.address}` : "Неизвестное здание"}
            </Text>
          </Box>

          <Box>
            <Text fontWeight="bold" color={textColor}>
              <Box as="span" color={primaryColor}>Описание:</Box>
            </Text>
            <Text color={textColor}>{request.additional_text}</Text>
          </Box>

          <Text fontSize="sm" color={timeColor}>
            Создано: {request.time}
          </Text>

          {show && (
            <Box mt={2}>
              <Image 
                src={request.photos} 
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
            color={"white"}
            borderColor={primaryColor}
            backgroundColor={darkGreen}
            _hover={{ bg:  "white", color: primaryColor}}
          >
            {show ? "Скрыть фото" : "Показать фото"}
          </Button>

          <Flex wrap="wrap" gap={2}>
            {request.status === "not taken" && (
              <>
                <Button 
                  bg={primaryColor}
                  color="white"
                  _hover={{ bg:  darkPurple}}
                  size="sm" 
                  flex="1"
                  onClick={() => handleUpdateStatus("in progress")}
                >
                  Взять в работу
                </Button>
                
              </>
            )}

            {request.status === "in progress" && (
              <>
                <Button 
                  bg={accentColor}
                  color="white"
                  _hover={{ bg: darkPurple }}
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

            
          </Flex>
        </Stack>
      </Card.Footer>
    </Card.Root>
  );
};
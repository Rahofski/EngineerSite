import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import { Text, Stack, Box, Heading, Button, Flex } from "@chakra-ui/react";
import { RequestItem } from "./RequestItem";
import { AdminPanel } from "./AdminPanel"; // Панель управления инженерами

export type Request = {
  _id: number;
  building_id: number;
  field_id: number;
  user_id: number;
  description: string;
  img: string;
  status: "in progress" | "not taken" | "done";
  time: string;
};

// Тестовые заявки
const mockRequests: Request[] = [
  {
    _id: 1,
    building_id: 1,
    field_id: 1,
    user_id: 0,
    description: "Протечка трубы в подвале",
    img: "https://static19.tgcnt.ru/posts/_0/f7/f71018d04759977b551e565434c3276e.jpg",
    status: "in progress",
    time: "12:30 01.03.2025",
  },
  {
    _id: 2,
    building_id: 2,
    field_id: 2,
    user_id: 1,
    description: "Не работает освещение в подъезде",
    img: "https://i.pinimg.com/736x/b2/0b/3a/b20b3adce236bcf18185dae624357524.jpg",
    status: "in progress",
    time: "15:00 02.03.2025",
  },
  {
    _id: 3,
    building_id: 2,
    field_id: 6,
    user_id: 0,
    description: "Сломан лифт",
    img: "https://avatars.mds.yandex.net/get-altay/3522550/2a00000174ef9bbb46794d1f51e8086ccae6/XXL_height",
    status: "not taken",
    time: "15:00 02.03.2025",
  },
];

import { RequestStats } from "./RequestStats";
import { Header } from "./Header";
import { RequestGrid } from "./RequestGrid";

export const AdminPage = () => {
    const [showRequests, setShowRequests] = useState(false);
  
    const { data: requests, isLoading, error } = useQuery<Request[]>({
      queryKey: ["requests"],
      queryFn: async () => {
        try {
          const res = await fetch(BASE_URL + "/requests", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Something went wrong");
          }
          return data || [];
        } catch (error: any) {
          console.error("Error fetching requests:", error);
          throw error;
        }
      },
      enabled: showRequests, // 🔥 Данные загружаются ТОЛЬКО если showRequests === true
    });
  
    if (error) {
      console.error("Error fetching requests:", error);
    }

  const allRequests = requests || mockRequests;

  
    return (
      <>
      <Header/>
      <Flex p={6} gap={10}>
        {/* Левая часть: Диаграммы и заявки */}
        <Box flex="2">
          <Heading as="h1" size="xl" mb={4}>
            🛠️ Страница администратора
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={6}>
            Здесь отображаются все заявки в системе.
          </Text>
  
          {/* Диаграммы */}
          <Flex>
            <RequestStats requests={allRequests} />

            <RequestGrid allRequests={allRequests} isLoading={isLoading}/>
          </Flex>
          {/* <Button onClick={() => setShowRequests(!showRequests)} mt={6} mb={6}>
            {showRequests ? "Скрыть заявки" : "Показать заявки"}
          </Button>
  
          {showRequests && isLoading && (
            <Box textAlign="center" my={4}>
              <Text fontSize="xl">Загрузка...</Text>
            </Box>
          )}
          {showRequests && !isLoading && (
            <Stack gap={6}>
              {allRequests && allRequests.length > 0 ? (
                allRequests.map((request) => (
                  <RequestItem
                    key={request._id}
                    request={request}
                    primaryColor="blue"
                    secondaryColor="gray"
                    accentColor="red"
                  />
                ))
              ) : (
                <Text color="gray.500">Нет заявок</Text>
              )}
            </Stack>
          )} */}
        </Box>
        {/*<Box flex="1" bg="gray.100" p={6} borderRadius="md">
          <AdminPanel />
        </Box>*/}
      </Flex>
      </>
    );
  };

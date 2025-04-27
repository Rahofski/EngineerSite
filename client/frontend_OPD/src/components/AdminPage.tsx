import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import { Text, Box, Heading, Flex } from "@chakra-ui/react";
import { RequestStats } from "./RequestStats";
import { Header } from "./Header";
import { RequestGrid } from "./RequestGrid";
import { mockRequests } from "./mockData";
//import { RequestItem } from "./RequestItem";
//import { AdminPanel } from "./AdminPanel"; // Панель управления инженерами

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
          <Box pb={10}>
            <RequestStats requests={allRequests}/>
          </Box>
            <RequestGrid allRequests={allRequests} isLoading={isLoading}/>
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

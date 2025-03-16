import { useQuery } from "@tanstack/react-query";

import { BASE_URL } from "../App";
import {  Text, Stack, Box, Heading, Flex } from "@chakra-ui/react";
import { RequestItem } from "./RequestItem";


export type Building = {
    _id: number;
    name: string,
    address: string,
    type: string;
}

export type Request = {
    _id: number;
    building_id: number;
    field_id: number, 
    user_id: number,
    description: string;
    img: string;
    status: string;
    time: string;
}

// Тестовые заявки
const mockRequests: Request[] = [
  {
      _id: 1,
      building_id: 1,
      field_id: 1, 
      user_id:0,
      description: "Протечка трубы в подвале",
      img: "https://static19.tgcnt.ru/posts/_0/f7/f71018d04759977b551e565434c3276e.jpg",
      status: "in progress",
      time: "12:30 01.03.2025"
  },
  {
      _id: 2,
      building_id: 2,
        field_id: 2, 
      user_id: 1,
      description: "Не работает освещение в подъезде",
      img: "https://i.pinimg.com/736x/b2/0b/3a/b20b3adce236bcf18185dae624357524.jpg",
      status: "in progress",
      time: "15:00 02.03.2025"
  },
    {
      _id: 3,
      building_id: 2,
      field_id: 0, 
      user_id:0,
      description: "Сломан лифт",
      img: "https://avatars.mds.yandex.net/get-altay/3522550/2a00000174ef9bbb46794d1f51e8086ccae6/XXL_height",
      status: "not taken",
      time: "15:00 02.03.2025",
    }];

    export const RequestList = () => {
        const { data: requests, isLoading, error } = useQuery<Request[]>({
          queryKey: ["requests"],
          queryFn: async () => {
            try {
              const res = await fetch(BASE_URL + "/requests", {
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
              console.error("Error fetching requests:", error);
              throw error;
            }
          },
        });
      
        if (error) {
          console.error("Error fetching requests:", error);
        }
      
        // Фильтруем заявки по статусу
        const notTakenRequests = (requests || mockRequests).filter(
          (request) => request.status === "not taken"
        );
        const inProgressRequests = (requests || mockRequests).filter(
          (request) => request.status === "in progress"
        );
        const doneRequests = (requests || mockRequests).filter(
          (request) => request.status === "done"
        );
      
        return (
          <>
            {isLoading && (
              <Box textAlign="center" my={4}>
                <Text fontSize="xl">Загрузка...</Text>
              </Box>
            )}
      
            {!isLoading && (
              <Stack gap={6}>
                {/* Свободные заявки */}
                <Box>
                  <Flex justifyContent="center" mb={4}>
                    <Heading as="h2" size="lg" textAlign="center">
                      Свободные заявки
                    </Heading>
                  </Flex>
                  <Stack gap={3}>
                    {notTakenRequests.length > 0 ? (
                      notTakenRequests.map((request) => (
                        <RequestItem key={request._id} request={request} />
                      ))
                    ) : (
                      <Text color="gray.500" textAlign="center">
                        Нет свободных заявок
                      </Text>
                    )}
                  </Stack>
                </Box>
      
                {/* Заявки в работе */}
                <Box>
                  <Flex justifyContent="center" mb={4}>
                    <Heading as="h2" size="lg" textAlign="center">
                      Заявки в работе
                    </Heading>
                  </Flex>
                  <Stack gap={3}>
                    {inProgressRequests.length > 0 ? (
                      inProgressRequests.map((request) => (
                        <RequestItem key={request._id} request={request} />
                      ))
                    ) : (
                      <Text color="gray.500" textAlign="center">
                        Нет заявок в работе
                      </Text>
                    )}
                  </Stack>
                </Box>
      
                {/* Выполненные заявки */}
                <Box>
                  <Flex justifyContent="center" mb={4}>
                    <Heading as="h2" size="lg" textAlign="center">
                      Выполненные заявки
                    </Heading>
                  </Flex>
                  <Stack gap={3}>
                    {doneRequests.length > 0 ? (
                      doneRequests.map((request) => (
                        <RequestItem key={request._id} request={request} />
                      ))
                    ) : (
                      <Text color="gray.500" textAlign="center">
                        Нет выполненных заявок
                      </Text>
                    )}
                  </Stack>
                </Box>
              </Stack>
            )}
          </>
        );
      };
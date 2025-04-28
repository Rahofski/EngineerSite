import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import { Text, Box, Heading, Flex, useDisclosure, Button } from "@chakra-ui/react";
import { RequestStats } from "./RequestStats";
import { Header } from "./Header";
import { RequestGrid } from "./RequestGrid";
import { mockRequests } from "./mockData";
import {Request} from "./RequestList"
import { AdminPanel } from "./AdminPanel";
import { darkPurple } from "./constants/colors";
//import { RequestItem } from "./RequestItem";
//import { AdminPanel } from "./AdminPanel"; // Панель управления инженерами

export const AdminPage = () => {
    const [showRequests, setShowRequests] = useState(false);
    const { open: isPanelOpen, onOpen: openPanel, onClose: closePanel } = useDisclosure();
    const token = localStorage.getItem("token"); // Получаем токен из localStorage

    const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        closePanel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closePanel]);
    const { data: requests, isLoading, error } = useQuery<Request[]>({
      queryKey: ["requests"],
      queryFn: async () => {
        try {
          const res = await fetch(BASE_URL + "/requests", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
            },
          });
          const data = await res.json();
          if (!res.ok) {
            console.log(data)
            throw new Error(data.message || "Something went wrong");
          }
          return data.requests || [];
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

  const allRequests = requests || mockRequests; // Используем тестовые данные, если запрос не удался

  
    return (
      <>
      <Header/>
      <Flex p={6} gap={10}>
        {/* Левая часть: Диаграммы и заявки */}
        <Box flex="2">
          <Flex justifyContent={"space-between"} alignItems={"center"}>
            <Box>
              <Heading as="h1" size="xl" mb={4}>
                🛠️ Страница администратора
              </Heading>
              <Text fontSize="lg" color="gray.600" mb={6}>
                Здесь отображаются все заявки в системе.
              </Text>
            </Box>
            <Button 
                onClick={openPanel}
                colorScheme="blue"
                bgColor={darkPurple}
                mb={4}
              >
                Открыть панель управления
            </Button>
          </Flex>
          {/* Диаграммы */}
          <Box pb={10}>
            <RequestStats requests={allRequests}/>
          </Box>
          { isPanelOpen && (
              <Box
                position="fixed" // Изменено на fixed для overlay
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="blackAlpha.600" // Полупрозрачный оверлей
                zIndex="overlay"
                onClick={closePanel}
              >
                <Box 
                  ref={panelRef}
                  position="absolute"
                  top="39%"
                  left="87%"
                  transform="translate(-50%, -50%)"
                  bg="white"
                  p={6}
                  borderRadius="md"
                  boxShadow="xl"
                  width="400px"
                  onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике внутри
                >
                <AdminPanel onClose={closePanel} />
                </Box>
              </Box>
            )}
            <RequestGrid allRequests={allRequests} isLoading={isLoading}/>
        </Box>
      </Flex>
      </>
    );
  };


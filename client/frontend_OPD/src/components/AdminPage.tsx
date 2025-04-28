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

export const AdminPage = () => {
    const { open: isPanelOpen, onOpen: openPanel, onClose: closePanel } = useDisclosure();
    const token = localStorage.getItem("token");

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

    // 🔥 Убрал `enabled: showRequests` — запрос будет выполняться сразу
    const { data: requests, isLoading, error } = useQuery<Request[]>({
      queryKey: ["requests"],
      queryFn: async () => {
        try {
          const res = await fetch(BASE_URL + "/requests", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
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
    });
  
    if (error) {
      console.error("Error fetching requests:", error);
    }

  const allRequests = requests || [];//ockRequests;

    return (
      <>
        <Header/>
        <Flex p={6} gap={10}>
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
            <Box pb={10}>
              <RequestStats requests={allRequests}/>
            </Box>
            {isPanelOpen && (
              <Box
                position="fixed"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="blackAlpha.600"
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
                  onClick={(e) => e.stopPropagation()}
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
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import { Text, Stack, Box, Heading, Flex, SimpleGrid, Badge} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { RequestItem } from "./RequestItem";
import {Header} from "./Header"
export type Building = {
  _id: number;
  name: string;
  address: string;
  type: string;
};

export type Request = {
  _id: number;
  building_id: number;
  field_id: number;
  user_id: number;
  description: string;
  img: string;
  status: "not taken" | "in progress" | "done";
  time: string;
};

const mockRequests: Request[] = [
  {
    _id: 1,
    building_id: 1,
    field_id: 1,
    user_id: 0,
    description: "Протечка трубы в подвале",
    img: "https://static19.tgcnt.ru/posts/_0/f7/f71018d04759977b551e565434c3276e.jpg",
    status: "not taken",
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
    field_id: 6,
    user_id: 0,
    description: "Сломан лифт",
    img: "https://avatars.mds.yandex.net/get-altay/3522550/2a00000174ef9bbb46794d1f51e8086ccae6/XXL_height",
    status: "done",
    time: "15:00 02.03.2025",
  }
];

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

  const primaryColor = "#0D4C8B"; // Основной синий
  const secondaryColor = "#E31937"; // Красный
  const accentColor = "#FFD200"; // Желтый
  const lightBg = "#F5F5F5"; // Светлый фон
  const darkBg = "#1A365D"; // Темный фон для темной темы

  const bgColor = useColorModeValue(lightBg, darkBg);
  const cardBg = useColorModeValue("white", "gray.800");
  const headingColor = useColorModeValue(primaryColor, "white");

  
  //const borderColor = useColorModeValue("gray.200", "gray.600");

  if (error) {
    console.error("Error fetching requests:", error);
  }

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
    <Box p={4} bg={bgColor} minH="100vh">
      {isLoading && (
        <Box textAlign="center" my={4}>
          <Text fontSize="xl">Загрузка...</Text>
        </Box>
      )}

      {!isLoading && (
        <Stack gap={8}>
          <Header/>
          {/* Статистика по заявкам */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            <Box 
              bg={cardBg} 
              p={4} 
              borderRadius="lg" 
              borderTop="4px" 
              borderColor={secondaryColor}
              boxShadow="sm"
            >
              <Text fontSize="sm" color="gray.500">Свободные</Text>
              <Heading size="lg" color={primaryColor}>{notTakenRequests.length}</Heading>
            </Box>
            <Box 
              bg={cardBg} 
              p={4} 
              borderRadius="lg" 
              borderTop="4px" 
              borderColor={primaryColor}
              boxShadow="sm"
            >
              <Text fontSize="sm" color="gray.500">В работе</Text>
              <Heading size="lg" color={primaryColor}>{inProgressRequests.length}</Heading>
            </Box>
            <Box 
              bg={cardBg} 
              p={4} 
              borderRadius="lg" 
              borderTop="4px" 
              borderColor={accentColor}
              boxShadow="sm"
            >
              <Text fontSize="sm" color="gray.500">Выполнено</Text>
              <Heading size="lg" color={primaryColor}>{doneRequests.length}</Heading>
            </Box>
          </SimpleGrid>

          {/* Секции с заявками */}
          {[
            { 
              title: "Свободные заявки", 
              requests: notTakenRequests, 
              color: secondaryColor,
              emptyText: "Нет свободных заявок"
            },
            { 
              title: "Заявки в работе", 
              requests: inProgressRequests, 
              color: primaryColor,
              emptyText: "Нет заявок в работе" 
            },
            { 
              title: "Выполненные заявки", 
              requests: doneRequests, 
              color: accentColor,
              emptyText: "Нет выполненных заявок"
            }
          ].map((section) => (
            <Box key={section.title}>
              <Flex align="center" mb={4}>
                <Box 
                  w="4px" 
                  h="24px" 
                  bg={section.color} 
                  mr={3} 
                  borderRadius="full"
                />
                <Heading as="h2" size="md" color={headingColor}>
                  {section.title}
                </Heading>
                <Badge 
                  bg={section.color} 
                  color="white" 
                  ml={2} 
                  px={2} 
                  py={1} 
                  borderRadius="full"
                >
                  {section.requests.length}
                </Badge>
              </Flex>
              
              {section.requests.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
                  {section.requests.map((request) => (
                    <RequestItem 
                      key={request._id} 
                      request={request} 
                      primaryColor={primaryColor}
                      secondaryColor={secondaryColor}
                      accentColor={accentColor}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <Box 
                  bg={cardBg} 
                  p={6} 
                  borderRadius="lg" 
                  textAlign="center"
                  boxShadow="sm"
                >
                  <Text color="gray.500">{section.emptyText}</Text>
                </Box>
              )}
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};
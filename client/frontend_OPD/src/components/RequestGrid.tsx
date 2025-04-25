import { useState } from 'react';
import {
  Box,
  Text,
  Stack,
  SimpleGrid,
  Badge,
  Image,
  Flex,
  Center,
  Square,
  Button,
  useDisclosure,
  CloseButton,
  Heading
} from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { Request } from './RequestList';
import { BASE_URL } from '../App';
import { FIELD_NAMES } from './RequestStats';

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

export const RequestGrid = ({ allRequests, isLoading}: {
  allRequests: Request[];
  isLoading: boolean;
}) => {
  const { open, onOpen, onClose } = useDisclosure();
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const token = localStorage.getItem("token");

  // Получаем данные о зданиях
  const { data: buildings, isError } = useQuery<Building[]>({
    queryKey: ["buildings"],
    queryFn: async () => {
      try {
        if (!token) throw new Error("No token provided");
        const res = await fetch(BASE_URL + "/buildings", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Something went wrong");
        return data || [];
      } catch (error) {
        console.error("Error fetching buildings:", error);
        throw error;
      }
    },
  });

  const buildingsList = isError ? mockBuildings : buildings || [];

  const getStatusColor = (status: Request['status']) => {
    switch (status) {
      case 'in progress': return 'blue';
      case 'not taken': return 'red';
      case 'done': return 'green';
      default: return 'gray';
    }
  };

  const statusText = {
    "not taken": "Не взята",
    "in progress": "В работе",
    "done": "Выполнена"
  };

  const getFieldInitial = (fieldId: number) => {
    const fieldName = FIELD_NAMES[fieldId] || 'Другое';
    return fieldName.charAt(0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}.${month}`;
  };

  const openDetails = (request: Request) => {
    setSelectedRequest(request);
    onOpen();
  };

  return (
    <Box>
      {isLoading && (
        <Box textAlign="center" my={4}>
          <Text fontSize="xl">Загрузка...</Text>
        </Box>
      )}

      {!isLoading && (
        <SimpleGrid columns={[2, 3, 4, 5]} gap={4}>
          {allRequests && allRequests.length > 0 ? (
            allRequests.map((request) => (
              <Square
                key={request._id}
                size="80px"
                bg="white"
                borderRadius="md"
                boxShadow="md"
                borderWidth="1px"
                borderColor="gray.200"
                cursor="pointer"
                onClick={() => openDetails(request)}
                position="relative"
                overflow="hidden"
              >
                <Center flexDirection="column">
                  <Text fontSize="xl" fontWeight="bold">
                    {getFieldInitial(request.field_id)}
                  </Text>
                  <Text fontSize="sm" color="gray.500" mb={5}>
                    {formatDate(request.time)}
                  </Text>
                </Center>
                <Badge
                  position="absolute"
                  bottom="0"
                  right="0"
                  colorScheme={getStatusColor(request.status)}
                  fontSize="xs"
                  borderRadius="md"
                >
                  {statusText[request.status]}
                </Badge>
              </Square>
            ))
          ) : (
            <Text color="gray.500">Нет заявок</Text>
          )}
        </SimpleGrid>
      )}

      {open && selectedRequest && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="blackAlpha.600"
          zIndex="modal"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={onClose}
        >
          <Box
            bg="white"
            borderRadius="md"
            p={6}
            maxW="500px"
            w="90%"
            maxH="90vh"
            overflowY="auto"
            onClick={(e) => e.stopPropagation()}
            boxShadow="xl"
          >
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md" color="blue.600">
                Заявка #{selectedRequest._id}
              </Heading>
              <CloseButton onClick={onClose} />
            </Flex>

            <Stack gap={4}>
              {/* Строка с информацией о здании */}
              <Flex>
                <Text fontWeight="bold" minWidth="120px">Здание:</Text>
                <Text>
                  {buildingsList.find(b => b._id === selectedRequest.building_id)?.name || "Неизвестное здание"}
                  {buildingsList.find(b => b._id === selectedRequest.building_id)?.address && 
                    `, ${buildingsList.find(b => b._id === selectedRequest.building_id)?.address}`}
                </Text>
              </Flex>

              <Flex>
                <Text fontWeight="bold" minWidth="120px">Категория:</Text>
                <Text>{FIELD_NAMES[selectedRequest.field_id] || 'Другое'}</Text>
              </Flex>

              <Flex>
                <Text fontWeight="bold" minWidth="120px">Статус:</Text>
                <Badge colorScheme={getStatusColor(selectedRequest.status)}>
                  {statusText[selectedRequest.status]}
                </Badge>
              </Flex>

              <Flex>
                <Text fontWeight="bold" minWidth="120px">Дата:</Text>
                <Text>{new Date(selectedRequest.time).toLocaleString()}</Text>
              </Flex>

              <Flex direction="column">
                <Text fontWeight="bold">Описание:</Text>
                <Text whiteSpace="pre-wrap">{selectedRequest.description}</Text>
              </Flex>

              {selectedRequest.img && (
                <Flex direction="column">
                  <Text fontWeight="bold">Фото:</Text>
                  <Image 
                    src={selectedRequest.img} 
                    alt="Прикрепленное фото" 
                    maxH="200px"
                    borderRadius="md"
                  />
                </Flex>
              )}
            </Stack>

            <Flex justify="flex-end" mt={6}>
              <Button colorScheme="blue" onClick={onClose}>
                Закрыть
              </Button>
            </Flex>
          </Box>
        </Box>
      )}
    </Box>
  );
};
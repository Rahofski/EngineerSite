import { useState } from 'react';
import {
  Box,
  Text,
  Stack,
  Badge,
  Image,
  Flex,
  Button,
  useDisclosure,
  CloseButton,
  Heading,
  Input,
  HStack,
  VStack,
  Icon
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { useQuery } from '@tanstack/react-query';
import { Request } from './RequestList';
import { BASE_URL } from '../App';
import { FIELD_NAMES } from './RequestStats';
import { secondaryColor, primaryColor, accentColor, darkGreen, darkPurple } from './constants/colors';
import { mockBuildings } from './mockData';

export type Building = {
  _id: number;
  name: string;
  address: string;
  type: string;
};


const statusText = {
  "not taken": "Не взята",
  "in progress": "В работе",
  "done": "Выполнена"
};

export const RequestGrid = ({ allRequests, isLoading}: {
  allRequests: Request[];
  isLoading: boolean;
}) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isFieldOpen, setIsFieldOpen] = useState(false);
  const { open, onOpen, onClose } = useDisclosure();
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const token = localStorage.getItem("token");

  // Состояния для фильтров
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [fieldFilter, setFieldFilter] = useState<number | null>(null);
  const [dateFilter, setDateFilter] = useState<string>('');

  const DropdownFilter = ({ 
    label, 
    isOpen, 
    onToggle, 
    options, 
    selectedValue,
    onSelect,
    renderOption
  }: {
    label: string;
    isOpen: boolean;
    onToggle: () => void;
    options: any[];
    selectedValue: any;
    onSelect: (value: any) => void;
    renderOption: (option: any) => React.ReactNode;
  }) => (
    <Box position="relative" minW="200px">
      <Button
        onClick={onToggle}
        w="100%"
        justifyContent="space-between"
        bgColor={darkPurple}
      >
        {label}: {selectedValue === null ? 'Все' : renderOption(selectedValue)}
        <Icon as={isOpen ? ChevronUpIcon : ChevronDownIcon} ml={2} />
      </Button>
      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="white"
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          boxShadow="md"
          zIndex={1}
          mt={1}
        >
          <Stack maxH="200px" overflowY="auto">
            <Button
              bgColor={selectedValue === null ? darkPurple : 'ghost'}
              variant={selectedValue === null ? 'solid' : 'ghost'}
              colorScheme={selectedValue === null ? 'blue' : 'gray'}
              onClick={() => {
                onSelect(null);
                onToggle();
              }}
              justifyContent="flex-start"
              borderRadius={0}
            >
              Все
            </Button>
            {options.map((option) => (
              <Button
                key={option}
                bgColor={selectedValue === option ? darkPurple : 'ghost'}
                variant={selectedValue === option ? 'solid' : 'ghost'}
                colorScheme={selectedValue === option ? 'blue' : 'gray'}
                onClick={() => {
                  onSelect(option);
                  onToggle();
                }}
                justifyContent="flex-start"
                borderRadius={0}
              >
                {renderOption(option)}
              </Button>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );

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
      case "in progress": return accentColor;
      case "not taken": return secondaryColor;
      case "done": return primaryColor;
      default: return 'gray';
    }
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

  // Функция фильтрации заявок
  const filteredRequests = allRequests?.filter(request => {
    // Фильтр по статусу
    if (statusFilter !== null && request.status !== statusFilter) {
      return false;
    }
    
    // Фильтр по сфере
    if (fieldFilter !== null && request.field_id !== fieldFilter) {
      return false;
    }
    
    // Фильтр по дате
    if (dateFilter) {
      const requestDate = new Date(request.time).toLocaleDateString();
      const filterDate = new Date(dateFilter).toLocaleDateString();
      if (requestDate !== filterDate) {
        return false;
      }
    }
    
    return true;
  });

  // Уникальные сферы для фильтрации
  const uniqueFields = Array.from(new Set(
    allRequests?.map(request => request.field_id) || []
  )).sort();

  return (
    <>
    <Box
      bg="white"
      borderRadius="md"
      borderWidth="1px"
      borderColor="gray.200"
      p={4}
      mb={5}
    >
      <VStack align="stretch" gap={4}>
        <Heading size="md" color={secondaryColor}>
          Фильтры
        </Heading>
        
        <Flex gap={4} wrap="wrap" alignItems={"center"}>

          {/* Фильтр по сфере */}
          <DropdownFilter
            label="Сфера"
            isOpen={isFieldOpen}
            onToggle={() => setIsFieldOpen(!isFieldOpen)}
            options={uniqueFields}
            selectedValue={fieldFilter}
            onSelect={setFieldFilter}
            renderOption={(fieldId) => FIELD_NAMES[fieldId] || 'Другое'}
          />

          {/* Фильтр по статусу */}
          <DropdownFilter
            label="Статус"
            isOpen={isStatusOpen}
            onToggle={() => setIsStatusOpen(!isStatusOpen)}
            options={Object.keys(statusText)}
            selectedValue={statusFilter}
            onSelect={setStatusFilter}
            renderOption={(status) => statusText[status as keyof typeof statusText]}
          />
          
          {/* Фильтр по дате */}
          <Box>
            <HStack>
              
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                maxWidth="200px"
              />
              {dateFilter && (
                <Button
                  onClick={() => setDateFilter('')}
                  size="sm"
                  variant="ghost"
                >
                  Очистить
                </Button>
              )}
            </HStack>
          </Box>
          
          {/* Кнопка сброса фильтров */}
          <Box alignSelf="flex-end">
            <Button
            bgColor={secondaryColor}
            color={"white"}
              onClick={() => {
                setStatusFilter(null);
                setFieldFilter(null);
                setDateFilter('');
              }}
              variant="outline"
            >
              Сбросить все фильтры
            </Button>
          </Box>
        </Flex>
      </VStack>
    </Box>

      <Box
        bg="white"
        borderRadius="md"
        borderWidth="1px"
        borderColor="gray.200"
        position="relative"
        overflow="hidden"
        mb={5}
      >
        <Flex alignItems={"center"} padding={"5px 50px"} gap={120}>
          <Text mr={5}>Номер</Text>
          <Text fontSize="l" width={"200px"} mr={7}>
            Сфера
          </Text>
          <Text width={"100px"} mr={7}>
            Статус
          </Text>
          <Text mr={9}>Дата</Text>
          <Text>Адрес</Text>
        </Flex>
      </Box>

      {isLoading && (
        <Box textAlign="center" my={4}>
          <Text fontSize="xl">Загрузка...</Text>
        </Box>
      )}

      {!isLoading && (
        <Stack gap={2} >
          {filteredRequests && filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <Box
                key={request._id}
                bg="white"
                borderRadius="md"
                boxShadow="md"
                borderWidth="1px"
                borderColor="gray.200"
                cursor="pointer"
                onClick={() => openDetails(request)}
                position="relative"
                overflow="hidden"
                _hover={{ 
                  boxShadow: "xl", 
                  transform: "translateY(-2px)", 
                  transition: "all 0.2s",
                  borderColor: primaryColor
                }}
              >
                <Flex alignItems={"center"} padding={"5px 50px"} gap={150}>
                  <Text w={10}>#{request._id}</Text>
                  <Text fontSize="l" fontWeight="bold" width={"200px"}>
                    {FIELD_NAMES[request.field_id]}
                  </Text>
                  <Text width={"100px"}>
                    {statusText[request.status]}
                  </Text>
                  <Text w={10}>{formatDate(request.time)}</Text>
                  <Text>
                    {buildingsList.find(b => b._id === request.building_id)?.name || "Неизвестное здание"}
                    {buildingsList.find(b => b._id === request.building_id)?.address && 
                      `, ${buildingsList.find(b => b._id === request.building_id)?.address}`}
                  </Text>
                </Flex>
              </Box>
            ))
          ) : (
            <Text color="gray.500">Нет заявок, соответствующих фильтрам</Text>
          )}
        </Stack>
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
              <Heading size="md" color={secondaryColor}>
                Заявка #{selectedRequest._id}
              </Heading>
            </Flex>

            <Stack gap={4}>
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
                <Badge bg={getStatusColor(selectedRequest.status)} color={"white"}>
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
      </>
  );
};
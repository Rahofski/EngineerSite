import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../App";
import { Text, Stack, Box, Heading, Button, Flex, Input } from "@chakra-ui/react";
import { RequestItem } from "./RequestItem";
import { AdminPanel } from "./AdminPanel"; // Панель управления инженерами
import {Header} from "./Header"
import { FIELD_NAMES } from "./RequestStats";
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
    time: "15:30 02.03.2025",
  },
];

import { RequestStats } from "./RequestStats";

export const AdminPage = () => {
    const [showRequests, setShowRequests] = useState(false);
    const [fieldFilter, setFieldFilter] = useState<number | string>("all");
    const [statusFilter, setStatusFilter] = useState<string | "all">("all");
    const [isFieldListOpen, setIsFieldListOpen] = useState(false);
    const [isStatusListOpen, setIsStatusListOpen] = useState(false);
    const [searchField, setSearchField] = useState("");
    const [searchStatus, setSearchStatus] = useState("");

    const fieldWrapperRef = useRef<HTMLDivElement>(null);
    const statusWrapperRef = useRef<HTMLDivElement>(null);
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
  const primaryColor = "#0D4C8B"; // Основной синий
  const secondaryColor = "#E31937"; // Красный
  const accentColor = "#FFD200"; // Желтый
  const filteredRequests = allRequests.filter(request => {
    const matchesField = fieldFilter === "all" || request.field_id === fieldFilter;
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesField && matchesStatus;
  });
  const fieldOptions = [
    { value: "all", label: "Все специальности" },
    ...Object.entries(FIELD_NAMES)
      .filter(([key]) => key !== "0") // Исключаем "Все" из фильтров
      .map(([value, label]) => ({ 
        value: Number(value), 
        label 
      }))
      .sort((a, b) => a.value - b.value) // Сортируем по значению
  ];

  const statusOptions = [
    { value: "all", label: "Все заявки" },
    { value: "not taken", label: "Свободные" },
    { value: "in progress", label: "В процессе" },
    { value: "done", label: "Выполненные" },
  ];

  const filteredFieldOptions = fieldOptions.filter(option => 
    option.label.toLowerCase().includes(searchField.toLowerCase())
  );

  const filteredStatusOptions = statusOptions.filter(option => 
    option.label.toLowerCase().includes(searchStatus.toLowerCase())
  );

  // Закрытие списков при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fieldWrapperRef.current && !fieldWrapperRef.current.contains(event.target as Node)) {
        setIsFieldListOpen(false);
      }
      if (statusWrapperRef.current && !statusWrapperRef.current.contains(event.target as Node)) {
        setIsStatusListOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
    return (
      <>
      <Header/>
      <Flex p={6} gap={10}>
        {/* Левая часть: Диаграммы и заявки */}
        <Box flex="4">
          <Heading as="h1" size="xl" mb={4}>
            🛠️ Страница администратора
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={6}>
            Здесь отображаются все заявки в системе.
          </Text>
  
          {/* Диаграммы */}
          <RequestStats requests={allRequests} />
          
          {/* Кнопка для показа / скрытия заявок */}
          <Button onClick={() => setShowRequests(!showRequests)} mt={20} mb={6}>
            {showRequests ? "Скрыть заявки" : "Показать заявки"}
          </Button>
  
          {/* 🔥 Теперь "Загрузка..." появляется только если showRequests === true */}
          {showRequests && isLoading && (
            <Box textAlign="center" my={4}>
              <Text fontSize="xl">Загрузка...</Text>
            </Box>
          )}
  
          {/* Показываем заявки только если showRequests === true */}
          {showRequests && !isLoading && (
            <>
            <Flex gap={4} mt={6} mb={4}>
            {/* Фильтр по специальности */}
            <Box position="relative" width="250px" ref={fieldWrapperRef}>
              <Input
                value={fieldFilter === "all" ? "Все специальности" : FIELD_NAMES[fieldFilter as number]}
                onFocus={() => setIsFieldListOpen(true)}
                onChange={(e) => setSearchField(e.target.value)}
                placeholder="Выберите специальность"
                readOnly={!isFieldListOpen}
              />
              {isFieldListOpen && (
                <Box
                  as="ul"
                  position="absolute"
                  zIndex="dropdown"
                  width="100%"
                  bg="white"
                  boxShadow="md"
                  maxH="200px"
                  overflowY="auto"
                  mt={1}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                  listStyleType="none"
                >{filteredFieldOptions.map((option) => (
                  <Box
                    as="li"
                    key={option.value}
                    p={2}
                    _hover={{ bg: "gray.100" }}
                    cursor="pointer"
                    onClick={() => {
                      setFieldFilter(option.value);
                      setIsFieldListOpen(false);
                      setSearchField("");
                    }}
                  >
                    {option.label}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          {/* Фильтр по статусу */}
          <Box position="relative" width="250px" ref={statusWrapperRef}>
              <Input
                value={statusFilter === "all" ? "Все статусы" : 
                  statusOptions.find(o => o.value === statusFilter)?.label || ""}
                onFocus={() => setIsStatusListOpen(true)}
                onChange={(e) => setSearchStatus(e.target.value)}
                placeholder="Выберите статус"
                readOnly={!isStatusListOpen}
              />
              {isStatusListOpen && (
                <Box
                  as="ul"
                  position="absolute"
                  zIndex="dropdown"
                  width="100%"
                  bg="white"
                  boxShadow="md"
                  maxH="200px"
                  overflowY="auto"
                  mt={1}
                  borderRadius="md"
                  border="1px solid"
                  borderColor="gray.200"
                  listStyleType="none"
                >
                  {filteredStatusOptions.map((option) => (
                    <Box
                      as="li"
                      key={option.value}
                      p={2}
                      _hover={{ bg: "gray.100" }}
                      cursor="pointer"
                      onClick={() => {
                        setStatusFilter(option.value);
                        setIsStatusListOpen(false);
                        setSearchStatus("");
                      }}
                    >
                      {option.label}
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Flex>
            <Stack gap={6}>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <RequestItem 
                    key={request._id} 
                    request={request} 
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    accentColor={accentColor}
                  />
                ))
              ) : (
                <Text color="gray.500">Нет заявок, соответствующих фильтрам</Text>
              )}
            </Stack>
            </>
          )}
        </Box>
  
        {/* Правая часть: Панель управления инженерами */}
        <Box flex="1" bg="gray.100" p={6} borderRadius="md" h="600px">
          <AdminPanel />
        </Box>
      </Flex>
      </>
    );
  };

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Box, Heading, Flex, Input} from "@chakra-ui/react";
import { Request } from "./AdminPage";
import { useState, useRef, useEffect } from "react";

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#A020F0", "#DC143C"];

export const FIELD_NAMES: Record<number, string> = {
  0: "Все",
  1: "Водоснабжение",
  2: "Электроснабжение",
  3: "Газоснабжение",
  5: "Техника",
  6: "Другое",
  7: "Плотничество",
};
  
const STATUS_NAMES: Record<string, string> = {
    "in progress": "Заявки в процессе",
    "not taken": "Свободные заявки",
    "done": "Выполненные заявки",
};

const processDataByField = (requests: Request[]) => {
    const counts: Record<number, number> = {};
  
    requests.forEach((request) => {
      counts[request.field_id] = (counts[request.field_id] || 0) + 1;
    });
  
    return Object.keys(counts).map((key, index) => ({
      name: FIELD_NAMES[Number(key)] || `Сфера ${key}`,
      value: counts[Number(key)],
      color: COLORS[index % COLORS.length],
    }));
};

const processDataByStatus = (requests: Request[]) => {
  const counts: Record<string, number> = {};

  requests.forEach((request) => {
    counts[request.status] = (counts[request.status] || 0) + 1;
  });

  return Object.keys(counts).map((key, index) => ({
    name: STATUS_NAMES[key],
    value: counts[key],
    color: COLORS[index % COLORS.length],
  }));
};

export const RequestStats = ({ requests }: { requests: Request[] }) => {
  const fieldData = processDataByField(requests);
  const statusData = processDataByStatus(requests);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [isListOpen, setIsListOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  const categories = [0, 1, 2, 3, 5, 6, 7];


  // Закрытие списка при клике вне его области
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsListOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredRequests = selectedCategory === 0
    ? requests
    : requests.filter((req) => req.field_id === selectedCategory);

  const requestsByDate = filteredRequests.reduce<Record<string, number>>((acc, req) => {
    const date = new Date(req.time).toLocaleDateString("ru-RU");
    if (!acc[date]) acc[date] = 0;
    acc[date]++;
    return acc;
  }, {});

  const chartData = Object.entries(requestsByDate).map(([date, count]) => ({
    date,
    "Количество заявок": count,
  }));

  // Фильтрация категорий по поиску
  const filteredCategories = categories.filter(category => 
    FIELD_NAMES[category].toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Flex gap={6} justifyContent={"space-between"}>
      <Box>
        <Heading size="md" mb={15}>
          Заявки по сферам
        </Heading>
        <ResponsiveContainer width={300} height={300}>
          <PieChart>
            <Pie data={fieldData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {fieldData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      <Box mb={6} ref={wrapperRef}>
      <Heading size="md" mb={5}>Динамика заявок</Heading>
        <Flex justify="space-between" mb={4}>
          <Box position="relative" width="300px">
            <Input
              value={selectedCategory === 0 ? "Все" : FIELD_NAMES[selectedCategory]}
              onFocus={() => setIsListOpen(true)}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Выберите категорию"
              readOnly={!isListOpen}
            />
            {isListOpen && (
              <Box as="ul"
                position="absolute"
                zIndex="dropdown"
                width="100%"
                bg="white"
                maxH="200px"
                overflowY="auto"
                mt={1}  
              >
                {filteredCategories.map((category) => (
                  <Box as="li" 
                    key={category}
                    p={2}
                    _hover={{ bg: "gray.100" }}
                    cursor="pointer"
                    onClick={() => {
                      setSelectedCategory(category);
                      setIsListOpen(false);
                      setSearchValue("");
                    }}
                  >
                    { FIELD_NAMES[category]}
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Flex>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Количество заявок"
              stroke="#3182CE"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box>
        <Heading size="md" mb={15}>
          Заявки по статусу
        </Heading>
        <ResponsiveContainer width={300} height={300}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Flex>
  );
};
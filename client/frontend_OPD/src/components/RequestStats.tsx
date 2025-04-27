import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from "recharts";
import { 
  Box, Heading, Flex, Button, HStack, VStack, Text, 
  Input, useDisclosure, Icon
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Request } from "./RequestList";
import { useState, useRef, useEffect } from "react";
import { accentColor, darkGreen, darkPurple, primaryColor, secondaryColor } from "./constants/colors";

const COLORS = [
  "#723097", "#373062", "#3AA935", "#56965B", "#F39869", "#DB4928"
];

const STATUS_COLORS: Record<string, string> = {
  "in progress": accentColor,
  "done": primaryColor,
  "not taken": secondaryColor
};

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

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const processDataByField = (requests: Request[]) => {
  const today = new Date().toLocaleDateString("ru-RU");
  const filteredRequests = requests.filter(request => {
    const requestDate = new Date(request.time).toLocaleDateString("ru-RU");
    return requestDate === today && 
           (request.status === "not taken" || request.status === "in progress");
  });

  const counts: Record<number, number> = {};
  
  filteredRequests.forEach((request) => {
    counts[request.field_id] = (counts[request.field_id] || 0) + 1;
  });

  return Object.keys(counts).map((key, index) => ({
    name: FIELD_NAMES[Number(key)] || `Сфера ${key}`,
    value: counts[Number(key)],
    color: COLORS[index % COLORS.length],
  }));
};

const processDataByStatus = (requests: Request[]) => {
  const today = new Date().toLocaleDateString("ru-RU");
  const filteredRequests = requests.filter(request => {
    const requestDate = new Date(request.time).toLocaleDateString("ru-RU");
    return requestDate === today;
  });

  const counts: Record<string, number> = {};

  filteredRequests.forEach((request) => {
    counts[request.status] = (counts[request.status] || 0) + 1;
  });

  return Object.keys(counts).map((key) => ({
    name: STATUS_NAMES[key],
    value: counts[key],
    color: STATUS_COLORS[key],
  }));
};

export const RequestStats = ({ requests }: { requests: Request[] }) => {
  const fieldData = processDataByField(requests);
  const statusData = processDataByStatus(requests);
  
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [timePeriod, setTimePeriod] = useState<"day" | "week" | "month" | "year" | "custom">("week");
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(new Date().setDate(new Date().getDate() - 7)),
    end: new Date()
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  
  const { 
    open: isCategoryOpen, 
    onToggle: onToggleCategory, 
    onClose: onCloseCategory 
  } = useDisclosure();
  const categoryRef = useRef<HTMLDivElement>(null);

  // Закрытие выпадающих списков при клике вне области
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        onCloseCategory();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePeriodChange = (period: "day" | "week" | "month" | "year" | "custom") => {
    setTimePeriod(period);
    setShowCustomDatePicker(period === "custom");
    
    if (period !== "custom") {
      const now = new Date();
      let startDate = new Date();

      switch (period) {
        case "day": startDate = startOfDay(now); break;
        case "week": startDate = new Date(now.setDate(now.getDate() - 7)); break;
        case "month": startDate = new Date(now.setMonth(now.getMonth() - 1)); break;
        case "year": startDate = new Date(now.setFullYear(now.getFullYear() - 1)); break;
      }

      setDateRange({ start: startDate, end: new Date() });
    }
  };

  const handleApplyCustomDate = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      setDateRange({ start, end });
    }
  };

  const processBarChartData = () => {
    let filtered = selectedCategory === 0 
      ? requests 
      : requests.filter(req => req.field_id === selectedCategory);
  
    filtered = filtered.filter(req => {
      const reqDate = new Date(req.time);
      return reqDate >= dateRange.start && reqDate <= dateRange.end;
    });
  
    const groupedData: Record<string, { count: number; originalDate: Date }> = {};
  
    filtered.forEach(req => {
      const reqDate = new Date(req.time);
      let key = "";
  
      if (timePeriod === "year") {
        key = reqDate.toLocaleString("ru-RU", { month: "short" }); // Месяцы
      } else {
        key = reqDate.toLocaleDateString("ru-RU"); // Дни
      }
  
      if (!groupedData[key]) {
        groupedData[key] = { count: 0, originalDate: reqDate };
      }
      groupedData[key].count += 1;
    });
  
    const result: { date: string; count: number; originalDate: Date }[] = [];
  
    if (timePeriod === "year") {
      // Заполняем все месяцы
      const months = [
        "янв.", "февр.", "март", "апр.", "май", "июнь",
        "июль", "авг.", "сент.", "окт.", "нояб.", "дек."
      ];
      months.forEach((monthName, index) => {
        const existing = groupedData[monthName];
        result.push({
          date: monthName,
          count: existing ? existing.count : 0,
          originalDate: new Date(new Date().getFullYear(), index, 1)
        });
      });
    } else {
      // Заполняем все дни
      let currentDate = new Date(dateRange.start);
      while (currentDate <= dateRange.end) {
        const key = currentDate.toLocaleDateString("ru-RU");
        const existing = groupedData[key];
        result.push({
          date: key,
          count: existing ? existing.count : 0,
          originalDate: new Date(currentDate)
        });
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  
    return result.sort((a, b) => a.originalDate.getTime() - b.originalDate.getTime());
  };
  
  
  

  const barChartData = processBarChartData();

  return (
    <Flex gap={20} alignItems={"flex-start"}>
      <Box>
        <Heading size="md" mb={4}>Динамика заявок</Heading>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              contentStyle={{
                background: 'white',
                borderRadius: 'md',
                boxShadow: 'md'
              }}
              formatter={(value: number, name: string, props: any) => [
                value, 
                name,
                props.payload.originalDate?.toLocaleDateString("ru-RU")
              ]}
              labelFormatter={(label) => `Период: ${label}`}
            />
            <Bar 
              dataKey="count" 
              name="Количество заявок" 
              fill={primaryColor}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <Box>
        <VStack align="stretch" mb={4} gap={4}>
          <HStack gap={4}>
            <Box ref={categoryRef} position="relative">
              <Button 
                onClick={onToggleCategory}
                minW="200px"
                justifyContent="space-between"
                bgColor={darkPurple}
              >
                {`Сфера: `}
                {FIELD_NAMES[selectedCategory]}
                <Icon as={isCategoryOpen ? ChevronUpIcon : ChevronDownIcon} ml={2} />
              </Button>
              {isCategoryOpen && (
                <Box
                  position="absolute"
                  top="100%"
                  left={0}
                  zIndex={1}
                  mt={1}
                  bg="white"
                  boxShadow="md"
                  borderRadius="md"
                  border="1px"
                  borderColor="gray.200"
                  minW="200px"
                >
                  <VStack align="stretch">
                    {Object.entries(FIELD_NAMES).map(([id, name]) => (
                      <Button
                        key={id}
                        variant="ghost"
                        justifyContent="flex-start"
                        borderRadius={0}
                        onClick={() => {
                          setSelectedCategory(Number(id));
                          onCloseCategory();
                        }}
                        bg={selectedCategory === Number(id) ? darkPurple : "transparent"}
                        color={selectedCategory === Number(id) ? "white": "black"}
                        _hover={{ bg: "blue.50" }}
                      >
                        {name}
                      </Button>
                    ))}
                  </VStack>
                </Box>
              )}
            </Box>

            <HStack gap={2}>
              <Button 
                onClick={() => handlePeriodChange("day")}
                variant={timePeriod === "day" ? "solid" : "outline"}
                bgColor={timePeriod === "day" ? darkPurple : "outline"}
              >
                День
              </Button>
              <Button 
                onClick={() => handlePeriodChange("week")}
                variant={timePeriod === "week" ? "solid" : "outline"}
                bgColor={timePeriod === "week" ? darkPurple : "outline"}
              >
                Неделя
              </Button>
              <Button 
                onClick={() => handlePeriodChange("month")}
                variant={timePeriod === "month" ? "solid" : "outline"}
                bgColor={timePeriod === "month" ? darkPurple : "outline"}
              >
                Месяц
              </Button>
              <Button 
                onClick={() => handlePeriodChange("year")}
                variant={timePeriod === "year" ? "solid" : "outline"}
                bgColor={timePeriod === "year" ? darkPurple : "outline"}
              >
                Год
              </Button>
              <Button 
                onClick={() => handlePeriodChange("custom")}
                variant={timePeriod === "custom" ? "solid" : "outline"}
                bgColor={timePeriod === "custom" ? darkPurple : "outline"}
              >
                Произвольный
              </Button>
            </HStack>
          </HStack>
          
          {showCustomDatePicker && (
            <HStack gap={4} align="flex-end">
            <VStack align="start">
              <Text fontSize="sm" color="gray.600">Начальная дата</Text>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </VStack>
          
            <VStack align="start">
              <Text fontSize="sm" color="gray.600">Конечная дата</Text>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
              />
            </VStack>
          
            <Button
              onClick={handleApplyCustomDate}
              disabled={!startDate || !endDate}
              colorScheme="blue"
              bgColor={secondaryColor}
            >
              Применить
            </Button>
          </HStack>          
          )}
        </VStack>
      </Box>
      </Box>
      <Flex gap={6} mb={10}>
  {/* Первый график */}
  <Box>
    <Heading size="md" mb={4}>Заявки по сферам</Heading>
    <Box width="300px" height="200px" position="relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={fieldData} 
            dataKey="value" 
            nameKey="name" 
            cx="50%" 
            cy="50%" 
            outerRadius={90}
          >
            {fieldData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>

    {/* Своя легенда */}
    <Box mt={4}>
      {fieldData.map((item, index) => (
        <Flex align="center" mb={2} key={index}>
          <Box w="12px" h="12px" borderRadius="full" bg={item.color} mr={2} />
          <Text fontSize="m">{item.name}</Text>
        </Flex>
      ))}
    </Box>
  </Box>

  {/* Второй график */}
  <Box>
    <Heading size="md" mb={4}>Заявки по статусу</Heading>
    <Box width="300px" height="200px" position="relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={statusData} 
            dataKey="value" 
            nameKey="name" 
            cx="50%" 
            cy="50%" 
            outerRadius={90}
          >
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Box>

    {/* Своя легенда */}
    <Box mt={4}>
      {statusData.map((item, index) => (
        <Flex align="center" mb={2} key={index}>
          <Box w="12px" h="12px" borderRadius="full" bg={item.color} mr={2} />
          <Text fontSize="m">{item.name}</Text>
        </Flex>
      ))}
    </Box>
  </Box>
</Flex>

    </Flex>
  );
};
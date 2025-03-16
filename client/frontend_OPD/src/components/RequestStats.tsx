import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Box, Heading, Stack } from "@chakra-ui/react";
import { Request } from "./AdminPage";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#DC143C"];

const processDataByField = (requests: Request[]) => {
  const counts: Record<number, number> = {};

  requests.forEach((request) => {
    counts[request.field_id] = (counts[request.field_id] || 0) + 1;
  });

  return Object.keys(counts).map((key, index) => ({
    name: `Сфера ${key}`,
    value: counts[Number(key)],
    color: COLORS[index % COLORS.length], // Назначаем цвет
  }));
};

const processDataByStatus = (requests: Request[]) => {
  const counts: Record<string, number> = {};

  requests.forEach((request) => {
    counts[request.status] = (counts[request.status] || 0) + 1;
  });

  return Object.keys(counts).map((key, index) => ({
    name: key,
    value: counts[key],
    color: COLORS[index % COLORS.length], // Назначаем цвет
  }));
};

export const RequestStats = ({ requests }: { requests: Request[] }) => {
  const fieldData = processDataByField(requests);
  const statusData = processDataByStatus(requests);

  return (
    <Stack gap={6} align="center">
      <Box>
        <Heading size="md" mb={4}>
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

      <Box>
        <Heading size="md" mb={4}>
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
    </Stack>
  );
};

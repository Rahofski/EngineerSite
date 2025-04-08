import { Flex, Box, Heading, Text, Image } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";
import logo from './logo_vert.png';
export const Header = () => {
    
    const primaryColor = "#0D4C8B"; // Основной синий
    const headingColor = useColorModeValue(primaryColor, "white");
    return (
        <Flex align="center" mb={4}>
        <Image 
            src={logo} 
            alt="Логотип СПбПУ" 
            boxSize="100px"
            mr={4}
        />
        <Box>
            <Heading as="h1" size="xl" color={headingColor} mb={1}>
            Система управления заявками
            </Heading>
            <Text color="gray.600">Санкт-Петербургский политехнический университет Петра Великого</Text>
        </Box>
        </Flex>
    )
}
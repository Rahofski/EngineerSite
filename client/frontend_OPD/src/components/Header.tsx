import { Flex, Box, Heading, Text, Image } from "@chakra-ui/react";
import logo from './logo_vert.png';
import { primaryColor } from "./constants/colors";
export const Header = () => {
    
    const headingColor = primaryColor; // Основной синий
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
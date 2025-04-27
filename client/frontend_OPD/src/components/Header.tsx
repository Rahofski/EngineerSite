import { Flex, Box, Heading, Text, Image } from "@chakra-ui/react";
import logo from './logo_vert.svg';
import { primaryColor } from "./constants/colors";
export const Header = () => {
    
    return (
        <Flex align="center" mb={4} pl={4}>
        <Image 
            src={logo} 
            alt="Логотип СПбПУ" 
            boxSize="100px"
            mr={4}
        />
        <Box 
            width="2px" 
            height="80px" 
            backgroundColor="black" 
            mr={4}
        />
        <Box>
            <Heading as="h1" size="xl" color={"black"} mb={1}>
            Система управления заявками
            </Heading>
        </Box>
        </Flex>
    )
}
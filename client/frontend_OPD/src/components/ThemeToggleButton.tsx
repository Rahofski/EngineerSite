import { Button } from "@chakra-ui/react";
import { useColorMode } from "@/components/ui/color-mode";

import { MoonIcon, SunIcon } from "@chakra-ui/icons";

export const ThemeToggleButton = () => {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Button
            position="fixed"
            bottom="20px"
            right="20px"
            onClick={toggleColorMode}
            colorScheme="teal"
            p="4"
            borderRadius="full"
            boxShadow="lg"
        >
            {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </Button>
    );
};

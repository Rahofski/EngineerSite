import {Box, Button, Card, Image } from "@chakra-ui/react"
import { useState } from "react";

export const RequestPage = () => {
    const [show, setShow] = useState(false);
    
    const changeShow = () => {
        setShow(!show)
    }
    return (
        <Card.Root justifyContent="center" flexDirection="column" overflow="hidden" maxW="sm">
            <Box>
                <Card.Body>
                    <Card.Title mb="2">Заявка №1</Card.Title>
                    <Card.Description>
                        ул. Политехническая, д.29 аудитория 237
                        <h4>Описание</h4>
                        <p>
                            Разъебан шо пизда, нужно чинить
                        </p>
                    </Card.Description>
                </Card.Body>
                <Card.Footer>
                    <Button>Взять заявку</Button>
                    <Button onClick={changeShow}>
                    {show? "Скрыть" : "Подробнее"}
                    </Button>
                </Card.Footer>
            </Box>
            {show && (
                <Image
                objectFit="cover"
                maxW="200px"
                src="https://avatars.mds.yandex.net/i?id=8ae5eda2cc97000ae6f379aff37295aa41b68b42db5c3424-5031045-images-thumbs&n=13"
                alt="broken toilet"
              />
            )}
    
        </Card.Root>
    )
}

import React from "react";
import { Card, Image, Stack, Heading, Button, Flex } from "@chakra-ui/react";

function MyCard({ gift, handleOpenModal, isChosen, allowRemove }) {
  const { imageSrc, title } = gift;

  return (
    <Card
      direction="column"
      variant="outline"
      borderRadius="xl"
      overflow="hidden"
      mx="0.5em"
      maxW="25em"
      mb="2.5em"
    >
      <Image objectFit="cover" src={imageSrc} alt={title} />
      <Stack p="1.5em" gap="1.5em">
        <Heading size="sm">{title}</Heading>
        <Flex w="full" justifyContent="end" alignItems="center">
          <Button
            colorScheme={allowRemove ? "red" : isChosen ? "gray" : "facebook"}
            alignSelf="end"
            fontSize="md"
            isDisabled={allowRemove ? false : isChosen}
            onClick={() => {
              handleOpenModal(gift);
            }}
          >
            {allowRemove ? "Remover" : isChosen ? "Escolhido" : "Escolher"}
          </Button>
        </Flex>
      </Stack>
    </Card>
  );
}

export default MyCard;

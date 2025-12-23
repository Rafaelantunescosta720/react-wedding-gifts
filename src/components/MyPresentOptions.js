import React from "react";
import { Button, Flex, Text } from "@chakra-ui/react";
import { FaPix } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";

const MyPresentOptions = ({
  selectedGiftData,
  setSelectedGiftData,
  setActiveStep,
}) => {
  return (
    <>
      <Text fontSize="sm">
        Você pode escolher um presente da nossa lista e adquiri-lo no local que preferir. Caso ache mais prático, também é possível contribuir enviando o valor do presente diretamente via Pix. Sinta-se à vontade para escolher a opção que for mais conveniente para você.
      </Text>
      <Flex my="1em">
        <Button
          colorScheme="green"
          variant="ghost"
          mr={3}
          ml="auto"
          leftIcon={<FaPix />}
          fontSize="sm"
          onClick={() => {
            setSelectedGiftData({ ...selectedGiftData, paymentMethod: "pix" });
            setActiveStep(1);
          }}
        >
          Pix
        </Button>
        <Button
          colorScheme="green"
          variant="ghost"
          leftIcon={<FaShoppingCart />}
          fontSize="sm"
          onClick={() => {
            setSelectedGiftData({
              ...selectedGiftData,
              paymentMethod: "comprar",
            });
            setActiveStep(1);
          }}
        >
          Eu Compro
        </Button>
      </Flex>
    </>
  );
};

export default MyPresentOptions;

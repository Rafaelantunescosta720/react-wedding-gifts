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
        Você pode escolher um presente da nossa lista e comprá-lo onde achar
        melhor. Ou, se preferir algo mais prático, também pode nos enviar o presente
        diretamente via Pix. Fique à vontade para escolher a forma que for mais
        conveniente para você!
      </Text>
      <Flex my="1em">
        <Button
          colorScheme="facebook"
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
          colorScheme="facebook"
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

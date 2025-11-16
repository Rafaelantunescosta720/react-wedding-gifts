import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Text,
  Button,
  useToast,
  Stack,
  Heading,
  Divider,
  Image,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

const MyConfirmRemoveModal = ({
  isOpen,
  onClose,
  selectedGiftData,
  setSelectedGiftData,
  fetchGifts,
}) => {
  const toast = useToast();

  const handleClick = () => {
    setSelectedGiftData((prevGiftData) => {
      const updatedGiftData = {
        ...prevGiftData,
        status: "Disponível",
        name: "",
        phone: "",
        paymentMethod: "",
        message: "",
        giftDate: "",
      };
      const myPromise = enviarDadosParaAPI(updatedGiftData)
        .then(() => {
          fetchGifts();
        })
        .catch((error) => {
          console.error("Erro ao enviar dados:", error);
        });

      toast.promise(myPromise, {
        success: {
          title: "Presente Cancelado!",
          description:
            "Entendemos, às vezes as coisas mudam! O presente foi removido, mas a gente ainda está super animado para te ver no casamento!",
          duration: 7000,
          isClosable: true,
          position: "top",
        },
        error: {
          title: "Opa, deu erro!",
          description:
            "Parece que algo deu errado ao cancelar o presente. Por favor, verifique ou fale com a gente para resolver.",
          duration: 10000,
          isClosable: true,
          position: "top",
        },
        loading: {
          title: "Processando...",
          description:
            "Estamos cuidando de tudo para cancelar o presente. Só um instante, por favor.",
          duration: 7000,
          isClosable: true,
          position: "top",
        },
      });

      handleClose();
      return updatedGiftData;
    });
  };

  function enviarDadosParaAPI(selectedGiftData) {
    return new Promise(async (resolve, reject) => {
      try {
        const { id, name, phone, status, paymentMethod, message, giftDate } =
          selectedGiftData;
        const response = await fetch("/api/update-gift", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            name: name,
            phone: phone,
            status: status,
            paymentMethod: paymentMethod,
            message: message,
            giftDate: giftDate,
          }),
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Erro ao enviar dados: ${errorMessage}`);
        }

        const data = await response.json();
        resolve(data);
      } catch (error) {
        console.error("Erro ao enviar dados para a API:", error);
        reject(error);
      }
    });
  }

  function handleClose() {
    setSelectedGiftData({});
    onClose();
  }

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={handleClose}
      size={{ base: "sm", sm: "sm", md: "md", lg: "lg", xl: "xl" }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent pt="1em">
        <ModalHeader>
          Remover presente
          <ModalCloseButton m="0.25em" />
        </ModalHeader>

        <ModalBody>
          <Flex gap="1em">
            <Image
              src={selectedGiftData && selectedGiftData.imageSrc}
              alt={selectedGiftData && selectedGiftData.description}
              borderRadius="md"
              objectFit="contain"
              maxW="30%"
            />
            <Stack gap="0.75em" justifyContent="center">
              <Heading fontSize="sm" fontWeight="bold">
                {selectedGiftData && selectedGiftData.title}
              </Heading>
            </Stack>
          </Flex>
          <Divider m="1.5em 0" />
          <Text fontSize="sm">
            Ei, você está prestes a cancelar a reserva deste presente. Tem
            certeza? Se for o caso, só confirmar e a reserva será cancelada. Se
            mudar de ideia, nossa lista está aqui para ajudar você a encontrar o
            presente perfeito!
          </Text>
          <Flex mb="1em" mt="2em" justifyContent="flex-end">
            <Button
              colorScheme="red"
              leftIcon={<DeleteIcon />}
              fontSize="sm"
              onClick={handleClick}
            >
              Remover
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MyConfirmRemoveModal;

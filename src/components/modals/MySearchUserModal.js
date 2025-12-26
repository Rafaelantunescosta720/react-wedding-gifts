import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Stack,
  Text,
  Button,
  FormControl,
  InputGroup,
  InputLeftElement,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { PhoneIcon, SearchIcon } from "@chakra-ui/icons";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";

const MySearchUserModal = ({ isOpen, onClose, setSelectedPage }) => {
  const router = useRouter();

  const schema = Yup.object().shape({
    phone: Yup.string()
      .required("Este campo é obrigatório")
      .matches(/^\d{9,12}$/, "Número de celular inválido"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  function onSubmit(data) {
    router.push(
      {
        pathname: "/my-gifts",
        query: { phone: data.phone },
      },
      undefined,
      { shallow: true }
    );
    setSelectedPage("my-gifts");
    reset();
    onClose();
  }

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "sm", sm: "sm", md: "md", lg: "lg", xl: "xl" }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent pt="1em">
        <ModalHeader>
          Meus presentes
          <ModalCloseButton m="0.25em" />
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4} m="1em 0">
              <FormControl isInvalid={errors.phone}>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <PhoneIcon color="green.500" />
                  </InputLeftElement>
                  <Input
                    type="tel"
                    fontSize="sm"
                    placeholder="Digite o seu número de celular"
                    {...register("phone")}
                  />
                </InputGroup>
                <FormErrorMessage fontSize={{ base: "xs", md: "sm", lg: "md" }}>
                  {errors.phone && errors.phone.message}
                </FormErrorMessage>
              </FormControl>
            </Stack>
            <Flex mb="1em" mt="2em" justifyContent="flex-end">
              <Button
                colorScheme="green"
                type="submit"
                isLoading={isSubmitting}
                leftIcon={<SearchIcon />}
                fontSize="sm"
              >
                Buscar
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MySearchUserModal;

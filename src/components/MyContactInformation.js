import {
  Text,
  Stack,
  InputGroup,
  InputLeftElement,
  Input,
  FormControl,
  FormErrorMessage,
  Button,
  Flex,
  useToast,
  Textarea,
  Icon,
} from "@chakra-ui/react";
import { IoPerson } from "react-icons/io5";
import { ArrowBackIcon, PhoneIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { GrSend } from "react-icons/gr";

const MyContactInformation = ({
  setSelectedGiftData,
  handleClose,
  setActiveStep,
  fetchGifts,
}) => {
  const schema = Yup.object().shape({
    name: Yup.string()
      .required("Este campo é obrigatório")
      .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Somente letras são permitidas"),
    phone: Yup.string()
      .required("Este campo é obrigatório")
      .matches(/^\d{9,12}$/, "Número de celular inválido"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const toast = useToast();

  const onSubmit = (data) => {
    setSelectedGiftData((prevGiftData) => {
      const updatedGiftData = {
        ...prevGiftData,
        name: data.name,
        phone: data.phone,
        status: "Escolhido",
        message: data.message,
        giftDate: new Date().toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "medium",
        }),
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
          title: "Presente Confirmado!",
          description:
            "Sua reserva foi feita com sucesso! A gente mal pode esperar para te ver no nosso casamento. Obrigado por fazer parte desse momento!",
          duration: 7000,
          isClosable: true,
          position: "top",
        },
        error: {
          title: "Ops, deu erro!",
          description:
            "Algo deu errado ao reservar o presente. Por favor, verifique o status ou fale com a gente se precisar de uma mão. Se já pagou via PIX, pode ficar tranquilo que não precisa refazer.",
          duration: 10000,
          isClosable: true,
          position: "top",
        },
        loading: {
          title: "Quase lá...",
          description:
            "Estamos finalizando sua reserva. Só um minutinho, por favor.",
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

  return (
    <>
      <Text fontSize="sm">
        Para que possamos identificar e agradecer seu presente, pedimos que informe seu nome e telefone abaixo. Se desejar, você também pode deixar uma mensagem, será um prazer ler suas palavras.
        Fique tranquilo(a): seus dados serão utilizados exclusivamente para esse fim e permanecerão seguros conosco.
      </Text>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4} m="2em 0">
          <FormControl isInvalid={errors.name}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={IoPerson} color="facebook.500" />
              </InputLeftElement>
              <Input
                fontSize="sm"
                type="text"
                placeholder="Nome completo"
                {...register("name")}
              />
            </InputGroup>
            <FormErrorMessage fontSize={{ base: "xs", md: "sm", lg: "md" }}>
              {errors.name && errors.name.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.phone}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <PhoneIcon color="facebook.500" />
              </InputLeftElement>
              <Input
                type="tel"
                fontSize="sm"
                placeholder="Número de celular"
                {...register("phone")}
              />
            </InputGroup>
            <FormErrorMessage fontSize={{ base: "xs", md: "sm", lg: "md" }}>
              {errors.phone && errors.phone.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl>
            <InputGroup>
              <Textarea
                fontSize="sm"
                placeholder="Deixe uma mensagem para nós"
                {...register("message")}
              />
            </InputGroup>
          </FormControl>
        </Stack>
        <Flex mb="1em" mt="2em" justifyContent="flex-end">
          <Button
            colorScheme="green"
            variant="ghost"
            mr={3}
            leftIcon={<ArrowBackIcon />}
            fontSize="sm"
            onClick={() => {
              setActiveStep(1);
            }}
          >
            Voltar
          </Button>
          <Button
            colorScheme="green"
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<GrSend />}
            fontSize="sm"
          >
            Enviar
          </Button>
        </Flex>
      </form>
    </>
  );
};

export default MyContactInformation;

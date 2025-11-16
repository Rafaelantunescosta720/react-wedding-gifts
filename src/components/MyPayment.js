import React from "react";
import { Button, Center, Flex, Stack, Text } from "@chakra-ui/react";
import { useQRCode } from "next-qrcode";
import { useClipboard } from "@chakra-ui/react";
import { ArrowBackIcon, CheckIcon, CopyIcon } from "@chakra-ui/icons";

const MyPayment = ({ selectedGiftData, setActiveStep }) => {
  const { SVG } = useQRCode();
  const { onCopy, value, setValue, hasCopied } = useClipboard(
    process.env.NEXT_PUBLIC_PIX_KEY
  );

  return (
    <>
      <Center>
        {selectedGiftData.paymentMethod === "pix" ? (
          <Stack>
            <Text fontSize="sm">
              Você pode usar o QR Code abaixo para uma transação rápida e
              prática. Se preferir, também pode copiar a chave Pix que está logo
              abaixo e usá-la no seu aplicativo de pagamento. Escolha o método
              que achar mais fácil!
            </Text>
            <Center mt="1em">
              <SVG
                text={process.env.NEXT_PUBLIC_QRCODE_TEXT}
                options={{
                  margin: 2,
                  width: 220,
                  color: {
                    dark: "#000000",
                    light: "#ffffff",
                  },
                }}
              />
            </Center>
            <Text
              alignSelf="center"
              fontSize="sm"
              fontWeight="600"
              color="facebook.500"
            >
              {process.env.NEXT_PUBLIC_ACCOUNT_OWNER}
            </Text>
            <Button
              onClick={onCopy}
              variant="ghost"
              colorScheme="gray"
              color="facebook.500"
              rightIcon={<CopyIcon fontSize="1.2em" />}
              fontSize="sm"
              w="fit-content"
              alignSelf="center"
              my="0.5em"
            >
              {hasCopied ? "Chave copiada!" : value}
            </Button>
          </Stack>
        ) : (
          <Text fontSize="sm">
            Você pode comprar o presente onde preferir e entregá-lo quando for
            mais conveniente para você. O site é apenas para reservar os
            presentes e evitar presentes repetidos, então fique à vontade para
            escolher a loja e o momento que melhor se encaixem na sua rotina.
          </Text>
        )}
      </Center>
      <Flex my="1em">
        <Button
          colorScheme="facebook"
          variant="ghost"
          mr={3}
          ml="auto"
          leftIcon={<ArrowBackIcon />}
          fontSize="sm"
          onClick={() => {
            setActiveStep(0);
          }}
        >
          Voltar
        </Button>
        <Button
          colorScheme="facebook"
          fontSize="sm"
          leftIcon={<CheckIcon />}
          onClick={() => {
            setActiveStep(2);
          }}
        >
          Finalizar
        </Button>
      </Flex>
    </>
  );
};

export default MyPayment;

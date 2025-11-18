import React, { useEffect } from "react";
import { Button, Center, Flex, Stack, Text } from "@chakra-ui/react";
import { useQRCode } from "next-qrcode";
import { useClipboard } from "@chakra-ui/react";
import { ArrowBackIcon, CheckIcon, CopyIcon } from "@chakra-ui/icons";

const MyPayment = ({ selectedGiftData, setActiveStep }) => {
  const { SVG } = useQRCode();

  // valor inicial vindo da env (fallback amigável)
  const initialPix =
    process.env.NEXT_PUBLIC_PIX_KEY || "Chave PIX não configurada";
  const { onCopy, setValue, hasCopied } = useClipboard(initialPix);

  // garante que o texto do clipboard reflita a env (útil se o valor mudar em hot-reload)
  useEffect(() => {
    setValue(initialPix);
  }, [initialPix, setValue]);

  const qrcodeText = process.env.NEXT_PUBLIC_QRCODE_TEXT || initialPix;
  const accountOwner = process.env.NEXT_PUBLIC_ACCOUNT_OWNER || "";

  return (
    <>
      <Center>
        {selectedGiftData.paymentMethod === "pix" ? (
          <Stack>
            <Text fontSize="sm">
              Você pode usar o QR Code abaixo para uma transação rápida e
              prática.
            </Text>

            <Center mt="1em">
              <SVG
                text={qrcodeText}
                options={{
                  margin: 2,
                  width: 220,
                  color: { dark: "#000000", light: "#ffffff" },
                }}
              />
            </Center>

            <Text
              alignSelf="center"
              fontSize="sm"
              fontWeight="600"
              color="facebook.500"
            >
              {accountOwner}
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
              aria-label="Copiar código PIX"
            >
              {hasCopied ? "Chave copiada!" : "Clique aqui para copiar!"}
            </Button>
          </Stack>
        ) : (
          <Text fontSize="sm">
            Você pode comprar o presente onde preferir e entregá-lo quando for
            mais conveniente.
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
          onClick={() => setActiveStep(0)}
        >
          Voltar
        </Button>
        <Button
          colorScheme="facebook"
          fontSize="sm"
          leftIcon={<CheckIcon />}
          onClick={() => setActiveStep(2)}
        >
          Finalizar
        </Button>
      </Flex>
    </>
  );
};

export default MyPayment;

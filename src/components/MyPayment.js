import React, { useEffect } from "react";
import { Button, Center, Flex, Stack, Text } from "@chakra-ui/react";
import { useQRCode } from "next-qrcode";
import { useClipboard } from "@chakra-ui/react";
import { ArrowBackIcon, CheckIcon, CopyIcon } from "@chakra-ui/icons";
import useSWR from "swr";

const MyPayment = ({ selectedGiftData, setActiveStep }) => {
  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { SVG } = useQRCode();

  const { data } = useSWR("/api/pix-payload", fetcher, {
    revalidateOnFocus: false,
  });
  const payload = data?.payload;

  // valor inicial vindo da env (fallback amigável)
  const initialPix =
    process.env.NEXT_PUBLIC_PIX_KEY || "Chave PIX não configurada";
  const initialCopyValue = payload || initialPix;
  const { onCopy, setValue, hasCopied } = useClipboard(initialCopyValue);

  // atualiza value quando payload chega
  useEffect(() => {
    if (payload) setValue(payload);
  }, [payload, setValue]);

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
              {payload ? (
                <SVG
                  text={payload}
                  options={{
                    margin: 2,
                    width: 220,
                    color: { dark: "#000000", light: "#ffffff" },
                  }}
                />
              ) : (
                <Text>Gerando QR Code...</Text>
              )}
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
          colorScheme="green"
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
          colorScheme="green"
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

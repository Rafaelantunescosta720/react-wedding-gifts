import React, { useEffect } from "react";
import Head from "next/head";
import {
  Container,
  Image,
  Text,
  Center,
  Button,
  useClipboard,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { useQRCode } from "next-qrcode";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => r.json());

function formatCpf(raw = "") {
  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 11) return raw;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(
    6,
    9
  )}-${digits.slice(9)}`;
}

export default function Pix() {
  const { SVG } = useQRCode();
  const { data } = useSWR("/api/pix-payload", fetcher, {
    revalidateOnFocus: false,
  });
  const payload = data?.payload;
  const txid = data?.txid;

  // fallback para cópia: a chave (caso payload não disponível)
  const initialCopyValue = payload || process.env.NEXT_PUBLIC_PIX_KEY || "";
  const { onCopy, value, setValue, hasCopied } = useClipboard(initialCopyValue);

  // atualiza value quando payload chega
  useEffect(() => {
    if (payload) setValue(payload);
  }, [payload, setValue]);

  // chave visível formatada (opcional mostrar no layout)
  const visibleKey = process.env.NEXT_PUBLIC_PIX_KEY
    ? formatCpf(process.env.NEXT_PUBLIC_PIX_KEY)
    : null;

  return (
    <>
      <Head>
        <title>C&R | Pix</title>
        <meta
          name="description"
          content="Gift list for the wedding of Willian and Samara"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Container centerContent maxW={{ md: "80%" }} mb="9em">
        <Center flexDir="column">
          <Image src="./logo.svg" alt="Logo" mt="3em" boxSize="12em" />
          <Text mx="0.5em" my="2em" textAlign="center">
            Quer dar aquele presente especial, mas sem sair de casa? O PIX salva
            o dia! É só escanear o QR Code ou, se preferir, copiar a chave PIX
            que está logo ali em baixo. Prometemos usar esse presente com muito
            carinho (ou para pagar a lua de mel, quem sabe?). Cada contribuição
            é uma parte do nosso sonho, e somos muito gratos por você fazer
            parte dele. Obrigado por estar conosco nesse momento tão especial!
          </Text>

          {payload ? (
            <SVG text={payload} options={{ margin: 2, width: 250 }} />
          ) : (
            <Text>Gerando QR Code...</Text>
          )}
        </Center>
        <Text
          alignSelf="center"
          fontSize="sm"
          fontWeight="600"
          mt="1em"
          color="facebook.500"
        >
          {process.env.NEXT_PUBLIC_ACCOUNT_OWNER}
        </Text>
        {visibleKey && (
          <Text fontSize="sm" color="gray.600" mt="0.5em" textAlign="center">
            CPF: {visibleKey}
          </Text>
        )}

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
      </Container>
    </>
  );
}

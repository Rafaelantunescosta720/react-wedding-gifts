import Head from "next/head";
import {
  Container,
  Image,
  Text,
  Center,
  useDisclosure,
  Box,
  Spinner,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MyCard from "@/components/MyCard";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import useSWR from "swr";
import MyChooseGiftModal from "@/components/modals/MyChooseGiftModal";
import { SearchIcon } from "@chakra-ui/icons";

export default function Search() {
  const router = useRouter();
  const { query } = router.query;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedGiftData, setSelectedGiftData] = useState({});
  const [gifts, setGifts] = useState([]);

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, mutate } = useSWR("/api/gifts", fetcher);

  useEffect(() => {
    if (data) {
      const removeAccents = (text) =>
        text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const filteredData = data.filter((object) => {
        const normalizedTitle = removeAccents(object.title).toLowerCase();
        const searchTerm = query ? removeAccents(query).toLowerCase().trim() : query;

        return normalizedTitle.includes(searchTerm);
      });

      setGifts(filteredData);
    }
  }, [data, query]);

  const handleOpenModal = (cardData) => {
    setSelectedGiftData({ ...selectedGiftData, ...cardData });
    onOpen();
  };

  return (
    <>
      <Head>
        <title>C&R | Buscar</title>
        <meta
          name="description"
          content="Gift list for the wedding of Rafael and Carolina"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
      </Head>
      <Container centerContent maxW={{ md: "80%" }} mb="5em">
        <Center flexDir="column">
          <Image src="./logo.svg" alt="Logo" mt="3em" boxSize="12em" />
          <Text mx="0.5em" mt="3em" textAlign="center">
            Achou o presente perfeito? Ótimo! Agora é só reservar para garantir
            que ninguém vai escolher antes de você. Se ainda está em dúvida, não
            tem problema, a lista está cheia de boas opções! Mas não espere
            muito, os melhores presentes voam rápido.
          </Text>
        </Center>
        {data && gifts && gifts.length == 0 ? (
          <Center flexDir="column" gap="0.75em" color="facebook.500" mt="5em">
            <SearchIcon fontSize="3.5em" />
            <Heading fontSize="lg" textAlign="center" mt="1em">
              Poxa, não encontramos nenhum(a) &quot;{query}
              &quot;.
            </Heading>
            <Text textAlign="center">
              Mas não se preocupe! Se você tiver algo específico em mente, é só
              falar com a gente e podemos adicionar à lista.
              <br /> Quem sabe seu presente está a um passo de ser incluído!
            </Text>
          </Center>
        ) : data ? (
          <>
            <Text
              as="h4"
              mt="2.5em"
              mb="1.5em"
              mx="0.5em"
              fontSize="1.5em"
              textTransform="uppercase"
              fontWeight="400"
              alignSelf="start"
            >
              {query}
            </Text>
            <Box className={styles.cardsGrid} alignItems="center">
              {data &&
                gifts.map((gift) => (
                  <MyCard
                    key={gift.id}
                    handleOpenModal={handleOpenModal}
                    gift={gift}
                    isChosen={gift.status == "Escolhido"}
                    allowRemove={false}
                  />
                ))}
            </Box>
          </>
        ) : (
          <Spinner mt="4em" size="xl" color="#D1AD74" />
        )}
      </Container>
      <MyChooseGiftModal
        isOpen={isOpen}
        onClose={onClose}
        selectedGiftData={selectedGiftData}
        setSelectedGiftData={setSelectedGiftData}
        fetchGifts={mutate}
      />
    </>
  );
}

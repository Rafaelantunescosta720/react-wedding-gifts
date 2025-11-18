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
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import MyCard from "@/components/MyCard";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import MyConfirmRemoveModal from "@/components/modals/MyConfirmRemoveModal";
import useSWR from "swr";
import { SearchIcon } from "@chakra-ui/icons";
import { AiOutlineGift } from "react-icons/ai";

export default function MyGifts() {
  const router = useRouter();
  const { phone } = router.query;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedGiftData, setSelectedGiftData] = useState({});
  const [gifts, setGifts] = useState([]);

  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error, mutate } = useSWR("/api/gifts", fetcher);

  useEffect(() => {
    if (data) {
      const filteredData = data.filter((object) => {
        if (object.status !== "Escolhido") {
          return false;
        }

        const normalizePhone = (phone) => phone.replace(/\D/g, "");

        const normalizedObjectPhone = normalizePhone(object.phone);
        const normalizedPhone = normalizePhone(phone);

        return (
          normalizedObjectPhone.includes(normalizedPhone) ||
          normalizedPhone.includes(normalizedObjectPhone)
        );
      });

      setGifts(filteredData);
    }
  }, [data, phone]);

  const handleOpenModal = (cardData) => {
    setSelectedGiftData({ ...selectedGiftData, ...cardData });
    onOpen();
  };

  return (
    <>
      <Head>
        <title>C&R | Meus Presentes</title>
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
            Olha só que beleza! Esses são os presentes que você escolheu para a
            gente. Já estamos sonhando com eles! Se quiser fazer alguma
            alteração ou adicionar mais um mimo, fique à vontade. Cada escolha é
            uma lembrança especial que levaremos para sempre. Obrigado por fazer
            parte desse momento!
          </Text>
        </Center>
        {data && gifts && gifts.length == 0 ? (
          <Center flexDir="column" gap="0.75em" color="facebook.500" mt="5em">
            <Icon as={AiOutlineGift} fontSize="3.5em" />
            <Heading fontSize="lg" textAlign="center" mt="1em">
              Você ainda não escolheu nenhum presente...
            </Heading>
            <Text textAlign="center">
              Mas não se preocupe, ainda dá tempo! Nossa lista está cheia de
              opções incríveis esperando por você. <br />
              Que tal dar uma olhadinha e escolher algo especial?
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
              Meus Presentes
            </Text>
            <Box className={styles.cardsGrid} alignItems="center">
              {data &&
                gifts.map((gift) => (
                  <MyCard
                    key={gift.id}
                    handleOpenModal={handleOpenModal}
                    gift={gift}
                    isChosen={gift.status == "Escolhido"}
                    allowRemove={true}
                  />
                ))}
            </Box>
          </>
        ) : (
          <Spinner mt="4em" size="xl" color="#D1AD74" />
        )}
      </Container>
      <MyConfirmRemoveModal
        isOpen={isOpen}
        onClose={onClose}
        selectedGiftData={selectedGiftData}
        setSelectedGiftData={setSelectedGiftData}
        fetchGifts={mutate}
      />
    </>
  );
}

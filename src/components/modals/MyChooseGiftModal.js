import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Stack,
  Heading,
  Image,
  Divider,
} from "@chakra-ui/react";
import MyStepper from "../MyStepper";
import MyContactInformation from "../MyContactInformation";
import MyPresentOptions from "../MyPresentOptions";
import MyPayment from "../MyPayment";

const MyChooseGiftModal = ({
  isOpen,
  onClose,
  selectedGiftData,
  setSelectedGiftData,
  fetchGifts,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Escolha como nos presentear!", "Finalize o Presente do Seu Jeito!", "Obrigado pelo Presente!"];
  const activeStepText = steps[activeStep];

  function handleClose() {
    setActiveStep(0);
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
          Escolher presente
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
          <MyStepper
            activeStep={activeStep}
            steps={steps}
            activeStepText={activeStepText}
          />
          {activeStep === 0 && (
            <MyPresentOptions
              selectedGiftData={selectedGiftData}
              setSelectedGiftData={setSelectedGiftData}
              setActiveStep={setActiveStep}
            />
          )}
          {activeStep === 1 && (
            <MyPayment
              selectedGiftData={selectedGiftData}
              setActiveStep={setActiveStep}
            />
          )}
          {activeStep === 2 && (
            <MyContactInformation
              setSelectedGiftData={setSelectedGiftData}
              handleClose={handleClose}
              setActiveStep={setActiveStep}
              fetchGifts={fetchGifts}
            />
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MyChooseGiftModal;

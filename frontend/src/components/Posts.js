import {
  Box,
  Input,
  Button,
  Text,
  Image,
  CircularProgress,
  SimpleGrid,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormHelperText,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import useMutation from '../hooks/useMutation';
import useQuery from '../hooks/useQuery';
import emailjs from '@emailjs/browser';

const validFileTypes = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'application/pdf',
];
const URL = '/images';

const ErrorText = ({ children, ...props }) => (
  <Text fontSize="lg" color="red.300" {...props}>
    {children}
  </Text>
);

const Posts = () => {
  const toast = useToast();
  const [refetch, setRefetch] = useState(0);
  const {
    mutate: uploadImage,
    isLoading: uploading,
    error: uploadError,
  } = useMutation({ url: URL });

  const {
    data: imageUrls,
    isLoading: imagesLoading,
    error: fetchError,
  } = useQuery(URL, refetch);

  const [error, setError] = useState('');

  const handleUpload = async e => {
    const file = e.target.files[0];
    if (!validFileTypes.find(type => type === file.type)) {
      setError('Incorrect File Format');
      return;
    }

    const form = new FormData();
    form.append('image', file);
    await uploadImage(form);
    setTimeout(() => setRefetch(s => s + 1), 1000);
  };

  const handleDelete = async url => {
    setRefetch(s => s + 1); // Refetch the images to update the list
    toast({
      title: 'Image Deleted.',
      description: 'The image has been successfully deleted.',
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  };

  const handleShare = async url => {
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: 'Link Copied!',
        description: 'Image URL has been copied to your clipboard.',
        status: 'info',
        duration: 5000,
        isClosable: true,
      });
    });
  };

  const { isOpen, onClose, onOpen } = useDisclosure();
  //  const urlToSend = async url;

  const [selectedFileUrl, setSelectedFileUrl] = useState('');
  const formRef = useRef();

  const handleShareButtonClick = ({ url }) => {
    setSelectedFileUrl(url);
    onOpen();
  };

  const sendEmail = e => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_8wh2wgo',
        'template_pntrkj3',
        formRef.current,
        'i_OClDgkgqM-JesHG'
      )
      .then(
        result => {
          console.log('SUCCESS!', result.text);
          onClose(); // This will close the modal
          formRef.current.reset(); // This will reset the form fields
          // Display a toast message
          toast({
            title: 'Email Sent',
            description: 'The file link has been sent successfully!',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });

          // ... Handle the success, e.g., by closing the modal
        },
        error => {
          console.log('FAILED...', error.text);
        }
      );
  };
  //  const sendEmail = (e) => {
  //   e.preventDefault();

  //   emailjs
  //     .sendForm('service_8wh2wgo', 'template_pntrkj3', formRef.current, {
  //       publicKey: 'i_OClDgkgqM-JesHG',
  //     })
  //     .then(
  //       () => {
  //         console.log('SUCCESS!');
  //       },
  //       (error) => {
  //         console.log('FAILED...', error.text);
  //       },
  //     );

  // };

  return (
    <Box mt={6} align="center">
      <Input
        id="imageInput"
        aligh="left"
        type="file"
        hidden
        onChange={handleUpload}
      />
      <Button
        as="label"
        htmlFor="imageInput"
        colorScheme="blue"
        variant="solid"
        mb={0.5}
        cursor="pointer"
        isLoading={uploading}
      >
        Upload NEW
      </Button>

      <Button
        colorScheme="red"
        ml={3}
        // onClick={() => imageUrls.forEach(url => handleDelete(url))}
      >
        Delete All
      </Button>
      <Button
        colorScheme="green"
        ml={3}
        onClick={() => imageUrls.forEach(url => handleShare(url))}
      >
        Share All
      </Button>
      {error && <ErrorText>{error}</ErrorText>}
      {uploadError && <ErrorText>{uploadError}</ErrorText>}
      <Text textAlign="left" mb={4}>
        Files Uploaded -
      </Text>
      {imagesLoading && (
        <CircularProgress
          color="gray.600"
          trackColor="blue.300"
          size={7}
          thickness={10}
          isIndeterminate
        />
      )}
      {fetchError && <ErrorText textAlign="left">No Files Found</ErrorText>}
      {!fetchError && imageUrls?.length === 0 && (
        <Text textAlign="left" fontSize="lg" color="gray.500">
          No Files Found
        </Text>
      )}
      <Box mt={6} align="center">
        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {imageUrls?.length > 0 &&
            imageUrls.map(url => (
              <Box
                key={url}
                p={2}
                borderWidth="1px"
                borderColor="gray.200"
                display="flex"
                flexDirection="column" // Align items vertically
              >
                <Image borderRadius={5} src={url} alt="Image" key={url} />

                {/* Flex container for buttons */}
                <Box
                  display="flex"
                  justifyContent="space-between" // Align buttons evenly
                  width="100%"
                  mt={2} // Add margin between text and buttons
                >
                  <Button
                    size="xs"
                    colorScheme="blue"
                    onClick={() => window.open(url, '_blank')}
                  >
                    Preview
                  </Button>

                  <>
                    <Button
                      size="xs"
                      colorScheme="green"
                      onClick={() => handleShareButtonClick(url)}
                    >
                      Share
                    </Button>
                    <Modal isOpen={isOpen} onClose={onClose}>
                      <ModalContent>
                        <ModalHeader>Send an email</ModalHeader>
                        <ModalCloseButton />
                        <form
                          ref={formRef}
                          onSubmit={sendEmail}
                          // onSubmit={(event) => {
                          //   event.preventDefault();
                          //   alert("Sent!");
                          // }}
                        >
                          <ModalBody>
                            <FormControl>
                              <Input
                                type="email"
                                name="user_email"
                                placeholder="Email ID"
                                required
                              />
                              <FormLabel>URL to be sent</FormLabel>
                              <Input
                                type="text"
                                name="url"
                                placeholder="URL to be sent"
                                value={url}
                                readOnly
                              />
                              <FormHelperText>
                                Sharing made easy! Send this link via an email.
                              </FormHelperText>
                            </FormControl>
                            <ModalFooter>
                              <Button type="submit">Send</Button>
                            </ModalFooter>
                          </ModalBody>
                        </form>
                      </ModalContent>
                    </Modal>
                  </>

                  <Button
                    size="xs"
                    colorScheme="red"
                    onClick={() => handleDelete(url)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Posts;

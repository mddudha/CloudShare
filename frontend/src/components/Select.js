import React, { useState } from 'react';
import { SimpleGrid, Image, Box, Checkbox } from '@chakra-ui/react';

function ImageSelector({ imageUrls }) {
  // State to track selected images
  const [selectedImages, setSelectedImages] = useState({});

  // Handle checkbox change
  const handleCheckboxChange = url => {
    setSelectedImages(prev => ({
      ...prev,
      [url]: !prev[url], // Toggle the selection
    }));
  };

  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={4}>
      {imageUrls?.map(url => (
        <Box key={url} position="relative" p={2}>
          <Image borderRadius={5} src={url} alt="ENCRYPTED" />
          <Checkbox
            position="absolute"
            top="5px"
            left="5px"
            colorScheme="green"
            isChecked={selectedImages[url]}
            onChange={() => handleCheckboxChange(url)}
          />
        </Box>
      ))}
    </SimpleGrid>
  );
}

export default ImageSelector;

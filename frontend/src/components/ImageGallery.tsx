import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";

const GalleryContainer = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

const ImageItem = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const FullSizeImageOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const FullSizeImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  border-radius: 10px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
`;
// Definir las props para el componente
interface ImageGalleryProps {
  updateTrigger: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ updateTrigger }) => {
  const [images, setImages] = useState<Array<{ key: string; url: string }>>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    console.log("api: ", process.env.REACT_APP_API_URL);
    console.log("LOCALSTACK_ENDPOINT:", process.env.LOCALSTACK_ENDPOINT); // Agregar este log
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/images`
      );

      setImages(response.data.images);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages, updateTrigger]); // Añadir updateTrigger como dependencia

  const handleImageClick = async (key: string) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/images/originals/${key}`
      );
      setSelectedImage(response.data.url);
    } catch (error) {
      console.error("Error getting image URL:", error);
    }
  };

  const handleOverlayClick = () => {
    setSelectedImage(null);
  };

  return (
    <GalleryContainer>
      <h2>Image Gallery</h2>
      <Grid>
        {images.map(({ key, url }) => (
          <ImageItem
            key={key}
            src={url}
            alt={key}
            onClick={() => handleImageClick(key)}
            onError={(e) => {
              console.error(`Error loading image ${key}:`, e);
              e.currentTarget.src = "https://placehold.co/200x200";
            }}
          />
        ))}
      </Grid>
      {selectedImage && (
        <FullSizeImageOverlay onClick={handleOverlayClick}>
          <FullSizeImage
            src={selectedImage}
            alt="Full Size"
            onError={(e) => {
              console.error("Error loading full image:", e);
              e.currentTarget.src = "https://placehold.co/800x600";
            }}
          />
        </FullSizeImageOverlay>
      )}
    </GalleryContainer>
  );
};

export default ImageGallery;

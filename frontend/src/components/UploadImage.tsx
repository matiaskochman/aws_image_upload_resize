// frontend/src/components/UploadImage.tsx
import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const UploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const PreviewImage = styled.img`
  width: 300px;
  height: auto;
  margin-top: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const UploadButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
  background-color: #61dafb;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #21a1f1;
  }
`;

// Definir las props para el componente
interface UploadImageProps {
  onUploadSuccess: () => void;
}

const UploadImage: React.FC<UploadImageProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validar que el archivo sea una imagen
      if (!selectedFile.type.startsWith("image/")) {
        setMessage("Por favor, selecciona un archivo de imagen válido.");
        setFile(null);
        setPreview(null);
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string); // Almacena la URL completa
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      const dataUrl = await convertToBase64(file);
      const base64 = dataUrl.split(",")[1]; // Extraer solo la parte Base64
      const mimeType = file.type; // Obtener el tipo MIME del archivo

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/images`,
        {
          base64,
          filename: file.name,
          mimeType, // Incluir el tipo MIME
        }
      );

      setMessage("Imagen cargada exitosamente!");
      console.log(response.data);

      // Llamar a la función de actualización pasada desde App
      onUploadSuccess();
    } catch (error) {
      console.error(error);
      setMessage("Error al cargar la imagen.");
    } finally {
      setUploading(false);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string); // Retornar la URL completa
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <UploadContainer>
      <h2>Subir Imagen</h2>
      <input type="file" onChange={handleFileChange} />
      {preview && <PreviewImage src={preview} alt="Preview" />}
      <UploadButton onClick={handleUpload} disabled={uploading}>
        {uploading ? "Cargando..." : "Subir"}
      </UploadButton>
      {message && <p>{message}</p>}
    </UploadContainer>
  );
};

export default UploadImage;

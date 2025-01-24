// frontend/src/App.tsx
import React, { useState } from "react";
import "./App.css";
import ImageGallery from "./components/ImageGallery";
import UploadImage from "./components/UploadImage";

const App: React.FC = () => {
  // Estado para controlar las actualizaciones de la galería
  const [updateGallery, setUpdateGallery] = useState<number>(0);

  // Función para incrementar el estado de actualización
  const handleImageUpload = () => {
    setUpdateGallery((prev) => prev + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Bienvenido al Frontend de Image Resizer</h1>
      </header>
      <main>
        {/* Pasar la función de actualización al componente UploadImage */}
        <UploadImage onUploadSuccess={handleImageUpload} />
        {/* Pasar el estado de actualización a ImageGallery */}
        <ImageGallery updateTrigger={updateGallery} />
      </main>
    </div>
  );
};

export default App;

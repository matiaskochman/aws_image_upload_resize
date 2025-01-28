// const fs = require("fs");
// const path = require("path");

// // Carpetas y archivo de salida
// const sourceDir = path.join(__dirname, "../src");
// const rootFiles = [
//   "../.vscode/settings.json",
//   "../package.json",
//   "../tsconfig.json",
//   "../.env",
//   "../serverless.yml",
//   "../.vscode/launch.json",
// ];
// const outputFilePath = path.join(__dirname, "./backend-output.txt");

// // Función para verificar si es un archivo válido (extensiones .js, .jsx, .ts, .tsx)
// const isValidFile = (fileName) => {
//   return /\.(js|jsx|ts|tsx)$/.test(fileName);
// };

// // Función para leer archivos, excluir líneas comentadas y concatenar contenido
// const processFiles = (dir) => {
//   let output = "";

//   const files = fs.readdirSync(dir);

//   files.forEach((file) => {
//     const fullPath = path.join(dir, file);
//     const stats = fs.statSync(fullPath);

//     if (stats.isDirectory()) {
//       // Si es una carpeta, procesar recursivamente
//       output += processFiles(fullPath);
//     } else if (stats.isFile() && isValidFile(file)) {
//       // Leer archivo y eliminar líneas comentadas
//       const fileContent = fs.readFileSync(fullPath, "utf-8");
//       const cleanedContent = fileContent
//         .split("\n")
//         .filter(
//           (line) =>
//             !line.trim().startsWith("//") &&
//             !line.trim().startsWith("/*") &&
//             !line.trim().endsWith("*/")
//         )
//         .join("\n");

//       // Agregar el contenido al output con separadores
//       output += `Path: ${fullPath}\n\n${cleanedContent}\n\n/*****************/\n\n`;
//     }
//   });

//   return output;
// };

// // Procesar archivos root
// const processRootFiles = () => {
//   let output = "";

//   rootFiles.forEach((relativePath) => {
//     const fullPath = path.join(__dirname, relativePath);
//     if (fs.existsSync(fullPath)) {
//       const fileContent = fs.readFileSync(fullPath, "utf-8");
//       output += `Path: ${fullPath}\n\n${fileContent}\n\n/*****************/\n\n`;
//     }
//   });

//   return output;
// };

// // Procesar todos los archivos y escribir en output.txt
// try {
//   let finalOutput = processRootFiles();
//   finalOutput += processFiles(sourceDir);
//   fs.writeFileSync(outputFilePath, finalOutput.trim(), "utf-8");
//   console.log(
//     `Archivos procesados correctamente. Salida generada en: ${outputFilePath}`
//   );
// } catch (error) {
//   console.error("Error procesando los archivos:", error);
// }
const fs = require("fs");
const path = require("path");

// Carpetas y archivo de salida
const sourceDir = path.join(__dirname, "../src");
const rootDir = path.join(__dirname, "../"); // Directorio raíz para buscar .env*
const rootFiles = [
  "../.vscode/settings.json",
  "../package.json",
  "../tsconfig.json",
  // "../.env", // Removido para manejar dinámicamente
  "../serverless.yml",
  "../.vscode/launch.json",
];
const outputFilePath = path.join(__dirname, "./backend-output.txt");

// Función para verificar si es un archivo válido (extensiones .js, .jsx, .ts, .tsx)
const isValidFile = (fileName) => {
  return /\.(js|jsx|ts|tsx)$/.test(fileName);
};

// Función para leer archivos, excluir líneas comentadas y concatenar contenido
const processFiles = (dir) => {
  let output = "";

  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // Si es una carpeta, procesar recursivamente
      output += processFiles(fullPath);
    } else if (stats.isFile() && isValidFile(file)) {
      // Leer archivo y eliminar líneas comentadas
      const fileContent = fs.readFileSync(fullPath, "utf-8");
      const cleanedContent = fileContent
        .split("\n")
        .filter(
          (line) =>
            !line.trim().startsWith("//") &&
            !line.trim().startsWith("/*") &&
            !line.trim().endsWith("*/")
        )
        .join("\n");

      // Agregar el contenido al output con separadores
      output += `Path: ${fullPath}\n\n${cleanedContent}\n\n/*****************/\n\n`;
    }
  });

  return output;
};

// Función para procesar los archivos raíz, incluyendo todos los que empiezan con .env
const processRootFiles = () => {
  let output = "";

  // Procesar archivos específicos de rootFiles
  rootFiles.forEach((relativePath) => {
    const fullPath = path.join(__dirname, relativePath);
    if (fs.existsSync(fullPath)) {
      const fileContent = fs.readFileSync(fullPath, "utf-8");
      output += `Path: ${fullPath}\n\n${fileContent}\n\n/*****************/\n\n`;
    }
  });

  // Buscar y procesar todos los archivos que empiecen con .env en rootDir
  const envFiles = fs
    .readdirSync(rootDir)
    .filter(
      (file) =>
        file.startsWith(".env") &&
        fs.statSync(path.join(rootDir, file)).isFile()
    );

  envFiles.forEach((envFile) => {
    const fullPath = path.join(rootDir, envFile);
    const fileContent = fs.readFileSync(fullPath, "utf-8");
    output += `Path: ${fullPath}\n\n${fileContent}\n\n/*****************/\n\n`;
  });

  return output;
};

// Procesar todos los archivos y escribir en output.txt
try {
  let finalOutput = processRootFiles();
  finalOutput += processFiles(sourceDir);
  fs.writeFileSync(outputFilePath, finalOutput.trim(), "utf-8");
  console.log(
    `Archivos procesados correctamente. Salida generada en: ${outputFilePath}`
  );
} catch (error) {
  console.error("Error procesando los archivos:", error);
}

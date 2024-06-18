import pdf from "pdf-parse";
import fs from "fs";

// Función para decodificar base64 y extraer texto del PDF
async function extractTextFromBase64Pdf(
  base64Pdf: string
): Promise<string | null> {
  // Decodificar el contenido base64
  try {
    // const pdfBuffer = Buffer.from(base64Pdf, "base64");
    // Extraer el texto del PDF usando pdf-parse
    const pdfBuffer = fs.readFileSync(
      "../../public/Apunte_Metodo_de_Estimacion_CEIS_UFRO.pdf"
    );
    const data = await pdf(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error("Error al extraer texto del PDF:", error);
    return null;
  }
}

export default extractTextFromBase64Pdf;

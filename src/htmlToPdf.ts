import { toPng } from "html-to-image";

export const dataUrlToFile = (dataUrl: string) => {
  const byteString = atob(dataUrl.split(",")[1]);
  const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeString });

  const file = new File([blob], "image.png", { type: blob.type });

  return file;
};

export const convert = async (file: File, fileName: string) => {
  /**
   * Convertapi-js
   * Add <script src="https://unpkg.com/convertapi-js@1.0.8/lib/convertapi.js"></script> in HTML head
   */

  // @ts-ignore
  let convertApi = ConvertApi.auth({ secret: "Your scret Here" });
  let params = convertApi.createParams();
  params.add("File", file);
  params.add("FileName", fileName);
  let result = await convertApi.convert("png", "pdf", params);
  return result;
};

export const convertHTMLToPDF = async (ref: HTMLElement, fileName: string) => {
  try {
    const imageElement = ref;

    const dataUrl = await toPng(imageElement);
    const parsedFile = dataUrlToFile(dataUrl);

    const res = await convert(parsedFile, fileName);
    const pdfFileURL = res?.dto?.Files[0]?.Url;

    const link = document.createElement("a");
    link.href = pdfFileURL;
    link.download = fileName;
    link.click();
  } catch (error) {
    console.error("Error converting image to PDF:", error);
  }
};

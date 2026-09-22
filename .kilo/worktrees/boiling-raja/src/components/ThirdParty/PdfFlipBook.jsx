import { useEffect, useRef } from "react";
const PdfFlipBook = ({ pdfPath = "/flipbook/sample.pdf", page = 1 }) => {
  const flipbookId = "my_flipbook";

  useEffect(() => {
    const loadScripts = async () => {
      const loadScript = (src) =>
        new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = src;
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });

      const loadStyle = (href) => {
        const link = document.createElement("link");
        link.href = href;
        link.rel = "stylesheet";
        document.head.appendChild(link);
      };

      loadStyle("/flipbook/assets/css/flipbook.css");

      await loadScript("/flipbook/assets/js/libs/jquery.min.js");
      await loadScript("/flipbook/assets/js/libs/pdf.min.js");
      await loadScript("/flipbook/assets/js/libs/pdf.worker.min.js");
      await loadScript("/flipbook/assets/js/libs/three.min.js");
      await loadScript("/flipbook/assets/js/flipbook.js");
      await loadScript("/flipbook/settings.js");
      await loadScript("/flipbook/toc.js");

      if (window.PDFFlipBook) {
        window.PDFFlipBook.init();
      }
    };

    loadScripts();
  }, []);

  return (
    <div >
      <div
        id={flipbookId}
        className="_pdfflip_book"
        source={pdfPath}
        data-page={page} 
      />
    </div>
  );
};

export default PdfFlipBook;

import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import HTMLFlipBook from "react-pageflip";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry"; // Ensure the worker is bundled
import "./MyBook.css";

// Reusable Page Component
const Page = React.forwardRef(({ pageNumber, canvasRef }, ref) => {
  return (
    <div className="demoPage" ref={ref}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "auto" }} />
      <p className="pageNumber">Page {pageNumber}</p>
    </div>
  );
});

Page.propTypes = {
  pageNumber: PropTypes.number.isRequired,
  canvasRef: PropTypes.object.isRequired,
};

// Main Book Component
const MyBook = ({ pdfUrl }) => {
  const [pages, setPages] = useState([]);
  const flipBookRef = useRef(null); // Reference to the flipbook container

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const numPages = pdf.numPages;

        const pageCanvases = [];
        for (let i = 1; i <= numPages; i++) {
          pageCanvases.push({ pageNumber: i, canvasRef: React.createRef() });
        }

        setPages(pageCanvases);

        // Render each page on its canvas
        pageCanvases.forEach(async (pageCanvas) => {
          const page = await pdf.getPage(pageCanvas.pageNumber);
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = pageCanvas.canvasRef.current;
          const context = canvas.getContext("2d");

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = {
            canvasContext: context,
            viewport,
          };

          await page.render(renderContext).promise;
        });
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPdf();
  }, [pdfUrl]);

  const handleFullscreen = () => {
    const flipBookElement = flipBookRef.current;
    if (flipBookElement) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        flipBookElement.requestFullscreen();
      }
    }
  };

  if (pages.length === 0) {
    return <p>Loading pages...</p>;
  }

  return (
    <div className="myBookContainer">
      <button className="fullscreenButton" onClick={handleFullscreen}>
        Toggle Fullscreen
      </button>
      <div ref={flipBookRef}>
        <HTMLFlipBook width={800} height={1000}>
          {pages.map((page, index) => (
            <Page
              key={index}
              pageNumber={page.pageNumber}
              canvasRef={page.canvasRef}
            />
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
};

MyBook.propTypes = {
  pdfUrl: PropTypes.string.isRequired,
};

export default MyBook;

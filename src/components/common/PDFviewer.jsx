import React, { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import styles from "./common_css/PdfViewerCSS.module.css";
import * as pdfjsLib from "pdfjs-dist/webpack";
import { Icon } from "@iconify/react";

const Page = React.forwardRef((props, ref) => (
  <div className={styles.page} ref={ref}>
    <img src={props.src} alt={`Page ${props.number}`} loading="lazy" />
  </div>
));

const PageFlipPDF = ({ pdfUrl }) => {
  const [pdfPages, setPdfPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const flipBookRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

    const loadPDF = async () => {
      try {
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const pages = [];
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2 }); // Adjust scale for better quality
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport }).promise;
          pages.push(canvas.toDataURL("image/png")); // Convert to PNG for better compatibility
        }
        setPdfPages(pages);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    loadPDF();
  }, [pdfUrl]);

  const handleFlip = (e) => {
    setCurrentPage(e.data);
  };

  const goToFirstPage = () => flipBookRef.current.pageFlip().flip(0);
  const goToLastPage = () =>
    flipBookRef.current.pageFlip().flip(pdfPages.length - 1);
  const goToPrevPage = () => flipBookRef.current.pageFlip().flipPrev();
  const goToNextPage = () => flipBookRef.current.pageFlip().flipNext();

  const zoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2));
  const zoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5));

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error("Error enabling fullscreen:", err);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error("Error exiting fullscreen:", err);
      });
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setIsFullscreen(true);
        containerRef.current.classList.add(styles.PageFlipPDFFullscreen);
      } else {
        window.location.reload(); return
        setIsFullscreen(false);
        containerRef.current.classList.remove(styles.PageFlipPDFFullscreen);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div className={styles.PageFlipPDF} ref={containerRef}>
      <div
        className={
          isFullscreen
            ? styles.PageFlipPDFFullscreen
            : styles.PageFlipPDFContainer
        }
      >
        {pdfPages.length > 0 ? (
          <HTMLFlipBook
            width={550}
            height={733}
            size="stretch"
            minWidth={315}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
            maxShadowOpacity={0.5}
            flippingTime={1500}
            flippingSpeed={1000}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={handleFlip}
            ref={flipBookRef}
            className={styles.flipBook}
          >
            {pdfPages.map((src, index) => (
              <Page key={index} number={index + 1} src={src} />
            ))}
          </HTMLFlipBook>
        ) : (
          <div className={styles.loading}>Loading PDF...</div>
        )}
      </div>

      <div className={styles.controls}>
        <button onClick={zoomIn}>
          <Icon icon="mdi:magnify-plus" />
        </button>
        <button onClick={zoomOut}>
          <Icon icon="mdi:magnify-minus" />
        </button>
        <button onClick={goToFirstPage}>
          <Icon icon="mdi:page-first" />
        </button>
        <button onClick={goToPrevPage}>
          <Icon icon="mdi:skip-backward" />
        </button>
        <span>
          {currentPage + 1}/{pdfPages.length}
        </span>
        <button onClick={goToNextPage}>
          <Icon icon="mdi:skip-forward" />
        </button>
        <button onClick={goToLastPage}>
          <Icon icon="mdi:page-last" />
        </button>
        <button onClick={toggleFullscreen}>
          <Icon
            icon={isFullscreen ? "mdi:fullscreen-exit" : "mdi:fullscreen"}
          />
        </button>
      </div>
    </div>
  );
};

export default PageFlipPDF;

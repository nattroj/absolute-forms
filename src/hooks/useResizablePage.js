import { useState, useEffect, useRef, useCallback } from 'react';

const useResizablePage = (background) => {
  const [page, setPage] = useState(null);
  const imgRef = useRef();

  const handleAspectRatio = useCallback(() => {
    const img = imgRef.current;
    const height = img.naturalHeight;
    const width = img.naturalWidth;
    const aspectRatio = height / width;
    if (background) {

      setPage({
        width: window.innerWidth < width ? window.innerWidth : width,
        height: window.innerWidth < width ? window.innerWidth * aspectRatio : width * aspectRatio
      })
    }
  }, [background])

  useEffect(() => {
    const handleResize = () => handleAspectRatio();
    window.addEventListener('resize', handleResize);

    handleAspectRatio();

    return () => window.removeEventListener('resize', handleResize);
  }, [background, handleAspectRatio])

return { page, imgRef };
}

export default useResizablePage;
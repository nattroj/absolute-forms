import { useEffect, useState } from 'react';

const useBackground = (file) => {
  const [background, setBackground] = useState(null);

  useEffect(() => {
    let reader;
    const handleFile = () => setBackground(reader.result);

    if (file) {
      reader = new FileReader();
      reader.addEventListener('load', handleFile);
      reader.readAsDataURL(file);
    }

    return () => {
      if (reader) reader.removeEventListener('load', handleFile);
    }
  }, [file]);

  return background;
}

export default useBackground;
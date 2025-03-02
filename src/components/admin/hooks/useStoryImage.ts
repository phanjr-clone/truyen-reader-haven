
import { useState } from 'react';

export function useStoryImage(initialUrl: string = '') {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>(initialUrl);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const preview = URL.createObjectURL(file);
      setCoverPreview(preview);
    }
  };

  return {
    coverFile,
    coverPreview,
    setCoverFile,
    setCoverPreview,
    handleImageChange,
  };
}

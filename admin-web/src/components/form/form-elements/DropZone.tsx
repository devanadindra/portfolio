import { useState, useEffect } from "react";
import ComponentCard from "../../common/ComponentCard";
import { useDropzone } from "react-dropzone";

interface DropzoneProps {
  onChange?: (files: File[]) => void;
}

const DropzoneComponent: React.FC<DropzoneProps> = ({ onChange }) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles];
    setFiles(newFiles);
  };

  // Kirim ke parent jika onChange tersedia
  useEffect(() => {
    if (onChange) onChange(files);
  }, [files, onChange]);

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/jpg": [],
    },
  });

  return (
    <ComponentCard title="Dropzone">
      <div
        {...getRootProps()}
        className={`dropzone transition border border-dashed cursor-pointer rounded-xl p-7 lg:p-10
        ${
          isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
        }`}
      >
        <input {...getInputProps()} />

        <div className="dz-message flex flex-col items-center">
          <h4 className="mb-3 font-semibold text-gray-800 dark:text-white/90">
            {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
          </h4>
          <span className="text-sm text-gray-700 dark:text-gray-400">
            Drag and drop your PNG, JPG, JPEG here or browse
          </span>
        </div>
      </div>

      {/* Preview & Remove */}
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-4 gap-4">
          {files.map((file, index) => {
            const url = URL.createObjectURL(file);
            return (
              <div key={index} className="relative border rounded p-1">
                <img
                  src={url}
                  alt={file.name}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ComponentCard>
  );
};

export default DropzoneComponent;

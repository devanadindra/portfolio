import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
    id: string;
    value: string;
    onChange: (content: string) => void;
    rows?: number;
    className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ id, value, onChange, rows, className }) => {
  const handleEditorChange = (content: string, _editor: any) => {
    onChange(content);
  };

  return (
    <div className={className}>
      <Editor
        id={id}
        apiKey="YOUR_TINYMCE_API_KEY" // Ganti dengan API Key TinyMCE Anda
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          height: rows ? rows * 40 : 200, // Menghitung tinggi berdasarkan rows
          menubar: false,
          // Plugin yang harus diaktifkan untuk TABLE
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount' // Pastikan 'table' ada
          ],
          // Toolbar untuk menampilkan tombol TABLE
          toolbar:
            'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | table', // Pastikan 'table' ada
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
    </div>
  );
};

export default RichTextEditor;
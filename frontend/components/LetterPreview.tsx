'use client';

import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface LetterPreviewProps {
  letterHTML: string;
  formData: FormData;
}

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  companyName: string;
  motivation?: string;
  skills?: string;
}

export default function LetterPreview({ letterHTML, formData }: LetterPreviewProps) {
  const handleDownloadPDF = async () => {
    const input = document.createElement('div');
    input.innerHTML = letterHTML;
    document.body.appendChild(input);

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${formData.fullName}_Lamaran_${formData.companyName}.pdf`);

    document.body.removeChild(input);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Preview Surat Lamaran</h2>
      <div
        className="mb-4 p-4 border border-gray-300 rounded"
        dangerouslySetInnerHTML={{ __html: letterHTML }}
      />
      <button
        onClick={handleDownloadPDF}
        className="w-full bg-green-500 text-white p-2 rounded"
      >
        Download PDF
      </button>
    </div>
  );
}
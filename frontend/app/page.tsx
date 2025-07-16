'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import type { FormData } from "@/components/ApplicationForm";
import LetterPreview from '@/components/LetterPreview';

interface GenerateLetterResponse {
  success: boolean;
  letterHTML?: string;
  error?: string;
}

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [letterHTML, setLetterHTML] = useState<string>('');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [error, setError] = useState<string>('');

  const handleFormSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post<GenerateLetterResponse>(
        '/api/generate-letter',
        data,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success && response.data.letterHTML) {
        setLetterHTML(response.data.letterHTML);
        setFormData(data);
      } else {
        setError(response.data.error || 'Terjadi kesalahan saat membuat surat');
      }
    } catch (err) {
      console.error('Error generating letter:', err);
      const axiosError = err as AxiosError<{ error?: string }>;
      setError(
        axiosError.response?.data?.error ||
          'Gagal terhubung ke server. Pastikan backend sudah berjalan.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Application Letter Generator
          </h1>
          <p className="text-lg text-gray-600">
            Buat surat lamaran kerja profesional dengan cepat dan mudah
          </p>
        </header>

        {error && (
          <div className="max-w-4xl mx-auto mb-8" role="alert" aria-live="assertive">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <ApplicationForm onSubmit={handleFormSubmit} loading={loading} />
            </div>
            <div>
              {letterHTML && formData ? (
                <LetterPreview letterHTML={letterHTML} formData={formData} />
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Preview Surat Lamaran
                  </h2>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center"
                    aria-label="Placeholder for letter preview"
                  >
                    <div className="text-gray-400">
                      <svg
                        className="mx-auto h-12 w-12 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-lg font-medium text-gray-500 mb-2">
                        Surat lamaran akan muncul di sini
                      </p>
                      <p className="text-sm text-gray-400">
                        Isi form di sebelah kiri dan klik "Generate Surat Lamaran"
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-600">
          <p>© 2025 Application Letter Generator. Built with Next.js & Express.js</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
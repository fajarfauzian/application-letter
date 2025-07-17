'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import ApplicationForm, { FormData } from '@/components/ApplicationForm'; 
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Application Letter Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Buat surat lamaran kerja profesional dengan cepat dan mudah menggunakan teknologi modern
          </p>
        </header>

        {error && (
          <div className="max-w-4xl mx-auto mb-8" role="alert" aria-live="assertive">
            <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-r-lg shadow-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <strong className="font-semibold">Error: </strong>
                  <span>{error}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ApplicationForm onSubmit={handleFormSubmit} loading={loading} />
            </div>
            <div className="space-y-6">
              {letterHTML && formData ? (
                <LetterPreview letterHTML={letterHTML} formData={formData} />
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Preview Surat Lamaran
                    </h2>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-xl p-16 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200"
                      aria-label="Placeholder for letter preview"
                    >
                      <div className="text-gray-400">
                        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
                          <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                          Surat lamaran akan muncul di sini
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm mx-auto">
                          Isi form di sebelah kiri dan klik "Generate Surat Lamaran" untuk melihat hasil
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-20 text-center">
          <div className="inline-block bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">
              © 2025 Application Letter Generator. Built with 
              <span className="font-semibold text-blue-600"> Next.js</span> & 
              <span className="font-semibold text-green-600"> Express.js</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
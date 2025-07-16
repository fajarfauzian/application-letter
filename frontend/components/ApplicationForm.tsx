'use client';

import React from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  companyName: string;
  motivation?: string;
  skills?: string;
}

interface ApplicationFormProps {
  onSubmit: (data: FormData) => void;
  loading: boolean;
}

export default function ApplicationForm({ onSubmit, loading }: ApplicationFormProps) {
  const methods = useForm<FormData>();
  const { register, handleSubmit } = methods;

  const onFormSubmit: SubmitHandler<FormData> = (data) => {
    onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Formulir Lamaran</h2>
        <div className="mb-4">
          <label className="block mb-1">Nama Lengkap *</label>
          <input {...register('fullName', { required: true })} className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email *</label>
          <input {...register('email', { required: true })} type="email" className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">No. HP *</label>
          <input {...register('phoneNumber', { required: true })} className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Posisi yang Dilamar *</label>
          <input {...register('position', { required: true })} className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Nama Perusahaan *</label>
          <input {...register('companyName', { required: true })} className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Motivasi</label>
          <textarea {...register('motivation')} className="w-full p-2 border rounded" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Keahlian (pisahkan dengan koma)</label>
          <input {...register('skills')} className="w-full p-2 border rounded" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-400">
          {loading ? 'Memproses...' : 'Generate Surat Lamaran'}
        </button>
      </form>
    </FormProvider>
  );
}
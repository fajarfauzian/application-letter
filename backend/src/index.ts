import express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sanitizeHtml from 'sanitize-html';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  companyName: string;
  motivation?: string;
  skills?: string;
}

interface GenerateLetterResponse {
  success: boolean;
  letterHTML?: string;
  data?: FormData;
  error?: string;
}

const app = express();
const PORT = 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(bodyParser.json());

function generateApplicationLetter(data: FormData): string {
  const { fullName, email, phoneNumber, position, companyName, motivation, skills } = data;

  const currentDate = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const motivationParagraph = motivation
    ? `<p style="margin-bottom: 16px; line-height: 1.6;">${sanitizeHtml(motivation)}</p>`
    : '';

  const skillsList = skills
    ? skills.split(',').map((skill) => `<li>${sanitizeHtml(skill.trim())}</li>`).join('')
    : '';

  return `
    <div style="max-width: 800px; margin: 0 auto; padding: 40px; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="text-align: right; margin-bottom: 40px;"><p style="margin: 0;">${currentDate}</p></div>
      <div style="margin-bottom: 30px;"><p style="margin: 0; font-weight: bold;">Kepada Yth,</p><p style="margin: 0;">HRD Manager</p><p style="margin: 0;">${companyName}</p></div>
      <div style="margin-bottom: 30px;"><p style="margin: 0; font-weight: bold;">Hal: Lamaran Kerja - ${position}</p></div>
      <div style="margin-bottom: 20px;"><p style="margin: 0;">Dengan hormat,</p></div>
      <div style="margin-bottom: 20px;"><p style="margin-bottom: 16px; line-height: 1.6;">Saya yang bertanda tangan di bawah ini:</p><div style="margin-left: 20px; margin-bottom: 16px;"><p style="margin: 4px 0;"><strong>Nama:</strong> ${fullName}</p><p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p><p style="margin: 4px 0;"><strong>No. HP:</strong> ${phoneNumber}</p></div></div>
      <div style="margin-bottom: 20px;"><p style="margin-bottom: 16px; line-height: 1.6;">Dengan ini mengajukan lamaran kerja untuk posisi <strong>${position}</strong> di perusahaan yang Bapak/Ibu pimpin.</p>${motivationParagraph}${skillsList ? `<p style="margin-bottom: 8px; line-height: 1.6;">Berikut adalah kualifikasi dan keahlian yang saya miliki:</p><ul style="margin-left: 20px; margin-bottom: 16px;">${skillsList}</ul>` : ''}</div>
      <div style="margin-bottom: 20px;"><p style="margin-bottom: 16px; line-height: 1.6;">Saya siap untuk mengikuti tahap seleksi dan proses wawancara yang akan dilaksanakan. Besar harapan saya untuk dapat bergabung dengan tim ${companyName} dan berkontribusi dalam mencapai tujuan perusahaan.</p></div>
      <div style="margin-bottom: 20px;"><p style="margin-bottom: 16px; line-height: 1.6;">Demikian surat lamaran ini saya buat dengan sebenar-benarnya. Atas perhatian dan kesempatan yang diberikan, saya ucapkan terima kasih.</p></div>
      <div style="margin-top: 40px;"><p style="margin: 0;">Hormat saya,</p><br /><br /><br /><p style="margin: 0; font-weight: bold;">${fullName}</p></div>
    </div>
  `;
}

app.post('/api/generate-letter', (req: Request<Record<string, never>, GenerateLetterResponse, FormData, Record<string, never>>, res: Response<GenerateLetterResponse>) => {
  try {
    const { fullName, email, phoneNumber, position, companyName } = req.body;

    if (!fullName || !email || !phoneNumber || !position || !companyName) {
      return res.status(400).json({ success: false, error: 'Mohon lengkapi semua field yang wajib diisi' });
    }

    const letterHTML = generateApplicationLetter(req.body);

    res.json({ success: true, letterHTML, data: req.body });
  } catch (error) {
    console.error('Error generating letter:', error);
    res.status(500).json({ success: false, error: 'Terjadi kesalahan saat membuat surat' });
  }
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
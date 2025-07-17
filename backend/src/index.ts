import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sanitizeHtml from "sanitize-html";

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  position: string;
  companyName: string;
  motivation?: string;
  skills?: string;
  address?: string;
  education?: string;
  major?: string;
  internshipCompany?: string;
  projectExperience?: string;
}

interface GenerateLetterResponse {
  success: boolean;
  letterHTML?: string;
  data?: FormData;
  error?: string;
}

const app = express();
const PORT = 5000;

app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());

function generateApplicationLetter(data: FormData): string {
  const {
    fullName,
    email,
    phoneNumber,
    position,
    companyName,
    motivation,
    skills,
    address,
    education,
    major,
    internshipCompany,
    projectExperience,
  } = data;

  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const senderAddress = address
    ? `<p style="margin: 0 0 5px 0; font-size: 14px; color: #333;">${sanitizeHtml(address)}</p>`
    : "";
  
  const motivationParagraph = motivation
    ? `<p style="margin-bottom: 16px; line-height: 1.6; text-align: justify; font-size: 14px;">${sanitizeHtml(motivation)}</p>`
    : "";
  
  // Generate qualification paragraph
  let qualificationText = "Saya merupakan lulusan";
  if (education) {
    qualificationText += ` ${sanitizeHtml(education)}`;
  } else {
    qualificationText += " SMK Wikrama Bogor";
  }
  
  if (major) {
    qualificationText += ` dengan jurusan ${sanitizeHtml(major)}`;
  } else {
    qualificationText += " dengan jurusan Pengembangan Perangkat Lunak dan Gim";
  }
  
  qualificationText += ". Selama masa studi";
  
  if (internshipCompany) {
    qualificationText += ` dan praktik kerja lapangan di ${sanitizeHtml(internshipCompany)}`;
  } else {
    qualificationText += " dan praktik kerja lapangan";
  }
  
  if (projectExperience) {
    qualificationText += `, saya telah ${sanitizeHtml(projectExperience)}`;
  } else {
    qualificationText += ", saya telah mengembangkan beberapa proyek berbasis web menggunakan React.js dan Next.js, serta terbiasa menggunakan GitLab sebagai alat kolaborasi dalam tim pengembangan";
  }
  
  qualificationText += ". Saya juga memiliki semangat belajar yang tinggi dan mampu beradaptasi dengan cepat terhadap teknologi baru.";

  const skillsList = skills
    ? skills
        .split(",")
        .map((skill) => `<li style="margin-bottom: 4px;">${sanitizeHtml(skill.trim())}</li>`)
        .join("")
    : "";

  return `
    <div style="max-width: 210mm; margin: 0; padding: 20mm; font-family: Arial, sans-serif; line-height: 1.6; color: #333; background: white; min-height: 297mm;">
      <!-- Garis Hijau di Atas -->
      <div style="border-top: 3px solid #4CAF50; margin-bottom: 20px;"></div>

      <!-- Informasi Pengirim -->
      <div style="margin-bottom: 30px;">
        <p style="margin: 0 0 5px 0; font-weight: bold; font-size: 14px;">${fullName}</p>
        ${senderAddress}
        <p style="margin: 0 0 5px 0; font-size: 14px;">${phoneNumber}</p>
        <p style="margin: 0 0 20px 0; font-size: 14px;">${email}</p>
      </div>

      <!-- Tanggal -->
      <div style="margin-bottom: 40px;">
        <p style="margin: 0; font-size: 14px;">${currentDate}</p>
      </div>

      <!-- Penerima -->
      <div style="margin-bottom: 30px;">
        <p style="margin: 0 0 5px 0; font-size: 14px;">Tim Rekrutmen</p>
        <p style="margin: 0 0 5px 0; font-size: 14px;">${companyName}</p>
        <p style="margin: 0; font-size: 14px;">Jakarta, Indonesia</p>
      </div>

      <!-- Salam -->
      <div style="margin-bottom: 20px;">
        <p style="margin: 0; font-size: 14px;">Yth. Tim Rekrutmen ${companyName},</p>
      </div>

      <!-- Isi Surat -->
      <div style="margin-bottom: 20px;">
        <p style="margin-bottom: 16px; line-height: 1.6; text-align: justify; font-size: 14px;">Dengan hormat,</p>
        <p style="margin-bottom: 16px; line-height: 1.6; text-align: justify; font-size: 14px;">Nama saya ${fullName}. Melalui surat ini, saya ingin menyampaikan minat saya untuk melamar posisi ${position} di perusahaan Bapak/Ibu.</p>
        
        <p style="margin-bottom: 16px; line-height: 1.6; text-align: justify; font-size: 14px;">${qualificationText}</p>
        
        ${motivationParagraph}
        ${
          skillsList
            ? `<p style="margin-bottom: 8px; line-height: 1.6; text-align: justify; font-size: 14px;">Berikut adalah kualifikasi dan keahlian yang saya miliki:</p><ul style="margin-left: 20px; margin-bottom: 16px; font-size: 14px;">${skillsList}</ul>`
            : ""
        }
      </div>

      <div style="margin-bottom: 20px;">
        <p style="margin-bottom: 16px; line-height: 1.6; text-align: justify; font-size: 14px;">Saya percaya bahwa latar belakang dan keterampilan yang saya miliki dapat menjadi kontribusi yang positif bagi tim di ${companyName}. Bersama surat ini, saya lampirkan CV untuk bahan pertimbangan lebih lanjut.</p>
      </div>

      <div style="margin-bottom: 40px;">
        <p style="margin-bottom: 16px; line-height: 1.6; text-align: justify; font-size: 14px;">Saya sangat menghargai kesempatan untuk dapat berdiskusi lebih jauh mengenai potensi kontribusi saya di perusahaan Bapak/Ibu.</p>
      </div>

      <!-- Penutup -->
      <div style="margin-top: 40px;">
        <p style="margin: 0 0 60px 0; font-size: 14px;">Hormat saya,</p>
        <p style="margin: 0; font-weight: bold; font-size: 14px;">${fullName}</p>
      </div>
    </div>
  `;
}

app.post(
  "/api/generate-letter",
  (
    req: Request<
      Record<string, never>,
      GenerateLetterResponse,
      FormData,
      Record<string, never>
    >,
    res: Response<GenerateLetterResponse>
  ) => {
    try {
      const { fullName, email, phoneNumber, position, companyName } = req.body;

      if (!fullName || !email || !phoneNumber || !position || !companyName) {
        return res.status(400).json({
          success: false,
          error: "Mohon lengkapi semua field yang wajib diisi",
        });
      }

      const letterHTML = generateApplicationLetter(req.body);

      res.json({ success: true, letterHTML, data: req.body });
    } catch (error) {
      console.error("Error generating letter:", error);
      res.status(500).json({
        success: false,
        error: "Terjadi kesalahan saat membuat surat",
      });
    }
  }
);

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
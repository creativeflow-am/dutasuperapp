import { GoogleGenerativeAI } from "@google/generative-ai";

// Kunci langsung kita tempel di sini
const genAI = new GoogleGenerativeAI("AIzaSyDch4Oic47TOPl_PqRmSyog3o2LFyGOQ_Y");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const optimizeCaption = async (title: string, currentCaption: string, platform: string) => {
  try {
    const prompt = `Bertindaklah sebagai Copywriter Profesional Media Sosial. 
      Judul Konten: ${title}
      Platform: ${platform}
      Draft Caption Saat Ini: ${currentCaption}
      Tolong optimalkan caption ini agar lebih menarik (hook yang kuat), berikan 3 opsi variasi (Lucu, Profesional, To-the-point) lengkap dengan hashtag yang relevan.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Gagal mengoptimasi caption.";
  }
};

export const generateDraft = async (title: string, platform: string) => {
  try {
    const prompt = `Bertindaklah sebagai Digital Content Strategist. Buatlah 1 draft caption media sosial untuk:
      Judul/Topik: ${title}
      Platform: ${platform}
      Berikan hook, isi ringkas, CTA, dan 3-5 hashtag.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini Generate Error:", error);
    return "Gagal membuat draf otomatis.";
  }
};
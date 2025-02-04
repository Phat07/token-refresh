import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async askGemini(question: string, data: any): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `
      Bạn là một trợ lý AI thông minh. Hãy trả lời câu hỏi dựa trên dữ liệu sau.
      - Trả lời một cách tự nhiên, giống con người.
      - Không sử dụng định dạng **bold**, _italic_, hoặc bất kỳ ký tự đặc biệt nào.
      - Nếu không có dữ liệu, hãy thông báo rõ ràng.

      --- Dữ liệu ---
      ${JSON.stringify(data)}

      --- Câu hỏi ---
      ${question}

      Hãy trả lời một cách thân thiện và dễ hiểu, chỉ sử dụng văn bản thuần túy.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text().trim();

      // Xóa các ký tự ** hoặc _ để tránh định dạng Markdown
      text = text.replace(/\*\*(.*?)\*\*/g, '$1'); // Xóa **bold**
      text = text.replace(/_(.*?)_/g, '$1'); // Xóa _italic_

      return text;
    } catch (error) {
      console.error('Lỗi khi gọi Gemini API:', error);
      return 'Xin lỗi, tôi không thể xử lý yêu cầu ngay bây giờ.';
    }
  }
}

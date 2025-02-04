import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class NLPService {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async generateSQL(question: string): Promise<string> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `
        Bạn là một trợ lý chuyên về SQL.
        Dựa vào câu hỏi sau, hãy tạo một truy vấn SQL phù hợp với MySQL để lấy dữ liệu từ database:
        Câu hỏi: "${question}"
        Lưu ý:
        - Chỉ trả về câu SQL, không cần giải thích.
        - Các bảng có sẵn: users, salon, voucher, employee, customers, owners, services.
        - Đảm bảo truy vấn hợp lệ với MySQL.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const query = response.text().trim();

      // Clean the query to remove markdown formatting
      const cleanQuery = query
        .replace(/```sql/g, '')
        .replace(/```/g, '')
        .trim();

      return cleanQuery;
    } catch (error) {
      console.error('Lỗi khi tạo truy vấn SQL:', error);
      return '';
    }
  }
}

# Sử dụng Node.js image chính thức làm image nền
FROM node:21

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependency
RUN npm install

# Sao chép toàn bộ mã nguồn của dự án vào container
COPY . .

# Biên dịch mã NestJS
RUN npm run build

# Lắng nghe trên cổng 3000
EXPOSE 3000

# Khởi chạy ứng dụng NestJS
CMD ["npm", "run", "start:dev"]

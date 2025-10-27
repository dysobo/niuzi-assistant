FROM node:20-alpine

WORKDIR /app

# 复制package文件并安装依赖
COPY package*.json ./
RUN npm install

# 复制源代码
COPY . .

# 编译TypeScript
RUN npm run build

# 验证dist目录是否存在
RUN ls -la dist/ || (echo "Build failed - dist directory not found" && exit 1)

EXPOSE 3001

CMD ["node", "dist/index.js"]

# ==========================================
# Stage 1: Install Dependencies & Build
# ==========================================
FROM oven/bun:1 AS builder
WORKDIR /app

# ก๊อปปี้ไฟล์ package.json และ lock file มาก่อน (เพื่อใช้ Cache ของ Docker)
COPY package.json bun.lock ./

# ติดตั้ง dependencies (รวม devDependencies เพื่อใช้ build)
RUN bun install --frozen-lockfile

# ก๊อปปี้ Source code ทั้งหมด
COPY . .

# สั่ง Build (จะได้ไฟล์ dist/main.js ออกมา)
RUN bun run build

# ==========================================
# Stage 2: Production Runner
# ==========================================
# ใช้ Image เปล่าๆ ของ Bun เพื่อมารันไฟล์ที่เรา build แล้ว
FROM oven/bun:1 AS runner
WORKDIR /app

# ก๊อปปี้เฉพาะไฟล์ที่ Build เสร็จแล้วมาจาก Stage 1 (ไม่เอา Source Code)
COPY --from=builder /app/dist ./dist

# กำหนดตัวแปร Environment
ENV NODE_ENV=production
ENV PORT=3000

# เปิด Port 3000
EXPOSE 3000

# สั่งรันไฟล์ JS ที่ได้จากการ Build
CMD ["bun", "dist/main.js"]
import { PrismaClient } from "@prisma/client";

// ✅ PrismaClient를 전역 변수로 선언하여 재사용
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
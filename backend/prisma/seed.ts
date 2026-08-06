import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
async function main() {
  const passwordHash = await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!', 12);
  const superadmin = await prisma.user.upsert({ where: { email: process.env.SEED_ADMIN_EMAIL ?? 'superadmin@kidslearn.local' }, update: {}, create: { name: 'KidsLearn Superadmin', email: process.env.SEED_ADMIN_EMAIL ?? 'superadmin@kidslearn.local', passwordHash, role: Role.SUPERADMIN } });
  await prisma.activity.createMany({ data: [
    { title: 'Rangni top', description: 'To‘g‘ri rangni tanlang.', type: 'TEST', subject: 'Ranglar', ageMin: 1, ageMax: 4, content: { options: ['Qizil', 'Ko‘k', 'Sariq'] }, published: true },
    { title: 'Hayvonni top', description: 'Hayvonlarni tanib oling.', type: 'GAME', subject: 'Hayvonlar', ageMin: 1, ageMax: 5, content: { options: ['Mushuk', 'It', 'Sigir'] }, published: true },
    { title: 'Puzzle', description: 'Rasm bo‘laklarini joyiga qo‘ying.', type: 'PUZZLE', subject: 'Mantiq', ageMin: 3, ageMax: 7, content: { pieces: 4 }, published: true },
  ] });
  console.log(`Seeded ${superadmin.email}`);
}
main().finally(() => prisma.$disconnect());

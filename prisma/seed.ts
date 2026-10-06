import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding data BEM...');

  // 1. Buat Akun Admin Utama
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { nim: 'admin' },
    update: {},
    create: {
      nim: 'admin',
      name: 'Ketua BEM',
      password: hashedAdminPassword,
      role: 'ADMIN',
      isSuperAdmin: true,
      isDefaultPassword: false,
    },
  });
  console.log('✅ Admin user seeded:', admin.nim);

  // 2. Buat beberapa pengguna mahasiswa dummy
  const usersData = [
    { nim: '71230001', name: 'Andi Setiawan' },
    { nim: '71230002', name: 'Budi Raharjo' },
    { nim: '71230003', name: 'Citra Kirana' },
    { nim: '71230004', name: 'Dewi Lestari' },
    { nim: '71230005', name: 'Eko Patrio' },
  ];

  const createdUsers = [];
  
  for (const u of usersData) {
    const hashedPassword = await bcrypt.hash(u.nim, 10);
    const user = await prisma.user.upsert({
      where: { nim: u.nim },
      update: {},
      create: {
        nim: u.nim,
        name: u.name,
        password: hashedPassword,
        role: 'MAHASISWA',
        isDefaultPassword: true,
      },
    });
    createdUsers.push(user);
    console.log(`👤 Upserted user: ${user.name} (${user.nim})`);
  }

  // 3. Buat beberapa kegiatan BEM
  const now = new Date();
  
  const eventsData = [
    {
      code: 'LDK-2026',
      name: 'Latihan Dasar Kepemimpinan 2026',
      description: 'Acara wajib untuk seluruh calon pengurus BEM dan mahasiswa baru yang ingin melatih jiwa kepemimpinan.',
      location: 'Gedung Serbaguna Kampus',
      posterUrl: 'https://via.placeholder.com/800x400?text=Poster+LDK',
      startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 hari dari sekarang
      endDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
      capacity: 100,
      status: 'OPEN',
    },
    {
      code: 'SEMINAR-IT',
      name: 'Seminar Nasional Teknologi 2026',
      description: 'Membahas perkembangan AI dan dampaknya terhadap dunia industri dan pendidikan.',
      location: 'Auditorium Utama',
      posterUrl: 'https://via.placeholder.com/800x400?text=Poster+Seminar',
      startDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 hari dari sekarang
      endDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // + 4 jam
      capacity: 200,
      status: 'OPEN',
    },
    {
      code: 'BAKSOS-26',
      name: 'Bakti Sosial BEM 2026',
      description: 'Kegiatan amal dan pembagian sembako ke desa binaan kampus.',
      location: 'Desa Suka Maju',
      posterUrl: 'https://via.placeholder.com/800x400?text=Poster+Baksos',
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 hari lalu (Sudah lewat)
      endDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      capacity: 50,
      status: 'COMPLETED',
    }
  ];

  const createdEvents = [];

  for (const e of eventsData) {
    const event = await prisma.event.upsert({
      where: { code: e.code },
      update: {
        location: e.location,
        posterUrl: e.posterUrl,
      },
      create: e,
    });
    createdEvents.push(event);
    console.log(`📅 Upserted event: ${event.name} (${event.code})`);
  }

  // 4. Buatkan data pendaftar (Registration)
  console.log('📝 Menghubungkan mahasiswa ke acara...');
  
  // Andi mendaftar ke semua acara
  for (const event of createdEvents) {
    await prisma.registration.upsert({
      where: { userId_eventId: { userId: createdUsers[0].id, eventId: event.id } },
      update: {},
      create: { userId: createdUsers[0].id, eventId: event.id, status: 'CONFIRMED' },
    });
  }

  // Budi & Citra mendaftar LDK
  await prisma.registration.upsert({
    where: { userId_eventId: { userId: createdUsers[1].id, eventId: createdEvents[0].id } },
    update: {},
    create: { userId: createdUsers[1].id, eventId: createdEvents[0].id, status: 'PENDING' },
  });
  
  await prisma.registration.upsert({
    where: { userId_eventId: { userId: createdUsers[2].id, eventId: createdEvents[0].id } },
    update: {},
    create: { userId: createdUsers[2].id, eventId: createdEvents[0].id, status: 'CONFIRMED' },
  });

  // Dewi mendaftar Seminar
  await prisma.registration.upsert({
    where: { userId_eventId: { userId: createdUsers[3].id, eventId: createdEvents[1].id } },
    update: {},
    create: { userId: createdUsers[3].id, eventId: createdEvents[1].id, status: 'PENDING' },
  });

  console.log('✅ Seeding berhasil diselesaikan!');
}

main()
  .catch((e) => {
    console.error('❌ Gagal melakukan seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

Loyiha nomi
KidsLearn – 1–7 yoshdagi bolalar uchun interaktiv ta'lim platformasi
Loyiha maqsadi
1–7 yoshdagi bolalar uchun zamonaviy onlayn ta'lim platformasi ishlab chiqing. Platforma bolalarga o'yin orqali ranglar, harflar, raqamlar, shakllar, hayvonlar, mevalar va boshqa boshlang'ich bilimlarni o'rgatishi kerak.
Platformadan ota-onalar farzandining rivojlanishini kuzata olishi, administrator esa barcha kontentni boshqarishi kerak.

Texnologiyalar
Nomzod quyidagi texnologiyalardan foydalanishi tavsiya etiladi:
Frontend: React yoki Next.js
Backend: Node.js (Express yoki NestJS)
Database: PostgreSQL
ORM: Prisma
Authentication: JWT
Docker
Git
Boshqa zamonaviy texnologiyalardan foydalanish ham mumkin.

Rollar
Platformada quyidagi foydalanuvchi rollari bo'lishi kerak:
1. Administrator
Platformani to'liq boshqaradi.
2. Ota-ona
Farzandlarini qo'shadi va ularning rivojlanishini kuzatadi.
3. Bola
Faqat o'ziga tegishli o'yin va darslardan foydalanadi.

Authentication
Quyidagi imkoniyatlar bo'lishi kerak:
Login
Logout
JWT Authentication
Role Based Access Control

Ota-ona kabineti
Ota-ona quyidagi imkoniyatlarga ega bo'lishi kerak:
Profil yaratish
Ism
Telefon
Email
Parol
Bir ota-ona bir nechta bola qo'sha olishi kerak.
Har bir bola uchun:
Ism
Tug'ilgan sana
Yosh
Avatar

Bola profili
Har bir bola uchun yosh avtomatik aniqlanadi.
Yoshga qarab darslar chiqarilishi kerak.
Masalan:
1–2 yosh
Ranglar
Hayvonlar
Mevalar
3–4 yosh
Harflar
Raqamlar
Shakllar
5–7 yosh
Ingliz alifbosi
Sodda matematika
Mantiqiy o'yinlar

Darslar
Administrator dars qo'sha olishi kerak.
Har bir darsda:
Nomi
Tavsif
Yosh kategoriyasi
Muqova rasmi
Video
Audio
Rasmlar

O'yinlar
Kamida quyidagi o'yinlar bo'lishi kerak:
Rangni top
Bolaga rang nomi chiqadi.
To'g'ri rangni tanlashi kerak.

Hayvonni top
Hayvon ovozi eshitiladi.
Bola to'g'ri hayvonni tanlaydi.

Harfni top
Harf ko'rsatiladi.
Mos harfni tanlaydi.

Raqamni top
Ekranda son chiqadi.
Bola shu sonni tanlaydi.

Puzzle
Rasm bo'laklarga bo'linadi.
Bola ularni joyiga qo'yadi.

Memory Game
Kartochkalarni ochib juftini topadi.

Progress
Har bir bola uchun quyidagilar saqlanishi kerak:
O'ynagan o'yinlar soni
Tugatilgan darslar
Toplangan ball
Yulduzchalar
Oxirgi faollik
Ketma-ket faol kunlar (Streak)

Mukofot tizimi
Topshiriqlar bajarilganda:
Bronze Medal
Silver Medal
Gold Medal
Diamond Medal
Berilishi kerak.

Ota-ona statistikasi
Dashboardda:
Bugungi mashg'ulotlar
Haftalik natija
Oylik natija
Eng yaxshi fanlar
Qiyin mavzular
Grafik ko'rinishida chiqishi kerak.

Administrator paneli
Administrator quyidagilarni boshqara olishi kerak:
Foydalanuvchilar
Ota-onalar
Bolalar
Darslar
O'yinlar
Rasmlar
Videolar
Audio fayllar
Statistikalar

Search
Quyidagi qidiruvlar bo'lishi kerak:
Bola ismi
Ota-ona ismi
Yosh
Dars nomi

Filter
Filterlar:
Yosh
Fan
Sana
Faollik

Bildirishnomalar
Ota-onaga:
Bola bugun dars qilmagan.
Yangi dars qo'shildi.
Bola mukofot oldi.

API
REST API yozilishi kerak.
Swagger dokumentatsiyasi bo'lishi kerak.

Qo'shimcha talablar
Responsive dizayn
Dark/Light Mode
Pagination
Search
Validation
Error Handling
Loading holatlari
Clean Architecture
Docker Compose
README fayli
GitHub repository

Bonus
Quyidagi imkoniyatlar bonus hisoblanadi:
PWA
Push Notification
AI tavsiyalar
O'zbek, Ingliz va Rus tillari
Ovoz bilan boshqarish
Leaderboard
PDF sertifikat yaratish

Topshirish tartibi
Nomzod quyidagilarni taqdim etishi kerak:
GitHub repository.
README 
Vercel link agar toliq ishlasa domen qoyiladi
Eslatma
Loyiha ishlab chiqarish darajasida (production-ready) yozilishi kerak. Kod toza, modul ko'rinishida tashkil etilgan, xavfsizlik talablari (JWT, validatsiya, role-based access) bajarilgan bo'lishi va foydalanuvchi uchun qulay interfeysga ega bo'lishi talab etiladi.
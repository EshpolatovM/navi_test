import type { Option, QuizQuestion, Riaset } from './types'
import { STAGES, PER_STAGE } from './stages'

// Weight vectors in RIASEC order: [R, I, A, S, E, C]
// Primary dimension = 2, optional secondary = 1.
const R: Riaset = [2, 0, 0, 0, 0, 0]
const I: Riaset = [0, 2, 0, 0, 0, 0]
const A: Riaset = [0, 0, 2, 0, 0, 0]
const S: Riaset = [0, 0, 0, 2, 0, 0]
const E: Riaset = [0, 0, 0, 0, 2, 0]
const C: Riaset = [0, 0, 0, 0, 0, 2]

const o = (text: string, w: Riaset): Option => ({ text, w })

// Each raw question holds 6 short options in R,I,A,S,E,C order (O*NET-flavored
// signals derived from Interest / Work Activities / Work Styles / Work Context
// concepts — reworded so no occupation is named). The export keeps a designed
// subset per question (4, 5 or 6) and rotates the order per question.
interface RawQuestion {
  id: number
  q: string
  opts: Option[]
}

const RAW: RawQuestion[] = [
  // ── ETAP 1 · QIZIQISHLAR (1–15) ─────────────────────────────────────────
  {
    id: 1,
    q: 'Ochiq havoda ishlash yoqadimi?',
    opts: [
      o('Ekin va bog\u2018 parvarishi', R),
      o('Tabiat qonuniyatlarini o\u2018rganish', I),
      o('Manzaralarni tasvirlab berish', A),
      o('Guruhda sayohat qilish', S),
      o('Bog\u2018 mahsulotlarini sotish', E),
      o('Ekin hisobotini tuzish', C),
    ],
  },
  {
    id: 2,
    q: 'Yangi narsa o\u2018rganish yoqadimi?',
    opts: [
      o('Asbob-uskunani ishlatish', R),
      o('Ilmiy faktlarni o\u2018rganish', I),
      o('Ijodiy g\u2018oya yaratish', A),
      o('Do\u2018stlarga tushuntirib berish', S),
      o('Yangi imkoniyat kashf etish', E),
      o('Aniq qoidalarni o\u2018zlashtirish', C),
    ],
  },
  {
    id: 3,
    q: 'Bo\u2018sh vaqtingizda nima qilasiz?',
    opts: [
      o('Narsalarni ta\u2018mirlayman', R),
      o('Tajriba o\u2018tkazaman', I),
      o('Chizaman yoki yozaman', A),
      o('Odamlarga yordam beraman', S),
      o('Loyiha rejalashtiraman', E),
      o('Hisob-kitob yuritaman', C),
    ],
  },
  {
    id: 4,
    q: 'Qaysi mashg\u2018ulot zavq bag\u2018ishlaydi?',
    opts: [
      o('Jismoniy mehnat', R),
      o('Mantiqiy boshqotirma', I),
      o('Ijodiy ishlar', A),
      o('Do\u2018stona muloqot', S),
      o('Musobaqa va g\u2018alaba', E),
      o('Aniq tartib', C),
    ],
  },
  {
    id: 5,
    q: 'Qaysi mavzu sizni qiziqtiradi?',
    opts: [
      o('Mashina va mexanizmlar', R),
      o('Ilm-fan va tadqiqot', I),
      o('San\u2018at va dizayn', A),
      o('Insonlar va jamiyat', S),
      o('Biznes va bozor', E),
      o('Raqamlar va hisobot', C),
    ],
  },
  {
    id: 6,
    q: 'Qaysi xobbi sizga yaqin?',
    opts: [
      o('Bog\u2018dorchilik va ta\u2018mirlash', R),
      o('Kuzatish va tajriba', I),
      o('Rasm va musiqa', A),
      o('Jamoa tadhirlari', S),
      o('Kichik biznes yuritish', E),
      o('To\u2018plam va arxiv tuzish', C),
    ],
  },
  {
    id: 7,
    q: 'Qaysi mashg\u2018ulot sizni quvontiradi?',
    opts: [
      o('Sport va harakat', R),
      o('Kitob bilan mashg\u2018ulot', I),
      o('Ijodiy amaliyot', A),
      o('Do\u2018stlar bilan uchrashuv', S),
      o('G\u2018alaba uchun tanlov', E),
      o('Reja va jadval tuzish', C),
    ],
  },
  {
    id: 8,
    q: 'Kun bo\u2018yi nima qilishni xohlaysiz?',
    opts: [
      o('Qo\u2018l mehnati bilan shug\u2018ullanaman', R),
      o('Ma\u2018lumotlarni tahlil qilaman', I),
      o('Yangi asar yarataman', A),
      o('Boshqalarga xizmat qilaman', S),
      o('Muzokara olib boraman', E),
      o('Hujjatlarni tartiblayman', C),
    ],
  },
  {
    id: 9,
    q: 'Qaysi vazifa sizga oson ko\u2018rinadi?',
    opts: [
      o('Jihozni sozlash', R),
      o('Muammoni tahlil qilish', I),
      o('Taqdimotni bezash', A),
      o('Jamoani uyushtirish', S),
      o('Savdoni rivojlantirish', E),
      o('Ma\u2018lumotlarni tekshirish', C),
    ],
  },
  {
    id: 10,
    q: 'Qaysi yo\u2018nalishda o\u2018smoqchisiz?',
    opts: [
      o('Amaliy hunarmandchilik', R),
      o('Ilmiy bilimlar', I),
      o('Ijodiy mahorat', A),
      o('Aloqa va hamkorlik', S),
      o('Rahbarlik ko\u2018nikmasi', E),
      o('Tashkilotchilik qobiliyati', C),
    ],
  },
  {
    id: 11,
    q: 'Qaysi ish sizga mos keladi?',
    opts: [
      o('Mehnatga asoslangan ish', R),
      o('Tahlilga asoslangan ish', I),
      o('Ijodga asoslangan ish', A),
      o('Yordamga asoslangan ish', S),
      o('Rahbarlikka asoslangan ish', E),
      o('Tartibga asoslangan ish', C),
    ],
  },
  {
    id: 12,
    q: 'Qaysi natijadan mamnun bo\u2018lasiz?',
    opts: [
      o('Buzilgan narsa tuzalganda', R),
      o('Murakkab masala yechilganda', I),
      o('Go\u2018zal asar tug\u2018ilganda', A),
      o('Kimgadir foyda bo\u2018lganda', S),
      o('Maqsadga erishilganda', E),
      o('Ish yakuniga yetganda', C),
    ],
  },
  {
    id: 13,
    q: 'Qaysi dars sizga qiziq bo\u2018lgan?',
    opts: [
      o('Amaliy saboq', R),
      o('Tabiiy fanlar', I),
      o('Adabiyot va rasm', A),
      o('Jamoaviy ish', S),
      o('Loyiha boshqaruvi', E),
      o('Aniq tartib darslari', C),
    ],
  },
  {
    id: 14,
    q: 'Dam olishda nimani tanlaysiz?',
    opts: [
      o('Ta\u2018mirlash va yig\u2018ish', R),
      o('Kuzatish va tajriba', I),
      o('Ijodiy mashg\u2018ulot', A),
      o('Do\u2018stlar bilan vaqt', S),
      o('Yangi loyiha rejalash', E),
      o('Ro\u2018yxat va to\u2018plam tuzish', C),
    ],
  },
  {
    id: 15,
    q: 'Ish kunini nimadan boshlaysiz?',
    opts: [
      o('Jismoniy topshiriqdan', R),
      o('Tahlil va izlanishdan', I),
      o('Ijodiy g\u2018oyadan', A),
      o('Jamoaga salom berishdan', S),
      o('Maqsad belgilashdan', E),
      o('Kunlik reja tuzishdan', C),
    ],
  },

  // ── ETAP 2 · FAOLIYATLAR (16–30) ────────────────────────────────────────
  {
    id: 16,
    q: 'Qaysi faoliyat sizga yaqin?',
    opts: [
      o('Jihoz bilan ishlash', R),
      o('Ma\u2018lumotlarni tahlil qilish', I),
      o('Taqdimot va dizayn yaratish', A),
      o('O\u2018qitish va maslahat berish', S),
      o('Loyihani boshqarish', E),
      o('Hisob va hisobot yuritish', C),
    ],
  },
  {
    id: 17,
    q: 'Ish kunini qanday boshlash yoqadi?',
    opts: [
      o('Amaliy vazifa bilan', R),
      o('Izlanish va kuzatish bilan', I),
      o('Ijodiy g\u2018oya bilan', A),
      o('Do\u2018stona muloqot bilan', S),
      o('Qaror qabul qilish bilan', E),
      o('Reja tuzish bilan', C),
    ],
  },
  {
    id: 18,
    q: 'Qaysi ko\u2018nikma sizga qiziq?',
    opts: [
      o('Jihozni boshqarish', R),
      o('Mantiqiy fikr yuritish', I),
      o('Ijodiy yozish', A),
      o('Tinglash va hamdardlik', S),
      o('Ishontirish mahorati', E),
      o('Tafsilotga aniqlik', C),
    ],
  },
  {
    id: 19,
    q: 'Qaysi sohada mohir bo\u2018lishni istaysiz?',
    opts: [
      o('Ta\u2018mirlash va qurilish', R),
      o('Tadqiqot olib borish', I),
      o('Vizual ijod', A),
      o('Dars va maslahat berish', S),
      o('Savdo va muzokara', E),
      o('Moliyaviy hisob-kitob', C),
    ],
  },
  {
    id: 20,
    q: 'Qaysi jarayon sizga zavq beradi?',
    opts: [
      o('Yig\u2018ish va sinash', R),
      o('Masalani bosqichma-bosqich yechish', I),
      o('G\u2018oyani tasvirlash', A),
      o('Fikr almashish', S),
      o('Strategiya tuzish', E),
      o('Tartibga solish', C),
    ],
  },
  {
    id: 21,
    q: 'Qaysi vazifani tez bajarasiz?',
    opts: [
      o('Amaliy topshiriqni', R),
      o('Tahliliy vazifani', I),
      o('Ijodiy taqdimotni', A),
      o('Mijoz bilan muloqotni', S),
      o('Taklifni taqdim etishni', E),
      o('Hujjat tahlilini', C),
    ],
  },
  {
    id: 22,
    q: 'Qaysi topshiriqni birinchi olardingiz?',
    opts: [
      o('Jihozni ta\u2018mirlashni', R),
      o('Murakkab masalani o\u2018rganishni', I),
      o('Dizayn tayyorlashni', A),
      o('Do\u2018stga yordam berishni', S),
      o('Savdo uchrashuvini tashkil qilishni', E),
      o('Ro\u2018yxat va jadval tuzishni', C),
    ],
  },
  {
    id: 23,
    q: 'Qaysi faoliyat sizni charchatmaydi?',
    opts: [
      o('Jismoniy mehnat', R),
      o('Ma\u2018lumot to\u2018plash', I),
      o('Ijodiy mashg\u2018ulot', A),
      o('Insonlar bilan ishlash', S),
      o('Rejalashtirish', E),
      o('Aniq hisob-kitob', C),
    ],
  },
  {
    id: 24,
    q: 'Qaysi yondashuv sizga yaqin?',
    opts: [
      o('Sinab ko\u2018rish orqali', R),
      o('Tahlil qilish orqali', I),
      o('Tasavvur qilish orqali', A),
      o('Hamkorlik qilish orqali', S),
      o('Muzokara qilish orqali', E),
      o('Tartibga amal qilish orqali', C),
    ],
  },
  {
    id: 25,
    q: 'Qaysi vazifani mamnuniyat bilan qabul qilasiz?',
    opts: [
      o('Material va jihozlar bilan ishlashni', R),
      o('Ma\u2018lumotlarni o\u2018rganishni', I),
      o('Matn va rasm yaratishni', A),
      o('Odamlarga yordam berishni', S),
      o('Jamoa boshqarishni', E),
      o('Idora ishlarini yuritishni', C),
    ],
  },
  {
    id: 26,
    q: 'Qaysi faoliyatda mahoratingiz yuqori?',
    opts: [
      o('Qo\u2018l ishlarida', R),
      o('Tahlil va kuzatishda', I),
      o('Ijodiy ko\u2018rinishda', A),
      o('O\u2018qitish va maslahatda', S),
      o('Loyiha taqdimotida', E),
      o('Hisobot va tizimlarda', C),
    ],
  },
  {
    id: 27,
    q: 'Mehnat kuni qaysi ish bilan to\u2018lsin?',
    opts: [
      o('Qurilish va ta\u2018mirlash', R),
      o('Tadqiqot va tahlil', I),
      o('Loyihalash va ijod', A),
      o('Mijozlar bilan aloqa', S),
      o('Savdo va muzokaralar', E),
      o('Yozuv va hisob ishlari', C),
    ],
  },
  {
    id: 28,
    q: 'Qaysi faoliyat sizni jalb qiladi?',
    opts: [
      o('Mashina va dastgohlar', R),
      o('Laboratoriya tajribalari', I),
      o('Sahna va ko\u2018rgazma', A),
      o('Ijtimoiy loyihalar', S),
      o('Yangi biznes g\u2018oyalar', E),
      o('Arxiv va baza yuritish', C),
    ],
  },
  {
    id: 29,
    q: 'Qaysi rol sizga tabiiy keladi?',
    opts: [
      o('Mahoratli ijrochi', R),
      o('Ma\u2018lumotli tahlilchi', I),
      o('Ijodkor yaratuvchi', A),
      o('Mehribon maslahatchi', S),
      o('G\u2018olib rahbar', E),
      o('O\u2018rnak tashkilotchi', C),
    ],
  },
  {
    id: 30,
    q: 'Qaysi faoliyatga vaqt ajratasiz?',
    opts: [
      o('Ustaxona ishlari', R),
      o('Ilmiy maqola o\u2018qish', I),
      o('Ijodiy mashqlar', A),
      o('Ko\u2018ngilli faoliyat', S),
      o('Yangi loyiha izlash', E),
      o('Moliyaviy reja tuzish', C),
    ],
  },

  // ── ETAP 3 · ISH USLUBI (31–45) ─────────────────────────────────────────
  {
    id: 31,
    q: 'Ishda qanday uslub sizga mos?',
    opts: [
      o('Qattiq mehnat uslubi', R),
      o('Ehtiyotkor tahlil uslubi', I),
      o('Erkin ijod uslubi', A),
      o('Hamkorlik uslubi', S),
      o('Qat\u2018iy boshqaruv uslubi', E),
      o('Aniq tartib uslubi', C),
    ],
  },
  {
    id: 32,
    q: 'Qanday ishlashni afzal ko\u2018rasiz?',
    opts: [
      o('Faol va harakatchan', R),
      o('Xotirjam va o\u2018ychan', I),
      o('Erkin va ijodkor', A),
      o('Jamoa bilan birga', S),
      o('Qat\u2018iy va shijoatli', E),
      o('Rejali va tizimli', C),
    ],
  },
  {
    id: 33,
    q: 'Natijada qaysi sifatni qadrlaysiz?',
    opts: [
      o('Mahsulot mustahkamligi', R),
      o('Xulosaning to\u2018g\u2018riligi', I),
      o('G\u2018oyaning originalligi', A),
      o('Odamlarga foydasi', S),
      o('Ko\u2018rsatilgan natija', E),
      o('Hisobotning aniqligi', C),
    ],
  },
  {
    id: 34,
    q: 'Qaysi muhitda unumli harakat qilasiz?',
    opts: [
      o('Faol jismoniy muhit', R),
      o('Jim va sokin muhit', I),
      o('Erkin ijodiy muhit', A),
      o('Do\u2018stona jamoa muhiti', S),
      o('Raqobatli dinamik muhit', E),
      o('Tartibli rasmiy muhit', C),
    ],
  },
  {
    id: 35,
    q: 'Qaysi ish tarzi sizga ma\u2018qul?',
    opts: [
      o('Harakatga boy', R),
      o('O\u2018ylashga boy', I),
      o('Ijodga boy', A),
      o('Muloqotga boy', S),
      o('Natijaga qaratilgan', E),
      o('Tartibga asoslangan', C),
    ],
  },
  {
    id: 36,
    q: 'Yuklamaga qanday javob berasiz?',
    opts: [
      o('Kuch va chidamlilik bilan', R),
      o('Tahlil va reja bilan', I),
      o('Ijodiy yechim bilan', A),
      o('Jamoa bilan birgalikda', S),
      o('Tez va qat\u2018iy harakat bilan', E),
      o('Tizimli reja bilan', C),
    ],
  },
  {
    id: 37,
    q: 'Qaysi uslubingiz ustunlik qiladi?',
    opts: [
      o('Amaliy harakat', R),
      o('Tahliliy fikrlash', I),
      o('Ijodiy yondashuv', A),
      o('Hamkorlik va muloqot', S),
      o('Shijoatli qaror', E),
      o('Aniq tekshiruv', C),
    ],
  },
  {
    id: 38,
    q: 'Ishda qaysi fazilatingiz namoyon bo\u2018ladi?',
    opts: [
      o('Chidamlilik', R),
      o('Tahliliy tafakkur', I),
      o('Ijodiy qobiliyat', A),
      o('Rahm-shafqat', S),
      o('Ishonch va jiddiylik', E),
      o('Aniqlik va mas\u2019uliyat', C),
    ],
  },
  {
    id: 39,
    q: 'Qaysi ish rejimi qulay?',
    opts: [
      o('Erkin jismoniy rejim', R),
      o('Chuqur o\u2018y uchun vaqt', I),
      o('Moslashuvchan jadval', A),
      o('Doimiy jamoa uchrashuvlari', S),
      o('Natijaga yo\u2018naltirilgan rejim', E),
      o('Aniq jadval va tartib', C),
    ],
  },
  {
    id: 40,
    q: 'Qanday qaror qabul qilish yoqadi?',
    opts: [
      o('Amaliy sinash orqali', R),
      o('Mantiqiy tahlil orqali', I),
      o('Sezgi va ijod orqali', A),
      o('Jamoa fikri orqali', S),
      o('Tez va hal qiluvchi qaror', E),
      o('Aniq ma\u2018lumot orqali', C),
    ],
  },
  {
    id: 41,
    q: 'Qaysi holatda ishlash yaxshi?',
    opts: [
      o('Faol jismoniy ish', R),
      o('Chuqur o\u2018ylash ishi', I),
      o('Ijodiy jarayon', A),
      o('Odamlar bilan muloqot', S),
      o('Boshqaruv va muzokara', E),
      o('Nazorat va tartiblash', C),
    ],
  },
  {
    id: 42,
    q: 'Qaysi vazifa sizni harakatga keltiradi?',
    opts: [
      o('Amaliy natija beruvchi', R),
      o('Yangi bilim beruvchi', I),
      o('Ijod talab qiluvchi', A),
      o('Odamlarga foydali', S),
      o('Mas\u2019uliyat talab qiluvchi', E),
      o('Tizimlilik talab qiluvchi', C),
    ],
  },
  {
    id: 43,
    q: 'Ish davomida qaysi lahza qiziq?',
    opts: [
      o('Qo\u2018l bilan ishlash', R),
      o('Ma\u2018lumot o\u2018rganish', I),
      o('Tasavvur va loyihalash', A),
      o('Hamkasblar bilan suhbat', S),
      o('Mas\u2019ul qaror qabul qilish', E),
      o('Ro\u2018yxat va reja tuzish', C),
    ],
  },
  {
    id: 44,
    q: 'Qaysi ish ritmi sizga mos?',
    opts: [
      o('Harakatli faol ritm', R),
      o('O\u2018lchovli chuqur ritm', I),
      o('Erkin ijodiy ritm', A),
      o('Jonli muloqot ritmi', S),
      o('Tezkor dinamik ritm', E),
      o('Barqaror tartibli ritm', C),
    ],
  },
  {
    id: 45,
    q: 'Qaysi ishda o\u2018zingizni ko\u2018rsatasiz?',
    opts: [
      o('Amaliy vazifada', R),
      o('Murakkab masalada', I),
      o('Ijodiy loyihada', A),
      o('Jamoa ishida', S),
      o('Taqdimot va muzokarada', E),
      o('Hisob va tekshiruvda', C),
    ],
  },

  // ── ETAP 4 · ISH MUHITI (46–60) ─────────────────────────────────────────
  {
    id: 46,
    q: 'Qaysi muhitda ishlash qulay?',
    opts: [
      o('Ochiq havoda', R),
      o('Laboratoriyada', I),
      o('Ijodiy studiyada', A),
      o('Odamlar orasida', S),
      o('Band ofisda', E),
      o('Tartibli idorada', C),
    ],
  },
  {
    id: 47,
    q: 'Qaysi joyda ishlash yoqadi?',
    opts: [
      o('Bog\u2018 va ochiq maydonda', R),
      o('Ilmiy markazda', I),
      o('Dizayn studiyasida', A),
      o('Maktab yoki maskanda', S),
      o('Biznes markazida', E),
      o('Arxiv xonasida', C),
    ],
  },
  {
    id: 48,
    q: 'Qaysi sharoit sizga qulay?',
    opts: [
      o('Toza havo va ochiq joy', R),
      o('Jim va sokin xona', I),
      o('Ko\u2018rgazmali ijodiy makon', A),
      o('Odamlar to\u2018la makon', S),
      o('Jonli dinamik ofis', E),
      o('O\u2018zgarmas aniq maydon', C),
    ],
  },
  {
    id: 49,
    q: 'Qaysi jamoa sizga yaqin?',
    opts: [
      o('Mehnatkash jamoa', R),
      o('Ilmiy hamkasblar', I),
      o('Ijodiy guruh', A),
      o('Do\u2018stona guruh', S),
      o('G\u2018ayratli ishbilarmon jamoa', E),
      o('Tartibli professional jamoa', C),
    ],
  },
  {
    id: 50,
    q: 'Qaysi sharoit ishni osonlashtiradi?',
    opts: [
      o('Ochiq amaliy ish joyi', R),
      o('Kutubxona va ma\u2018lumotga kirish', I),
      o('Erkin ijodiy hudud', A),
      o('Jamoa qo\u2018llab-quvvatlovi', S),
      o('Rag\u2018batlantiruvchi raqobat', E),
      o('Aniq qoidalar va jadval', C),
    ],
  },
  {
    id: 51,
    q: 'Qaysi joyda samarali ishlaysiz?',
    opts: [
      o('Tashqarida harakatda', R),
      o('Kitob va kompyuter oldida', I),
      o('Ustaxonada ijod qilishda', A),
      o('Mijozlar bilan suhbatda', S),
      o('Yig\u2018ilish va taqdimotda', E),
      o('Toza tartibli idorada', C),
    ],
  },
  {
    id: 52,
    q: 'Vaqtingizni qayerda o\u2018tkazish yoqadi?',
    opts: [
      o('Ustaxona va dalada', R),
      o('Kutubxona va laboratoriyada', I),
      o('Sahna va studiyada', A),
      o('Jamoat joylarida', S),
      o('Biznes ofislarida', E),
      o('Hujjat xonasida', C),
    ],
  },
  {
    id: 53,
    q: 'Qaysi vositalar sizga qulay?',
    opts: [
      o('Mashina va dastgohlar', R),
      o('O\u2018lchov va tahlil asboblari', I),
      o('Grafik va dizayn dasturlari', A),
      o('Hamkorlik vositalari', S),
      o('Savdo va boshqaruv tizimlari', E),
      o('Jadval va ma\u2019lumot bazalari', C),
    ],
  },
  {
    id: 54,
    q: 'Qaysi jadval sizga mos?',
    opts: [
      o('Faol smenali jadval', R),
      o('Erkin tadqiqot grafigi', I),
      o('Moslashuvchan ijodiy grafik', A),
      o('Mijoz jadvaliga moslashuv', S),
      o('Dinamik ish jadvali', E),
      o('Barqaror rasmiy jadval', C),
    ],
  },
  {
    id: 55,
    q: 'Qaysi muhitda xotirjam bo\u2018lasiz?',
    opts: [
      o('Tabiat qo\u2018ynida', R),
      o('Sokin kutubxonada', I),
      o('Yakka ijodiy makonda', A),
      o('Ishonchli jamoada', S),
      o('Band va jonli ofisda', E),
      o('Aniq tartib ostida', C),
    ],
  },
  {
    id: 56,
    q: 'Qaysi joyda o\u2018zingizni topasiz?',
    opts: [
      o('Ishlab chiqarish joyida', R),
      o('Tadqiqot markazida', I),
      o('Ijodiy studiyada', A),
      o('Ta\u2019lim maskanida', S),
      o('Savdo ofisida', E),
      o('Hujjat xonasida', C),
    ],
  },
  {
    id: 57,
    q: 'Qaysi resurs siz uchun muhim?',
    opts: [
      o('Ishonchli asbob-uskunalar', R),
      o('Bilim va ma\u2018lumot bazasi', I),
      o('Ijodiy vositalar va makon', A),
      o('Qo\u2018llab-quvvatlaydigan jamoa', S),
      o('Bozor va istiqbol ma\u2018lumoti', E),
      o('Aniq protseduralar', C),
    ],
  },
  {
    id: 58,
    q: 'Qaysi joy sizga kuch beradi?',
    opts: [
      o('Ochiq tabiat va maydonlar', R),
      o('Yangi kashfiyotlar', I),
      o('Go\u2018zal ijodiy makon', A),
      o('Insonlar va jamiyat', S),
      o('Yangi imkoniyatlar', E),
      o('Tartibga solingan joy', C),
    ],
  },
  {
    id: 59,
    q: 'Qaysi muhitda rivojlanasiz?',
    opts: [
      o('Amaliy ishlab chiqarish muhiti', R),
      o('Ilmiy izlanish muhiti', I),
      o('Ijodiy ifoda muhiti', A),
      o('Xizmat ko\u2018rsatish muhiti', S),
      o('Yangi imkoniyatlar muhiti', E),
      o('Barqaror idora muhiti', C),
    ],
  },
  {
    id: 60,
    q: 'Qaysi muhitni xayolga keltirasiz?',
    opts: [
      o('Zavod va ustaxonani', R),
      o('Ilmiy markazni', I),
      o('Ijodiy agentlikni', A),
      o('Ta\u2019lim va tibbiyot maskanini', S),
      o('Zamonaviy ofisni', E),
      o('Bank va arxivni', C),
    ],
  },
]

// O*NET-style assessment structure: item response sets vary naturally.
// Each question probes a subset of the six interest dimensions (4, 5 or 6
// options). The dimension start shifts diagonaally so the whole 60-item
// instrument stays balanced across all six dimensions.
const OPTION_COUNTS = [4, 5, 6, 5, 4, 6]

// Default dimension order; each question rotates which dimension begins the set.
const DIM_ORDER = [0, 1, 2, 3, 4, 5]

// Rotate each question's option order so the "A" position is never the same
// dimension twice in a row — keeps answers from feeling like a pattern.
function rotate<T>(arr: T[], k: number): T[] {
  const n = arr.length
  if (n === 0) return arr
  const s = ((k % n) + n) % n
  return [...arr.slice(s), ...arr.slice(0, s)]
}

export const QUESTIONS: QuizQuestion[] = RAW.map((item, i) => {
  const count = OPTION_COUNTS[i % OPTION_COUNTS.length]
  const start = (i % 6 + Math.floor(i / 6)) % 6
  const order = DIM_ORDER.slice(start).concat(DIM_ORDER.slice(0, start))
  const opts = order.slice(0, count).map((d) => item.opts[d])
  const stage = Math.floor(i / PER_STAGE)
  // Difficulty per question: a gentle wave that drifts from light to dark over
  // the whole quiz — so consecutive answers visibly alternate to'q/och while
  // the overall difficulty still ramps up over time.
  const wave = 0.5 + 0.5 * Math.sin(i * 0.7)
  const trend = i / (RAW.length - 1)
  const difficulty = Math.min(1, Math.max(0, 0.55 * wave + 0.5 * trend))
  return {
    ...item,
    stage,
    accent: STAGES[stage].accent,
    difficulty,
    opts: rotate(opts, i % count),
  }
})
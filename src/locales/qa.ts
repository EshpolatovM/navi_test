// Three-language versions of ALL quiz content.
// UZ entries mirror the data layer (single source of truth stays unchanged);
// RU / EN are maintained here. Scoring, indexes and option ORDER are identical
// across languages — ONLY the visible text differs per language.
//
// Career options are keyed by RAW dimension order [R, I, A, S, E, C] so every
// rotated/subset export can be looked up by each option's w vector.

export type { Lang } from '../lib/i18n'
export interface QAText {
  uz: string
  ru: string
  en: string
}
export interface CareerQA {
  q: QAText
  opts: QAText[] // R,I,A,S,E,C
}
export interface InterestQA {
  q: QAText
  opts: QAText[] // exported order (1:1 with INTEREST_ITEMS)
}
export interface CareerMetaQA {
  name: QAText
  description: QAText
}

export const CAREER_QA: Record<number, CareerQA> = {
  1: {
    q: { uz: "Ochiq havoda ishlash yoqadimi?", ru: "Нравится ли вам работать на открытом воздухе?", en: "Do you like working outdoors?" },
    opts: [{ uz: "Ekin va bog‘ parvarishi", ru: "Уход за растениями и садом", en: "Caring for plants and gardens" }, { uz: "Tabiat qonuniyatlarini o‘rganish", ru: "Изучать законы природы", en: "Studying the laws of nature" }, { uz: "Manzaralarni tasvirlab berish", ru: "Описывать пейзажи", en: "Describing landscapes" }, { uz: "Guruhda sayohat qilish", ru: "Путешествовать в группе", en: "Travelling in a group" }, { uz: "Bog‘ mahsulotlarini sotish", ru: "Продавать продукты сада", en: "Selling produce from the garden" }, { uz: "Ekin hisobotini tuzish", ru: "Вести отчёт по урожаю", en: "Keeping a crop report" }]
  },
  2: {
    q: { uz: "Yangi narsa o‘rganish yoqadimi?", ru: "Нравится ли вам узнавать что-то новое?", en: "Do you like learning new things?" },
    opts: [{ uz: "Asbob-uskunani ishlatish", ru: "Работать с инструментами", en: "Using tools and equipment" }, { uz: "Ilmiy faktlarni o‘rganish", ru: "Изучать научные факты", en: "Studying scientific facts" }, { uz: "Ijodiy g‘oya yaratish", ru: "Придумывать творческие идеи", en: "Coming up with creative ideas" }, { uz: "Do‘stlarga tushuntirib berish", ru: "Объяснять что-то друзьям", en: "Explaining things to friends" }, { uz: "Yangi imkoniyat kashf etish", ru: "Открывать новые возможности", en: "Discovering new opportunities" }, { uz: "Aniq qoidalarni o‘zlashtirish", ru: "Осваивать чёткие правила", en: "Learning clear rules and steps" }]
  },
  3: {
    q: { uz: "Bo‘sh vaqtingizda nima qilasiz?", ru: "Чем вы занимаетесь в свободное время?", en: "What do you do in your free time?" },
    opts: [{ uz: "Narsalarni ta‘mirlayman", ru: "Ремонтирую вещи", en: "I fix and repair things" }, { uz: "Tajriba o‘tkazaman", ru: "Провожу опыты", en: "I run little experiments" }, { uz: "Chizaman yoki yozaman", ru: "Рисую или пишу", en: "I draw or write" }, { uz: "Odamlarga yordam beraman", ru: "Помогаю людям", en: "I help people" }, { uz: "Loyiha rejalashtiraman", ru: "Планирую проекты", en: "I plan projects" }, { uz: "Hisob-kitob yuritaman", ru: "Веду подсчёты", en: "I keep counts and records" }]
  },
  4: {
    q: { uz: "Qaysi mashg‘ulot zavq bag‘ishlaydi?", ru: "Какое занятие приносит вам радость?", en: "Which activity gives you joy?" },
    opts: [{ uz: "Jismoniy mehnat", ru: "Физический труд", en: "Hands-on physical work" }, { uz: "Mantiqiy boshqotirma", ru: "Логические головоломки", en: "Logic puzzles" }, { uz: "Ijodiy ishlar", ru: "Творческие дела", en: "Creative work" }, { uz: "Do‘stona muloqot", ru: "Дружеское общение", en: "Friendly conversation" }, { uz: "Musobaqa va g‘alaba", ru: "Соревнования и победы", en: "Competition and winning" }, { uz: "Aniq tartib", ru: "Чёткий порядок", en: "Clear order and structure" }]
  },
  5: {
    q: { uz: "Qaysi mavzu sizni qiziqtiradi?", ru: "Какая тема вас интересует?", en: "Which topic interests you?" },
    opts: [{ uz: "Mashina va mexanizmlar", ru: "Машины и механизмы", en: "Machines and mechanics" }, { uz: "Ilm-fan va tadqiqot", ru: "Наука и исследования", en: "Science and research" }, { uz: "San‘at va dizayn", ru: "Искусство и дизайн", en: "Art and design" }, { uz: "Insonlar va jamiyat", ru: "Люди и общество", en: "People and society" }, { uz: "Biznes va bozor", ru: "Бизнес и рынок", en: "Business and markets" }, { uz: "Raqamlar va hisobot", ru: "Цифры и отчёты", en: "Numbers and reports" }]
  },
  6: {
    q: { uz: "Qaysi xobbi sizga yaqin?", ru: "Какое хобби вам близко?", en: "Which hobby fits you best?" },
    opts: [{ uz: "Bog‘dorchilik va ta‘mirlash", ru: "Садоводство и ремонт", en: "Gardening and fixing things" }, { uz: "Kuzatish va tajriba", ru: "Наблюдение и опыты", en: "Observing and experimenting" }, { uz: "Rasm va musiqa", ru: "Рисование и музыка", en: "Drawing and music" }, { uz: "Jamoa tadhirlari", ru: "Командные мероприятия", en: "Team activities" }, { uz: "Kichik biznes yuritish", ru: "Маленький бизнес", en: "Running a small business" }, { uz: "To‘plam va arxiv tuzish", ru: "Составлять коллекции и архивы", en: "Making collections and archives" }]
  },
  7: {
    q: { uz: "Qaysi mashg‘ulot sizni quvontiradi?", ru: "Какое занятие вас радует?", en: "What activity cheers you up?" },
    opts: [{ uz: "Sport va harakat", ru: "Спорт и движение", en: "Sport and movement" }, { uz: "Kitob bilan mashg‘ulot", ru: "Занятия с книгой", en: "Spending time with a book" }, { uz: "Ijodiy amaliyot", ru: "Творческая практика", en: "Creative practice" }, { uz: "Do‘stlar bilan uchrashuv", ru: "Встречи с друзьями", en: "Meeting with friends" }, { uz: "G‘alaba uchun tanlov", ru: "Соревнование за победу", en: "Competing to win" }, { uz: "Reja va jadval tuzish", ru: "Составление планов и графиков", en: "Making plans and schedules" }]
  },
  8: {
    q: { uz: "Kun bo‘yi nima qilishni xohlaysiz?", ru: "Чем вы хотели бы заниматься целый день?", en: "What would you do all day long?" },
    opts: [{ uz: "Qo‘l mehnati bilan shug‘ullanaman", ru: "Ручная работа", en: "Work with my hands" }, { uz: "Ma‘lumotlarni tahlil qilaman", ru: "Анализ данных", en: "Analysing information" }, { uz: "Yangi asar yarataman", ru: "Создание нового произведения", en: "Creating something new" }, { uz: "Boshqalarga xizmat qilaman", ru: "Помощь другим", en: "Helping others" }, { uz: "Muzokara olib boraman", ru: "Ведение переговоров", en: "Negotiating" }, { uz: "Hujjatlarni tartiblayman", ru: "Приводить документы в порядок", en: "Organising documents" }]
  },
  9: {
    q: { uz: "Qaysi vazifa sizga oson ko‘rinadi?", ru: "Какая задача кажется вам лёгкой?", en: "Which task seems easy to you?" },
    opts: [{ uz: "Jihozni sozlash", ru: "Налаживать оборудование", en: "Setting up equipment" }, { uz: "Muammoni tahlil qilish", ru: "Анализировать проблему", en: "Analysing a problem" }, { uz: "Taqdimotni bezash", ru: "Оформлять презентацию", en: "Designing a presentation" }, { uz: "Jamoani uyushtirish", ru: "Объединять команду", en: "Bringing a team together" }, { uz: "Savdoni rivojlantirish", ru: "Развивать продажи", en: "Growing sales" }, { uz: "Ma‘lumotlarni tekshirish", ru: "Проверять данные", en: "Checking data" }]
  },
  10: {
    q: { uz: "Qaysi yo‘nalishda o‘smoqchisiz?", ru: "В каком направлении вы хотите расти?", en: "In which direction do you want to grow?" },
    opts: [{ uz: "Amaliy hunarmandchilik", ru: "Ремесленное мастерство", en: "Practical crafts and skills" }, { uz: "Ilmiy bilimlar", ru: "Научные знания", en: "Scientific knowledge" }, { uz: "Ijodiy mahorat", ru: "Творческое мастерство", en: "Creative mastery" }, { uz: "Aloqa va hamkorlik", ru: "Общение и сотрудничество", en: "Communication and teamwork" }, { uz: "Rahbarlik ko‘nikmasi", ru: "Лидерские навыки", en: "Leadership skills" }, { uz: "Tashkilotchilik qobiliyati", ru: "Организаторские способности", en: "Organisational skills" }]
  },
  11: {
    q: { uz: "Qaysi ish sizga mos keladi?", ru: "Какая работа вам подходит?", en: "Which kind of work suits you?" },
    opts: [{ uz: "Mehnatga asoslangan ish", ru: "Работа на основе труда", en: "Work based on physical effort" }, { uz: "Tahlilga asoslangan ish", ru: "Работа на основе анализа", en: "Work based on analysis" }, { uz: "Ijodga asoslangan ish", ru: "Работа на основе творчества", en: "Work based on creativity" }, { uz: "Yordamga asoslangan ish", ru: "Работа на основе помощи", en: "Work based on helping others" }, { uz: "Rahbarlikka asoslangan ish", ru: "Работа на основе лидерства", en: "Work based on leadership" }, { uz: "Tartibga asoslangan ish", ru: "Работа на основе порядка", en: "Work based on order and precision" }]
  },
  12: {
    q: { uz: "Qaysi natijadan mamnun bo‘lasiz?", ru: "Какой результат вас радует?", en: "Which outcome makes you happy?" },
    opts: [{ uz: "Buzilgan narsa tuzalganda", ru: "Когда починил сломанное", en: "When I fix something broken" }, { uz: "Murakkab masala yechilganda", ru: "Когда решена сложная задача", en: "When a hard problem is solved" }, { uz: "Go‘zal asar tug‘ilganda", ru: "Когда рождается красивое", en: "When something beautiful is made" }, { uz: "Kimgadir foyda bo‘lganda", ru: "Когда кому-то стало лучше", en: "When someone benefits" }, { uz: "Maqsadga erishilganda", ru: "Когда цель достигнута", en: "When a goal is reached" }, { uz: "Ish yakuniga yetganda", ru: "Когда работа доведена до конца", en: "When a task is finished neatly" }]
  },
  13: {
    q: { uz: "Qaysi dars sizga qiziq bo‘lgan?", ru: "Какой урок вам был интересен?", en: "Which lesson interested you?" },
    opts: [{ uz: "Amaliy saboq", ru: "Практические занятия", en: "Hands-on lessons" }, { uz: "Tabiiy fanlar", ru: "Естественные науки", en: "Natural sciences" }, { uz: "Adabiyot va rasm", ru: "Литература и рисование", en: "Literature and art" }, { uz: "Jamoaviy ish", ru: "Командная работа", en: "Teamwork" }, { uz: "Loyiha boshqaruvi", ru: "Управление проектами", en: "Project management" }, { uz: "Aniq tartib darslari", ru: "Уроки порядка и точности", en: "Lessons on order and accuracy" }]
  },
  14: {
    q: { uz: "Dam olishda nimani tanlaysiz?", ru: "Что вы выбираете на отдыхе?", en: "What do you choose during rest?" },
    opts: [{ uz: "Ta‘mirlash va yig‘ish", ru: "Ремонт и сборку", en: "Repairing and assembling" }, { uz: "Kuzatish va tajriba", ru: "Наблюдение и опыты", en: "Observing and experimenting" }, { uz: "Ijodiy mashg‘ulot", ru: "Творческое занятие", en: "Creative activities" }, { uz: "Do‘stlar bilan vaqt", ru: "Время с друзьями", en: "Time with friends" }, { uz: "Yangi loyiha rejalash", ru: "Планирование новых проектов", en: "Planning new projects" }, { uz: "Ro‘yxat va to‘plam tuzish", ru: "Составление списков и коллекций", en: "Making lists and collections" }]
  },
  15: {
    q: { uz: "Ish kunini nimadan boshlaysiz?", ru: "С чего вы начинаете рабочий день?", en: "How do you start a work day?" },
    opts: [{ uz: "Jismoniy topshiriqdan", ru: "С физической задачи", en: "With a hands-on task" }, { uz: "Tahlil va izlanishdan", ru: "С анализа и поиска", en: "With analysis and research" }, { uz: "Ijodiy g‘oyadan", ru: "С творческой идеи", en: "With a creative idea" }, { uz: "Jamoaga salom berishdan", ru: "С приветствия команде", en: "By greeting the team" }, { uz: "Maqsad belgilashdan", ru: "С постановки цели", en: "By setting a goal" }, { uz: "Kunlik reja tuzishdan", ru: "С составления плана дня", en: "By planning the day" }]
  },
  16: {
    q: { uz: "Qaysi faoliyat sizga yaqin?", ru: "Какая деятельность вам близка?", en: "Which activity feels close to you?" },
    opts: [{ uz: "Jihoz bilan ishlash", ru: "Работа с оборудованием", en: "Working with equipment" }, { uz: "Ma‘lumotlarni tahlil qilish", ru: "Анализ данных", en: "Analysing information" }, { uz: "Taqdimot va dizayn yaratish", ru: "Создание презентаций и дизайна", en: "Creating designs and presentations" }, { uz: "O‘qitish va maslahat berish", ru: "Обучение и консультации", en: "Teaching and advising" }, { uz: "Loyihani boshqarish", ru: "Управление проектом", en: "Leading a project" }, { uz: "Hisob va hisobot yuritish", ru: "Вести учёт и отчёты", en: "Keeping accounts and reports" }]
  },
  17: {
    q: { uz: "Ish kunini qanday boshlash yoqadi?", ru: "Как вам нравится начинать рабочий день?", en: "How do you like to start the day?" },
    opts: [{ uz: "Amaliy vazifa bilan", ru: "С практической задачи", en: "With a practical task" }, { uz: "Izlanish va kuzatish bilan", ru: "С поиска и наблюдения", en: "With research and observation" }, { uz: "Ijodiy g‘oya bilan", ru: "С творческой идеи", en: "With a creative idea" }, { uz: "Do‘stona muloqot bilan", ru: "С дружеского общения", en: "With friendly conversation" }, { uz: "Qaror qabul qilish bilan", ru: "С принятия решения", en: "With making a decision" }, { uz: "Reja tuzish bilan", ru: "С составления плана", en: "With making a plan" }]
  },
  18: {
    q: { uz: "Qaysi ko‘nikma sizga qiziq?", ru: "Какой навык вам интересен?", en: "Which skill interests you?" },
    opts: [{ uz: "Jihozni boshqarish", ru: "Управление оборудованием", en: "Operating equipment" }, { uz: "Mantiqiy fikr yuritish", ru: "Логическое мышление", en: "Logical thinking" }, { uz: "Ijodiy yozish", ru: "Творческое письмо", en: "Creative writing" }, { uz: "Tinglash va hamdardlik", ru: "Слушание и сопереживание", en: "Listening and empathy" }, { uz: "Ishontirish mahorati", ru: "Умение убеждать", en: "Persuasion skills" }, { uz: "Tafsilotga aniqlik", ru: "Внимание к деталям", en: "Attention to detail" }]
  },
  19: {
    q: { uz: "Qaysi sohada mohir bo‘lishni istaysiz?", ru: "В какой сфере вы хотите стать мастером?", en: "In which field do you want to be skilled?" },
    opts: [{ uz: "Ta‘mirlash va qurilish", ru: "Ремонт и строительство", en: "Repair and construction" }, { uz: "Tadqiqot olib borish", ru: "Проведение исследований", en: "Doing research" }, { uz: "Vizual ijod", ru: "Визуальное творчество", en: "Visual creativity" }, { uz: "Dars va maslahat berish", ru: "Преподавание и консультирование", en: "Teaching and advising" }, { uz: "Savdo va muzokara", ru: "Продажи и переговоры", en: "Sales and negotiation" }, { uz: "Moliyaviy hisob-kitob", ru: "Финансовые расчёты", en: "Financial calculations" }]
  },
  20: {
    q: { uz: "Qaysi jarayon sizga zavq beradi?", ru: "Какой процесс доставляет вам удовольствие?", en: "Which process do you enjoy?" },
    opts: [{ uz: "Yig‘ish va sinash", ru: "Сборка и испытание", en: "Assembling and testing" }, { uz: "Masalani bosqichma-bosqich yechish", ru: "Пошаговое решение задачи", en: "Solving problems step by step" }, { uz: "G‘oyani tasvirlash", ru: "Воплощение идеи", en: "Bringing an idea to life" }, { uz: "Fikr almashish", ru: "Обмен мнениями", en: "Sharing ideas" }, { uz: "Strategiya tuzish", ru: "Составление стратегии", en: "Building a strategy" }, { uz: "Tartibga solish", ru: "Наведение порядка", en: "Putting things in order" }]
  },
  21: {
    q: { uz: "Qaysi vazifani tez bajarasiz?", ru: "Какое задание вы выполняете быстро?", en: "Which task do you do quickly?" },
    opts: [{ uz: "Amaliy topshiriqni", ru: "Практическое задание", en: "Practical tasks" }, { uz: "Tahliliy vazifani", ru: "Аналитическую задачу", en: "Analytical tasks" }, { uz: "Ijodiy taqdimotni", ru: "Творческую презентацию", en: "Creative presentations" }, { uz: "Mijoz bilan muloqotni", ru: "Общение с клиентом", en: "Talking with clients" }, { uz: "Taklifni taqdim etishni", ru: "Представление предложения", en: "Presenting a proposal" }, { uz: "Hujjat tahlilini", ru: "Анализ документов", en: "Reviewing documents" }]
  },
  22: {
    q: { uz: "Qaysi topshiriqni birinchi olardingiz?", ru: "Какую задачу вы взяли бы первой?", en: "Which task would you take first?" },
    opts: [{ uz: "Jihozni ta‘mirlashni", ru: "Починить оборудование", en: "Fix the equipment" }, { uz: "Murakkab masalani o‘rganishni", ru: "Изучить сложную задачу", en: "Study a hard problem" }, { uz: "Dizayn tayyorlashni", ru: "Подготовить дизайн", en: "Make a design" }, { uz: "Do‘stga yordam berishni", ru: "Помочь другу", en: "Help a friend" }, { uz: "Savdo uchrashuvini tashkil qilishni", ru: "Организовать деловую встречу", en: "Arrange a sales meeting" }, { uz: "Ro‘yxat va jadval tuzishni", ru: "Составить списки и таблицы", en: "Make lists and tables" }]
  },
  23: {
    q: { uz: "Qaysi faoliyat sizni charchatmaydi?", ru: "Какое занятие вас не утомляет?", en: "Which activity never tires you?" },
    opts: [{ uz: "Jismoniy mehnat", ru: "Физический труд", en: "Physical work" }, { uz: "Ma‘lumot to‘plash", ru: "Сбор информации", en: "Gathering information" }, { uz: "Ijodiy mashg‘ulot", ru: "Творческие занятия", en: "Creative activities" }, { uz: "Insonlar bilan ishlash", ru: "Работа с людьми", en: "Working with people" }, { uz: "Rejalashtirish", ru: "Планирование", en: "Planning" }, { uz: "Aniq hisob-kitob", ru: "Точные расчёты", en: "Accurate calculations" }]
  },
  24: {
    q: { uz: "Qaysi yondashuv sizga yaqin?", ru: "Какой подход вам ближе?", en: "Which approach fits you best?" },
    opts: [{ uz: "Sinab ko‘rish orqali", ru: "Через пробу", en: "By trying things out" }, { uz: "Tahlil qilish orqali", ru: "Через анализ", en: "By analysing" }, { uz: "Tasavvur qilish orqali", ru: "Через воображение", en: "By imagining" }, { uz: "Hamkorlik qilish orqali", ru: "Через сотрудничество", en: "By working together" }, { uz: "Muzokara qilish orqali", ru: "Через переговоры", en: "By negotiating" }, { uz: "Tartibga amal qilish orqali", ru: "Следуя порядку", en: "By following order" }]
  },
  25: {
    q: { uz: "Qaysi vazifani mamnuniyat bilan qabul qilasiz?", ru: "Какое задание вы принимаете с удовольствием?", en: "Which task do you gladly take on?" },
    opts: [{ uz: "Material va jihozlar bilan ishlashni", ru: "Работу с материалами и инструментами", en: "Working with materials and tools" }, { uz: "Ma‘lumotlarni o‘rganishni", ru: "Изучение данных", en: "Learning and studying data" }, { uz: "Matn va rasm yaratishni", ru: "Создание текстов и рисунков", en: "Creating text and images" }, { uz: "Odamlarga yordam berishni", ru: "Помощь людям", en: "Helping people" }, { uz: "Jamoa boshqarishni", ru: "Управление командой", en: "Leading a team" }, { uz: "Idora ishlarini yuritishni", ru: "Ведение дел офиса", en: "Handling office work" }]
  },
  26: {
    q: { uz: "Qaysi faoliyatda mahoratingiz yuqori?", ru: "В каком деле ваше мастерство выше?", en: "In which activity are you most skilled?" },
    opts: [{ uz: "Qo‘l ishlarida", ru: "В ручной работе", en: "In hands-on work" }, { uz: "Tahlil va kuzatishda", ru: "В анализе и наблюдении", en: "In analysis and observation" }, { uz: "Ijodiy ko‘rinishda", ru: "В творческом выражении", en: "In creative expression" }, { uz: "O‘qitish va maslahatda", ru: "В обучении и советах", en: "In teaching and advising" }, { uz: "Loyiha taqdimotida", ru: "В презентации проектов", en: "In presenting projects" }, { uz: "Hisobot va tizimlarda", ru: "В отчётах и системах", en: "In reports and systems" }]
  },
  27: {
    q: { uz: "Mehnat kuni qaysi ish bilan to‘lsin?", ru: "Какая работа наполняет ваш рабочий день?", en: "What should your work day be filled with?" },
    opts: [{ uz: "Qurilish va ta‘mirlash", ru: "Строительство и ремонт", en: "Construction and repair" }, { uz: "Tadqiqot va tahlil", ru: "Исследование и анализ", en: "Research and analysis" }, { uz: "Loyihalash va ijod", ru: "Проектирование и творчество", en: "Design and creativity" }, { uz: "Mijozlar bilan aloqa", ru: "Общение с клиентами", en: "Talking with clients" }, { uz: "Savdo va muzokaralar", ru: "Продажи и переговоры", en: "Sales and negotiations" }, { uz: "Yozuv va hisob ishlari", ru: "Письменные и учётные работы", en: "Writing and bookkeeping" }]
  },
  28: {
    q: { uz: "Qaysi faoliyat sizni jalb qiladi?", ru: "Какая деятельность вас привлекает?", en: "Which activity attracts you?" },
    opts: [{ uz: "Mashina va dastgohlar", ru: "Машины и станки", en: "Machines and tools" }, { uz: "Laboratoriya tajribalari", ru: "Лабораторные опыты", en: "Laboratory experiments" }, { uz: "Sahna va ko‘rgazma", ru: "Сцена и выставки", en: "Stage and exhibitions" }, { uz: "Ijtimoiy loyihalar", ru: "Социальные проекты", en: "Social projects" }, { uz: "Yangi biznes g‘oyalar", ru: "Новые бизнес-идеи", en: "New business ideas" }, { uz: "Arxiv va baza yuritish", ru: "Ведение архивов и баз", en: "Running archives and databases" }]
  },
  29: {
    q: { uz: "Qaysi rol sizga tabiiy keladi?", ru: "Какая роль даётся вам естественно?", en: "Which role comes naturally to you?" },
    opts: [{ uz: "Mahoratli ijrochi", ru: "Умелый исполнитель", en: "A skilled doer" }, { uz: "Ma‘lumotli tahlilchi", ru: "Грамотный аналитик", en: "A knowledgeable analyst" }, { uz: "Ijodkor yaratuvchi", ru: "Творец", en: "A creative maker" }, { uz: "Mehribon maslahatchi", ru: "Добрый советчик", en: "A caring adviser" }, { uz: "G‘olib rahbar", ru: "Лидер-победитель", en: "A winning leader" }, { uz: "O‘rnak tashkilotchi", ru: "Образцовый организатор", en: "An exemplary organiser" }]
  },
  30: {
    q: { uz: "Qaysi faoliyatga vaqt ajratasiz?", ru: "На какую деятельность вы выделяете время?", en: "Where do you spend your time?" },
    opts: [{ uz: "Ustaxona ishlari", ru: "Мастерская", en: "Workshop tasks" }, { uz: "Ilmiy maqola o‘qish", ru: "Чтение научных статей", en: "Reading scientific articles" }, { uz: "Ijodiy mashqlar", ru: "Творческие упражнения", en: "Creative exercises" }, { uz: "Ko‘ngilli faoliyat", ru: "Волонтёрская деятельность", en: "Volunteering" }, { uz: "Yangi loyiha izlash", ru: "Поиск новых проектов", en: "Looking for new projects" }, { uz: "Moliyaviy reja tuzish", ru: "Составление финансовых планов", en: "Making financial plans" }]
  },
  31: {
    q: { uz: "Ishda qanday uslub sizga mos?", ru: "Какой стиль работы вам подходит?", en: "Which work style suits you?" },
    opts: [{ uz: "Qattiq mehnat uslubi", ru: "Упорный труд", en: "Solid hard work" }, { uz: "Ehtiyotkor tahlil uslubi", ru: "Осторожный анализ", en: "Careful analysis" }, { uz: "Erkin ijod uslubi", ru: "Свободное творчество", en: "Free creativity" }, { uz: "Hamkorlik uslubi", ru: "Сотрудничество", en: "Collaboration" }, { uz: "Qat‘iy boshqaruv uslubi", ru: "Решительное управление", en: "Decisive leadership" }, { uz: "Aniq tartib uslubi", ru: "Чёткий порядок", en: "Clear order" }]
  },
  32: {
    q: { uz: "Qanday ishlashni afzal ko‘rasiz?", ru: "Как вы предпочитаете работать?", en: "How do you prefer to work?" },
    opts: [{ uz: "Faol va harakatchan", ru: "Активно и подвижно", en: "Active and energetic" }, { uz: "Xotirjam va o‘ychan", ru: "Спокойно и вдумчиво", en: "Calm and thoughtful" }, { uz: "Erkin va ijodkor", ru: "Свободно и творчески", en: "Free and creative" }, { uz: "Jamoa bilan birga", ru: "Вместе с командой", en: "Together with the team" }, { uz: "Qat‘iy va shijoatli", ru: "Решительно и напористо", en: "Driven and assertive" }, { uz: "Rejali va tizimli", ru: "Планомерно и системно", en: "Planned and systematic" }]
  },
  33: {
    q: { uz: "Natijada qaysi sifatni qadrlaysiz?", ru: "Какое качество результата вы цените?", en: "Which quality of the result do you value?" },
    opts: [{ uz: "Mahsulot mustahkamligi", ru: "Прочность изделия", en: "Durable products" }, { uz: "Xulosaning to‘g‘riligi", ru: "Правильность вывода", en: "Correct conclusions" }, { uz: "G‘oyaning originalligi", ru: "Оригинальность идеи", en: "Original ideas" }, { uz: "Odamlarga foydasi", ru: "Польза для людей", en: "Benefit to people" }, { uz: "Ko‘rsatilgan natija", ru: "Достигнутый результат", en: "Achieved results" }, { uz: "Hisobotning aniqligi", ru: "Точность отчёта", en: "Accurate reports" }]
  },
  34: {
    q: { uz: "Qaysi muhitda unumli harakat qilasiz?", ru: "В какой среде вы работаете продуктивно?", en: "In which environment are you productive?" },
    opts: [{ uz: "Faol jismoniy muhit", ru: "Активная физическая среда", en: "An active physical setting" }, { uz: "Jim va sokin muhit", ru: "Тихая спокойная среда", en: "A quiet calm setting" }, { uz: "Erkin ijodiy muhit", ru: "Свободная творческая среда", en: "A free creative setting" }, { uz: "Do‘stona jamoa muhiti", ru: "Дружная командная среда", en: "A friendly team setting" }, { uz: "Raqobatli dinamik muhit", ru: "Конкурентная динамичная среда", en: "A competitive dynamic setting" }, { uz: "Tartibli rasmiy muhit", ru: "Порядок и официальность", en: "An orderly formal setting" }]
  },
  35: {
    q: { uz: "Qaysi ish tarzi sizga ma‘qul?", ru: "Какой стиль работы вам нравится?", en: "Which work style do you prefer?" },
    opts: [{ uz: "Harakatga boy", ru: "Богатый на движение", en: "Full of action" }, { uz: "O‘ylashga boy", ru: "Богатый на размышления", en: "Full of thinking" }, { uz: "Ijodga boy", ru: "Богатый на творчество", en: "Full of creativity" }, { uz: "Muloqotga boy", ru: "Богатый на общение", en: "Full of communication" }, { uz: "Natijaga qaratilgan", ru: "Нацеленный на результат", en: "Focused on results" }, { uz: "Tartibga asoslangan", ru: "Основанный на порядке", en: "Based on order" }]
  },
  36: {
    q: { uz: "Yuklamaga qanday javob berasiz?", ru: "Как вы реагируете на нагрузку?", en: "How do you respond to a heavy workload?" },
    opts: [{ uz: "Kuch va chidamlilik bilan", ru: "Силой и выносливостью", en: "With strength and stamina" }, { uz: "Tahlil va reja bilan", ru: "Анализом и планом", en: "With analysis and a plan" }, { uz: "Ijodiy yechim bilan", ru: "Творческим решением", en: "With a creative solution" }, { uz: "Jamoa bilan birgalikda", ru: "Вместе с командой", en: "Together with the team" }, { uz: "Tez va qat‘iy harakat bilan", ru: "Быстрыми решительными действиями", en: "With fast decisive action" }, { uz: "Tizimli reja bilan", ru: "Системным планом", en: "With a systematic plan" }]
  },
  37: {
    q: { uz: "Qaysi uslubingiz ustunlik qiladi?", ru: "Какой ваш стиль преобладает?", en: "Which style of yours stands out?" },
    opts: [{ uz: "Amaliy harakat", ru: "Практические действия", en: "Practical action" }, { uz: "Tahliliy fikrlash", ru: "Аналитическое мышление", en: "Analytical thinking" }, { uz: "Ijodiy yondashuv", ru: "Творческий подход", en: "A creative approach" }, { uz: "Hamkorlik va muloqot", ru: "Сотрудничество и общение", en: "Collaboration and communication" }, { uz: "Shijoatli qaror", ru: "Энергичные решения", en: "Energetic decisions" }, { uz: "Aniq tekshiruv", ru: "Точная проверка", en: "Careful checking" }]
  },
  38: {
    q: { uz: "Ishda qaysi fazilatingiz namoyon bo‘ladi?", ru: "Какое ваше качество проявляется в работе?", en: "Which trait of yours shows at work?" },
    opts: [{ uz: "Chidamlilik", ru: "Выносливость", en: "Stamina" }, { uz: "Tahliliy tafakkur", ru: "Аналитический ум", en: "Analytical mind" }, { uz: "Ijodiy qobiliyat", ru: "Творческие способности", en: "Creative ability" }, { uz: "Rahm-shafqat", ru: "Доброта и сочувствие", en: "Kindness and compassion" }, { uz: "Ishonch va jiddiylik", ru: "Уверенность и серьёзность", en: "Confidence and seriousness" }, { uz: "Aniqlik va mas’uliyat", ru: "Точность и ответственность", en: "Accuracy and responsibility" }]
  },
  39: {
    q: { uz: "Qaysi ish rejimi qulay?", ru: "Какой режим работы вам удобен?", en: "Which work regime suits you?" },
    opts: [{ uz: "Erkin jismoniy rejim", ru: "Свободный физический режим", en: "Free hands-on schedule" }, { uz: "Chuqur o‘y uchun vaqt", ru: "Время для глубоких размышлений", en: "Time for deep thinking" }, { uz: "Moslashuvchan jadval", ru: "Гибкое расписание", en: "A flexible schedule" }, { uz: "Doimiy jamoa uchrashuvlari", ru: "Регулярные встречи команды", en: "Regular team meetings" }, { uz: "Natijaga yo‘naltirilgan rejim", ru: "Режим, нацеленный на результат", en: "A results-focused schedule" }, { uz: "Aniq jadval va tartib", ru: "Чёткое расписание и порядок", en: "A clear fixed schedule" }]
  },
  40: {
    q: { uz: "Qanday qaror qabul qilish yoqadi?", ru: "Как вы любите принимать решения?", en: "How do you like to make decisions?" },
    opts: [{ uz: "Amaliy sinash orqali", ru: "Через практическую пробу", en: "By trying things out" }, { uz: "Mantiqiy tahlil orqali", ru: "Через логический анализ", en: "Through logical analysis" }, { uz: "Sezgi va ijod orqali", ru: "Через интуицию и творчество", en: "Through intuition and creativity" }, { uz: "Jamoa fikri orqali", ru: "По мнению команды", en: "Based on the team's view" }, { uz: "Tez va hal qiluvchi qaror", ru: "Быстро и решительно", en: "Quickly and decisively" }, { uz: "Aniq ma‘lumot orqali", ru: "По точным данным", en: "Based on clear data" }]
  },
  41: {
    q: { uz: "Qaysi holatda ishlash yaxshi?", ru: "В каком состоянии вам лучше работается?", en: "In which situation do you work best?" },
    opts: [{ uz: "Faol jismoniy ish", ru: "Активная физическая работа", en: "Active physical work" }, { uz: "Chuqur o‘ylash ishi", ru: "Работа с глубокими размышлениями", en: "Deep focused work" }, { uz: "Ijodiy jarayon", ru: "Творческий процесс", en: "A creative process" }, { uz: "Odamlar bilan muloqot", ru: "Общение с людьми", en: "Working with people" }, { uz: "Boshqaruv va muzokara", ru: "Управление и переговоры", en: "Managing and negotiating" }, { uz: "Nazorat va tartiblash", ru: "Контроль и наведение порядка", en: "Controlling and organising" }]
  },
  42: {
    q: { uz: "Qaysi vazifa sizni harakatga keltiradi?", ru: "Какая задача мотивирует вас действовать?", en: "Which task motivates you to act?" },
    opts: [{ uz: "Amaliy natija beruvchi", ru: "Та, что даёт практический результат", en: "One that gives a practical result" }, { uz: "Yangi bilim beruvchi", ru: "Та, что даёт новые знания", en: "One that gives new knowledge" }, { uz: "Ijod talab qiluvchi", ru: "Та, что требует творчества", en: "One that needs creativity" }, { uz: "Odamlarga foydali", ru: "Полезная людям", en: "One that helps people" }, { uz: "Mas’uliyat talab qiluvchi", ru: "Та, что требует ответственности", en: "One that requires responsibility" }, { uz: "Tizimlilik talab qiluvchi", ru: "Та, что требует системности", en: "One that needs a system" }]
  },
  43: {
    q: { uz: "Ish davomida qaysi lahza qiziq?", ru: "Какой момент в работе вам интересен?", en: "Which moment at work is most interesting?" },
    opts: [{ uz: "Qo‘l bilan ishlash", ru: "Работа руками", en: "Working with your hands" }, { uz: "Ma‘lumot o‘rganish", ru: "Изучение данных", en: "Learning new information" }, { uz: "Tasavvur va loyihalash", ru: "Представление и проектирование", en: "Imagining and designing" }, { uz: "Hamkasblar bilan suhbat", ru: "Разговор с коллегами", en: "Talking with colleagues" }, { uz: "Mas’ul qaror qabul qilish", ru: "Принятие важных решений", en: "Making important decisions" }, { uz: "Ro‘yxat va reja tuzish", ru: "Составление списков и планов", en: "Making lists and plans" }]
  },
  44: {
    q: { uz: "Qaysi ish ritmi sizga mos?", ru: "Какой ритм работы вам подходит?", en: "Which work rhythm fits you?" },
    opts: [{ uz: "Harakatli faol ritm", ru: "Активный динамичный ритм", en: "An active lively rhythm" }, { uz: "O‘lchovli chuqur ritm", ru: "Размеренный глубокий ритм", en: "A steady deep rhythm" }, { uz: "Erkin ijodiy ritm", ru: "Свободный творческий ритм", en: "A free creative rhythm" }, { uz: "Jonli muloqot ritmi", ru: "Живой ритм общения", en: "A lively conversational rhythm" }, { uz: "Tezkor dinamik ritm", ru: "Быстрый динамичный ритм", en: "A fast dynamic rhythm" }, { uz: "Barqaror tartibli ritm", ru: "Устойчивый упорядоченный ритм", en: "A stable orderly rhythm" }]
  },
  45: {
    q: { uz: "Qaysi ishda o‘zingizni ko‘rsatasiz?", ru: "В какой работе вы проявляете себя?", en: "In which work do you shine?" },
    opts: [{ uz: "Amaliy vazifada", ru: "В практической задаче", en: "Practical tasks" }, { uz: "Murakkab masalada", ru: "В сложной задаче", en: "Complex problems" }, { uz: "Ijodiy loyihada", ru: "В творческом проекте", en: "Creative projects" }, { uz: "Jamoa ishida", ru: "В командной работе", en: "Team work" }, { uz: "Taqdimot va muzokarada", ru: "В презентациях и переговорах", en: "Presentations and negotiations" }, { uz: "Hisob va tekshiruvda", ru: "В учёте и проверке", en: "Accounting and checking" }]
  },
  46: {
    q: { uz: "Qaysi muhitda ishlash qulay?", ru: "В какой среде вам удобно работать?", en: "In which environment do you like to work?" },
    opts: [{ uz: "Ochiq havoda", ru: "На открытом воздухе", en: "Outdoors" }, { uz: "Laboratoriyada", ru: "В лаборатории", en: "In a laboratory" }, { uz: "Ijodiy studiyada", ru: "В творческой студии", en: "In a creative studio" }, { uz: "Odamlar orasida", ru: "Среди людей", en: "Around people" }, { uz: "Band ofisda", ru: "В оживлённом офисе", en: "In a busy office" }, { uz: "Tartibli idorada", ru: "В аккуратном офисе", en: "In a tidy office" }]
  },
  47: {
    q: { uz: "Qaysi joyda ishlash yoqadi?", ru: "Где вам нравится работать?", en: "Where do you enjoy working?" },
    opts: [{ uz: "Bog‘ va ochiq maydonda", ru: "В саду на открытой площадке", en: "In a garden or open space" }, { uz: "Ilmiy markazda", ru: "В научном центре", en: "In a science centre" }, { uz: "Dizayn studiyasida", ru: "В дизайн-студии", en: "In a design studio" }, { uz: "Maktab yoki maskanda", ru: "В школе или учреждении", en: "At a school or a care centre" }, { uz: "Biznes markazida", ru: "В бизнес-центре", en: "In a business centre" }, { uz: "Arxiv xonasida", ru: "В архиве", en: "In an archive room" }]
  },
  48: {
    q: { uz: "Qaysi sharoit sizga qulay?", ru: "Какие условия вам удобны?", en: "Which conditions suit you?" },
    opts: [{ uz: "Toza havo va ochiq joy", ru: "Свежий воздух и открытое пространство", en: "Fresh air and open space" }, { uz: "Jim va sokin xona", ru: "Тихая спокойная комната", en: "A quiet calm room" }, { uz: "Ko‘rgazmali ijodiy makon", ru: "Наглядное творческое пространство", en: "An inspiring creative space" }, { uz: "Odamlar to‘la makon", ru: "Полное людей пространство", en: "A space full of people" }, { uz: "Jonli dinamik ofis", ru: "Живой динамичный офис", en: "A lively dynamic office" }, { uz: "O‘zgarmas aniq maydon", ru: "Постоянное точное место", en: "A fixed precise place" }]
  },
  49: {
    q: { uz: "Qaysi jamoa sizga yaqin?", ru: "Какая команда вам близка?", en: "Which team feels close to you?" },
    opts: [{ uz: "Mehnatkash jamoa", ru: "Трудолюбивая команда", en: "A hard-working team" }, { uz: "Ilmiy hamkasblar", ru: "Научные коллеги", en: "Scientific colleagues" }, { uz: "Ijodiy guruh", ru: "Творческая группа", en: "A creative group" }, { uz: "Do‘stona guruh", ru: "Дружная группа", en: "A friendly group" }, { uz: "G‘ayratli ishbilarmon jamoa", ru: "Энергичная деловая команда", en: "An energetic business team" }, { uz: "Tartibli professional jamoa", ru: "Упорядоченная профессиональная команда", en: "An orderly professional team" }]
  },
  50: {
    q: { uz: "Qaysi sharoit ishni osonlashtiradi?", ru: "Что облегчает вашу работу?", en: "What makes your work easier?" },
    opts: [{ uz: "Ochiq amaliy ish joyi", ru: "Открытое практичное место", en: "An open hands-on space" }, { uz: "Kutubxona va ma‘lumotga kirish", ru: "Библиотека и доступ к данным", en: "A library and access to information" }, { uz: "Erkin ijodiy hudud", ru: "Свободная творческая зона", en: "A free creative area" }, { uz: "Jamoa qo‘llab-quvvatlovi", ru: "Поддержка команды", en: "Team support" }, { uz: "Rag‘batlantiruvchi raqobat", ru: "Стимулирующая конкуренция", en: "Encouraging competition" }, { uz: "Aniq qoidalar va jadval", ru: "Чёткие правила и график", en: "Clear rules and a schedule" }]
  },
  51: {
    q: { uz: "Qaysi joyda samarali ishlaysiz?", ru: "Где вы работаете эффективно?", en: "Where do you work effectively?" },
    opts: [{ uz: "Tashqarida harakatda", ru: "В движении на улице", en: "Out and about, on the move" }, { uz: "Kitob va kompyuter oldida", ru: "За книгами и компьютером", en: "With books and a computer" }, { uz: "Ustaxonada ijod qilishda", ru: "Творя в мастерской", en: "Creating in a workshop" }, { uz: "Mijozlar bilan suhbatda", ru: "В беседе с клиентами", en: "Talking with clients" }, { uz: "Yig‘ilish va taqdimotda", ru: "На встречах и презентациях", en: "In meetings and presentations" }, { uz: "Toza tartibli idorada", ru: "В чистом аккуратном офисе", en: "In a clean tidy office" }]
  },
  52: {
    q: { uz: "Vaqtingizni qayerda o‘tkazish yoqadi?", ru: "Где вы любите проводить время?", en: "Where do you like to spend time?" },
    opts: [{ uz: "Ustaxona va dalada", ru: "В мастерской и в поле", en: "In a workshop or in the field" }, { uz: "Kutubxona va laboratoriyada", ru: "В библиотеке и лаборатории", en: "In a library or laboratory" }, { uz: "Sahna va studiyada", ru: "На сцене и в студии", en: "On stage or in a studio" }, { uz: "Jamoat joylarida", ru: "В общественных местах", en: "In public places" }, { uz: "Biznes ofislarida", ru: "В бизнес-офисах", en: "In business offices" }, { uz: "Hujjat xonasida", ru: "В комнате с документами", en: "In a document room" }]
  },
  53: {
    q: { uz: "Qaysi vositalar sizga qulay?", ru: "Какие инструменты вам удобны?", en: "Which tools are comfortable for you?" },
    opts: [{ uz: "Mashina va dastgohlar", ru: "Машины и станки", en: "Machines and equipment" }, { uz: "O‘lchov va tahlil asboblari", ru: "Приборы для измерений и анализа", en: "Measuring and analysis tools" }, { uz: "Grafik va dizayn dasturlari", ru: "Графические и дизайн-программы", en: "Graphics and design software" }, { uz: "Hamkorlik vositalari", ru: "Инструменты для сотрудничества", en: "Collaboration tools" }, { uz: "Savdo va boshqaruv tizimlari", ru: "Системы продаж и управления", en: "Sales and management systems" }, { uz: "Jadval va ma’lumot bazalari", ru: "Таблицы и базы данных", en: "Spreadsheets and databases" }]
  },
  54: {
    q: { uz: "Qaysi jadval sizga mos?", ru: "Какой график вам подходит?", en: "Which schedule fits you?" },
    opts: [{ uz: "Faol smenali jadval", ru: "Активный сменный график", en: "An active shift schedule" }, { uz: "Erkin tadqiqot grafigi", ru: "Свободный исследовательский график", en: "A flexible research schedule" }, { uz: "Moslashuvchan ijodiy grafik", ru: "Гибкий творческий график", en: "A flexible creative schedule" }, { uz: "Mijoz jadvaliga moslashuv", ru: "Подстройка под клиентов", en: "Adjusting to clients' schedules" }, { uz: "Dinamik ish jadvali", ru: "Динамичный график", en: "A dynamic schedule" }, { uz: "Barqaror rasmiy jadval", ru: "Стабильный официальный график", en: "A stable fixed schedule" }]
  },
  55: {
    q: { uz: "Qaysi muhitda xotirjam bo‘lasiz?", ru: "В какой среде вы спокойны?", en: "In which environment are you calm?" },
    opts: [{ uz: "Tabiat qo‘ynida", ru: "На лоне природы", en: "In the middle of nature" }, { uz: "Sokin kutubxonada", ru: "В тихой библиотеке", en: "In a quiet library" }, { uz: "Yakka ijodiy makonda", ru: "В собственном творческом пространстве", en: "In your own creative space" }, { uz: "Ishonchli jamoada", ru: "В надёжной команде", en: "In a trusted team" }, { uz: "Band va jonli ofisda", ru: "В оживлённом офисе", en: "In a busy lively office" }, { uz: "Aniq tartib ostida", ru: "При чётком порядке", en: "With clear order" }]
  },
  56: {
    q: { uz: "Qaysi joyda o‘zingizni topasiz?", ru: "Где вы находите себя?", en: "Where do you find yourself?" },
    opts: [{ uz: "Ishlab chiqarish joyida", ru: "На производстве", en: "In a production facility" }, { uz: "Tadqiqot markazida", ru: "В исследовательском центре", en: "At a research centre" }, { uz: "Ijodiy studiyada", ru: "В творческой студии", en: "In a creative studio" }, { uz: "Ta’lim maskanida", ru: "В учебном заведении", en: "At an educational institution" }, { uz: "Savdo ofisida", ru: "В торговом офисе", en: "In a sales office" }, { uz: "Hujjat xonasida", ru: "В комнате с документами", en: "In a document room" }]
  },
  57: {
    q: { uz: "Qaysi resurs siz uchun muhim?", ru: "Какой ресурс важен для вас?", en: "Which resource matters to you?" },
    opts: [{ uz: "Ishonchli asbob-uskunalar", ru: "Надёжное оборудование", en: "Reliable equipment" }, { uz: "Bilim va ma‘lumot bazasi", ru: "База знаний и данных", en: "Knowledge and data" }, { uz: "Ijodiy vositalar va makon", ru: "Творческие инструменты и место", en: "Creative tools and space" }, { uz: "Qo‘llab-quvvatlaydigan jamoa", ru: "Поддерживающая команда", en: "A supportive team" }, { uz: "Bozor va istiqbol ma‘lumoti", ru: "Сведения о рынке и перспективах", en: "Market and growth information" }, { uz: "Aniq protseduralar", ru: "Чёткие процедуры", en: "Clear procedures" }]
  },
  58: {
    q: { uz: "Qaysi joy sizga kuch beradi?", ru: "Какое место даёт вам силы?", en: "Which place gives you energy?" },
    opts: [{ uz: "Ochiq tabiat va maydonlar", ru: "Открытая природа и просторы", en: "Open nature and wide spaces" }, { uz: "Yangi kashfiyotlar", ru: "Новые открытия", en: "New discoveries" }, { uz: "Go‘zal ijodiy makon", ru: "Красивое творческое пространство", en: "A beautiful creative space" }, { uz: "Insonlar va jamiyat", ru: "Люди и общество", en: "People and community" }, { uz: "Yangi imkoniyatlar", ru: "Новые возможности", en: "New opportunities" }, { uz: "Tartibga solingan joy", ru: "Упорядоченное место", en: "An organised place" }]
  },
  59: {
    q: { uz: "Qaysi muhitda rivojlanasiz?", ru: "В какой среде вы развиваетесь?", en: "In which environment do you grow?" },
    opts: [{ uz: "Amaliy ishlab chiqarish muhiti", ru: "Практическая производственная среда", en: "A practical production environment" }, { uz: "Ilmiy izlanish muhiti", ru: "Среда научных поисков", en: "A scientific research environment" }, { uz: "Ijodiy ifoda muhiti", ru: "Среда творческого самовыражения", en: "A creative expression environment" }, { uz: "Xizmat ko‘rsatish muhiti", ru: "Среда обслуживания людей", en: "A service-oriented environment" }, { uz: "Yangi imkoniyatlar muhiti", ru: "Среда новых возможностей", en: "A new-opportunity environment" }, { uz: "Barqaror idora muhiti", ru: "Стабильная офисная среда", en: "A stable office environment" }]
  },
  60: {
    q: { uz: "Qaysi muhitni xayolga keltirasiz?", ru: "Какую среду вы представляете?", en: "Which environment can you imagine?" },
    opts: [{ uz: "Zavod va ustaxonani", ru: "Завод и мастерскую", en: "A factory or workshop" }, { uz: "Ilmiy markazni", ru: "Научный центр", en: "A science centre" }, { uz: "Ijodiy agentlikni", ru: "Творческое агентство", en: "A creative agency" }, { uz: "Ta’lim va tibbiyot maskanini", ru: "Учебное или медицинское учреждение", en: "A school or a medical centre" }, { uz: "Zamonaviy ofisni", ru: "Современный офис", en: "A modern office" }, { uz: "Bank va arxivni", ru: "Банк и архив", en: "A bank or archive" }]
  }
}

export const INTEREST_QA: Record<number, InterestQA> = {
  1: {
    q: { uz: "Minecraft yoki Roblox’da o‘zingiz server yaratib yoki uy qurab ko‘rganmisiz?", ru: "Вы когда-нибудь создавали свой сервер или строили дом в Minecraft или Roblox?", en: "Have you ever built your own house or made your own server in Minecraft or Roblox?" },
    opts: [{ uz: "Ha, o‘zim qilib ko‘rganman", ru: "Да, делал сам", en: "Yes, I've done it myself" }, { uz: "Ha, bir necha marta qilganman", ru: "Да, делал несколько раз", en: "Yes, I've done it a few times" }, { uz: "Bir marta sinab ko‘rganman", ru: "Пробовал один раз", en: "I've tried it once" }, { uz: "Yo‘q, lekin sinab ko‘rgim keladi", ru: "Нет, но хочется попробовать", en: "No, but I'd like to try" }, { uz: "Yo‘q, bunga qiziqmayman", ru: "Нет, мне не интересно", en: "No, I'm not interested" }]
  },
  2: {
    q: { uz: "Velosiped, skeyt yoki o‘yinchoq buzilsa, uni o‘zingiz tuzatishni xohlaysizmi?", ru: "Если сломается велосипед, скейтборд или игрушка, захотите ли вы починить его сами?", en: "If your bike, skateboard or toy breaks, would you want to fix it yourself?" },
    opts: [{ uz: "Ha, o‘zim tuzatishga urinaman", ru: "Да, я попробую починить сам", en: "Yes, I'll try to fix it myself" }, { uz: "Ba’zan o‘zim tuzataman", ru: "Иногда чиню сам", en: "Sometimes I fix things myself" }, { uz: "Faqat oson narsalarni tuzataman", ru: "Чиню только лёгкие вещи", en: "I only fix easy things" }, { uz: "Odatda kattalardan so‘rayman", ru: "Обычно прошу взрослых", en: "I usually ask an adult" }, { uz: "Yo‘q, bunga qiziqmayman", ru: "Нет, мне не интересно", en: "No, I'm not interested" }]
  },
  3: {
    q: { uz: "Uyda kartondan, qog‘ozdan yoki asboblar bilan biror narsa yasashni yoqtirasizmi?", ru: "Нравится ли вам мастерить что-то дома из картона, бумаги или инструментов?", en: "Do you like making things at home from cardboard, paper or tools?" },
    opts: [{ uz: "Ha, juda yoqadi", ru: "Да, очень нравится", en: "Yes, I love it" }, { uz: "Ha, qilishni yaxshi ko‘raman", ru: "Да, очень люблю", en: "Yes, I really like it" }, { uz: "Ba’zan qilaman", ru: "Иногда делаю", en: "Sometimes I do" }, { uz: "Yo‘q, unchalik qiziqtirmaydi", ru: "Нет, не очень интересно", en: "No, not really" }]
  },
  4: {
    q: { uz: "Robot, mashina yoki qurilmalarning qanday ishlashiga qiziqasizmi?", ru: "Вам интересно, как работают роботы, машины или устройства?", en: "Are you curious how robots, machines or gadgets work?" },
    opts: [{ uz: "Ha, juda qiziqaman", ru: "Да, очень интересно", en: "Yes, very curious" }, { uz: "Ha, qarash va o‘rganishni yaxshi ko‘raman", ru: "Да, люблю смотреть и изучать", en: "Yes, I like watching and learning" }, { uz: "Ba’zan qiziqaman", ru: "Иногда интересно", en: "Sometimes curious" }, { uz: "Yo‘q, unchalik qiziqmayman", ru: "Нет, не очень", en: "No, not really" }]
  },
  5: {
    q: { uz: "Telefon yoki kompyuterda biror narsa ishlamay qolsa, sababini o‘zingiz topishga harakat qilasizmi?", ru: "Если на телефоне или компьютере что-то не работает, вы сами пытаетесь найти причину?", en: "If something stops working on your phone or computer, do you try to figure out why yourself?" },
    opts: [{ uz: "Ha, o‘zim topib ko‘raman", ru: "Да, я ищу причину сам", en: "Yes, I figure it out myself" }, { uz: "Ha, avval o‘zim urinib ko‘raman", ru: "Да, сначала пробую сам", en: "Yes, I try myself first" }, { uz: "Ba’zan o‘zim urinaman", ru: "Иногда пробую сам", en: "Sometimes I try myself" }, { uz: "Odatda boshqalardan yordam so‘rayman", ru: "Обычно прошу помощи", en: "I usually ask for help" }, { uz: "Yo‘q, menga qiziq emas", ru: "Нет, мне не интересно", en: "No, it doesn't interest me" }]
  },
  6: {
    q: { uz: "Suv, o‘simlik yoki magnitlar bilan kichik ilmiy tajriba qilishni yoqtirasizmi?", ru: "Нравится ли вам проводить маленькие научные опыты с водой, растениями или магнитами?", en: "Do you like doing little science experiments with water, plants or magnets?" },
    opts: [{ uz: "Ha, tajriba qilishni yaxshi ko‘raman", ru: "Да, люблю экспериментировать", en: "Yes, I love experimenting" }, { uz: "Ba’zan sinab ko‘raman", ru: "Иногда пробую", en: "Sometimes I try" }, { uz: "Bir marta qilib ko‘rganman", ru: "Пробовал один раз", en: "I've tried it once" }, { uz: "Yo‘q, qiziqmayman", ru: "Нет, не интересуюсь", en: "No, not interested" }]
  },
  7: {
    q: { uz: "Yulduzlar, dinozavrlar yoki tabiat sirlari haqida o‘qib o‘rganishni xohlaysizmi?", ru: "Хотите ли вы читать и узнавать о звёздах, динозаврах или тайнах природы?", en: "Would you like to read and learn about stars, dinosaurs or nature's secrets?" },
    opts: [{ uz: "Ha, juda yoqadi", ru: "Да, очень нравится", en: "Yes, I love it" }, { uz: "Ha, qiziqaman", ru: "Да, интересуюсь", en: "Yes, I'm interested" }, { uz: "Ba’zan o‘qiyman", ru: "Иногда читаю", en: "Sometimes I read" }, { uz: "Yo‘q, unchalik qiziqmayman", ru: "Нет, не очень", en: "No, not really" }]
  },
  8: {
    q: { uz: "Biror masalani o‘ylab, o‘zingiz yechim topganingizda quvonasizmi?", ru: "Вы радуетесь, когда сами придумываете решение какой-то задачи?", en: "Are you happy when you find the answer to a problem yourself?" },
    opts: [{ uz: "Ha, juda quvonaman", ru: "Да, очень радуюсь", en: "Yes, very happy" }, { uz: "Ha, quvonaman", ru: "Да, радуюсь", en: "Yes, I am" }, { uz: "Ba’zan quvonaman", ru: "Иногда радуюсь", en: "Sometimes" }, { uz: "Yo‘q, unchalik emas", ru: "Нет, не очень", en: "No, not really" }]
  },
  9: {
    q: { uz: "Rasm chizish, suratga olish yoki video montaj qilib, o‘z kontentingizni yaratishni yoqtirasizmi?", ru: "Нравится ли вам рисовать, фотографировать или монтировать видео и создавать свой контент?", en: "Do you like drawing, taking photos or making videos to create your own content?" },
    opts: [{ uz: "Ha, juda yoqadi", ru: "Да, очень нравится", en: "Yes, I love it" }, { uz: "Ha, qilishni yaxshi ko‘raman", ru: "Да, очень люблю", en: "Yes, I really like it" }, { uz: "Ba’zan qilaman", ru: "Иногда делаю", en: "Sometimes I do" }, { uz: "Yo‘q, unchalik qiziqtirmaydi", ru: "Нет, не очень интересно", en: "No, not really" }]
  },
  10: {
    q: { uz: "Telefonda yoki daftarda o‘z qahramoningiz, kiyim yoki bezak dizaynini o‘ylab topasizmi?", ru: "Придумываете ли вы на телефоне или в тетради дизайн своих героев, одежды или украшений?", en: "Do you come up with your own heroes, clothes or decoration designs on your phone or in a notebook?" },
    opts: [{ uz: "Ha, ko‘p o‘ylab topaman", ru: "Да, часто придумываю", en: "Yes, I think them up a lot" }, { uz: "Ha, tez-tez", ru: "Да, часто", en: "Yes, often" }, { uz: "Ba’zan", ru: "Иногда", en: "Sometimes" }, { uz: "Yo‘q, qilmayman", ru: "Нет, не делаю", en: "No, I don't" }]
  },
  11: {
    q: { uz: "Hikoya, qo‘shiq yoki she’r yozib, fikrlaringizni ifoda etishni xohlaysizmi?", ru: "Хотите ли вы выражать свои мысли, сочиняя истории, песни или стихи?", en: "Would you like to express your ideas by writing stories, songs or poems?" },
    opts: [{ uz: "Ha, juda yoqadi", ru: "Да, очень нравится", en: "Yes, I love it" }, { uz: "Ha, yozishni yaxshi ko‘raman", ru: "Да, очень люблю писать", en: "Yes, I love writing" }, { uz: "Ba’zan yozaman", ru: "Иногда пишу", en: "Sometimes I write" }, { uz: "Yo‘q, qiziqmayman", ru: "Нет, не интересуюсь", en: "No, not interested" }]
  },
  12: {
    q: { uz: "Xonangiz yoki stolingizni o‘z didingiz bilan chiroyli bezashni yoqtirasizmi?", ru: "Нравится ли вам красиво украшать свою комнату или стол по своему вкусу?", en: "Do you like decorating your room or desk to make it beautiful?" },
    opts: [{ uz: "Ha, juda yoqadi", ru: "Да, очень нравится", en: "Yes, I love it" }, { uz: "Ha, yaxshi ko‘raman", ru: "Да, люблю", en: "Yes, I like it" }, { uz: "Ba’zan qilaman", ru: "Иногда делаю", en: "Sometimes I do" }, { uz: "Yo‘q, qilmayman", ru: "Нет, не делаю", en: "No, I don't" }]
  },
  13: {
    q: { uz: "Do‘stingizga o‘yin qoidalarini yoki uy vazifasini tushuntirib berishni yoqtirasizmi?", ru: "Нравится ли вам объяснять другу правила игры или домашнее задание?", en: "Do you like explaining a game's rules or homework to a friend?" },
    opts: [{ uz: "Ha, tushuntirishni yoqtiraman", ru: "Да, люблю объяснять", en: "Yes, I love explaining" }, { uz: "Ha, tushuntirib beraman", ru: "Да, объясняю", en: "Yes, I explain" }, { uz: "Ba’zan beraman", ru: "Иногда объясняю", en: "Sometimes I do" }, { uz: "Yo‘q, unchalik yoqmaydi", ru: "Нет, не очень нравится", en: "No, not really" }]
  },
  14: {
    q: { uz: "Sinfdoshlaringizga yoki kichiklarga yordam berishdan xursand bo‘lasizmi?", ru: "Радуетесь ли вы, когда помогаете одноклассникам или младшим?", en: "Do you feel happy when you help classmates or younger kids?" },
    opts: [{ uz: "Ha, har doim yordam beraman", ru: "Да, всегда помогаю", en: "Yes, I always help" }, { uz: "Ha, yordam berishni yaxshi ko‘raman", ru: "Да, очень люблю помогать", en: "Yes, I love helping" }, { uz: "Ba’zan yordam beraman", ru: "Иногда помогаю", en: "Sometimes I help" }, { uz: "Yo‘q, unchalik emas", ru: "Нет, не очень", en: "No, not really" }]
  },
  15: {
    q: { uz: "Guruh o‘yinida hamma bilan muloqot qilib, birga o‘ynashni xohlaysizmi?", ru: "В командной игре хотите ли вы общаться со всеми и играть вместе?", en: "In a group game, do you want to talk with everyone and play together?" },
    opts: [{ uz: "Ha, muloqotni juda yoqtiraman", ru: "Да, очень люблю общение", en: "Yes, I love talking with people" }, { uz: "Ha, yoqtiraman", ru: "Да, люблю", en: "Yes, I do" }, { uz: "Ba’zan", ru: "Иногда", en: "Sometimes" }, { uz: "Yo‘q, yakka o‘ynashni afzal ko‘raman", ru: "Нет, предпочитаю играть один", en: "No, I prefer playing alone" }]
  },
  16: {
    q: { uz: "Do‘stlaringiz muammosini tinglab, ularga dalda berishni yoqtirasizmi?", ru: "Нравится ли вам слушать проблемы друзей и поддерживать их?", en: "Do you like listening to your friends' problems and cheering them up?" },
    opts: [{ uz: "Ha, do‘stlarimni tinglayman", ru: "Да, я слушаю друзей", en: "Yes, I listen to my friends" }, { uz: "Ha, dalda berishni yaxshi ko‘raman", ru: "Да, очень люблю поддерживать", en: "Yes, I love supporting them" }, { uz: "Ba’zan", ru: "Иногда", en: "Sometimes" }, { uz: "Yo‘q, unchalik emas", ru: "Нет, не очень", en: "No, not really" }]
  },
  17: {
    q: { uz: "Sinf yoki to‘garak ishida rahbar bo‘lib, ishlarni taqsimlashni xohlaysizmi?", ru: "Хотите ли вы быть лидером в классе или кружке и распределять задания?", en: "Would you like to lead the class or club and hand out tasks?" },
    opts: [{ uz: "Ha, rahbar bo‘lishni xohlayman", ru: "Да, хочу быть лидером", en: "Yes, I want to be the leader" }, { uz: "Ha, yoqadi", ru: "Да, нравится", en: "Yes, I like it" }, { uz: "Ba’zan", ru: "Иногда", en: "Sometimes" }, { uz: "Yo‘q, unchalik yoqmaydi", ru: "Нет, не очень нравится", en: "No, not really" }]
  },
  18: {
    q: { uz: "Yarmarka yoki do‘konda biror narsani sotish va odamlarni ko‘ndirishni sinab ko‘rmoqchimisiz?", ru: "Хотите ли вы попробовать продавать что-то на ярмарке или в магазине и убеждать людей?", en: "Would you like to try selling something at a fair or shop and convince people to buy?" },
    opts: [{ uz: "Ha, sotib ko‘rganman va yoqdi", ru: "Да, продавал и понравилось", en: "Yes, I've sold and liked it" }, { uz: "Ha, sinab ko‘rmoqchiman", ru: "Да, хочется попробовать", en: "Yes, I'd like to try" }, { uz: "Ba’zan qiziqiyman", ru: "Иногда интересно", en: "Sometimes interesting" }, { uz: "Yo‘q, qiziqmayman", ru: "Нет, не интересуюсь", en: "No, not interested" }]
  },
  19: {
    q: { uz: "Yangi o‘yin-g‘oyani taklif qilib, guruhni o‘z fikringizga ishontirmoqchisiz?", ru: "Хотите ли вы предложить новую игровую идею и убедить группу в своём мнении?", en: "Would you like to suggest a new game idea and convince the group to follow it?" },
    opts: [{ uz: "Ha, g‘oyamni tushuntirib beraman", ru: "Да, я объясню свою идею", en: "Yes, I'll explain my idea" }, { uz: "Ha, urinaman", ru: "Да, попробую", en: "Yes, I'll try" }, { uz: "Ba’zan", ru: "Иногда", en: "Sometimes" }, { uz: "Yo‘q, qilmayman", ru: "Нет, не буду", en: "No, I won't" }]
  },
  20: {
    q: { uz: "Musobaqada jamoani g‘oliblikka undash va boshqarishni yoqtirasizmi?", ru: "Нравится ли вам вести команду к победе на соревновании?", en: "Do you like leading a team to victory in a competition?" },
    opts: [{ uz: "Ha, jamoani boshqarishni yoqtiraman", ru: "Да, люблю руководить командой", en: "Yes, I love leading the team" }, { uz: "Ha, yoqadi", ru: "Да, нравится", en: "Yes, I like it" }, { uz: "Ba’zan", ru: "Иногда", en: "Sometimes" }, { uz: "Yo‘q, unchalik emas", ru: "Нет, не очень", en: "No, not really" }]
  },
  21: {
    q: { uz: "Kitoblar, o‘yinchoqlar yoki qalamlaringizni tartibga solib, ro‘yxat tuzishni yoqtirasizmi?", ru: "Нравится ли вам наводить порядок в книгах, игрушках или карандашах и составлять списки?", en: "Do you like sorting your books, toys or pencils and making lists?" },
    opts: [{ uz: "Ha, tartibga solishni yoqtiraman", ru: "Да, люблю порядок", en: "Yes, I love organising" }, { uz: "Ha, yaxshi ko‘raman", ru: "Да, очень нравится", en: "Yes, I really like it" }, { uz: "Ba’zan qilaman", ru: "Иногда делаю", en: "Sometimes I do" }, { uz: "Yo‘q, unchalik emas", ru: "Нет, не очень", en: "No, not really" }]
  },
  22: {
    q: { uz: "Dars va to‘garak rejasini tuzib, ishlarini o‘z vaqtida bajarishdan mamnun bo‘lasizmi?", ru: "Вы радуетесь, когда составляете план уроков и кружков и всё делаете вовремя?", en: "Are you happy when you make a plan for lessons and clubs and finish everything on time?" },
    opts: [{ uz: "Ha, reja tuzib bajaraman", ru: "Да, делаю по плану", en: "Yes, I follow a plan" }, { uz: "Ha, o‘z vaqtida bajarishga harakat qilaman", ru: "Да, стараюсь успевать", en: "Yes, I try to be on time" }, { uz: "Ba’zan", ru: "Иногда", en: "Sometimes" }, { uz: "Yo‘q, unchalik emas", ru: "Нет, не очень", en: "No, not really" }]
  },
  23: {
    q: { uz: "Ballar yoki pullar hisobini yuritib, xatoni topishni yoqtirasizmi?", ru: "Нравится ли вам вести подсчёт баллов или денег и находить ошибки?", en: "Do you like keeping track of points or money and finding mistakes?" },
    opts: [{ uz: "Ha, hisob yuritishni yoqtiraman", ru: "Да, люблю считать", en: "Yes, I love keeping count" }, { uz: "Ha, yoqadi", ru: "Да, нравится", en: "Yes, I like it" }, { uz: "Ba’zan", ru: "Иногда", en: "Sometimes" }, { uz: "Yo‘q, unchalik emas", ru: "Нет, не очень", en: "No, not really" }]
  },
  24: {
    q: { uz: "Stikerlar va jadvallar bilan reja yuritib, tartibda qolishni xohlaysizmi?", ru: "Хотите ли вы вести план со стикерами и таблицами и держать всё в порядке?", en: "Would you like to keep a plan with stickers and charts and stay organised?" },
    opts: [{ uz: "Ha, reja yuritishni yaxshi ko‘raman", ru: "Да, очень люблю планировать", en: "Yes, I love planning" }, { uz: "Ha, yoqadi", ru: "Да, нравится", en: "Yes, I like it" }, { uz: "Ba’zan qilaman", ru: "Иногда делаю", en: "Sometimes I do" }, { uz: "Yo‘q, qiziqmayman", ru: "Нет, не интересуюсь", en: "No, not interested" }]
  }
}

export const CAREER_META: Record<string, CareerMetaQA> = {
  "dev": {
    name: { uz: "Dastur ishlab chiquvchi", ru: "Разработчик ПО", en: "Software Developer" },
    description: { uz: "Dasturlar, ilovalar va veb-saytlarni yaratib, ularni doimiy yaxshilab boradi.", ru: "Создаёт программы, приложения и веб-сайты и постоянно их улучшает.", en: "Creates programs, apps and websites and keeps improving them." }
  },
  "data": {
    name: { uz: "Ma’lumotlar tahlilchisi", ru: "Аналитик данных", en: "Data Analyst" },
    description: { uz: "Xom ma’lumotlarni aniq xulosalarga aylantiradi va oqilona qarorlar qabul qilishga yordam beradi.", ru: "Превращает сырые данные в точные выводы и помогает принимать разумные решения.", en: "Turns raw data into clear insights and helps make smart decisions." }
  },
  "designer": {
    name: { uz: "Grafik dizayner", ru: "Графический дизайнер", en: "Graphic Designer" },
    description: { uz: "Odamlar eslab qoladigan vizual identifikatsiya, interfeys va brendlarni yaratadi.", ru: "Создаёт визуальные стили, интерфейсы и бренды, которые запоминаются.", en: "Creates memorable visual identities, interfaces and brands." }
  },
  "architect": {
    name: { uz: "Me’mor", ru: "Архитектор", en: "Architect" },
    description: { uz: "Go‘zallik, konstruksiya va odamlar turmushini uyg‘unlashtirgan binolar va fazolarni loyihalaydi.", ru: "Проектирует здания и пространства, сочетая красоту, конструкцию и жизнь людей.", en: "Designs buildings and spaces that blend beauty, structure and people's lives." }
  },
  "doctor": {
    name: { uz: "Shifokor", ru: "Врач", en: "Doctor" },
    description: { uz: "Odamlarni tashxislaydi, davolaydi va ularning sog‘lom hayot kechirishiga ko‘maklashadi.", ru: "Диагностирует и лечит людей и помогает им вести здоровую жизнь.", en: "Diagnoses and treats people and helps them live healthy lives." }
  },
  "nurse": {
    name: { uz: "Hamshira", ru: "Медсестра", en: "Nurse" },
    description: { uz: "Bemorlarga har kuni amaliy yordam va g‘amxo‘rlik ko‘rsatadi.", ru: "Каждый день оказывает пациентам практическую помощь и заботу.", en: "Provides patients with hands-on care and attention every day." }
  },
  "teacher": {
    name: { uz: "O‘qituvchi", ru: "Учитель", en: "Teacher" },
    description: { uz: "O‘quvchilarni o‘rganishga, o‘sishga va o‘z imkoniyatlarini kashf etishga yo‘l ko‘rsatadi.", ru: "Помогает ученикам учиться, расти и открывать свои возможности.", en: "Guides students to learn, grow and discover their potential." }
  },
  "mechanic": {
    name: { uz: "Avtomexanik", ru: "Автомеханик", en: "Car Mechanic" },
    description: { uz: "Avtomobillar va texnikani tashxislab, ta’mirlab, ularni harakatda ushlab turadi.", ru: "Диагностирует и ремонтирует автомобили и технику, поддерживая их в движении.", en: "Diagnoses and repairs cars and machinery to keep them running." }
  },
  "electrician": {
    name: { uz: "Elektrik", ru: "Электрик", en: "Electrician" },
    description: { uz: "Uylar va korxonalarni quvvat bilan ta’minlovchi elektr tizimlarini o‘rnatadi va ta’mirlaydi.", ru: "Устанавливает и ремонтирует электрические системы домов и предприятий.", en: "Installs and repairs the electrical systems that power homes and businesses." }
  },
  "carpenter": {
    name: { uz: "Duradgor", ru: "Плотник", en: "Carpenter" },
    description: { uz: "Xom yog‘ochdan uylar, mebellar va nozik detallar quradi va shakllantiradi.", ru: "Строит и создаёт дома, мебель и тонкие детали из древесины.", en: "Builds and shapes houses, furniture and fine details from wood." }
  },
  "chef": {
    name: { uz: "Oshpaz", ru: "Повар", en: "Chef" },
    description: { uz: "Ta’m, mahorat va tezlikni uyg‘unlashtirib, odamlarni zavqlantiradigan taomlar tayyorlaydi.", ru: "Готовит блюда, соединяя вкус, мастерство и скорость, радуя людей.", en: "Prepares food combining taste, skill and speed to delight people." }
  },
  "musician": {
    name: { uz: "Musiqachi", ru: "Музыкант", en: "Musician" },
    description: { uz: "Auditoriyani hayratga soladigan va ruhlantiradigan musiqa yaratadi va ijro etadi.", ru: "Создаёт и исполняет музыку, которая восхищает и вдохновляет аудиторию.", en: "Creates and performs music that delights and inspires an audience." }
  },
  "writer": {
    name: { uz: "Yozuvchi", ru: "Писатель", en: "Writer" },
    description: { uz: "Hikoyalarni aytib, so‘z orqali ma’lumot beradi, ilhomlantiradi va ta’sir qiladi.", ru: "Рассказывает истории и через слово информирует, вдохновляет и влияет.", en: "Tells stories and uses words to inform, inspire and influence." }
  },
  "counselor": {
    name: { uz: "Psixolog / maslahatchi", ru: "Психолог / консультант", en: "Psychologist / Counselor" },
    description: { uz: "Odamlarga ruhiy salomatlik, qiyinchiliklar va shaxsiy o‘sishda yordam beradi.", ru: "Помогает людям в психическом здоровье, трудностях и личностном росте.", en: "Helps people with mental health, challenges and personal growth." }
  },
  "phys-therapist": {
    name: { uz: "Fizioterapevt", ru: "Физиотерапевт", en: "Physical Therapist" },
    description: { uz: "Odamlarga harakat qobiliyatini tiklashga va og‘riqsiz yashashga yordam beradi.", ru: "Помогает людям восстановить движение и жить без боли.", en: "Helps people regain movement and live without pain." }
  },
  "sales": {
    name: { uz: "Savdo menejeri", ru: "Менеджер по продажам", en: "Sales Manager" },
    description: { uz: "Jamoani boshqaradi, munosabatlarni quradi va daromadni oshiradigan bitimlar tuzadi.", ru: "Управляет командой, строит отношения и заключает сделки, увеличивающие доход.", en: "Leads a team, builds relationships and closes deals that grow revenue." }
  },
  "entrepreneur": {
    name: { uz: "Tadbirkor", ru: "Предприниматель", en: "Entrepreneur" },
    description: { uz: "Korxonalarni boshlaydi, o‘lchangan tavakkal qiladi va yangi narsalarni yaratadi.", ru: "Открывает предприятия, идёт на просчитанный риск и создаёт новое.", en: "Starts businesses, takes calculated risks and creates new things." }
  },
  "marketing": {
    name: { uz: "Marketing menejeri", ru: "Менеджер по маркетингу", en: "Marketing Manager" },
    description: { uz: "E‘tiborni tortadigan va talabni oshiradigan brend va kampaniyalarni shakllantiradi.", ru: "Формирует бренды и кампании, привлекающие внимание и повышающие спрос.", en: "Builds brands and campaigns that grab attention and drive demand." }
  },
  "lawyer": {
    name: { uz: "Huquqshunos", ru: "Юрист", en: "Lawyer" },
    description: { uz: "Ishlarni himoya qiladi, qonunni talqin qiladi va mijoz manfaatini qo‘riqlaydi.", ru: "Защищает дела, толкует закон и отстаивает интересы клиентов.", en: "Argues cases, interprets the law and protects clients' interests." }
  },
  "accountant": {
    name: { uz: "Buxgalter", ru: "Бухгалтер", en: "Accountant" },
    description: { uz: "Moliyaviy hisobni aniq yuritadi va pulni oqilona boshqarish bo‘yicha maslahat beradi.", ru: "Точно ведёт финансовый учёт и советует, как разумно распоряжаться средствами.", en: "Keeps financial records accurate and advises on managing money wisely." }
  },
  "fin-analysis": {
    name: { uz: "Moliyaviy tahlilchi", ru: "Финансовый аналитик", en: "Financial Analyst" },
    description: { uz: "Bozorlar va investitsiyalarni o‘rganib, oqilona moliyaviy qarorlar uchun asos yaratadi.", ru: "Изучает рынки и инвестиции, создавая основу для разумных финансовых решений.", en: "Studies markets and investments to inform smart financial decisions." }
  },
  "police": {
    name: { uz: "Politsiya xodimi", ru: "Сотрудник полиции", en: "Police Officer" },
    description: { uz: "Jamoani himoya qiladi, favqulodda vaziyatlarga javob beradi va tartibni ta’minlaydi.", ru: "Защищает общество, реагирует на чрезвычайные ситуации и поддерживает порядок.", en: "Protects the community, responds to emergencies and keeps order." }
  },
  "farmer": {
    name: { uz: "Fermer / dehqon", ru: "Фермер / земледелец", en: "Farmer" },
    description: { uz: "Oziq-ovqat yetishtiradi, yer, hayvonlar va hosilni barcha fasllarda boshqaradi.", ru: "Выращивает продукты, управляя землёй, животными и урожаем во все сезоны.", en: "Grows food and manages land, animals and crops through all seasons." }
  },
  "pilot": {
    name: { uz: "Uchuvchi", ru: "Лётчик", en: "Pilot" },
    description: { uz: "Samolyotlarni boshqaradi va murakkab jarayonlarni aniqlik va xotirjamlik bilan yuritadi.", ru: "Управляет самолётами и ведёт сложные процессы точно и спокойно.", en: "Flies aircraft and manages complex processes with precision and calm." }
  },
  "translator": {
    name: { uz: "Tarjimon", ru: "Переводчик", en: "Translator" },
    description: { uz: "Tillar va madaniyatlarni aniqlik va noziklik bilan bog‘laydi.", ru: "Точно и бережно соединяет языки и культуры.", en: "Connects languages and cultures with accuracy and care." }
  },
  "conservation": {
    name: { uz: "Atrof-muhit bo‘yicha mutaxassis", ru: "Специалист по охране природы", en: "Conservation Specialist" },
    description: { uz: "O‘rmonlar, suv va yovvoyi tabiatni dala ishlari va ehtiyotkor rejalash orqali himoya qiladi.", ru: "Защищает леса, воду и дикую природу через полевую работу и бережное планирование.", en: "Protects forests, water and wildlife through fieldwork and careful planning." }
  },
  "biologist": {
    name: { uz: "Tadqiqotchi biolog", ru: "Учёный-биолог", en: "Research Biologist" },
    description: { uz: "Tirik tizimlarni o‘rganadi va tushunchani chuqurlashtiradigan kashfiyotlar qiladi.", ru: "Изучает живые системы и совершает открытия, углубляющие понимание жизни.", en: "Studies living systems and makes discoveries that deepen our understanding." }
  }
}

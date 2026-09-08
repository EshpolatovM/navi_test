// Central UI dictionary — everything except the quiz questions themselves.
// Questions/answers live in the data layer and stay in Uzbek (they are content,
// not chrome); this file covers onboarding, buttons, labels and section titles.

export type Lang = 'uz' | 'ru' | 'en'

export const LANGS: { code: Lang; label: string; native: string; flag: string }[] = [
  { code: 'uz', label: 'O\u2018ZBEKCHA', native: 'O\u2018zbekcha', flag: '\u{1F1FA}\u{1F1FF}' },
  { code: 'ru', label: 'РУССКИЙ', native: 'Русский', flag: '\u{1F1F7}\u{1F1FA}' },
  { code: 'en', label: 'ENGLISH', native: 'English', flag: '\u{1F1EC}\u{1F1E7}' },
]

type Dict = Record<string, string>

const uz: Dict = {
  'onb.lang.title': 'Tilni tanlang',
  'onb.lang.sub': 'Ushbu tilda davom etamiz',
  'onb.theme.title': 'Ko\u2018rinishni tanlang',
  'onb.theme.sub': 'Yorug\u2018 yoki qorong\u2018i muhit',
  'onb.theme.light': 'Kun',
  'onb.theme.dark': 'Tun',
  'onb.color.title': 'Rangni tanlang',
  'onb.color.sub': 'Bu rang butun test yo\u2018nalishini belgilaydi',
  'onb.start': 'Boshlash',
  'onb.hint': 'Keyinchalik sozlamalardan o\u2018zgartirishingiz mumkin',

  'settings.title': 'Sozlamalar',
  'settings.lang': 'Til',
  'settings.theme': 'Ko\u2018rinish',
  'settings.theme.light': 'Yorug\u2018',
  'settings.theme.dark': 'Qorong\u2018i',
  'settings.accent': 'Akcent rang',
  'settings.close': 'Yopish',

  'app.back': 'Ortga',
  'app.cheat': 'Cheat rejim · tasodifiy javoblar',

  'splash.hello.a': 'Nimadan',
  'splash.hello.b': 'boshlaymiz',
  'splash.sub':
    'Ikkala test ham bepul va ro\u2018yxatdan o\u2018tish talab qilmaydi. Istalgan paytda orqaga qaytib, natijangizni saqlab davom ettirishingiz mumkin.',

  'card.interest.title': 'QIZIQISH',
  'card.interest.sub':
    'Agar hali aniq maqsadingiz bo\u2018lmasa yoki qaysi yo\u2018nalish sizga mosligini bilmasangiz — QIZIQISH testidan boshlang.',
  'card.interest.badge': 'Yangi · RIASEC',
  'card.career.title': 'REAL KASB TANLASH',
  'card.career.sub':
    'Agar maqsadingiz aniq bo\u2018lsa, bilim va ko\u2018nikmalaringizni jiddiy rivojlantirmoqchi bo\u2018lsangiz — REAL KASB TANLASH testini boshlang.',
  'card.career.badge': 'To\u2018liq kasb testi',
  'card.cta': 'Testni boshlash',
  'card.resume': 'Davom etish · {n}/{total}',
  'card.result': 'Natijani ko\u2018rish',

  'splash.chip.interest': 'Qiziqish: {n} savol · ~2 daqiqa',
  'splash.chip.career': 'Real kasb: {n} savol · {m} kasb · ~4 daqiqa',

  'road.title': 'Sayohat',
  'road.aside': 'Bosqichlar',
  'road.total': '{n} savol',
  'road.savol': 'savol {a}/{s}',
  'road.signal': 'Karyera signalingiz',

  'prog.savol': 'SAVOL',

  'scene.hint': 'O\u2018zingni eng ko\u2018p o\u2018ziga tortganini tanla',
  'scene.footer':
    'G\u2018oyalar orasida erkin harakatlan — konstellyatsiya javob beradi. Birini tanla, u seni oldinga olib borsin.',

  'ir.top': 'Javoblaringiz asosida qiziqish yo\u2018nalishingiz aniqlandi',
  'ir.profile': 'Sizning RIASEC profilingiz',
  'ir.strength': 'kuch',
  'ir.topBadge': 'Eng kuchli',
  'ir.second': 'Ikkinchi',
  'ir.para': 'Siz asosan {adj} — sizga {phrase} faoliyatlar moyil.',
  'ir.para2': 'Ikkinchi kuchli tomoningiz — {short}.',
  'ir.all': 'Barcha yo\u2018nalishlar bo\u2018yicha natija',
  'ir.why': 'Nima uchun bu muhim?',
  'ir.whyBody':
    'RIASEC — O*NET kasb ma\u2018lumotlar bazasida qo\u2018llaniladigan qiziqish modeli. Ushbu test yuqoridagi mehnat faoliyatlaridagi qiziqishlaringiz asosida sizning profilingizni qurdi. Keyingi bosqichda real kasb testi javoblaringizni 100+ kasb profili bilan taqqoslab, aniq yo\u2018nalishlar beradi.',
  'ir.restart': 'Qaytadan',
  'ir.other': 'Boshqa testga',
  'ir.disclaimer': 'Rasmiy O*NET testi emas — qiziqishlarni kashf qilish uchun moslashtirilgan.',

  'rc.top': 'Sizning javoblaringizga asoslanib, bu kasb yo\u2018nalishlari sizga eng mos bo\u2018lishi mumkin',
  'rc.signal': 'signal',
  'rc.karyera': 'Sizning karyera signalingiz',
  'rc.signals': 'Eng mos kasb yo\u2018nalishlari',
  'rc.yourSignals': 'Sizning eng kuchli signallaringiz: {list}.',
  'rc.why': 'Nega aynan {name}?',
  'rc.restart': 'Yana kashf qilish',
  'rc.note': 'Kasb yo\u2018nalishi — bu kashf qilish uchun boshlanish nuqtasi, siz haqingizdagi hukm emas.',

  'stage.BOSHLASH': 'BOSHLASH',
  'stage.QIZIQISHLAR': 'QIZIQISHLAR',
  'stage.FAOLIYATLAR': 'FAOLIYATLAR',
  'stage.ISH_USLUBI': 'ISH USLUBI',
  'stage.ISH_MUHITI': 'ISH MUHITI',
  'stage.NATIJA': 'NATIJA',

  'dim.R.name': 'Amaliy (Realistik)',
  'dim.R.short': 'Amaliy',
  'dim.I.name': 'Izlanuvchan (Analitik)',
  'dim.I.short': 'Izlanuvchan',
  'dim.A.name': 'Ijodiy (Artistik)',
  'dim.A.short': 'Ijodiy',
  'dim.S.name': 'Ijtimoiy',
  'dim.S.short': 'Ijtimoiy',
  'dim.E.name': 'Tadbirkor',
  'dim.E.short': 'Tadbirkor',
  'dim.C.name': 'Tartibli (Konventsional)',
  'dim.C.short': 'Tartibli',
}

const ru: Dict = {
  'onb.lang.title': 'Выберите язык',
  'onb.lang.sub': 'Продолжим на этом языке',
  'onb.theme.title': 'Выберите оформление',
  'onb.theme.sub': 'Светлый или тёмный режим',
  'onb.theme.light': 'Светлая',
  'onb.theme.dark': 'Тёмная',
  'onb.color.title': 'Выберите цвет',
  'onb.color.sub': 'Этот цвет задаст стиль всего теста',
  'onb.start': 'Начать',
  'onb.hint': 'Позже можно изменить в настройках',

  'settings.title': 'Настройки',
  'settings.lang': 'Язык',
  'settings.theme': 'Оформление',
  'settings.theme.light': 'Светлое',
  'settings.theme.dark': 'Тёмное',
  'settings.accent': 'Акцентный цвет',
  'settings.close': 'Закрыть',

  'app.back': 'Назад',
  'app.cheat': 'Чит-режим · случайные ответы',

  'splash.hello.a': 'С чего',
  'splash.hello.b': 'начнём',
  'splash.sub':
    'Оба теста бесплатны и не требуют регистрации. Вы можете вернуться в любой момент и продолжить, сохранив результат.',

  'card.interest.title': 'ИНТЕРЕСЫ',
  'card.interest.sub':
    'Если у вас ещё нет чёткой цели или вы не знаете, какое направление подходит — начните с теста ИНТЕРЕСЫ.',
  'card.interest.badge': 'Новое · RIASEC',
  'card.career.title': 'РЕАЛЬНЫЙ ВЫБОР ПРОФЕССИИ',
  'card.career.sub':
    'Если ваша цель ясна и вы хотите серьёзно развивать знания и навыки — пройдите тест РЕАЛЬНЫЙ ВЫБОР ПРОФЕССИИ.',
  'card.career.badge': 'Полный тест профессий',
  'card.cta': 'Начать тест',
  'card.resume': 'Продолжить · {n}/{total}',
  'card.result': 'Посмотреть результат',

  'splash.chip.interest': 'Интересы: {n} вопросов · ~2 минуты',
  'splash.chip.career': 'Реальные профессии: {n} вопросов · {m} профессий · ~4 минуты',

  'road.title': 'Путь',
  'road.aside': 'Этапы',
  'road.total': '{n} вопросов',
  'road.savol': 'вопрос {a}/{s}',
  'road.signal': 'Ваш карьерный сигнал',

  'prog.savol': 'ВОПРОС',

  'scene.hint': 'Выбери то, что привлекает больше всего',
  'scene.footer':
    'Двигайся свободно среди идей — созвездие ответит. Выбери одну, она поведёт тебя дальше.',

  'ir.top': 'На основе ответов определён ваш интерес',
  'ir.profile': 'Ваш RIASEC-профиль',
  'ir.strength': 'сила',
  'ir.topBadge': 'Самое сильное',
  'ir.second': 'Второе',
  'ir.para': 'Вы в основном {adj} — вам близки {phrase} деятельности.',
  'ir.para2': 'Вторая сильная сторона — {short}.',
  'ir.all': 'Результат по всем направлениям',
  'ir.why': 'Почему это важно?',
  'ir.whyBody':
    'RIASEC — модель интересов из базы профессий O*NET. Этот тест собрал ваш профиль на основе интересов к видам деятельности выше. На следующем шаге тест реальных профессий сравнит ваши ответы с 100+ профилями и даст точные направления.',
  'ir.restart': 'Заново',
  'ir.other': 'К другому тесту',
  'ir.disclaimer': 'Не официальный тест O*NET — адаптирован для открытия интересов.',

  'rc.top': 'На основе ваших ответов эти направления профессий могут подойти вам лучше всего',
  'rc.signal': 'сигнал',
  'rc.karyera': 'Ваш карьерный сигнал',
  'rc.signals': 'Самые подходящие направления',
  'rc.yourSignals': 'Ваши самые сильные сигналы: {list}.',
  'rc.why': 'Почему именно {name}?',
  'rc.restart': 'Открыть заново',
  'rc.note': 'Направление профессии — это отправная точка для открытия, а не приговор о вас.',

  'stage.BOSHLASH': 'СТАРТ',
  'stage.QIZIQISHLAR': 'ИНТЕРЕСЫ',
  'stage.FAOLIYATLAR': 'АКТИВНОСТИ',
  'stage.ISH_USLUBI': 'СТИЛЬ РАБОТЫ',
  'stage.ISH_MUHITI': 'СРЕДА РАБОТЫ',
  'stage.NATIJA': 'РЕЗУЛЬТАТ',

  'dim.R.name': 'Практический (Реалистический)',
  'dim.R.short': 'Практический',
  'dim.I.name': 'Исследовательский (Аналитический)',
  'dim.I.short': 'Исследовательский',
  'dim.A.name': 'Творческий (Артистический)',
  'dim.A.short': 'Творческий',
  'dim.S.name': 'Социальный',
  'dim.S.short': 'Социальный',
  'dim.E.name': 'Предприимчивый',
  'dim.E.short': 'Предприимчивый',
  'dim.C.name': 'Конвенциональный (Упорядоченный)',
  'dim.C.short': 'Упорядоченный',
}

const en: Dict = {
  'onb.lang.title': 'Select language',
  'onb.lang.sub': 'We\u2019ll continue in this language',
  'onb.theme.title': 'Choose appearance',
  'onb.theme.sub': 'Light or dark mood',
  'onb.theme.light': 'Light',
  'onb.theme.dark': 'Dark',
  'onb.color.title': 'Pick your color',
  'onb.color.sub': 'This color will define the whole test journey',
  'onb.start': 'Start',
  'onb.hint': 'You can change this later in settings',

  'settings.title': 'Settings',
  'settings.lang': 'Language',
  'settings.theme': 'Appearance',
  'settings.theme.light': 'Light',
  'settings.theme.dark': 'Dark',
  'settings.accent': 'Accent color',
  'settings.close': 'Close',

  'app.back': 'Back',
  'app.cheat': 'Cheat mode · random answers',

  'splash.hello.a': 'Where do we',
  'splash.hello.b': 'begin',
  'splash.sub':
    'Both tests are free and require no sign-up. You can return anytime and continue where you left off.',

  'card.interest.title': 'INTERESTS',
  'card.interest.sub':
    'If you don\u2019t have a clear goal yet or aren\u2019t sure which path fits you, start with the INTERESTS test.',
  'card.interest.badge': 'New · RIASEC',
  'card.career.title': 'REAL CAREER MATCH',
  'card.career.sub':
    'If your goal is clear and you want to seriously grow your knowledge and skills, take the REAL CAREER MATCH test.',
  'card.career.badge': 'Full career test',
  'card.cta': 'Start test',
  'card.resume': 'Continue · {n}/{total}',
  'card.result': 'See result',

  'splash.chip.interest': 'Interests: {n} questions · ~2 min',
  'splash.chip.career': 'Real career: {n} questions · {m} careers · ~4 min',

  'road.title': 'Journey',
  'road.aside': 'Stages',
  'road.total': '{n} questions',
  'road.savol': 'question {a}/{s}',
  'road.signal': 'Your career signal',

  'prog.savol': 'QUESTION',

  'scene.hint': 'Pick what draws you in the most',
  'scene.footer':
    'Move freely among the ideas — the constellation will respond. Choose one, and let it lead you forward.',

  'ir.top': 'Your interest direction was identified from your answers',
  'ir.profile': 'Your RIASEC profile',
  'ir.strength': 'strength',
  'ir.topBadge': 'Strongest',
  'ir.second': 'Second',
  'ir.para': 'You are mainly {adj} — you\u2019re drawn to {phrase} activities.',
  'ir.para2': 'Your second strongest trait is {short}.',
  'ir.all': 'Result across all directions',
  'ir.why': 'Why does this matter?',
  'ir.whyBody':
    'RIASEC is the interest model used in the O*NET career database. This test built your profile from your interests in the work activities above. Next, the real career test compares your answers against 100+ career profiles to give precise directions.',
  'ir.restart': 'Retake',
  'ir.other': 'Try the other test',
  'ir.disclaimer': 'Not the official O*NET test — tailored for discovering interests.',

  'rc.top': 'Based on your answers, these career paths may fit you best',
  'rc.signal': 'signal',
  'rc.karyera': 'Your career signal',
  'rc.signals': 'Best-fit career paths',
  'rc.yourSignals': 'Your strongest signals: {list}.',
  'rc.why': 'Why {name}?',
  'rc.restart': 'Explore again',
  'rc.note': 'A career path is a starting point for discovery, not a verdict about you.',

  'stage.BOSHLASH': 'START',
  'stage.QIZIQISHLAR': 'INTERESTS',
  'stage.FAOLIYATLAR': 'ACTIVITIES',
  'stage.ISH_USLUBI': 'WORK STYLE',
  'stage.ISH_MUHITI': 'WORK SETTING',
  'stage.NATIJA': 'RESULT',

  'dim.R.name': 'Practical (Realistic)',
  'dim.R.short': 'Practical',
  'dim.I.name': 'Investigative (Analytic)',
  'dim.I.short': 'Investigative',
  'dim.A.name': 'Artistic',
  'dim.A.short': 'Artistic',
  'dim.S.name': 'Social',
  'dim.S.short': 'Social',
  'dim.E.name': 'Enterprising',
  'dim.E.short': 'Enterprising',
  'dim.C.name': 'Conventional (Orderly)',
  'dim.C.short': 'Orderly',
}

const dicts: Record<Lang, Dict> = { uz, ru, en }

export function translate(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  let s = dicts[lang][key] ?? uz[key] ?? key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v))
  }
  return s
}
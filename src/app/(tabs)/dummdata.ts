import { addLabelToFlashcard } from "@/db/crud/flashcardLabels";
import { createFlashcardRecord } from "@/db/crud/flashcards";
import { createGroupRecord } from "@/db/crud/group";
import { createLabelTableData } from "@/db/crud/labels";
import { createWrongAnswerTableData } from "@/db/crud/wrongAnswers";

export const insertTestFlashcardGroup = async () => {
  // Create labels
  const englishLabel = await createLabelTableData("Англи хэл");
  const japaneseLabel = await createLabelTableData("Япон хэл");

  const englishLabelId = englishLabel?.lastInsertRowId;
  const japaneseLabelId = japaneseLabel?.lastInsertRowId;

  const germanLabel = await createLabelTableData("Герман хэл");
  const germanLabelId = germanLabel?.lastInsertRowId;

  // Group 1: Боловсрол
  const educationGroup = await createGroupRecord(
    "Боловсрол",
    "Боловсролын салбарт хэрэглэгддэг англи үгнүүд",
    0
  );
  const educationGroupId = educationGroup?.lastInsertRowId ?? 1;

  const educationFlashcards = [
    {
      word: "Articulate",
      meaning: "Яриагаа тод, ойлгомжтой илэрхийлэх",
      wrongAnswers: ["Дүрэм зөрчих", "Анхаарал сарниулах", "Хичээлээс хоцрох"],
    },
    {
      word: "Inquisitive",
      meaning: "Суралцах дуртай",
      wrongAnswers: ["Залхуурдаг", "Дуугүй байх дуртай", "Бага ангийн сурагч"],
    },
    {
      word: "Discipline",
      meaning: "Сахилга бат, дэг журам",
      wrongAnswers: ["Сургалтын төлөвлөгөө", "Уран зохиол", "Бүтээлч байдал"],
    },
    {
      word: "Fluent",
      meaning: "Хэлээр чөлөөтэй, саадгүй ярих чадвартай",
      wrongAnswers: [
        "Шинэ хэл сурч байгаа хүн",
        "Бие даан суралцаж байгаа",
        "Бичгийн хэв муутай",
      ],
    },
    {
      word: "Curriculum",
      meaning: "Сургалтын хөтөлбөр",
      wrongAnswers: [
        "Шалгалтын үнэлгээ",
        "Сургалтын байр",
        "Багшийн хувийн төлөвлөгөө",
      ],
    },
    {
      word: "Drop out",
      meaning: "Сургууль орхих",
      wrongAnswers: ["Сургуульд элсэх", "Шалгалт өгөх", "Цаг баримтлах"],
    },
    {
      word: "Scholarship",
      meaning: "Тэтгэлэг",
      wrongAnswers: ["Хичээлийн хэрэгсэл", "Хураамж төлбөр", "Оюутны байр"],
    },
    {
      word: "Revise",
      meaning: "Давтах, дахин харах",
      wrongAnswers: ["Хичээл таслах", "Гэрийн даалгавар өгөх", "Багш солих"],
    },
  ];

  // Group 2: Байгаль орчин
  const environmentGroup = await createGroupRecord(
    "Байгаль орчин",
    "Байгаль орчны талаарх үг хэллэгүүд",
    0
  );
  const environmentGroupId = environmentGroup?.lastInsertRowId ?? 2;

  const environmentFlashcards = [
    {
      word: "Pollution",
      meaning: "Бохирдол",
      wrongAnswers: ["Цэвэр агаар", "Ус хадгалах", "Ойн сандал"],
    },
    {
      word: "Recycle",
      meaning: "Дахин боловсруулах",
      wrongAnswers: ["Хаягдал устгах", "Шинэ зүйл үйлдвэрлэх", "Худалдах"],
    },
    {
      word: "Conservation",
      meaning: "Хамгаалалт, хадгалалт",
      wrongAnswers: ["Хог хаягдал", "Ус ашиглалт", "Цэвэрлэгээ"],
    },
  ];

  // Group 3: Дэлхийн асуудлууд
  const softwareEngineeringGroup = await createGroupRecord(
    "Програм хангамжийн инженерчлэл",
    "Програм хангамжийн хөгжүүлэлттэй холбоотой мэргэжлийн үгс",
    0
  );
  const softwareEngineeringGroupId =
    softwareEngineeringGroup?.lastInsertRowId ?? 3;

  const softwareEngineeringFlashcards = [
    {
      word: "Algorithm",
      meaning: "Алгоритм",
      wrongAnswers: ["Хөгжим", "Гар утас", "Түлхүүр үг"],
    },
    {
      word: "Debugging",
      meaning: "Алдаа засах",
      wrongAnswers: ["Хувьсах", "Гар бичмэл", "Байршуулах"],
    },
    {
      word: "Framework",
      meaning: "Хөгжүүлэлтийн хүрээ",
      wrongAnswers: ["Хяналтын самбар", "Гар утасны хэрэгсэл", "Нууц үг"],
    },
    {
      word: "Version Control",
      meaning: "Хувилбар хянах систем",
      wrongAnswers: ["Сэргээх диск", "Интерфейс", "Таблет"],
    },
    {
      word: "Function",
      meaning: "Функц",
      wrongAnswers: ["Код бичигч", "Зураглал", "Харилцах"],
    },
    {
      word: "Class",
      meaning: "Класс",
      wrongAnswers: ["Ангийн өрөө", "Хичээл", "Оношлогоо"],
    },
    {
      word: "Inheritance",
      meaning: "Өвлөн авалт",
      wrongAnswers: ["Гэрээ", "Гар утас", "Нөхөрлөл"],
    },
    {
      word: "Encapsulation",
      meaning: "Багцлалт",
      wrongAnswers: ["Өгөгдөл устгах", "Нууцлал", "Тохиргоо"],
    },
    {
      word: "Database",
      meaning: "Өгөгдлийн сан",
      wrongAnswers: ["Хөтөлбөр", "Нэвтрэх нэр", "Эх хавтан"],
    },
    {
      word: "Compilation",
      meaning: "Компиляци (код хөрвүүлэлт)",
      wrongAnswers: ["Зураг авах", "Түгээх", "Хадгалах төхөөрөмж"],
    },
    {
      word: "Interface",
      meaning: "Харилцах интерфейс",
      wrongAnswers: ["Хэрэглэгч", "Програм хангамж", "Хяналтын самбар"],
    },
    {
      word: "Repository",
      meaning: "Хадгалах сан (репо)",
      wrongAnswers: ["Байршил", "Сервер", "Өгөгдөл задлах"],
    },
  ];

  // Group 4: Хоол хүнс (Япон хэл) — updated to 10 flashcards
  const foodGroup = await createGroupRecord(
    "Хоол хүнс",
    "Япон хэлний хоол хүнстэй холбоотой үгс",
    0
  );
  const foodGroupId = foodGroup?.lastInsertRowId ?? 4;

  const foodFlashcards = [
    {
      word: "ご飯",
      meaning: "Будаа, хоол",
      wrongAnswers: ["Жимс", "Сүү", "Талх"],
    },
    { word: "野菜", meaning: "Ногоо", wrongAnswers: ["Амттан", "Мах", "Төмс"] },
    { word: "魚", meaning: "Загас", wrongAnswers: ["Өндөг", "Тахиа", "Суши"] },
    { word: "肉", meaning: "Мах", wrongAnswers: ["Жимс", "Ундаа", "Цай"] },
    { word: "果物", meaning: "Жимс", wrongAnswers: ["Талх", "Хоол", "Шөл"] },
    {
      word: "水",
      meaning: "Ус",
      wrongAnswers: ["Тахианы мах", "Сүү", "Гурил"],
    },
    { word: "牛乳", meaning: "Сүү", wrongAnswers: ["Шөл", "Кофе", "Ус"] },
    {
      word: "卵",
      meaning: "Өндөг",
      wrongAnswers: ["Загас", "Ногоо", "Амттан"],
    },
    {
      word: "朝ご飯",
      meaning: "Өглөөний хоол",
      wrongAnswers: ["Оройн хоол", "Ундаа", "Хоолны давс"],
    },
    {
      word: "昼ご飯",
      meaning: "Үдийн хоол",
      wrongAnswers: ["Шөнө хоол", "Цай", "Сүү"],
    },
  ];

  // Group 5: Сэтгэл хөдлөл (Япон хэл) — updated to 10 flashcards
  const emotionGroup = await createGroupRecord(
    "Сэтгэл хөдлөл",
    "Япон хэлний сэтгэл хөдлөлийн үг хэллэг",
    0
  );
  const emotionGroupId = emotionGroup?.lastInsertRowId ?? 5;

  const emotionFlashcards = [
    {
      word: "嬉しい",
      meaning: "Баяртай",
      wrongAnswers: ["Гунигтай", "Ядарсан", "Сандарсан"],
    },
    {
      word: "悲しい",
      meaning: "Гунигтай",
      wrongAnswers: ["Хөөртэй", "Баясгалантай", "Сэргэлэн"],
    },
    {
      word: "怒る",
      meaning: "Уурлах",
      wrongAnswers: ["Хайрлах", "Тайван байх", "Инээмсэглэх"],
    },
    {
      word: "怖い",
      meaning: "Аймар",
      wrongAnswers: ["Сэтгэл ханамжтай", "Хөгжилтэй", "Баяртай"],
    },
    {
      word: "安心",
      meaning: "Тайвшрал",
      wrongAnswers: ["Сандарсан", "Гуниг", "Уур"],
    },
    {
      word: "恥ずかしい",
      meaning: "Ичмээр",
      wrongAnswers: ["Зоригтой", "Хөгжилтэй", "Урамтай"],
    },
    {
      word: "疲れた",
      meaning: "Ядарсан",
      wrongAnswers: ["Сэргэлэн", "Урам зоригтой", "Тайван"],
    },
    {
      word: "楽しい",
      meaning: "Хөгжилтэй",
      wrongAnswers: ["Гунигтай", "Ууртай", "Ядарсан"],
    },
    {
      word: "驚く",
      meaning: "Гайхах",
      wrongAnswers: ["Мэдэх", "Сэрэмжтэй байх", "Тайвшрах"],
    },
    {
      word: "悩む",
      meaning: "Сэтгэл зовних",
      wrongAnswers: ["Сайхан мэдрэмж", "Амралт", "Төгс"],
    },
  ];

  // Group 6: Амьдралын хэв маяг (Герман хэл)
  const lifestyleGroup = await createGroupRecord(
    "Амьдралын хэв маяг",
    "Герман хэлний өдөр тутмын амьдралтай холбоотой үгс",
    0
  );
  const lifestyleGroupId = lifestyleGroup?.lastInsertRowId ?? 6;

  const lifestyleFlashcards = [
    {
      word: "Frühstück",
      meaning: "Өглөөний цай",
      wrongAnswers: ["Үдийн хоол", "Оройн хоол", "Зууш"],
    },
    {
      word: "Freizeit",
      meaning: "Чөлөөт цаг",
      wrongAnswers: ["Ажил", "Сургалт", "Шалгалт"],
    },
    {
      word: "Gesundheit",
      meaning: "Эрүүл мэнд",
      wrongAnswers: ["Өвчин", "Хоол хүнс", "Урлаг"],
    },
    {
      word: "Familie",
      meaning: "Гэр бүл",
      wrongAnswers: ["Ажил", "Найз", "Танил"],
    },
    {
      word: "Spazieren",
      meaning: "Алхах",
      wrongAnswers: ["Унтах", "Идэх", "Хичээл хийх"],
    },
  ];

  // Group 7: Ажлын орчин (Герман хэл)
  const workGroup = await createGroupRecord(
    "Ажлын орчин",
    "Герман хэлний ажил, мэргэжилтэй холбоотой үгс",
    0
  );
  const workGroupId = workGroup?.lastInsertRowId ?? 7;

  const workFlashcards = [
    {
      word: "Büro",
      meaning: "Оффис",
      wrongAnswers: ["Гэр", "Сургууль", "Дэлгүүр"],
    },
    {
      word: "Kollege",
      meaning: "Хамт ажиллагч",
      wrongAnswers: ["Дарга", "Харилцагч", "Сурагч"],
    },
    {
      word: "Chef",
      meaning: "Дарга",
      wrongAnswers: ["Ажилтан", "Найз", "Туслах"],
    },
    {
      word: "Besprechung",
      meaning: "Хурлын уулзалт",
      wrongAnswers: ["Амралт", "Зугаалга", "Сургалт"],
    },
    {
      word: "Projekt",
      meaning: "Төсөл",
      wrongAnswers: ["Хичээл", "Бизнес", "Зар"],
    },
    {
      word: "Arbeitszeit",
      meaning: "Ажлын цаг",
      wrongAnswers: ["Чөлөөт цаг", "Цалин", "Суралцах цаг"],
    },
    {
      word: "Vertrag",
      meaning: "Гэрээ",
      wrongAnswers: ["Хичээл", "Зар", "Хэлэлцээр"],
    },
    {
      word: "Aufgabe",
      meaning: "Даалгавар",
      wrongAnswers: ["Хоол", "Амралт", "Тоглоом"],
    },
  ];

  const insertFlashcards = async (
    groupId: number,
    flashcards: any[],
    labelId?: number
  ) => {
    for (const { word, meaning, wrongAnswers } of flashcards) {
      const flashcard = await createFlashcardRecord(word, meaning, groupId);
      const flashcardId = flashcard?.lastInsertRowId;
      if (flashcardId && labelId) {
        await addLabelToFlashcard(flashcardId, labelId);
        for (const wrongText of wrongAnswers) {
          await createWrongAnswerTableData({ flashcardId, wrongText });
        }
      }
    }
  };

  await insertFlashcards(educationGroupId, educationFlashcards, englishLabelId);
  await insertFlashcards(
    environmentGroupId,
    environmentFlashcards,
    englishLabelId
  );
  await insertFlashcards(
    softwareEngineeringGroupId,
    softwareEngineeringFlashcards,
    englishLabelId
  );
  await insertFlashcards(foodGroupId, foodFlashcards, japaneseLabelId);
  await insertFlashcards(emotionGroupId, emotionFlashcards, japaneseLabelId);
  await insertFlashcards(lifestyleGroupId, lifestyleFlashcards, germanLabelId);
  await insertFlashcards(workGroupId, workFlashcards, germanLabelId);
};

const userId = 1; // Set this to the correct user ID

export const dummyWeekCalendarData = [
  {
    userId,
    date: "2025-05-18", // Sunday
    minutesSpent: 2,
    wordsMemorized: 0,
    appOpened: 1,
    isSync: 0,
  },
  {
    userId,
    date: "2025-05-19", // Monday
    minutesSpent: 10,
    wordsMemorized: 2,
    appOpened: 1,
    isSync: 0,
  },
  {
    userId,
    date: "2025-05-20", // Tuesday
    minutesSpent: 18,
    wordsMemorized: 6,
    appOpened: 1,
    isSync: 0,
  },
  {
    userId,
    date: "2025-05-21", // Wednesday
    minutesSpent: 0,
    wordsMemorized: 0,
    appOpened: 1,
    isSync: 0,
  },
  {
    userId,
    date: "2025-05-22", // Thursday
    minutesSpent: 0,
    wordsMemorized: 0,
    appOpened: 1,
    isSync: 0,
  },
  {
    userId,
    date: "2025-05-23", // Friday
    minutesSpent: 0,
    wordsMemorized: 0,
    appOpened: 1,
    isSync: 0,
  },
  {
    userId,
    date: "2025-05-24", // Saturday
    minutesSpent: 0,
    wordsMemorized: 0,
    appOpened: 1,
    isSync: 0,
  },
];

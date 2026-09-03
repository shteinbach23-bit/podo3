// Конфигурация специализаций мастеров и полей карточки клиента для каждой из них.

export const FIELD_TYPES = {
  TEXT: "text",
  DATE: "date",
  TEXTAREA: "textarea",
  CHECKBOX: "checkbox",
  RADIO: "radio",
  SECTION: "section",
  CHECKBOX_GROUP: "checkbox_group",
  CHECKBOX_WITH_INPUT: "checkbox_with_input",
};

const commonFields = [
  { key: "fullName", label: "ФИО", type: FIELD_TYPES.TEXT, required: true },
  { key: "phone", label: "Телефон", type: FIELD_TYPES.TEXT },
];

const SPECIALIZATIONS = {
  podolog: {
    label: "Подолог",
    fields: [
      ...commonFields,
      { key: "firstVisitDate", label: "Дата первого посещения", type: FIELD_TYPES.DATE },
      { key: "birthDate", label: "Дата рождения", type: FIELD_TYPES.DATE },
      { key: "occupation", label: "Род деятельности", type: FIELD_TYPES.TEXT },
      { key: "hobbies", label: "Хобби/Вредные привычки", type: FIELD_TYPES.TEXT },
      
      { type: FIELD_TYPES.SECTION, label: "Медицинская информация" },
      
      { key: "diabetes", label: "Диабет", type: FIELD_TYPES.CHECKBOX_WITH_INPUT },
      { key: "psoriasis", label: "Псориаз", type: FIELD_TYPES.CHECKBOX_WITH_INPUT },
      { key: "chronicDiseases", label: "Хронические заболевания", type: FIELD_TYPES.CHECKBOX_WITH_INPUT },
      { key: "otherSkinDiseases", label: "Другие кожные заболевания", type: FIELD_TYPES.CHECKBOX_WITH_INPUT },
      { key: "oncology", label: "Онкология", type: FIELD_TYPES.CHECKBOX_WITH_INPUT },
      { key: "allergy", label: "Аллергия", type: FIELD_TYPES.CHECKBOX_WITH_INPUT },
      { key: "hepatitis", label: "Гепатит", type: FIELD_TYPES.CHECKBOX_WITH_INPUT },
      { key: "hemophilia", label: "Гемофилия", type: FIELD_TYPES.CHECKBOX_WITH_INPUT },
      
      { 
        key: "onychomycosis", 
        label: "Онихомикоз", 
        type: FIELD_TYPES.CHECKBOX_GROUP,
        options: ["D1", "D2", "D3", "D4", "D5", "S1", "S2", "S3", "S4", "S5"]
      },
      
      {
        key: "shoeSize",
        label: "Размер обуви",
        type: FIELD_TYPES.RADIO,
        options: ["Предположительный", "Фактический"],
        hasInput: true
      },
      
      { key: "heelFoot", label: "Пяточная стопа", type: FIELD_TYPES.TEXT },
      
      {
        key: "flatfoot",
        label: "Плоскостопие",
        type: FIELD_TYPES.CHECKBOX_GROUP,
        options: ["Вальгус", "Варус", "Продольное", "Поперечное", "Комбинированное"]
      },
      
      { key: "onychocryptosis", label: "Онихокриптоз", type: FIELD_TYPES.CHECKBOX_WITH_INPUT },
      { key: "softSkin", label: "Мягкая кожа", type: FIELD_TYPES.CHECKBOX_WITH_INPUT },
      { key: "hyperhidrosis", label: "Гипергидроз", type: FIELD_TYPES.CHECKBOX_WITH_INPUT },
      { key: "hyperhydratos", label: "Гипергидратоз", type: FIELD_TYPES.CHECKBOX_WITH_INPUT },
      { key: "traumaSurgery", label: "Травмы, операции", type: FIELD_TYPES.CHECKBOX_WITH_INPUT },
      { key: "warts", label: "Бородавки", type: FIELD_TYPES.CHECKBOX_WITH_INPUT },
      
      {
        key: "calluses",
        label: "Мозоли",
        type: FIELD_TYPES.CHECKBOX_GROUP,
        options: ["Стержневая", "Сосудистая", "Нейрососудистая", "Нейрофиброзная", "Твердая", "Мягкая", "Подногтевая", "Омозолелис"]
      },
      
      { key: "cracks", label: "Трещины", type: FIELD_TYPES.CHECKBOX_WITH_INPUT },
      { key: "other", label: "Другое", type: FIELD_TYPES.TEXTAREA },
    ],
  },
  manicure: {
    label: "Маникюр",
    fields: [
      ...commonFields,
      { key: "birthDate", label: "Дата рождения", type: FIELD_TYPES.DATE },
      {
        key: "nailShape",
        label: "Форма ногтей",
        type: FIELD_TYPES.RADIO,
        options: ["Овал", "Квадрат", "Миндаль", "Балерина"],
      },
      { key: "coating", label: "Покрытие", type: FIELD_TYPES.TEXT },
      { key: "allergyComment", label: "Аллергии/особенности", type: FIELD_TYPES.TEXTAREA },
    ],
  },
  pedicure: {
    label: "Педикюр",
    fields: [
      ...commonFields,
      { key: "birthDate", label: "Дата рождения", type: FIELD_TYPES.DATE },
      { key: "footCondition", label: "Состояние стоп", type: FIELD_TYPES.TEXTAREA },
      { key: "coating", label: "Покрытие", type: FIELD_TYPES.TEXT },
    ],
  },
  browsLashes: {
    label: "Брови/Ресницы",
    fields: [
      ...commonFields,
      { key: "birthDate", label: "Дата рождения", type: FIELD_TYPES.DATE },
      { key: "browShape", label: "Форма бровей", type: FIELD_TYPES.TEXT },
      {
        key: "lashType",
        label: "Тип ресниц",
        type: FIELD_TYPES.RADIO,
        options: ["Классика", "2D", "3D", "Голливуд"],
      },
      { key: "allergyComment", label: "Аллергии/особенности", type: FIELD_TYPES.TEXTAREA },
    ],
  },
  tattoo: {
    label: "Тату/Татуаж",
    fields: [
      ...commonFields,
      { key: "birthDate", label: "Дата рождения", type: FIELD_TYPES.DATE },
      { key: "sketch", label: "Описание эскиза", type: FIELD_TYPES.TEXTAREA },
      { key: "zone", label: "Зона нанесения", type: FIELD_TYPES.TEXT },
      { key: "allergyComment", label: "Аллергии/особенности", type: FIELD_TYPES.TEXTAREA },
    ],
  },
};

export function getSpecializationOptions() {
  return Object.entries(SPECIALIZATIONS).map(([id, val]) => ({ id, label: val.label }));
}

export function getFieldsForSpecialization(id) {
  return SPECIALIZATIONS[id]?.fields || commonFields;
}

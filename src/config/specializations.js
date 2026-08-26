// Конфигурация специализаций мастеров и полей карточки клиента для каждой из них.

export const FIELD_TYPES = {
  TEXT: "text",
  DATE: "date",
  TEXTAREA: "textarea",
  CHECKBOX: "checkbox",
  RADIO: "radio",
};

const commonFields = [
  { key: "fullName", label: "ФИО клиента", type: FIELD_TYPES.TEXT, required: true },
  { key: "phone", label: "Телефон", type: FIELD_TYPES.TEXT },
  { key: "birthDate", label: "Дата рождения", type: FIELD_TYPES.DATE },
];

const SPECIALIZATIONS = {
  podolog: {
    label: "Подолог",
    fields: [
      ...commonFields,
      { key: "diagnosis", label: "Диагноз/проблема", type: FIELD_TYPES.TEXTAREA },
      {
        key: "contraindications",
        label: "Противопоказания",
        type: FIELD_TYPES.CHECKBOX,
        options: ["Диабет", "Аллергия", "Грибок"],
        hasComment: true,
      },
      { key: "procedureNotes", label: "Заметки по процедуре", type: FIELD_TYPES.TEXTAREA },
    ],
  },
  manicure: {
    label: "Маникюр",
    fields: [
      ...commonFields,
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
      { key: "footCondition", label: "Состояние стоп", type: FIELD_TYPES.TEXTAREA },
      { key: "coating", label: "Покрытие", type: FIELD_TYPES.TEXT },
    ],
  },
  browsLashes: {
    label: "Брови/Ресницы",
    fields: [
      ...commonFields,
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

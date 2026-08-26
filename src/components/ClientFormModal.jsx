import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getFieldsForSpecialization, FIELD_TYPES } from "../config/specializations";
import { addClient, updateClient, deleteClient } from "../services/firestore";

export default function ClientFormModal({
  masterId,
  specialization,
  allowPhotos,
  existingClient,
  onClose,
  onSaved,
}) {
  const { t } = useTranslation();
  const fields = getFieldsForSpecialization(specialization);
  const [formData, setFormData] = useState(existingClient || {});
  const [saving, setSaving] = useState(false);

  function setField(key, value) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (existingClient) {
        await updateClient(masterId, existingClient.id, formData);
      } else {
        await addClient(masterId, formData);
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!existingClient) return;
    if (!window.confirm(t("delete") + "?")) return;
    setSaving(true);
    try {
      await deleteClient(masterId, existingClient.id);
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  function renderField(field) {
    const value = formData[field.key] ?? "";

    switch (field.type) {
      case FIELD_TYPES.TEXT:
        return (
          <input
            value={value}
            required={field.required}
            onChange={(e) => setField(field.key, e.target.value)}
          />
        );
      case FIELD_TYPES.DATE:
        return (
          <input type="date" value={value} onChange={(e) => setField(field.key, e.target.value)} />
        );
      case FIELD_TYPES.TEXTAREA:
        return <textarea value={value} onChange={(e) => setField(field.key, e.target.value)} />;
      case FIELD_TYPES.CHECKBOX:
        return (
          <div className="checkbox-field">
            <input
              type="checkbox"
              checked={!!value}
              onChange={(e) => setField(field.key, e.target.checked)}
            />
            {field.options && (
              <span className="checkbox-options">
                {field.options.map((opt) => (
                  <label key={opt} className="option-chip">
                    <input
                      type="checkbox"
                      checked={!!formData[`${field.key}_${opt}`]}
                      onChange={(e) => setField(`${field.key}_${opt}`, e.target.checked)}
                    />
                    {opt}
                  </label>
                ))}
              </span>
            )}
            {field.hasComment && (
              <input
                placeholder={t("notes")}
                value={formData[`${field.key}_comment`] || ""}
                onChange={(e) => setField(`${field.key}_comment`, e.target.value)}
              />
            )}
          </div>
        );
      case FIELD_TYPES.RADIO:
        return (
          <div className="radio-field">
            {field.options.map((opt) => (
              <label key={opt}>
                <input
                  type="radio"
                  name={field.key}
                  checked={value === opt}
                  onChange={() => setField(field.key, opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{existingClient ? t("edit") : t("add_client")}</h3>

        {fields.map((field) => (
          <div key={field.key} className="form-field">
            <label>{field.label}</label>
            {renderField(field)}
          </div>
        ))}

        {allowPhotos && (
          <div className="form-field">
            <label>Фото (до/после)</label>
            <input type="file" accept="image/*" multiple disabled />
            <small>Загрузка фото будет доступна после подключения Firebase Storage</small>
          </div>
        )}

        <div className="modal-actions">
          <button onClick={handleSave} disabled={saving}>
            {t("save")}
          </button>
          {existingClient && (
            <button onClick={handleDelete} disabled={saving} className="danger">
              {t("delete")}
            </button>
          )}
          <button onClick={onClose} disabled={saving}>
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

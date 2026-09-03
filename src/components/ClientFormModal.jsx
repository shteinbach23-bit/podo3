import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getFieldsForSpecialization, FIELD_TYPES } from "../config/specializations";
import { addClient, updateClient, deleteClient } from "../services/firestore";
import "./ClientFormModal.css";

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
      case FIELD_TYPES.SECTION:
        return <div className="form-section-header">{field.label}</div>;

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

      case FIELD_TYPES.CHECKBOX_WITH_INPUT:
        return (
          <div className="checkbox-with-input">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={!!formData[field.key + "_checked"]}
                onChange={(e) => setField(field.key + "_checked", e.target.checked)}
              />
              <span>{field.label}</span>
            </label>
            {formData[field.key + "_checked"] && (
              <input
                type="text"
                className="checkbox-input-field"
                placeholder="Детали..."
                value={formData[field.key + "_details"] || ""}
                onChange={(e) => setField(field.key + "_details", e.target.value)}
              />
            )}
          </div>
        );

      case FIELD_TYPES.CHECKBOX_GROUP:
        return (
          <div className="checkbox-group">
            {field.options.map((opt) => (
              <label key={opt} className="checkbox-chip">
                <input
                  type="checkbox"
                  checked={!!formData[`${field.key}_${opt}`]}
                  onChange={(e) => setField(`${field.key}_${opt}`, e.target.checked)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        );

      case FIELD_TYPES.RADIO:
        return (
          <div className="radio-group">
            <div className="radio-options">
              {field.options.map((opt) => (
                <label key={opt} className="radio-option">
                  <input
                    type="radio"
                    name={field.key}
                    checked={formData[field.key + "_type"] === opt}
                    onChange={() => setField(field.key + "_type", opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {field.hasInput && (
              <input
                type="text"
                className="radio-input-field"
                placeholder="Значение..."
                value={formData[field.key + "_value"] || ""}
                onChange={(e) => setField(field.key + "_value", e.target.value)}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content client-card-modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="client-card-title">
          {existingClient ? "Карта клиента" : "Карта клиента"}
        </h2>

        <div className="client-card-form">
          {fields.map((field, idx) => {
            if (field.type === FIELD_TYPES.SECTION) {
              return <div key={idx} className="form-section-header">{field.label}</div>;
            }
            
            return (
              <div key={field.key} className="form-field">
                {field.type !== FIELD_TYPES.CHECKBOX_WITH_INPUT && <label>{field.label}</label>}
                {renderField(field)}
              </div>
            );
          })}

          {allowPhotos && (
            <div className="form-field">
              <label>Фото (до/после)</label>
              <input type="file" accept="image/*" multiple disabled />
              <small>Загрузка фото будет доступна после подключения Firebase Storage</small>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {existingClient ? "Сохранить" : "Создать клиента"}
          </button>
          {existingClient && (
            <button onClick={handleDelete} disabled={saving} className="btn-danger">
              {t("delete")}
            </button>
          )}
          <button onClick={onClose} disabled={saving} className="btn-secondary">
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

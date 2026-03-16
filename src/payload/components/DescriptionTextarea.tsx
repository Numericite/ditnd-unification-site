"use client";
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  useField,
} from "@payloadcms/ui";
import type { TextareaFieldClientComponent } from "payload";

const MAX_LENGTH = 120;

const DescriptionTextarea: TextareaFieldClientComponent = ({ field, path }) => {
  const { value, setValue, showError, errorMessage } = useField<string>({
    path,
  });

  const charCount = value?.length ?? 0;
  const isOver = charCount > MAX_LENGTH;

  return (
    <div className="field-type textarea">
      <FieldLabel
        as="label"
        htmlFor={`field-${field.name}`}
        label={field.label}
        required={field.required}
      />
      <div style={{ position: "relative" }}>
        <textarea
          id={`field-${field.name}`}
          className="textarea-field__input"
          value={value ?? ""}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            padding: "10px",
            fontFamily: "inherit",
            fontSize: "inherit",
            minHeight: "80px",
            border: showError
              ? "1px solid var(--theme-error-500)"
              : "1px solid var(--theme-elevation-150)",
            borderRadius: "4px",
            resize: "vertical",
            background: "var(--theme-input-bg)",
            color: "var(--theme-text)",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: field.admin?.description
              ? "space-between"
              : "flex-end",
            alignItems: "center",
            marginTop: "4px",
            fontSize: "13px",
            color: isOver
              ? "var(--theme-error-500)"
              : "var(--theme-elevation-500)",
          }}
        >
          {field.admin?.description && (
            <FieldDescription
              description={field.admin.description as string}
              path={path}
            />
          )}
          {charCount}/{MAX_LENGTH}
        </div>
      </div>
      {showError && <FieldError message={errorMessage} path={path} />}
    </div>
  );
};

export default DescriptionTextarea;

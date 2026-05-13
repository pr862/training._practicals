export const assertRequiredString = (
  value: string | null | undefined,
  fieldName: string
) => {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalizedValue;
};

export const assertRequiredStringArray = (
  values: string[] | null | undefined,
  fieldName: string
) => {
  if (!values?.length) {
    throw new Error(`${fieldName} is required.`);
  }

  const normalizedValues = values
    .map((value) => value.trim())
    .filter(Boolean);

  if (!normalizedValues.length) {
    throw new Error(`${fieldName} is required.`);
  }

  return normalizedValues;
};

export const assertRequiredValue = <T>(
  value: T | null | undefined,
  fieldName: string
) => {
  if (value === null || value === undefined) {
    throw new Error(`${fieldName} is required.`);
  }

  return value;
};

export const assertRequiredFile = (
  file: File | null | undefined,
  fieldName = "File"
) => {
  if (!file || file.size === 0) {
    throw new Error(`${fieldName} is required.`);
  }

  return file;
};

export const assertAtLeastOneField = (
  payload: Record<string, unknown>,
  fieldName: string
) => {
  if (!Object.keys(payload).length) {
    throw new Error(`${fieldName} is required.`);
  }
};

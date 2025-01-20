interface ValidationErrors {
  [key: string]: string;
}

export const validateForm = (form: HTMLFormElement, fieldErrors: ValidationErrors): ValidationErrors => {
  const errors: ValidationErrors = {};
  const formData = new FormData(form);

  for (const [field, errorMessage] of Object.entries(fieldErrors)) {
    const value = formData.get(field);
    if (!value) {
      errors[field] = errorMessage || "Field required";
    }
  }

  return errors;
};

export default validateForm
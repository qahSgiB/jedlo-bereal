export const prepareUploadFileWithData = (data: Record<string, unknown>, fileField: string, file?: File | null): FormData => {
  if (!(fileField in data)) {
    throw Error('prepareUploadFile: fileField is not in data');
  }

  const dataCopy = { ...data };
  delete dataCopy[fileField];

  const formData = new FormData();
  formData.append('data', JSON.stringify(dataCopy));
  if (file !== undefined && file !== null) {
    formData.append(fileField, file);
  }

  return formData;
}
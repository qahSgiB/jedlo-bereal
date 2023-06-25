const getBeUrl = (): string => {
  return import.meta.env.VITE_BE_URL ?? 'http://localhost:3000'
}

export const getBeUrlStatic = (): string => {
  return getBeUrl() + '/static/';
}

export default getBeUrl;


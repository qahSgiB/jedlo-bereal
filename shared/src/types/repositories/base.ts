export type IdModel = {
  id: number,
};

export type UUIDModel = {
  id: string,
}

export type OmitId<T> = Omit<T, keyof IdModel>
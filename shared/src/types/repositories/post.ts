export type Post = {
  id: number,
  picture: string,
  createdAt: Date,
  creator: {
    username: string,
    picture: string,
  },
};
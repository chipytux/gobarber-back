declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
    avatar: { filename: string };
  }
}

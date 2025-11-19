export interface IUser {
  _id: string;
  username: string;
  role: "admin" | "user";
  phone?: string;
  email?: string;
}

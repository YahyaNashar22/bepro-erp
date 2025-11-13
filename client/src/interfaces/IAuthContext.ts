import type { IUser } from "../interfaces/IUser";

export interface IAuthContext {
  user: IUser | null;
  accessToken: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  authLoading: boolean;
}

export interface authState {
  accessToken: string | null;
  user: UserType | null;
}

export interface UserType {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  pfpUrl: string | null;
}

export interface AuthData {
  data: authState;
  success: boolean;
  message: string;
}

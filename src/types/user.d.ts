import { create } from "zustand";

interface User {
  isLogin: boolean;
  id: string;
  name: string;
  login: (id: string, name: string) => void;
}

export const useUser = create<User>((set) => ({
  isLogin: false,
  id: "",
  name: "",
  login: (id: string, name: string) =>
    set({
      id: id,
      name: name,
      isLogin: true,
    }),
}));

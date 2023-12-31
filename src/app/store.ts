import { create } from 'zustand';

type Store = {
  username: string;
  githubStars: any; // Replace 'any' with the actual type of the GitHub stars API response
  setUsername: (username: string) => void;
  setGithubStars: (githubStars: any) => void; // Replace 'any' with the actual type of the GitHub stars API response
};

export const useStore = create<Store>((set) => ({
  username: '',
  githubStars: null,
  setUsername: (username) => set({ username }),
  setGithubStars: (githubStars) => set({ githubStars }),
}));

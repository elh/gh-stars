import create from 'zustand';

type Store = {
  username: string;
  githubStars: any;
  loading: boolean;
  setUsername: (username: string) => void;
  setGithubStars: (githubStars: any) => void;
  fetchGithubStars: (username: string) => Promise<void>;
};

export const useStore = create<Store>((set) => ({
  username: '',
  githubStars: null,
  loading: false,
  setUsername: (username) => set({ username }),
  setGithubStars: (githubStars) => set({ githubStars }),
  // TODO: fetch all stars. load them incrementally?
  fetchGithubStars: async (username) => {
    set({ loading: true });
    try {
      const response = await fetch(`https://api.github.com/users/${username}/starred?per_page=100`);
      const data = await response.json();
      set({ githubStars: data });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));

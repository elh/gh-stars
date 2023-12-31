import create from 'zustand';

type Store = {
  username: string;
  githubStars: Map<string, any[]>;
  loading: boolean;
  setUsername: (username: string) => void;
  fetchGithubStars: (username: string) => Promise<void>;
};


export const useStore = create<Store>((set, get) => ({
  username: '',
  githubStars: new Map<string, any[]>(),
  loading: false,
  setUsername: (username) => set({ username }),
  fetchGithubStars: async (username) => {
    set({ loading: true });
    try {
      let page = 1;
      let stars: any[] = [];
      let updatedGithubStars = new Map<string, any[]>(get().githubStars);
      if (!updatedGithubStars.has(username)) {
        while (true) {
          const response = await fetch(`https://api.github.com/users/${username}/starred?per_page=100&page=${page}`);
          const data = await response.json();
          if (data.length === 0) {
            break;
          }
          stars = [...stars, ...data];
          updatedGithubStars.set(username, stars);
          set({ githubStars: updatedGithubStars });
          page++;
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));

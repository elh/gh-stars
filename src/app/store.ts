import create from 'zustand';

type Store = {
  username: string;
  githubStars: Map<string, any[]>;
  loading: boolean;
  loading_fetched_count: number;
  setUsername: (username: string) => void;
  fetchGithubStars: (username: string) => Promise<void>;
};

export const useStore = create<Store>((set, get) => ({
  username: '',
  githubStars: new Map<string, any[]>(),
  loading: false,
  loading_fetched_count: 0,
  setUsername: (username) => set({ username }),
  fetchGithubStars: async (username) => {
    set({
      loading: true,
      loading_fetched_count: 0,
    });
    try {
      const perPage = 100;
      let page = 1;
      let stars: any[] = [];
      while (true) {
        const response = await fetch(`https://api.github.com/users/${username}/starred?per_page=${perPage}&page=${page}`);
        const data = await response.json();
        stars = [...stars, ...data];
        set((state) => {
          const updatedGithubStars = new Map<string, any[]>(state.githubStars);
          updatedGithubStars.set(username, stars);
          return {
            githubStars: updatedGithubStars,
            loading_fetched_count: state.loading_fetched_count + data.length,
          };
        });
        if (data.length < perPage) {
          break;
        }
        page++;
      }
    } catch (error) {
      console.error(error);
    } finally {
      set({ loading: false });
    }
  },
}));

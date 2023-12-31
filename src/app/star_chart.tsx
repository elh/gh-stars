import { useStore } from './store'

export function StarChart() {
  const { username, githubStars, loading } = useStore((state) => ({
    username: state.username,
    githubStars: state.githubStars,
    loading: state.loading,
  }));

  if (!username) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
      </div>
    );
  }

  if (!githubStars) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold">No Stars</div>
          <div className="text-gray-500">Try another username</div>
        </div>
      </div>
    );
  }

  // TODO: turn this into a table
  return (
    <div className="flex items-center justify-center">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {githubStars.map((star) => (
          <div key={star.id} className="card bordered">
            <div className="card-body">
              <figure>
                <img src={star.owner.avatar_url} alt={star.owner.login} style={{ width: '50px', height: '50px' }} />
              </figure>
              <h2 className="card-title text-sm">{star.name}</h2>
              <p className="text-gray-700 text-xs">{star.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StarChart;

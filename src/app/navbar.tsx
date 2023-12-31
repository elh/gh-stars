import { useStore } from './store'

export function NavBar() {
  const { username, setUsername } = useStore((state) => ({
    username: state.username,
    setUsername: state.setUsername,
  }));

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-lg">Star Explorer</a>
      </div>
      {username && (
        <div className="text-sm pr-4">
          <span>{username}</span>
          <button className="btn btn-sm ml-2" onClick={() => setUsername('')} >
            Update
          </button>
        </div>
      )}
    </div>
  );
}

export default NavBar;

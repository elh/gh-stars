import { useStore } from './store'

export function NavBar() {
  const { username, setUsername } = useStore((state) => ({
    username: state.username,
    setUsername: state.setUsername,
  }));

  return (
    <div className="navbar px-8 bg-base-100">
      <div className="flex-1">
        <a className="text-lg">Star Explorer</a>
      </div>
      {username && (
        <div className="text-sm">
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

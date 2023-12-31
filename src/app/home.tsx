export function Home() {
  return (
    <div className="grid grid-rows-[auto,1fr] h-screen">
      {/* Nav bar */}
      <div className="navbar bg-base-100">
        <a className="btn btn-ghost text-lg">Star Explorer</a>
      </div>
      <div className="flex items-center justify-center">
        {/* Username input */}
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">Github Username</span>
          </div>
          <input type="text" placeholder="elh" className="input input-sm input-bordered w-full max-w-xs" />
        </label>
      </div>
    </div>
  );
}

export default Home;

import NavBar from './navbar';
import UsernameInput from './username_input';

export function Home() {
  return (
    <div className="grid grid-rows-[auto,1fr] h-screen">
      <NavBar />
      <div className="flex items-center justify-center">
        <UsernameInput />
      </div>
    </div>
  );
}

export default Home;

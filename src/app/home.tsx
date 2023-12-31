import NavBar from './navbar';
import StarChart from './star_chart';
import UsernameInput from './username_input';

export function Home() {
  return (
    <div className="grid grid-rows-[auto,1fr] h-screen">
      <NavBar />
      <div className="flex items-center justify-center py-2 px-8">
        <UsernameInput />
        <StarChart />
      </div>
    </div>
  );
}

export default Home;

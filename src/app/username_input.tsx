import React, { useEffect } from 'react';
import { useStore } from './store'

export function UsernameInput() {
  // TODO: read/write username from url
  const { username, setUsername, fetchGithubStars } = useStore((state) => ({
    username: state.username,
    setUsername: state.setUsername,
    fetchGithubStars: state.fetchGithubStars,
  }));

  const [inputValue, setInputValue] = React.useState(username);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };
  const handleInputBlur = () => {
    setUsername(inputValue);
  };
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      setUsername(inputValue);
    }
  };

  useEffect(() => {
    if (username) {
      fetchGithubStars(username);
    }
  }, [username, fetchGithubStars]);

  if (!username) {
    return (
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Github Username</span>
        </div>
        <input
          type="text"
          placeholder="elh"
          className="input input-sm input-bordered w-full max-w-xs mb-52"
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyPress={handleKeyPress}
        />
      </label>
    );
  }
}

export default UsernameInput;

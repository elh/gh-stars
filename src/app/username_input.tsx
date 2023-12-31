import React from 'react';
import { useStore } from './store'

export function UsernameInput() {
  // TODO: read/write username from url
  const { username, setUsername } = useStore((state) => ({
    username: state.username,
    setUsername: state.setUsername,
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

  if (!username) {
    return (
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">Github Username</span>
        </div>
        <input
          type="text"
          placeholder="elh"
          className="input input-sm input-bordered w-full max-w-xs"
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyPress={handleKeyPress}
        />
      </label>
    );
  }
}

export default UsernameInput;

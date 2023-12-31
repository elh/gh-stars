import { useMemo, useRef, useCallback } from 'react';
import { useStore } from './store';

// AG Grid
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

export function StarChart() {
  const gridRef = useRef();

  // Store
  const { username, githubStars, loading } = useStore((state) => ({
    username: state.username,
    githubStars: state.githubStars,
    loading: state.loading,
  }));

  // AG Grid
  const gridOptions = useMemo(() => ({
    autoSizeStrategy: {
        type: 'fitCellContents',
    }
  }), []);
  const colDefs = useMemo(
    () => [{ field: 'name' }, { field: 'owner' }, { field: 'description' }],
    []
  );
  const rowData = useMemo(() => {
    const userStars = githubStars.get(username);
    if (!userStars) {
      return [];
    }
    return userStars.map((star) => ({
      name: star.name,
      owner: star.owner.login,
      description: star.description,
    }));
  }, [githubStars]);

  const onFilterTextBoxChanged = useCallback(() => {
    gridRef.current.api.setGridOption(
      'quickFilterText',
      document.getElementById('filter-text-box').value
    );
  }, []);

  // Render
  if (!username) {
    return null;
  }

  if (!loading && !githubStars.get(username)) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold">No Stars</div>
          <div className="text-sm text-gray-500">Try another username</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="flex flex-col h-full w-full">
        {loading && (
          <div className="text-center mb-2">
            <div className="text-sm text-gray-500">Loading ...</div>
          </div>
        )}
        <input
          type="text"
          className="input input-xs input-bordered focus:outline-none w-full max-w-xs mb-2 ml-auto"
          id="filter-text-box"
          placeholder="Filter..."
          onInput={onFilterTextBoxChanged}
        />
        {githubStars.get(username) && (
          <div className="ag-theme-balham h-5/6 w-full">
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={colDefs}
              gridOptions={gridOptions}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default StarChart;

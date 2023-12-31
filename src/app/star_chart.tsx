import { useMemo } from 'react';
import { useStore } from './store';

// AG Grid
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

export function StarChart() {
  // Store
  const { username, githubStars, loading } = useStore((state) => ({
    username: state.username,
    githubStars: state.githubStars,
    loading: state.loading,
  }));

  // AG Grid
  const gridOptions = useMemo(() => ({
    defaultColDef: {
      filter: 'agTextColumnFilter'
    },
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
      <div className="h-full w-full">
        {loading && (
          <div className="text-center mb-2">
            <div className="text-sm text-gray-500">Loading ...</div>
          </div>
        )}
        {githubStars.get(username) && (
          <div className="ag-theme-balham h-full w-full">
            <AgGridReact rowData={rowData} columnDefs={colDefs} gridOptions={gridOptions}/>
          </div>
        )}
      </div>
    </div>
  );
}

export default StarChart;

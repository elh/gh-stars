import { useMemo, useRef, useCallback, useState,createRef } from 'react';
import { useStore } from './store';

// AG Grid
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import { ICellRendererParams, IRowNode, GridOptions } from 'ag-grid-community';

import Select from 'react-select';

const customStyles = {
  control: (_: any) =>
    'input input-xs input-bordered focus:outline-none mb-2',
  placeholder: (_: any) => 'text-stone-400',
  menu: (_: any) => 'bg-base-200 shadow-lg rounded-md py-1 px-2 z-50',
  menuList: (_: any) => 'text-sm z-50 no-scrollbar',
  noOptionsMessage: (_: any) => 'text-sm z-50',
  // NOTE: underlying elements are not addressable so this doesn't work. hack directly in css
  clearIndicator: (_: any) => 'hidden',
  dropdownIndicator: (_: any) => 'hidden',
  indicatorsContainer: (_: any) => 'hidden',
};

// TODO: support rendering for multiple users. everyone user is following?
export function StarChart() {
  const gridRef = createRef<AgGridReact>();
  const [filterObj, setFilterObj] = useState<{
    languages: string[];
    topics: string[];
    owners: string[];
  }>({
    languages: [],
    topics: [],
    owners: [],
  });
  const [selectedTopicsValue, setSelectedTopicsValue] = useState([]);

  // Store
  const { username, githubStars, loading, loading_fetched_count } = useStore((state) => ({
    username: state.username,
    githubStars: state.githubStars,
    loading: state.loading,
    loading_fetched_count: state.loading_fetched_count,
  }));

  // AG Grid
  const gridOptions: GridOptions = useMemo(
    () => ({
      suppressCellFocus: true,
      autoSizeStrategy: {
        type: 'fitCellContents',
      },
    }),
    []
  );
  const colDefs = useMemo(
    () => [
      {
        field: 'name',
        cellRenderer: function (params: ICellRendererParams) {
          return (
            <>
              <a
                className="font-bold"
                href={params.data.owner_html_url}
                target="_blank"
                rel="noopener"
              >
                {params.data.owner}
              </a>
              /
              <a
                className="font-bold"
                href={params.data.html_url}
                target="_blank"
                rel="noopener"
              >
                {params.value}
              </a>
            </>
          );
        },
      },
      {
        field: 'description',
        maxWidth: 800,
        autoHeight: true,
        cellRenderer: function (params: ICellRendererParams) {
          return (
            <div>
              <div
                className={
                  params.data.topics.length > 0 && params.value
                    ? 'mb-[-0.6rem]'
                    : ''
                }
              >
                {params.value}
              </div>
              <div className="overflow-auto no-scrollbar">
                {params.data.topics.map((topic: string, index: number) => (
                  <span
                    key={index}
                    className={`text-[8px] btn btn-xs no-animation py-1 px-3 m-[0.5px] rounded-full ${
                      filterObj.topics.includes(topic) ? 'btn-warning' : ''
                    }`}
                    onClick={() => {
                      if (filterObj.topics.includes(topic)) {
                        setFilterObj((prevFilterObj) => ({
                          ...prevFilterObj,
                          topics: prevFilterObj.topics.filter(
                            (item) => item !== topic
                          ),
                        }));
                        setSelectedTopicsValue((prevSelectedTopicsValue) =>
                          prevSelectedTopicsValue.filter(
                            (item: { value: string }) => item.value !== topic
                          )
                        );
                      } else {
                        setFilterObj((prevFilterObj) => {
                          const updatedTopics = prevFilterObj.topics.some(
                            (item) => item === topic
                          )
                            ? prevFilterObj.topics
                            : [...prevFilterObj.topics, topic];

                          return {
                            ...prevFilterObj,
                            topics: updatedTopics,
                          };
                        });
                        setSelectedTopicsValue((prevSelectedTopicsValue: any) => {
                          const exists = prevSelectedTopicsValue.some(
                            (item: { value: string }) => item.value === topic
                          );
                          if (!exists) {
                            return [
                              ...prevSelectedTopicsValue,
                              {
                                value: topic,
                                label: topic,
                              },
                            ];
                          }
                          return prevSelectedTopicsValue;
                        });
                      }
                      if (gridRef.current) {
                        gridRef.current.api.onFilterChanged();
                      }
                    }}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          );
        },
      },
      {
        field: 'language',
      },
      {
        field: 'stars',
        cellRenderer: function (params: ICellRendererParams) {
          const num = params.value;
          if (num > 500) {
            return <div title={num}>{(num / 1000).toFixed(1)}k</div>;
          } else {
            return num;
          }
        },
      },
    ],
    [filterObj]
  );
  const rowData = useMemo(() => {
    const userStars = githubStars.get(username);
    if (!userStars) {
      return [];
    }
    return userStars.map((star) => ({
      owner: star.owner.login,
      name: star.name,
      html_url: star.html_url,
      owner_html_url: star.owner.html_url,
      description: star.description,
      language: star.language,
      topics: star.topics,
      stars: star.stargazers_count,
    }));
  }, [githubStars, username]);

  const onFilterTextBoxChanged = useCallback(() => {
    if (gridRef.current) {
      const filterTextBox = document.getElementById('filter-text-box') as HTMLInputElement;
      gridRef.current.api.setGridOption(
        'quickFilterText',
        filterTextBox?.value
      );
    }
  }, [githubStars, username, filterObj]);

  // AG Grid external filter
  const isExternalFilterPresent = useCallback(() => {
    return Object.keys(filterObj).length > 0;
  }, [filterObj]);

  const doesExternalFilterPass = useCallback(
    (node: IRowNode) => {
      if (node.data) {
        if (
          filterObj.languages.length > 0 &&
          !filterObj.languages.includes(node.data.language)
        ) {
          return false;
        }
        if (
          filterObj.topics.length > 0 &&
          !filterObj.topics.some((topic) => node.data.topics.includes(topic))
        ) {
          return false;
        }
        if (
          filterObj.owners.length > 0 &&
          !filterObj.owners.includes(node.data.owner)
        ) {
          return false;
        }
      }
      return true;
    },
    [filterObj]
  );

  // TODO: filter down options to those in the currently filtered set?
  const languageOptions = useMemo(() => {
    const userStars = githubStars.get(username);
    if (!userStars) {
      return [];
    }

    const languageCounts: { [key: string]: number } = userStars.reduce(
      (counts, star) => {
        const language = star.language || '<None>';
        counts[language] = (counts[language] || 0) + 1;
        return counts;
      },
      {}
    );

    const languages = Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([language, count]) => ({
        value: language !== '<None>' ? language : null,
        label: `${language} (${count})`,
      }));

    return languages;
  }, [githubStars, username]);

  const topicOptions = useMemo(() => {
    const userStars = githubStars.get(username);
    if (!userStars) {
      return [];
    }

    const topicCounts: { [key: string]: number } = userStars.reduce(
      (counts, star) => {
        star.topics.forEach((topic: string) => {
          counts[topic] = (counts[topic] || 0) + 1;
        });
        return counts;
      },
      {}
    );

    const topics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([topic, count]) => ({
        value: topic,
        label: `${topic} (${count})`,
      }));

    return topics;
  }, [githubStars, username]);

  const ownerOptions = useMemo(() => {
    const userStars = githubStars.get(username);
    if (!userStars) {
      return [];
    }

    const ownerCounts: { [key: string]: number } = userStars.reduce(
      (counts, star) => {
        const owner = star.owner.login;
        counts[owner] = (counts[owner] || 0) + 1;
        return counts;
      },
      {}
    );

    const owners = Object.entries(ownerCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([owner, count]) => ({
        value: owner,
        label: `${owner} (${count})`,
      }));

    return owners;
  }, [githubStars, username]);

  const onLanguagesFilterChanged = useCallback((selectedOptions: any) => {
    setFilterObj((prevFilterObj) => ({
      ...prevFilterObj,
      languages: selectedOptions.map((option: {value: string}) => option.value),
    }));
    if (gridRef.current) {
      gridRef.current.api.onFilterChanged();
    }
  }, []);

  const onTopicsFilterChanged = useCallback((selectedOptions: any) => {
    setFilterObj((prevFilterObj) => ({
      ...prevFilterObj,
      topics: selectedOptions.map((option: {value: string}) => option.value),
    }));
    setSelectedTopicsValue(selectedOptions);
    if (gridRef.current) {
      gridRef.current.api.onFilterChanged();
    }
  }, []);

  const onOwnersFilterChanged = useCallback((selectedOptions: any) => {
    setFilterObj((prevFilterObj) => ({
      ...prevFilterObj,
      owners: selectedOptions.map((option: {value: string}) => option.value),
    }));
    if (gridRef.current) {
      gridRef.current.api.onFilterChanged();
    }
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
          // TODO: signal to user total number of stars. GraphQL API requires auth
          <div className="text-center mb-2">
            <div className="text-sm text-gray-500">Loading ... Fetched {loading_fetched_count}</div>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <div className="w-1/6">
            <Select
              isMulti
              name="languages"
              options={languageOptions}
              className="basic-multi-select"
              placeholder="Languages"
              unstyled={true}
              menuPosition="fixed"
              classNames={customStyles}
              onChange={onLanguagesFilterChanged}
            />
          </div>
          <div className="w-1/6">
            <Select
              isMulti
              name="topics"
              // @ts-ignore // options doesn't seem needed...
              options={topicOptions}
              className="basic-multi-select"
              placeholder="Topics"
              unstyled={true}
              menuPosition="fixed"
              classNames={customStyles}
              onChange={onTopicsFilterChanged}
              value={selectedTopicsValue}
            />
          </div>
          <div className="w-1/6">
            <Select
              isMulti
              name="owners"
              options={ownerOptions}
              className="basic-multi-select"
              placeholder="Owners"
              unstyled={true}
              menuPosition="fixed"
              classNames={customStyles}
              onChange={onOwnersFilterChanged}
            />
          </div>
          <input
            type="text"
            className="input input-xs input-bordered focus:outline-none w-1/6 mb-2"
            id="filter-text-box"
            placeholder="Text Filter..."
            onInput={onFilterTextBoxChanged}
          />
        </div>
        {githubStars.get(username) && (
          <div className="ag-theme-balham h-[95%] w-full">
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={colDefs}
              gridOptions={gridOptions}
              isExternalFilterPresent={isExternalFilterPresent}
              doesExternalFilterPass={doesExternalFilterPass}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default StarChart;

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dropdown from './components/Dropdown';

import './App.css'

const queryClient = new QueryClient();

const App: React.FC = () => {
  const url = `https://gateway.marvel.com:443/v1/public/comics`;
  const [selectedViaDropdownWithInternalSearch, setSelectedViaDropdownWithInternalSearch] = useState<string | null>(null);
  const [selectedViaDropdownWithoutInternalSearch, setSelectedViaDropdownWithoutInternalSearch] = useState<string | null>(null);

  // callback function for dropdown component with internal search
  const handleSelectForWithInternalSearch = (selected: string | null) => {
      setSelectedViaDropdownWithInternalSearch(selected);
  };

  // callback function for dropdown component without internal search
  const handleSelectForWithoutInternalSearch = (selected: string | null) => {
      setSelectedViaDropdownWithoutInternalSearch(selected)
  };

    return (
        <QueryClientProvider client={queryClient}>
            <div className='bottom-margin'>
                <h4>Marvel Character Dropdown without internal search</h4>
                <h4>Searching here makes an API call</h4>
                {selectedViaDropdownWithInternalSearch && <p>Value selected is: {selectedViaDropdownWithInternalSearch}</p>}
                <Dropdown url={url} onSelect={handleSelectForWithInternalSearch} internalSearch={false} />
            </div>

            <div>
              <h4>Marvel Character Dropdown with internal search</h4>
              <h4>Searching here does not make an API call</h4>
              {selectedViaDropdownWithoutInternalSearch && <p>Value selected is: {selectedViaDropdownWithoutInternalSearch}</p>}
              <Dropdown url={url} onSelect={handleSelectForWithoutInternalSearch} internalSearch={true} />
            </div>
        </QueryClientProvider>
    );
};

export default App;

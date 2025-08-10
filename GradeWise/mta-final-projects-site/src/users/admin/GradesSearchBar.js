//V
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { FaSearch, FaTimes } from 'react-icons/fa';

// Styled components for the modern search bar
const SearchContainer = styled.div`
    width: 100%;
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 9999;
`;

const SearchInputContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 12px;
    }
`;

const SearchSelect = styled.select`
    padding: 14px 16px;
    border-radius: 12px;
    border: 2px solid var(--input-border);
    font-size: 17.6px; /* Increased by 10% */
    font-weight: 500;
    background: var(--input-bg);
    color: var(--text-primary);
    min-width: 180px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px var(--shadow-light);

    &:focus {
        outline: none;
        border-color: var(--accent-primary);
        box-shadow: 0 4px 20px var(--shadow-medium);
    }

    &:hover {
        border-color: var(--accent-primary);
        box-shadow: 0 4px 15px var(--shadow-medium);
    }

    @media (max-width: 768px) {
        width: 100%;
        min-width: unset;
    }
`;

// Custom styles for react-select - matching assign-projects design
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    background: 'var(--input-bg)',
    border: '2px solid var(--input-border)',
    borderRadius: '12px',
    boxShadow: '0 4px 20px var(--shadow-light)',
    color: 'var(--text-primary)',
    minHeight: '50px',
    transition: 'all 0.3s ease',
    minWidth: '300px',
    flex: 1,
    '&:hover': {
      borderColor: 'var(--accent-primary)',
      boxShadow: '0 4px 15px var(--shadow-medium)',
    },
  }),
  menu: (provided) => ({
    ...provided,
    background: 'var(--card-bg)',
    backdropFilter: 'blur(10px)',
    border: '1px solid var(--card-border)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px var(--shadow-light)',
    zIndex: 9999,
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected ? 'var(--accent-primary)' : 'transparent',
    color: state.isSelected ? 'white' : 'var(--text-primary)',
    padding: '12px 16px',
    fontSize: '17.6px',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: state.isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)',
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'var(--text-secondary)',
    fontSize: '17.6px',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--text-primary)',
    fontSize: '17.6px',
    fontWeight: '500',
  }),
  input: (provided) => ({
    ...provided,
    color: 'var(--text-primary)',
    fontSize: '17.6px',
  }),
};

const SelectContainer = styled.div`
    min-width: 300px;
    flex: 1;
    position: relative;
    z-index: 9999;

    @media (max-width: 768px) {
        width: 100%;
        min-width: unset;
    }
`;

const SearchButton = styled.button`
    padding: 14px 24px;
    background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 120px;
    justify-content: center;

    &:hover {
        background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
        box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
        transform: translateY(-2px);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        background: #ccc;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    @media (max-width: 768px) {
        width: 100%;
    }
`;

const ClearButton = styled(SearchButton)`
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);

    &:hover {
        background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
        box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 12px;

    @media (max-width: 768px) {
        width: 100%;
        flex-direction: column;
    }
`;

const NoResultsMessage = styled.div`
    text-align: center;
    padding: 20px;
    color: #718096;
    font-size: 16px;
    font-style: italic;
`;

// SearchBar component for grades filtering with Judge Name and Project Name
const GradesSearchBar = ({ 
    searchTerm, 
    searchField, 
    onSearchInputChange, 
    onSearchFieldChange, 
    onSearch, 
    onClearFilters, 
    filtersActive, 
    sortedJudgeNames 
}) => {
    const [projectMap, setProjectMap] = useState({});

    useEffect(() => {
        // Load project map from local storage
        const storedProjectMap = JSON.parse(localStorage.getItem('projectMap')) || {};
        setProjectMap(storedProjectMap);
    }, []);

    // Convert judge names to options format for react-select
    const judgeOptions = sortedJudgeNames.map(name => ({
        value: name,
        label: name
    }));

    // Create options for project names
    const projectOptions = Object.entries(projectMap).map(([id, name]) => ({
        value: name,
        label: name
    })).sort((a, b) => a.label.localeCompare(b.label));

    // Get options based on selected field
    const getFieldOptions = () => {
        switch (searchField) {
            case 'judge_name':
                return judgeOptions;
            case 'project_name':
                return projectOptions;
            default:
                return [];
        }
    };

    // Handle selection change
    const handleChange = (selectedOption) => {
        onSearchInputChange({ target: { value: selectedOption ? selectedOption.value : '' } });
    };

    const isSearchDisabled = !searchField || !searchTerm;

    return (
        <SearchContainer>
            <SearchInputContainer>
                <SearchSelect value={searchField} onChange={onSearchFieldChange}>
                    <option value="">Select field to search</option>
                    <option value="judge_name">Judge Name</option> 
                    <option value="project_name">Project Name</option>
                </SearchSelect>
                
                {searchField && (
                    <SelectContainer>
                        <Select
                            value={getFieldOptions().find(option => option.value === searchTerm) || null}
                            onChange={handleChange}
                            options={getFieldOptions()}
                            placeholder={`Select or type to search ${searchField.replace('_', ' ')}...`}
                            isClearable
                            isSearchable
                            noOptionsMessage={() => "No options available"}
                            loadingMessage={() => "Loading..."}
                            styles={customSelectStyles}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                        />
                    </SelectContainer>
                )}
                
                <ButtonContainer>
                    <SearchButton 
                        type="button" 
                        onClick={onSearch}
                        disabled={isSearchDisabled}
                    >
                        <FaSearch />
                        Search
                    </SearchButton>
                    
                    {filtersActive && (
                        <ClearButton type="button" onClick={onClearFilters}>
                            <FaTimes />
                            Clear
                        </ClearButton>
                    )}
                </ButtonContainer>
            </SearchInputContainer>
            
            {searchField && getFieldOptions().length === 0 && (
                <NoResultsMessage>
                    No {searchField.replace('_', ' ')} data available for search.
                </NoResultsMessage>
            )}
        </SearchContainer>
    );
};

export default GradesSearchBar;

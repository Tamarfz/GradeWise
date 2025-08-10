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
    background: var(--card-bg);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    box-shadow: 0 8px 32px var(--shadow-light);
    border: 1px solid var(--card-border);
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
    box-shadow: 0 2px 10px var(--shadow-light);

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

const StyledSelect = styled(Select)`
    min-width: 300px;
    flex: 1;
    position: relative;
    z-index: 9999;
    
    .select__control {
        background: var(--input-bg);
        border: 2px solid var(--input-border);
        border-radius: 12px;
        box-shadow: 0 2px 10px var(--shadow-light);
        min-height: 50px;
        transition: all 0.3s ease;
        
        &:hover {
            border-color: var(--accent-primary);
            box-shadow: 0 4px 15px var(--shadow-medium);
        }

        &.select__control--is-focused {
            border-color: var(--accent-primary);
            box-shadow: 0 4px 20px var(--shadow-medium);
        }
    }
    
    .select__menu {
        background: #000000 !important;
        backdrop-filter: blur(10px);
        border: 1px solid #333333 !important;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3) !important;
        z-index: 99999 !important;
        position: absolute !important;
    }
    
    .select__option {
        padding: 12px 16px;
        font-size: 17.6px; /* Increased by 10% */
        transition: all 0.2s ease;
        color: #ffffff !important;
        background: #000000 !important;
        
        &:hover {
            background: #333333 !important;
            color: #ffffff !important;
        }

        &.select__option--is-focused {
            background: #333333 !important;
            color: #ffffff !important;
        }

        &.select__option--is-selected {
            background: #2196f3 !important;
            color: white !important;
        }
    }

    .select__placeholder {
        color: var(--text-secondary);
        font-size: 17.6px; /* Increased by 10% */
    }

    .select__single-value {
        color: #000000 !important;
        font-size: 17.6px; /* Increased by 10% */
        font-weight: 500;
    }

    /* Force consistent styling regardless of theme */
    .select__option,
    .select__option:hover,
    .select__option:focus {
        color: #ffffff !important;
        background: #000000 !important;
    }

    /* Hover and focus states */
    .select__option:hover,
    .select__option:focus {
        background: #333333 !important;
    }

    /* Only selected option should be white */
    .select__option--is-selected {
        color: white !important;
        background: #2196f3 !important;
    }

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
    color: var(--text-secondary);
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
                    <StyledSelect
                        value={getFieldOptions().find(option => option.value === searchTerm) || null}
                        onChange={handleChange}
                        options={getFieldOptions()}
                        placeholder={`Select or type to search ${searchField.replace('_', ' ')}...`}
                        isClearable
                        isSearchable
                        noOptionsMessage={() => "No options available"}
                        loadingMessage={() => "Loading..."}
                    />
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

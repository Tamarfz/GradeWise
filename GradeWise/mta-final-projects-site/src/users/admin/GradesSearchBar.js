//V
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Select from 'react-select';

// Styled components for the search bar
const SearchContainer = styled.div`
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 10px 0;

    /* Mobile responsiveness */
    @media (max-width: 768px) {
        padding: 5px;
    }
`;

const SearchInputContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    /* Stack elements vertically on smaller screens */
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 5px;
    }
`;

const SearchSelect = styled.select`
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 16px;
    background-color: rgba(240, 248, 255, 0.9); 
    color: #175a94;
    flex: 1;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    &:hover {
        background-color: #e1f0ff;
    }

    /* Full width on mobile */
    @media (max-width: 768px) {
        width: 50%;
    }
`;

const StyledSelect = styled(Select)`
    flex: 2;
    min-width: 200px;
    
    .select__control {
        background-color: rgba(240, 248, 255, 0.9);
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        
        &:hover {
            background-color: #e1f0ff;
        }
    }
    
    .select__menu {
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
    
    .select__option {
        &:hover {
            background-color: #e1f0ff;
        }
    }
`;

const SearchButton = styled.button`
    padding: 12px 20px;
    background-color: #175a94;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    font-size: 16px;

    &:hover {
        background-color: #0e3f6d;
    }

    /* Full width on mobile */
    @media (max-width: 768px) {
        width: 50%;
    }
`;

const ClearButton = styled(SearchButton)`
    background-color: #dc3545;
    &:hover {
        background-color: #c82333;
    }

    /* Full width on mobile */
    @media (max-width: 768px) {
        width: 50%;
    }
`;

// SearchBar component for grades filtering with Judge Name and Project Name
const GradesSearchBar = ({ searchTerm, searchField, onSearchInputChange, onSearchFieldChange, onSearch, onClearFilters, filtersActive, sortedJudgeNames }) => {
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

    return (
        <SearchContainer>
            <SearchInputContainer>
                <SearchSelect value={searchField} onChange={onSearchFieldChange}>
                    <option value="">Select field</option>
                    <option value="judge_name">Judge Name</option> 
                    <option value="project_name">Project Name</option>
                </SearchSelect>
                {searchField ? (
                    <StyledSelect
                        value={getFieldOptions().find(option => option.value === searchTerm) || null}
                        onChange={handleChange}
                        options={getFieldOptions()}
                        placeholder={`Select or type to search ${searchField}...`}
                        isClearable
                        isSearchable
                    />
                ) : null}
                <SearchButton type="button" onClick={onSearch}>Search</SearchButton>
                {filtersActive && (
                    <ClearButton type="button" onClick={onClearFilters}>Clear</ClearButton>
                )}
            </SearchInputContainer>
        </SearchContainer>
    );
};

export default GradesSearchBar;

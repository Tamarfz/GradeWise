import React from 'react';
import styled from 'styled-components';
import { FaSearch, FaTimes } from 'react-icons/fa';
import "./SearchBar.css"

const FormContainer = styled.form`
    width: 100%;
    max-width: 800px;
    margin: 0 auto 2rem;
    padding: 0;
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    
    /* On desktop, use full width; on mobile, use 90% of viewport */
    @media (max-width: 768px) {
        width: 90%;
        flex-direction: column;
        gap: 0.5rem;
        margin: 0 auto;
    }
`;

const SearchIcon = styled.div`
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.9);
    color: #1a202c;
    border: 2px solid rgba(102, 126, 234, 0.3);
    border-radius: 12px;
    height: 50px;
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    
    @media (max-width: 768px) {
        height: 45px;
        width: 45px;
    }
`;

const SearchFields = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex: 1;
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
    }
`;

const SelectField = styled.select`
    padding: 0.75rem 1rem;
    border-radius: 12px;
    border: 1px solid rgba(102, 126, 234, 0.2);
    font-size: 0.9rem;
    background: rgba(255, 255, 255, 0.9);
    color: #1a202c;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    width: 200px;
    backdrop-filter: blur(10px);
    
    &:hover {
        border-color: rgba(102, 126, 234, 0.4);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }
    
    &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const InputField = styled.input`
    padding: 0.75rem 1rem;
    border-radius: 12px;
    border: 1px solid rgba(102, 126, 234, 0.2);
    font-size: 0.9rem;
    background: rgba(255, 255, 255, 0.9);
    color: #1a202c;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    width: 250px;
    transition: all 0.3s ease-in-out;
    backdrop-filter: blur(10px);
    
    &:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    &::placeholder {
        color: #718096;
    }
    
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const Button = styled.button`
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    font-size: 0.9rem;
    font-weight: 600;
    height: 45px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
    
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const ClearButton = styled(Button)`
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
    
    &:hover {
        box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
    }
    
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const SearchBar = ({ 
    searchTerm, 
    searchField, 
    onSearchInputChange, 
    onSearchFieldChange, 
    onSearchButtonClick, 
    onClearFilters, 
    filtersActive 
}) => {
    return (
        <FormContainer onSubmit={(e) => { e.preventDefault(); onSearchButtonClick(e); }}>
            <InputContainer>
                <SearchIcon>
                    <FaSearch size={16} />
                </SearchIcon>
                
                <SearchFields>
                    <SelectField value={searchField} onChange={onSearchFieldChange}>
                        <option value="">Select field</option>
                        <option value="name">Name</option>
                        <option value="Title">Title</option>
                        <option value="ProjectYear">Year</option>
                        <option value="WorkshopName">Workshop Name</option>
                        <option value="ProjectOwners">Project Owners</option>
                        <option value="Lecturer">Lecturer</option>
                        <option value="StudentName">Student Name</option>
                        <option value="StudentEmail">Student Email</option>
                        <option value="StudentPhone">Student Phone</option>
                        <option value="WorkshopId">Workshop Id</option>
                    </SelectField>
                    <InputField
                        type="text"
                        value={searchTerm}
                        onChange={onSearchInputChange}
                        placeholder="Search projects..."
                    />
                    <Button type="submit">
                        <FaSearch size={14} />
                        Search
                    </Button>
                    {filtersActive && (
                        <ClearButton type="button" onClick={onClearFilters}>
                            <FaTimes size={14} />
                            Clear
                        </ClearButton>
                    )}
                </SearchFields>
            </InputContainer>
        </FormContainer>
    );
};

export default SearchBar;

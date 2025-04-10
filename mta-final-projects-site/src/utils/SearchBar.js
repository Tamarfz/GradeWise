import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import "./SearchBar.css"

const FormContainer = styled.form`
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 10px 0;
`;

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    
    -webkit-transition: width 2s ease-in-out;
    transition: width 2s ease-in-out;
    
    &:focus {
        width: 100%;
    }
    
    /* On desktop, use full width; on mobile, use 90% of viewport */
    @media (max-width: 768px) {
        width: 90%;
        flex-direction: column;
        gap: 5px;
        margin: 0 auto;
    }
`;

// Modified keyframes for expanding with extra bounce
const expandAnimation = keyframes`
  0% {
    transform: scaleX(0);
    opacity: 0;
  }
  70% {
    transform: scaleX(1.2);
    opacity: 1;
  }
  85% {
    transform: scaleX(0.95);
  }
  100% {
    transform: scaleX(1);
    opacity: 1;
  }
`;

// Keyframes for collapsing (from right to left)
const collapseAnimation = keyframes`
  0% {
    transform: scaleX(1);
    opacity: 1;
  }
  20% {
    transform: scaleX(0.9);
    opacity: 0.8;
  }
  100% {
    transform: scaleX(0);
    opacity: 0;
  }
`;

// ToggleFields uses the keyframe animations with transform-origin left.
const ToggleFields = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    
    transform-origin: left;
    animation: ${props => (props.expanded ? expandAnimation : collapseAnimation)} 0.5s ease forwards;
    
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 5px;
        width: 100%;
    }
`;

// ToggleButton remains always visible. On mobile the button shrinks a bit and the icon scales.
const ToggleButton = styled.button`
    padding: 8px;
    background-color: ${props => (props.expanded ? "black" : "white")};
    color: ${props => (props.expanded ? "white" : "black")};
    border: 3px solid black;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 16px;
    height: 60px;
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
        background-color: ${props => (props.expanded ? "rgba(0, 0, 0, 0.8)" : "white")};
    }
    object-fit: fill;

    @media (max-width: 768px) {
        height: 50px;
        width: 50px;
        font-size: 14px;
    }
`;

const SelectField = styled.select`
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 16px;
    background-color: #fff; 
    color: black;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease, width 0.4s ease;
    width: 200px;
    &:hover {
        background-color: #fff;
    }
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const InputField = styled.input`
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 16px;
    background-color: #fff; 
    color: black;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    width: 130px;
    -webkit-transition: width 0.4s ease-in-out;
    transition: width 0.4s ease-in-out;
    
    &:focus {
        width: 100%;
    }
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const Button = styled.button`
    padding: 12px 20px;
    background-color: rgb(0, 2, 3);
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    font-size: 16px;
    height: 40px;
    &:hover {
          background-color: rgba(0, 2, 3, 0.8);
    }
    @media (max-width: 768px) {
        width: 100%;
    }
`;

const ClearButton = styled(Button)`
    background-color: #dc3545;
    &:hover {
        background-color: #c82333;
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
    const [expanded, setExpanded] = useState(false);

    return (
        <FormContainer onSubmit={(e) => { e.preventDefault(); onSearchButtonClick(e); }}>
            <InputContainer>
                <ToggleButton expanded={expanded} type="button" onClick={() => setExpanded(prev => !prev)}>
                    {expanded 
                        ? "–" 
                        : <img className="input-with-icon-search" style={{width: "20px", height:"20px"}} src={process.env.PUBLIC_URL +"/Assets/icons/search.png"} alt="Search" />
                    }
                </ToggleButton>
                
                <ToggleFields expanded={expanded}>
                    <SelectField value={searchField} onChange={onSearchFieldChange}>
                        <option value="">Select field</option>
                        <option value="name">Name</option>
                        <option value="Title">Title</option>
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
                        placeholder="Search..."
                    />
                    <Button type="submit">
                        Search
                    </Button>
                    {filtersActive && (
                        <ClearButton type="button" onClick={onClearFilters}>
                            Clear Filters
                        </ClearButton>
                    )}
                </ToggleFields>
            </InputContainer>
        </FormContainer>
    );
};

export default SearchBar;

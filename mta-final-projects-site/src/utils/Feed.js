import React, { useState, useEffect } from 'react';
import Post from './Post';
import axios from 'axios';
import styled from 'styled-components';
import SearchBar from './SearchBar'; // Import SearchBar component
import { backendURL } from '../../src/config';
import Loading from './Loader';

// Styled components for Feed
const FeedContainer = styled.div`
    background: transparent;
    padding: 0;
    max-width: 100%;
    margin: 0 auto;

    /* Mobile responsiveness */
    @media (max-width: 768px) {
        padding: 0;
        max-width: 100%;
    }
`;

const EndMessage = styled.p`
    color: #718096;
    text-align: center;
    font-size: 1.1rem;
    font-weight: 500;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);

    /* Adjust font size for mobile */
    @media (max-width: 768px) {
        font-size: 1rem;
        padding: 1.5rem;
    }
`;

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const Feed = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('');
    const [filtersActive, setFiltersActive] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async (query = '') => {
        try {
            setLoading(true);
            const response = await axios.get(`${backendURL}/admin/projects/projectsList${query}`);
            let fetchedProjects = response.data;

            // Shuffle the projects array
            const shuffledProjects = shuffleArray(fetchedProjects);

            setProjects(shuffledProjects);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setLoading(false);
        }
    };

    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchFieldChange = (event) => {
        setSearchField(event.target.value);
    };

    const handleSearchButtonClick = (event) => {
        event.preventDefault();
        if (searchField && searchTerm) {
            const query = `?search=${searchTerm}&searchField=${searchField}`;
            fetchProjects(query);
            setFiltersActive(true); // Enable filter mode
        } else {
            alert('Please select a field to search.');
        }
    };

    const handleClearFilters = (event) => {
        event.preventDefault();
        setSearchTerm('');
        setSearchField('');
        fetchProjects(); // Fetch all projects without filters
        setFiltersActive(false); // Disable filter mode
    };

    if (loading) {
        return <Loading/>;
    }

    return (
        <FeedContainer>
            <SearchBar
                searchTerm={searchTerm}
                searchField={searchField}
                onSearchInputChange={handleSearchInputChange}
                onSearchFieldChange={handleSearchFieldChange}
                onSearchButtonClick={handleSearchButtonClick}
                onClearFilters={handleClearFilters}
                filtersActive={filtersActive}
            />
            
            {projects.length > 0 ? (
                <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                    {projects.map((project) => (
                        <Post
                            key={project._id}
                            project={project}
                            showGradeButton={false} // Don't show the Grade button
                        />
                    ))}
                </div>
            ) : (
                <EndMessage>No projects to show</EndMessage>
            )}
        </FeedContainer>
    );
};

export default Feed;

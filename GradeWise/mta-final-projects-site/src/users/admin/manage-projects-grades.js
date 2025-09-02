//V
import { backendURL } from '../../config';
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import Swal from 'sweetalert2'; 
import GradesManager from './GradesTable'; // Updated from GradesTable

import AdminButtons from './AdminButtons';
import GradesSearchBar from './GradesSearchBar'; // Import the custom search bar
import './ManageGrades.css';

const ManageGrades = () => {
    const [grades, setGrades] = useState([]);
    const [filteredGrades, setFilteredGrades] = useState([]); // To store filtered grades
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState('');
    const [filtersActive, setFiltersActive] = useState(false);
    const [judgeMap, setJudgeMap] = useState({});
    const [projectMap, setProjectMap] = useState({});
    const [sortedJudgeNames, setSortedJudgeNames] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchGrades();
    }, [token]);

    useEffect(() => {
        // Load judge and project maps from local storage
        const storedJudgeMap = JSON.parse(localStorage.getItem('judgeMap')) || {};
        const storedProjectMap = JSON.parse(localStorage.getItem('projectMap')) || {};
        setJudgeMap(storedJudgeMap);
        setProjectMap(storedProjectMap);
        
        // Create sorted array of judge names
        const judgeNames = Object.values(storedJudgeMap).sort((a, b) => a.localeCompare(b));
        setSortedJudgeNames(judgeNames);
    }, []);

    const fetchGrades = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${backendURL}/admin/grades`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch grades');
            }

            const data = await response.json();
            setGrades(data.grades);
            setFilteredGrades(data.grades); // Set initial filtered grades to all grades
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch grades. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle input change for search term
    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle search field change
    const handleSearchFieldChange = (e) => {
        setSearchField(e.target.value);
        setSearchTerm(''); // Reset search term when field changes
    };

    // Handle search button click
    const handleSearch = () => {
        if (searchField && searchTerm) {
            const filtered = grades.filter((grade) => {
                let fieldValue;

                // Special handling for judge_name and project_name fields
                if (searchField === 'judge_name') {
                    fieldValue = judgeMap[grade.judge_id]?.toLowerCase();
                } else if (searchField === 'project_name') {
                    fieldValue = projectMap[grade.project_id]?.toLowerCase();
                } else {
                    fieldValue = grade[searchField]?.toString().toLowerCase();
                }

                return fieldValue && fieldValue.includes(searchTerm.toLowerCase());
            });
            setFilteredGrades(filtered);
            setFiltersActive(true);
        } else {
            Swal.fire('Error', 'Please select a field and enter a search term.', 'error');
        }
    };

    // Handle clearing filters
    const handleClearFilters = () => {
        setSearchTerm('');
        setSearchField('');
        setFilteredGrades(grades); // Reset to full list of grades
        setFiltersActive(false);
    };

    if (loading) {
        return (
            <div className="manage-grades-container">
                <div className="loading">
                    <h4>Loading grades...</h4>
                </div>
            </div>
        );
    }

    return (
        <div className="manage-grades-container" >
            <div className="admin-header">
            <h2>Manage Grades</h2>
            </div>
            <GradesSearchBar
                searchTerm={searchTerm}
                searchField={searchField}
                onSearchInputChange={handleSearchInputChange}
                onSearchFieldChange={handleSearchFieldChange}
                onSearch={handleSearch}
                onClearFilters={handleClearFilters}
                filtersActive={filtersActive}
                sortedJudgeNames={sortedJudgeNames}
                grades={grades}
            />
            <div className="grades-manager-table">
                <GradesManager grades={filteredGrades} /> {/* Display filtered grades */} {/*GradesTable is now GradesManager*/}
            </div>
            <AdminButtons />
        </div>
    );
};

export default ManageGrades;

//V
import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import ReactDOM from 'react-dom/client';

import ExportData from './export-data';
import AdminButtons from './AdminButtons';
import { backendURL } from '../../config';
import './ManageJudges.css'; // Import your CSS file for styling

const ManageJudges = observer(() => {
    const [judges, setJudges] = useState([]);
    const [potentialJudges, setPotentialJudges] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedJudges, setSelectedJudges] = useState([]);
    const [filterText, setFilterText] = useState('');

    // Function to handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
    
            fetch(`${backendURL}/upload/potential_users`, {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                fetchPotentialJudges(); // Refresh the potential judges list after successful upload
                Swal.fire('Success', 'Potential judges data uploaded successfully!', 'success');
            })
            .catch((error) => {
                console.error('Error:', error);
                Swal.fire('Error', 'Error uploading potential judges data!', 'error');
            });
        }
    };

    // Function to fetch judges data from the database
    const fetchJudges = () => {
        fetch(`${backendURL}/admin/judges/judgesList`)
            .then(response => response.json())
            .then(data => {
                setJudges(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const fetchPotentialJudges = () => {
        return fetch(`${backendURL}/admin/judges/potentialJudgesList`)
            .then(response => response.json())
            .then(data => {
                setPotentialJudges(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    // Function to remove selected IDs from the database
    const removeSelectedIds = (selectedPotentialJudges) => {
        const potentialUserIds = selectedPotentialJudges;
        fetch(`${backendURL}/admin/judges/remove-ids`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids: potentialUserIds }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setSelectedIds([]);
                fetchPotentialJudges(); // Refresh the potential judges data after removal
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    // Function to remove selected users from the database
    const removeSelectedUsers = (selectedJudges) => {
        const userIds = selectedJudges;
        fetch(`${backendURL}/admin/judges/remove-users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ users: userIds }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setSelectedJudges([]);
                fetchJudges(); // Refresh the judges data after removal
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    useEffect(() => {
        fetchJudges();
        fetchPotentialJudges();
    }, []);
    
    const openJudgesListModal = () => {
        Swal.fire({
            title: '<span style="font-size: 75%; color: var(--text-primary);">Registered Judges</span>',
            html: '<div id="judgesListContainer" style="font-size: 75%; color: var(--text-primary);"></div>',
            showCancelButton: true,
            confirmButtonText: '<span style="font-size: 75%; color: var(--text-primary);">Remove Selected Judges</span>',
            cancelButtonText: '<span style="font-size: 75%; color: var(--text-primary);">Close</span>',
            preConfirm: () => {
                const selectedJudges = JSON.parse(localStorage.getItem('selectedJudges')) || [];
                removeSelectedJudges(selectedJudges);
            },
            didOpen: () => {
                renderJudgesList();
            },
        });
    };
    
    
    const renderJudgesList = () => {
        const judgesListContainer = document.getElementById('judgesListContainer');
        if (judgesListContainer) {
            const root = ReactDOM.createRoot(judgesListContainer);
            root.render(<JudgesList />);
        }
    };
    
    // Updated JudgesList component with sorting functionality
    const JudgesList = () => {
        const [filterText, setFilterText] = React.useState('');
        const [selectedJudges, setSelectedJudges] = React.useState([]);
        const [sortField, setSortField] = React.useState('name');
        const [sortDirection, setSortDirection] = React.useState('asc');
      
        React.useEffect(() => {
          localStorage.setItem('selectedJudges', JSON.stringify(selectedJudges));
        }, [selectedJudges]);
      
        const toggleSelection = (id) => {
          setSelectedJudges((prevSelectedJudges) =>
            prevSelectedJudges.includes(id)
              ? prevSelectedJudges.filter((judgeId) => judgeId !== id)
              : [...prevSelectedJudges, id]
          );
        };

        const handleSort = (field) => {
            if (sortField === field) {
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            } else {
                setSortField(field);
                setSortDirection('asc');
            }
        };

        const renderSortButton = (field, label) => (
            <button
                onClick={() => handleSort(field)}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    fontWeight: 'bold',
                    padding: '2px 5px',
                    margin: '0 5px'
                }}
            >
                {label} {sortField === field ? (sortDirection === 'asc' ? '▲' : '▼') : '↕'}
            </button>
        );

        const sortedJudges = [...judges]
            .filter(
                (judge) =>
                    judge.name.toLowerCase().includes(filterText.toLowerCase()) ||
                    judge.ID.toString().includes(filterText)
            )
            .sort((a, b) => {
                let aValue, bValue;
                
                if (sortField === 'name') {
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                } else if (sortField === 'id') {
                    aValue = parseInt(a.ID);
                    bValue = parseInt(b.ID);
                }
                
                if (sortDirection === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
      
        return (
          <div>
            <input
              type="text"
              id="filterInput"
              placeholder="Filter by name or ID"
              onChange={(e) => setFilterText(e.target.value)}
              style={{ 
                marginBottom: '10px', 
                width: '100%', 
                padding: '5px',
                backgroundColor: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--text-primary)'
              }}
            />
            <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
                {renderSortButton('name', 'Name')}
                {renderSortButton('id', 'ID')}
            </div>
            <ul id="judgesList" style={{ listStyleType: 'none', padding: 0 }}>
              {sortedJudges.map((judge, index) => (
                  <li key={judge.ID} style={{ marginBottom: '10px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        border: '1px solid var(--border-color)',
                        padding: '10px',
                        backgroundColor: 'var(--card-bg)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      <input
                        type="checkbox"
                        id={`judge-${index}`}
                        style={{ marginLeft: '20px', marginRight: '10px' }}
                        checked={selectedJudges.includes(judge.ID.toString())}
                        onChange={() => toggleSelection(judge.ID.toString())}
                      />
                      <label
                        htmlFor={`judge-${index}`}
                        style={{
                          flex: 1,
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          marginRight: '200px',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {judge.name} (ID: {judge.ID})
                      </label>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        );
      };
    
    useEffect(() => {
        renderJudgesList();
    }, [selectedJudges, filterText]);

    const removeSelectedJudges = (selectedJudges) => {
        removeSelectedUsers(selectedJudges);
    };
//toggleSelection - Delete - maybe
    const toggleSelection = (judgeId) => {
        const selectedIndex = selectedJudges.indexOf(judgeId);
        let newSelectedJudges = [];

        if (selectedIndex === -1) {
            newSelectedJudges = [...selectedJudges, judgeId];
        } else {
            newSelectedJudges = selectedJudges.filter((selectedId) => selectedId !== judgeId);
        }

        setSelectedJudges(newSelectedJudges);
    };

    const openPotentialJudgesListModal = () => {
        Swal.fire({
            title: '<span style="font-size: 75%; color: var(--text-primary);">Potential Judges</span>',
            html: '<div id="potentialJudgesListContainer" style="font-size: 75%; color: var(--text-primary);"></div>',
            showCancelButton: true,
            confirmButtonText: '<span style="font-size: 75%; color: var(--text-primary);">Remove Selected Potential Judges</span>',
            cancelButtonText: '<span style="font-size: 75%; color: var(--text-primary);">Close</span>',
            preConfirm: () => {
                const selectedIds = JSON.parse(localStorage.getItem('selectedPotentialJudges')) || [];
                removeSelectedIdsInternal(selectedIds);
            },
            didOpen: () => {
                renderPotentialJudgesList();
            },
        });
    };
    
    const renderPotentialJudgesList = () => {
        const potentialJudgesListContainer = document.getElementById('potentialJudgesListContainer');
        if (potentialJudgesListContainer) {
            const root = ReactDOM.createRoot(potentialJudgesListContainer);
            root.render(<PotentialJudgesList />);
        }
    };
    
    const PotentialJudgesList = () => {
        const [filterText, setFilterText] = React.useState('');
        const [selectedIds, setSelectedIds] = React.useState([]);
        const [sortDirection, setSortDirection] = React.useState('asc');
    
        React.useEffect(() => {
            localStorage.setItem('selectedPotentialJudges', JSON.stringify(selectedIds));
        }, [selectedIds]);
    

        const toggleSelection = (id) => {
            setSelectedIds((prevSelectedIds) => {
                if (prevSelectedIds.includes(id)) {
                    return prevSelectedIds.filter((judgeId) => judgeId !== id);
                } else {
                    return [...prevSelectedIds, id];
                }
            });
        };

        const handleSort = () => {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        };

        const renderSortButton = () => (
            <button
                onClick={handleSort}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    fontWeight: 'bold',
                    padding: '2px 5px',
                    margin: '0 5px'
                }}
            >
                ID {sortDirection === 'asc' ? '▲' : '▼'}
            </button>
        );

        const sortedPotentialJudges = [...potentialJudges]
            .filter((judge) => judge.ID.toString().includes(filterText))
            .sort((a, b) => {
                const aValue = parseInt(a.ID);
                const bValue = parseInt(b.ID);
                
                if (sortDirection === 'asc') {
                    return aValue - bValue;
                } else {
                    return bValue - aValue;
                }
            });
    
        return (
            <div>
                <input
                    type="text"
                    id="filterInput"
                    placeholder="Filter by ID"
                    onChange={(e) => setFilterText(e.target.value)}
                    style={{ 
                        marginBottom: '10px', 
                        width: '100%', 
                        padding: '5px',
                        backgroundColor: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        color: 'var(--text-primary)'
                    }}
                />
                <div style={{ marginBottom: '10px' }}>
                    {renderSortButton()}
                </div>
                <ul id="potentialJudgesList" style={{ listStyleType: 'none', padding: 0 }}>
                    {sortedPotentialJudges.map((judge, index) => (
                        <li key={judge.ID} style={{ marginBottom: '10px' }}>
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'left', 
                                justifyContent: 'normal', 
                                border: '1px solid var(--border-color)', 
                                padding: '10px',
                                backgroundColor: 'var(--card-bg)',
                                color: 'var(--text-primary)'
                            }}>
                                <input
                                    type="checkbox"
                                    id={`potential-judge-${index}`}
                                    checked={selectedIds.includes(judge.ID.toString())}
                                    onChange={() => toggleSelection(judge.ID.toString())}
                                    style={{ marginLeft: '20px', marginRight: '10px' }}
                                />
                                <label htmlFor={`potential-judge-${index}`} style={{ 
                                    flex: 1, 
                                    whiteSpace: 'nowrap', 
                                    textOverflow: 'ellipsis', 
                                    marginRight: '200px',
                                    color: 'var(--text-primary)'
                                }}>
                                    ID: {judge.ID}
                                </label>
                            </div>
                        </li>
                    ))}
                </ul>
                <div>
                    <input 
                        type="text" 
                        id="newIdInput" 
                        placeholder="Enter new ID" 
                        style={{
                            backgroundColor: 'var(--input-bg)',
                            border: '1px solid var(--input-border)',
                            color: 'var(--text-primary)',
                            padding: '5px',
                            marginRight: '10px'
                        }}
                    />
                    <button 
                        onClick={addNewId}
                        style={{
                            backgroundColor: 'var(--accent-primary)',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Add New ID
                    </button>
                </div>
            </div>
        );
    };
    
    useEffect(() => {
        renderPotentialJudgesList();
    }, [selectedIds, filterText]);
    
    const removeSelectedIdsInternal = (selectedIds) => {
        removeSelectedIds(selectedIds);
    };

    const addNewId = () => {
        const newIdInput = document.getElementById('newIdInput');
        const newId = newIdInput.value.trim();
        if (newId) {
            addNewPotentialJudge(newId, () => {
                newIdInput.value = '';
                fetchPotentialJudges();
            });
        }
    };

    const addNewPotentialJudge = (newId, callback) => {
        fetch(`${backendURL}/admin/judges/add-potential-judge`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ID: newId }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                if (callback) {
                    callback(); // Call the callback function after successful insertion
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const addNewPreference = async () => {
        const { value: newPreference } = await Swal.fire({
            title: '<span style="font-size: 75%; color: #175a94;">Add New Preference</span>',
            input: 'text',
            html: '<label style="font-size: 75%; color: #175a94;" for="swal-input1">Preference Name</label>',
            inputPlaceholder: 'Enter the new preference',
            showCancelButton: true,
            confirmButtonText: '<span style="font-size: 75%;">Save</span>',
            cancelButtonText: '<span style="font-size: 75%;">Cancel</span>',
            inputValidator: (value) => {
                if (!value) {
                    return 'Please enter a preference name';
                }
            },
        });

        if (newPreference) {
            try {
                const response = await fetch(`${backendURL}/admin/preferences/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ preference: newPreference }),
                });

                if (response.ok) {
                    Swal.fire('Success', 'Preference added successfully!', 'success');
                } else {
                    Swal.fire('Error', 'Failed to add preference', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'An error occurred while adding the preference', 'error');
            }
        }
    };

    const removePreferences = async () => {
        try {
            const response = await fetch(`${backendURL}/admin/preferences`);
            const preferences = await response.json();
    
            Swal.fire({
                title: '<span style="font-size: 75%; color: var(--text-primary);">Remove Preferences</span>',
                html: '<div id="preferencesListContainer" style="font-size: 75%; color: var(--text-primary);"></div>',
                showCancelButton: true,
                confirmButtonText: '<span style="font-size: 75%; color: var(--text-primary);">Remove Selected Preferences</span>',
                cancelButtonText: '<span style="font-size: 75%; color: var(--text-primary);">Close</span>',
                preConfirm: () => {
                    const selectedPreferences = JSON.parse(localStorage.getItem('selectedPreferences')) || [];
                    removeSelectedPreferences(selectedPreferences);
                },
                didOpen: () => {
                    renderPreferencesList(preferences);
                },
            });
        } catch (error) {
            console.error('Error fetching preferences:', error);
            Swal.fire('Error', 'An error occurred while fetching the preferences', 'error');
        }
    };
    
    const renderPreferencesList = (preferences) => {
        const preferencesListContainer = document.getElementById('preferencesListContainer');
        if (preferencesListContainer) {
            const root = ReactDOM.createRoot(preferencesListContainer);
            root.render(<PreferencesList preferences={preferences} />);
        }
    };

    const PreferencesList = ({ preferences }) => {
        const [selectedPreferences, setSelectedPreferences] = React.useState([]);
        const [sortDirection, setSortDirection] = React.useState('asc');

        React.useEffect(() => {
            localStorage.setItem('selectedPreferences', JSON.stringify(selectedPreferences));
        }, [selectedPreferences]);

        const toggleSelection = (id) => {
            setSelectedPreferences((prevSelectedPreferences) => {
                if (prevSelectedPreferences.includes(id)) {
                    return prevSelectedPreferences.filter((preferenceId) => preferenceId !== id);
                } else {
                    return [...prevSelectedPreferences, id];
                }
            });
        };

        const handleSort = () => {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        };

        const renderSortButton = () => (
            <button
                onClick={handleSort}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    fontWeight: 'bold',
                    padding: '2px 5px',
                    margin: '0 5px'
                }}
            >
                ID {sortDirection === 'asc' ? '▲' : '▼'}
            </button>
        );

        const sortedPreferences = [...preferences].sort((a, b) => {
            const aValue = parseInt(a.ID);
            const bValue = parseInt(b.ID);
            
            if (sortDirection === 'asc') {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });

        return (
            <div>
                <div style={{ marginBottom: '10px' }}>
                    {renderSortButton()}
                </div>
                <ul id="preferencesList" style={{ listStyleType: 'none', padding: 0 }}>
                    {sortedPreferences.map((preference, index) => (
                        <li key={preference.ID} style={{ marginBottom: '10px' }}>
                            <div style={{ 
                                display: 'flex',
                                justifyContent: 'normal', 
                                alignItems: 'left', 
                                border: '1px solid var(--border-color)', 
                                padding: '10px',
                                backgroundColor: 'var(--card-bg)',
                                color: 'var(--text-primary)'
                            }}>
                                <input
                                    type="checkbox"
                                    id={`preference-${index}`}
                                    checked={selectedPreferences.includes(preference.ID)}
                                    onChange={() => toggleSelection(preference.ID)}
                                    style={{ marginLeft: '90px', marginRight: '100px' }}
                                />
                                <label htmlFor={`preference-${index}`} style={{ 
                                    flex: 1, 
                                    whiteSpace: 'nowrap', 
                                    textOverflow: 'ellipsis', 
                                    marginRight: '200px',
                                    color: 'var(--text-primary)'
                                }}>
                                    {preference.ID}
                                </label>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const removeSelectedPreferences = async (selectedPreferences) => {
        try {
            const response = await fetch(`${backendURL}/admin/preferences/remove`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ preferences: selectedPreferences }),
            });

            if (response.ok) {
                Swal.fire('Success', 'Preferences removed successfully!', 'success');
            } else {
                Swal.fire('Error', 'Failed to remove preferences', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'An error occurred while removing the preferences', 'error');
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div className="header-content">
                    <div className="welcome-section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <h1 className="welcome-title">Manage Judges</h1>
                        <p className="welcome-subtitle">Upload and manage judge data</p>
                    </div>
                </div>
            </div>

            <div className="stats-section">
                <div className="admin-page-container">
                    <div className="admin-header">
                        <h2>Upload Potential Judges CSV</h2>
                        <input type="file" onChange={handleFileUpload} accept=".csv" />
                        <div className="admin-buttons">
                            <button className='admin-button' onClick={openJudgesListModal}>Show Judges List</button>
                            <button className='admin-button' onClick={openPotentialJudgesListModal}>Show Potential Judges List</button>
                            <button className="admin-button" onClick={addNewPreference}>Add Preference</button>
                            <button className="admin-button" onClick={removePreferences}>Remove Preference</button>
                            <ExportData url={`${backendURL}/admin/judges/judgesList`} />
                        </div>
                    </div>
                </div>
            </div>
            <AdminButtons />
        </div>
    );
});

export default ManageJudges;

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import './ProfileSetup.css';
import { backendURL } from '../../config';

const AvailablePreferences = observer(({ token }) => {
  const [preferences, setPreferences] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  useEffect(() => {
    fetchPreferences();
    fetchUserPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await fetch(`${backendURL}/preferences`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setPreferences(data);
      } else {
        console.error('Preferences data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const response = await fetch(`${backendURL}/preferences/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        // Map user preferences to an array of IDs.
        setSelectedPreferences(data.map(item => item.ID || item));
      } else {
        console.error('User preferences data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  const handlePreferenceChange = async (preferenceId, isAdding) => {
    try {
      const url = isAdding ? `${backendURL}/preferences/add` : `${backendURL}/preferences/remove`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ preferenceId }),
      });
      const data = await response.json();
      console.log('Preference update result:', data);
    } catch (error) {
      console.error('Error handling preference change:', error);
    }
  };

  // Use selectedPreferences directly to manage checkbox state.
  const toggleSelection = (id) => {
    if (selectedPreferences.includes(id)) {
      // Remove the preference.
      handlePreferenceChange(id, false);
      setSelectedPreferences(prev => prev.filter(x => x !== id));
    } else {
      // Add the preference.
      handlePreferenceChange(id, true);
      setSelectedPreferences(prev => [...prev, id]);
    }
  };

  const PreferencesList = () => {
    return (
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {preferences.map((preference, index) => (
          <li key={preference.ID} style={{ marginBottom: '10px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderRadius: '6px',
                border: '1px solid #ccc',
                padding: '10px',
              }}
            >
              <label
                htmlFor={`preference-${index}`}
                style={{
                  flex: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  margin: 0,
                }}
              >
                {preference.ID}
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '45px',
                }}
              >
                <input
                  type="checkbox"
                  id={`preference-${index}`}
                  checked={selectedPreferences.includes(preference.ID)}
                  onChange={() => toggleSelection(preference.ID)}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="preferences-section">
      <h3>Preferences</h3>
      <PreferencesList />
    </div>
  );
});

export default AvailablePreferences;

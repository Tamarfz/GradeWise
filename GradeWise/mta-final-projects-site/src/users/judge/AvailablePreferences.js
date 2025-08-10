import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { backendURL } from '../../config';
import { FaCheck, FaCog } from 'react-icons/fa';

const PreferencesContainer = styled.div`
  margin-top: 20px;
`;

const PreferencesTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PreferencesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
`;

const PreferenceItem = styled.li`
  background: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 10px var(--shadow-light);

  &:hover {
    border-color: var(--accent-primary);
    box-shadow: 0 4px 15px var(--shadow-medium);
    transform: translateY(-2px);
  }

  &.selected {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border-color: var(--accent-primary);
    box-shadow: 0 4px 15px var(--shadow-medium);
  }
`;

const PreferenceLabel = styled.label`
  flex: 1;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  margin: 0;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
`;

const ModernCheckbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  background: var(--input-bg);
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;

  &:checked {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }

  &:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  &:hover {
    border-color: var(--accent-primary);
    box-shadow: 0 2px 8px var(--shadow-light);
  }
`;

const LoadingMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: var(--accent-primary);
  font-weight: 600;
  gap: 10px;
`;

const AvailablePreferences = observer(({ token }) => {
  const [preferences, setPreferences] = useState([]);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <PreferencesContainer>
        <LoadingMessage>
          <FaCog style={{ animation: 'spin 1s linear infinite' }} />
          Loading preferences...
        </LoadingMessage>
      </PreferencesContainer>
    );
  }

  return (
    <PreferencesContainer>
      <PreferencesTitle>
        <FaCog />
        Project Preferences
      </PreferencesTitle>
      <PreferencesList>
        {preferences.map((preference, index) => (
          <PreferenceItem 
            key={preference.ID} 
            className={selectedPreferences.includes(preference.ID) ? 'selected' : ''}
            onClick={() => toggleSelection(preference.ID)}
          >
            <PreferenceLabel htmlFor={`preference-${index}`}>
              {preference.ID}
            </PreferenceLabel>
            <CheckboxContainer>
              <ModernCheckbox
                type="checkbox"
                id={`preference-${index}`}
                checked={selectedPreferences.includes(preference.ID)}
                onChange={() => toggleSelection(preference.ID)}
              />
            </CheckboxContainer>
          </PreferenceItem>
        ))}
      </PreferencesList>
    </PreferencesContainer>
  );
});

export default AvailablePreferences;

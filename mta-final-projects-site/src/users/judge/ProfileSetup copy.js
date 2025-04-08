import { observer } from 'mobx-react-lite';
import React from 'react';
import AvailablePreferences from './AvailablePreferences';
import { storages } from '../../stores';
import BackButton from '../../utils/BackButton';
import JudgeButtons from './JudgeButtons';
import { backendURL } from '../../config';
import './ProfileSetup.css';
import Swal from 'sweetalert2';

const ProfileSetup = observer(() => {
  const { userStorage } = storages;
  const user = userStorage.user;

  if (!user) {
    return <div>Loading...</div>;
  }

  // Immediately update the user object on change.
  const updateUser = (field, newValue) => {
    userStorage.user[field] = newValue;
  };

  // Handle form submission to persist changes via an API call.
  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldsToUpdate = ['email', 'password', 'name'];
    
    // For each field, call the update endpoint (same as in the EditFieldButton)
    const updatePromises = fieldsToUpdate.map(field => {
      const newValue = user[field];
      return fetch(`${backendURL}/user/updateField`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ field, newValue }),
      }).then(response => response.json());
    });

    Promise.all(updatePromises)
      .then((results) => {
        // Optionally check each result for success
        Swal.fire('Success', 'All fields updated successfully!', 'success');
      })
      .catch((error) => {
        console.error('Error updating user info:', error);
        Swal.fire('Error', 'There was an error updating the information.', 'error');
      });
  };

  return (
    <div className="profile-setup-container">
      <header className="profile-header">
        <h3 className="anton-regular">
          Welcome, Judge <span style={{ color: 'blue' }}>{user?.name}!</span>
        </h3>
        <JudgeButtons />
      </header>
      <h2>Profile Setup</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input className="profile-setup-email"
            id="email"
            name="email"
            type="email"
            value={user.email || ''}
            onChange={(e) => updateUser('email', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password:</label>
          <input className="profile-setup-password"
            id="password"
            name="password"
            type="password"
            value={user.password || ''}
            onChange={(e) => updateUser('password', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="name">Name:</label>
          <input className="profile-setup-name"
            id="name"
            name="name"
            type="text"
            value={user.name || ''}
            onChange={(e) => updateUser('name', e.target.value)}
          />
        </div>
        <button type="submit" className="save-button">Save Changes</button>
      </form>
      <div className="preferences-section">
        <h3>Preferences</h3>
        <AvailablePreferences token={localStorage.getItem('token')} />
      </div>
      <BackButton className="back-button" route="/judge" />
    </div>
  );
});

export default ProfileSetup;
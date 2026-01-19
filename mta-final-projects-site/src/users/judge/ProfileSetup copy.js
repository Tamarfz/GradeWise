import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
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
  
  // Local state for form data
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    password: user?.password || ''
  });
  
  // Call the backend to load current judge data when component mounts.
  useEffect(() => {
    fetch(`${backendURL}/current-judge`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        // Update store and local state with retrieved email and name (and optionally password)
        userStorage.user.email = data.email || '';
        userStorage.user.name = data.name || '';
        if (data.password) {
          userStorage.user.password = data.password;
        }
        setFormData({
          email: data.email || '',
          name: data.name || '',
          password: data.password || ''
        });
      })
      .catch(error => {
        console.error('Error retrieving current user:', error);
      });
  }, [userStorage]);

  if (!user?.email && !user?.name) { // Assuming both fields empty means loading
    return <div>Loading...</div>;
  }

  // Handle local change in form fields
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle form submission to persist changes via an API call.
  const handleSubmit = (e) => {
    e.preventDefault();
    const fieldsToUpdate = ['email', 'password', 'name'];
    
    // For each field, call the update endpoint using the local formData
    const updatePromises = fieldsToUpdate.map(field => {
      const newValue = formData[field];
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
        // Once update is successful, update the MobX store
        userStorage.user.email = formData.email;
        userStorage.user.name = formData.name;
        userStorage.user.password = formData.password;
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
        <span style={{ color:'rgb(23, 90, 148)'}}>
          Welcome, Judge {user?.name}!</span>
        </h3>
        <JudgeButtons />
      </header>
      <h2 style={{color: 'rgb(23, 90, 148)'}}>Profile Setup</h2>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input required
            className="profile-setup-email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password:</label>
          <input required
            className="profile-setup-password"
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="name">Name:</label>
          <input required
            className="profile-setup-name"
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
      <div className="preferences-section">
        <AvailablePreferences token={localStorage.getItem('token')} />
      </div>
      <button type="submit" className="save-button">Save Changes</button>
      </form>
      <BackButton className="back-button" route="/judge" />
    </div>
  );
});

export default ProfileSetup;
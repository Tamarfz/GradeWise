import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AvailablePreferences from './AvailablePreferences';
import { storages } from '../../stores';
import BackButton from '../../utils/BackButton';
import JudgeButtons from './JudgeButtons';
import { backendURL } from '../../config';
import Swal from 'sweetalert2';
import { FaUser, FaEnvelope, FaLock, FaSave, FaCog, FaUserShield } from 'react-icons/fa';

// Modern styled components
const ModernContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const DashboardHeader = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.1rem;
  color: #718096;
  margin: 0;
  font-weight: 500;
`;

const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
`;

const FormSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FormField = styled.div`
  margin-bottom: 25px;
`;

const FieldLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 8px;
  font-size: 1rem;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const FieldIcon = styled.div`
  position: absolute;
  left: 16px;
  color: #667eea;
  font-size: 18px;
  z-index: 2;
`;

const ModernInput = styled.input`
  width: 100%;
  padding: 16px 16px 16px 50px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.9);
  color: #1a202c;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(102, 126, 234, 0.1);

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: #a0aec0;
  }
`;

const PreferencesSection = styled.div`
  background: rgba(248, 250, 252, 0.8);
  border-radius: 16px;
  padding: 25px;
  margin-top: 30px;
  border: 1px solid rgba(102, 126, 234, 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 30px;
  flex-wrap: wrap;
`;

const ModernButton = styled.button`
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  text-transform: none;
  transition: all 0.3s ease;
  min-width: 140px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  &.save-button {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(67, 233, 123, 0.3);

    &:hover {
      background: linear-gradient(135deg, #3dd070 0%, #2dd4bf 100%);
      box-shadow: 0 6px 20px rgba(67, 233, 123, 0.4);
      transform: translateY(-2px);
    }
  }

  &.back-button {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);

    &:hover {
      background: linear-gradient(135deg, #ff5252 0%, #e64a19 100%);
      box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
      transform: translateY(-2px);
    }
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 14px 24px;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #667eea;
  font-weight: 600;
  font-size: 1.1rem;
`;

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
    return (
      <ModernContainer>
        <LoadingSpinner>
          <FaCog style={{ marginRight: '10px', animation: 'spin 1s linear infinite' }} />
          Loading profile...
        </LoadingSpinner>
      </ModernContainer>
    );
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
        Swal.fire({
          title: 'Success!',
          text: 'Profile updated successfully!',
          icon: 'success',
          confirmButtonColor: '#43e97b',
          background: 'rgba(255, 255, 255, 0.95)',
          backdrop: 'rgba(0, 0, 0, 0.4)',
        });
      })
      .catch((error) => {
        console.error('Error updating user info:', error);
        Swal.fire({
          title: 'Error',
          text: 'There was an error updating the information.',
          icon: 'error',
          confirmButtonColor: '#ff6b6b',
          background: 'rgba(255, 255, 255, 0.95)',
          backdrop: 'rgba(0, 0, 0, 0.4)',
        });
      });
  };

  return (
    <ModernContainer>
      <DashboardHeader>
        <WelcomeTitle>
          <FaUserShield style={{ marginRight: '12px' }} />
          Welcome, Judge {user?.name}!
        </WelcomeTitle>
        <WelcomeSubtitle>Manage your profile settings and preferences</WelcomeSubtitle>
      </DashboardHeader>

      <ProfileCard>
        <FormSection>
          <SectionTitle>
            <FaUser />
            Personal Information
          </SectionTitle>
          
          <form onSubmit={handleSubmit}>
            <FormField>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <InputContainer>
                <FieldIcon>
                  <FaEnvelope />
                </FieldIcon>
                <ModernInput
                  required
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </InputContainer>
            </FormField>

            <FormField>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputContainer>
                <FieldIcon>
                  <FaLock />
                </FieldIcon>
                <ModernInput
                  required
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                />
              </InputContainer>
            </FormField>

            <FormField>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <InputContainer>
                <FieldIcon>
                  <FaUser />
                </FieldIcon>
                <ModernInput
                  required
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </InputContainer>
            </FormField>

            <PreferencesSection>
              <AvailablePreferences token={localStorage.getItem('token')} />
            </PreferencesSection>

            <ButtonContainer>
              <ModernButton type="submit" className="save-button">
                <FaSave />
                Save Changes
              </ModernButton>
            </ButtonContainer>
          </form>
        </FormSection>
      </ProfileCard>

      <JudgeButtons />
    </ModernContainer>
  );
});

export default ProfileSetup;
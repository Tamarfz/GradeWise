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
  background: var(--bg-primary);
  padding: 20px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const DashboardHeader = styled.header`
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 8px 32px var(--shadow-light);
  border: 1px solid var(--card-border);
  text-align: center;

  @media (max-width: 768px) {
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 12px;
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
`;

const ProfileCard = styled.div`
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 32px var(--shadow-light);
  border: 1px solid var(--card-border);
  max-width: 800px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 25px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 12px;
  }
`;

const FormSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 20px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin-bottom: 15px;
    gap: 8px;
  }
`;

const FormField = styled.div`
  margin-bottom: 25px;
`;

const FieldLabel = styled.label`
  display: block;
  font-weight: 600;
  color: var(--text-primary);
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
  color: var(--accent-primary);
  font-size: 18px;
  z-index: 2;

  @media (max-width: 768px) {
    left: 14px;
    font-size: 16px;
  }

  @media (max-width: 480px) {
    left: 12px;
    font-size: 14px;
  }
`;

const ModernInput = styled.input`
  width: 100%;
  padding: 16px 16px 16px 50px;
  border: 2px solid var(--input-border);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  background: var(--input-bg);
  color: var(--text-primary);
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px var(--shadow-light);

  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 4px 20px var(--shadow-medium);
    transform: translateY(-2px);
  }

  &::placeholder {
    color: var(--text-secondary);
  }

  @media (max-width: 768px) {
    padding: 14px 14px 14px 45px;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 12px 12px 12px 40px;
    font-size: 0.9rem;
  }
`;

const PreferencesSection = styled.div`
  background: var(--bg-secondary);
  border-radius: 16px;
  padding: 25px;
  margin-top: 30px;
  border: 1px solid var(--border-color);

  @media (max-width: 768px) {
    padding: 20px;
    margin-top: 25px;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 15px;
    margin-top: 20px;
    border-radius: 10px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 30px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 12px;
    margin-top: 25px;
  }

  @media (max-width: 480px) {
    gap: 10px;
    margin-top: 20px;
    flex-direction: column;
    align-items: center;
  }
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
  color: var(--accent-primary);
  font-weight: 600;
  font-size: 1.1rem;
`;

const AvatarSection = styled.div`
  margin-bottom: 30px;
`;

const AvatarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
  margin-top: 15px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const AvatarOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 15px;
  border-radius: 12px;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  background: var(--bg-secondary);
  
  ${props => props.selected && `
    border-color: var(--accent-primary);
    background: var(--card-bg);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
  }
`;

const AvatarImage = styled.img`
  width: 100px;
  height: 80px;
  border-radius: 12px;
  object-fit: contain;
  margin-bottom: 10px;
`;

const AvatarName = styled.span`
  font-size: 0.8rem;
  color: var(--text-secondary);
  text-align: center;
  font-weight: 500;
`;

const ProfileSetup = observer(() => {
  const { userStorage } = storages;
  const user = userStorage.user;
  
  // Local state for form data
  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    password: user?.password || '',
    avatar: user?.avatar || 'default'
  });

  // Available avatars
  const availableAvatars = [
    { id: 'default', url: '/Assets/icons/default-avatar.png', name: 'Default' },
    { id: 'michael-jordan', url: '/Assets/icons/michael-jordan.jpg', name: 'Michael Jordan' },
    { id: 'ohad-avidar', url: '/Assets/icons/ohad-avidar.jpg', name: 'Ohad Avidar' },
    { id: 'trump', url: '/Assets/icons/trump.jpg', name: 'Trump' },
    { id: 'harry-potter', url: '/Assets/icons/harry-potter.jpg', name: 'Harry Potter' },
    { id: 'the-rock', url: '/Assets/icons/the-rock.jpg', name: 'The Rock' },
    { id: 'jimmy-hendrix', url: '/Assets/icons/jimmy-hendrix.jpg', name: 'Jimmy Hendrix' },
    { id: 'messi', url: '/Assets/icons/lionel-messi.jpg', name: 'Lionel Messi' },
    { id: 'cristiano-ronaldo', url: '/Assets/icons/cristiano-ronaldo.jpg', name: 'Cristiano Ronaldo' },
    { id: 'spongebob', url: '/Assets/icons/spongebob.png', name: 'Spongebob' },
    { id: 'pikachu', url: '/Assets/icons/pikachu.png', name: 'Pikachu' },
    { id: 'spiderman', url: '/Assets/icons/spiderman.webp', name: 'Spiderman' },
    { id: 'batman', url: '/Assets/icons/batman.png', name: 'Batman' },
    { id: 'voldemort', url: '/Assets/icons/voldemort.jpg', name: 'Voldemort' },
    { id: 'aladdin', url: '/Assets/icons/aladdin.jpeg', name: 'Aladdin' },
    { id: 'mufasa', url: '/Assets/icons/lion_king_Mufasa.webp', name: 'Mufasa' }
  ];
  
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
          password: data.password || '',
          avatar: data.avatar || 'default'
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
    const fieldsToUpdate = ['email', 'password', 'name', 'avatar'];
    
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
        userStorage.user.avatar = formData.avatar;
        Swal.fire({
          title: 'Success!',
          text: 'Profile updated successfully!',
          icon: 'success',
          confirmButtonColor: '#43e97b',
          background: 'var(--card-bg)',
          color: 'var(--text-primary)',
          backdrop: 'rgba(0, 0, 0, 0.4)',
          customClass: {
            popup: 'swal2-popup-dark-mode',
            title: 'swal2-title-dark-mode',
            content: 'swal2-content-dark-mode',
            confirmButton: 'swal2-confirm-dark-mode'
          }
        });
      })
      .catch((error) => {
        console.error('Error updating user info:', error);
        Swal.fire({
          title: 'Error',
          text: 'There was an error updating the information.',
          icon: 'error',
          confirmButtonColor: '#ff6b6b',
          background: 'var(--card-bg)',
          color: 'var(--text-primary)',
          backdrop: 'rgba(0, 0, 0, 0.4)',
          customClass: {
            popup: 'swal2-popup-dark-mode',
            title: 'swal2-title-dark-mode',
            content: 'swal2-content-dark-mode',
            confirmButton: 'swal2-confirm-dark-mode'
          }
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

            <AvatarSection>
              <FieldLabel>Choose Your Avatar</FieldLabel>
              <AvatarGrid>
                {availableAvatars.map((avatar) => (
                  <AvatarOption
                    key={avatar.id}
                    selected={formData.avatar === avatar.id}
                    onClick={() => handleChange('avatar', avatar.id)}
                  >
                    <AvatarImage src={avatar.url} alt={avatar.name} />
                    <AvatarName>{avatar.name}</AvatarName>
                  </AvatarOption>
                ))}
              </AvatarGrid>
            </AvatarSection>

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
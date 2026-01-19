import React, { useState, useEffect } from 'react';
import { Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
import Swal from 'sweetalert2';
import { storages } from '../../stores';
import { backendURL } from '../../config';
import { FaStar, FaComments, FaCalculator, FaCheckCircle } from 'react-icons/fa';

// Modern styled components
const ModernForm = styled.form`
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px var(--shadow-light);
  border: 1px solid var(--card-border);
  max-width: 600px;
  margin: 0 auto;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
`;

const HeaderTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const HeaderSubtitle = styled.p`
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
`;

const GradedNotice = styled.div`
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: white;
  padding: 15px 20px;
  border-radius: 12px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(67, 233, 123, 0.3);
  font-weight: 600;
`;

const StyledFormControl = styled(FormControl)`
  margin-bottom: 20px;
  
  .MuiInputLabel-root {
    color: var(--text-primary) !important;
    font-weight: 600 !important;
    font-size: 20px !important;
  }
  
  .MuiInputBase-root {
    background: var(--input-bg) !important;
    border-radius: 12px !important;
    box-shadow: 0 2px 10px var(--shadow-light) !important;
    border: 2px solid var(--input-border) !important;
    transition: all 0.3s ease !important;
    min-height: 60px !important;
    
    &:hover {
      border-color: var(--accent-primary) !important;
      box-shadow: 0 4px 15px var(--shadow-medium) !important;
    }
    
    &.Mui-focused {
      border-color: var(--accent-primary) !important;
      box-shadow: 0 4px 20px var(--shadow-medium) !important;
    }
  }
  
  .MuiSelect-select {
    padding: 16px 20px !important;
    font-weight: 600 !important;
    font-size: 20px !important;
    color: var(--text-primary) !important;
    min-height: 60px !important;
    display: flex !important;
    align-items: center !important;
  }
  
  .MuiOutlinedInput-notchedOutline {
    border: none !important;
  }
  
  .MuiSelect-icon {
    font-size: 24px !important;
    color: #667eea !important;
  }
  
  /* Custom styles for the dropdown menu */
  .MuiPaper-root {
    background: var(--card-bg) !important;
    backdrop-filter: blur(10px) !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 32px var(--shadow-light) !important;
    border: 1px solid var(--card-border) !important;
  }
  
  .MuiMenuItem-root {
    font-size: 20px !important;
    font-weight: 600 !important;
    padding: 12px 20px !important;
    min-height: 50px !important;
    display: flex !important;
    align-items: center !important;
    color: var(--text-primary) !important;
    
    &:hover {
      background: var(--bg-secondary) !important;
    }
    
    &.Mui-selected {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
    }
  }
  
  @media (max-width: 768px) {
    .MuiInputBase-root {
      width: 100% !important;
    }
  }
`;

const ModernTextarea = styled.textarea`
  width: 100%;
  border-radius: 12px;
  padding: 16px;
  background: var(--input-bg);
  border: 2px solid var(--input-border);
  box-shadow: 0 2px 10px var(--shadow-light);
  font-size: 20px;
  font-weight: 500;
  color: var(--text-primary);
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 4px 20px var(--shadow-medium);
  }
  
  &::placeholder {
    color: var(--text-secondary);
    font-size: 20px;
  }
`;

const TotalScore = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  margin: 25px 0;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const TotalScoreValue = styled.span`
  font-size: 28px;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 25px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ModernButton = styled(Button)`
  padding: 12px 24px !important;
  border-radius: 12px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  text-transform: none !important;
  transition: all 0.3s ease !important;
  min-width: 120px !important;
  
  &.cancel-button {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%) !important;
    color: white !important;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3) !important;
    
    &:hover {
      background: linear-gradient(135deg, #ff5252 0%, #e64a19 100%) !important;
      box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4) !important;
      transform: translateY(-2px) !important;
    }
  }
  
  &.submit-button {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%) !important;
    color: white !important;
    box-shadow: 0 4px 15px rgba(67, 233, 123, 0.3) !important;
    
    &:hover {
      background: linear-gradient(135deg, #3dd070 0%, #2dd4bf 100%) !important;
      box-shadow: 0 6px 20px rgba(67, 233, 123, 0.4) !important;
      transform: translateY(-2px) !important;
    }
  }
  
  @media (max-width: 768px) {
    width: 100% !important;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--accent-primary);
  font-weight: 600;
`;

const InitialFormData = {
  complexity: '',
  usability: '',
  innovation: '',
  presentation: '',
  proficiency: '',
  additionalComment: '',
  grade: 0,
};

const ProjectGradingForm = ({ projectId, onSubmit, onCancel }) => {
  const { userStorage } = storages;
  
  const [formData, setFormData] = useState(InitialFormData);
  const [graded, setGraded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [judgeId, setJudgeId] = useState();

  // Calculate the total from grading fields
  const calculateTotal = (data) => {
    return (
      (Number(data.complexity) || 0) +
      (Number(data.usability) || 0) +
      (Number(data.innovation) || 0) +
      (Number(data.presentation) || 0) +
      (Number(data.proficiency) || 0)
    );
  };

  // Fetch existing grade (if any) for this project by the current judge
  useEffect(() => {
    const fetchGrade = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendURL}/projects/${projectId}/grade`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.gradeInfo) {
          const gradeInfo = response.data.gradeInfo;
          setJudgeId(gradeInfo.judge_id);
          
          // Check if the project has been graded (all values are not null)
          const isGraded = gradeInfo.complexity !== null && 
                          gradeInfo.usability !== null && 
                          gradeInfo.innovation !== null && 
                          gradeInfo.presentation !== null && 
                          gradeInfo.proficiency !== null;
          
          setFormData({
            complexity: gradeInfo.complexity || '',
            usability: gradeInfo.usability || '',
            innovation: gradeInfo.innovation || '',
            presentation: gradeInfo.presentation || '',
            proficiency: gradeInfo.proficiency || '',
            additionalComment: gradeInfo.additionalComment || '',
            grade: gradeInfo.grade || 0,
          });
          setGraded(isGraded);
        }
      } catch (error) {
        console.error('Error fetching grade:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrade();
  }, [projectId, judgeId]);

  // Update a grading field and recalc total
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: parseInt(value, 10) };
    updatedData.grade = calculateTotal(updatedData);
    setFormData(updatedData);
  };

  const handleCommentChange = (e) => {
    setFormData({ ...formData, additionalComment: e.target.value });
  };

  // Submit the form data to the backend
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = graded ? 'PUT' : 'POST';
      const response = await fetch(`${backendURL}/gradeProject`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id: projectId,
          judge_id: judgeId,
          ...formData,
        }),
      });
      Swal.fire('Success', 'Grade submitted successfully!', 'success');
      if (onSubmit) onSubmit();
    } catch (error) {
      Swal.fire('Error', 'Failed to submit grade.', 'error');
    }
  };

  if (loading) {
    return (
      <LoadingSpinner>
        <FaStar style={{ marginRight: '10px' }} />
        Loading grading info...
      </LoadingSpinner>
    );
  }

  return (
    <ModernForm onSubmit={handleFormSubmit}>
      <FormHeader>
        <HeaderTitle>
          <FaStar />
          Project Grading Form
        </HeaderTitle>
        <HeaderSubtitle>
          Rate each criterion from 1-10 and provide additional comments
        </HeaderSubtitle>
      </FormHeader>

      {graded && (
        <GradedNotice>
          <FaCheckCircle />
          You have already graded this project. Your previous responses are shown below.
        </GradedNotice>
      )}

      {['complexity', 'usability', 'innovation', 'presentation', 'proficiency'].map((field) => (
        <StyledFormControl fullWidth key={field} margin="normal" variant="outlined">
          <InputLabel id={`${field}-label`}>
            {field.charAt(0).toUpperCase() + field.slice(1)} (1-10)
          </InputLabel>
          <Select
            labelId={`${field}-label`}
            id={field}
            name={field}
            value={formData[field]}
            onChange={handleSelectChange}
            label={`${field.charAt(0).toUpperCase() + field.slice(1)} (1-10)`}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <MenuItem key={i + 1} value={i + 1}>
                {i + 1}
              </MenuItem>
            ))}
          </Select>
        </StyledFormControl>
      ))}

      <div style={{ marginTop: '20px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          marginBottom: '15px',
          color: '#667eea',
          fontWeight: '600',
          fontSize: '20px'
        }}>
          <FaComments />
          Additional Comments
        </div>
        <ModernTextarea
          id="additionalComment"
          value={formData.additionalComment}
          onChange={handleCommentChange}
          placeholder="Enter any additional comments about the project..."
          rows="4"
        />
      </div>

      <TotalScore>
        <FaCalculator />
        <span>Total Score:</span>
        <TotalScoreValue>{formData.grade}</TotalScoreValue>
      </TotalScore>

      <ButtonContainer>
        <ModernButton onClick={onCancel} className="cancel-button">
          Cancel
        </ModernButton>
        <ModernButton type="submit" className="submit-button">
          Submit Grade
        </ModernButton>
      </ButtonContainer>
    </ModernForm>
  );
};

export default ProjectGradingForm;
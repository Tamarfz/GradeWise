import React, { useState, useEffect } from 'react';
import { Select, MenuItem, InputLabel, FormControl, Button } from '@mui/material';
import styled from 'styled-components';
import axios from 'axios';
import Swal from 'sweetalert2';
import { storages } from '../../stores';
import { backendURL } from '../../config';

const StyledFormControl = styled(FormControl)`
  margin-bottom: 16px;
  .MuiInputLabel-root {
    color: #175a94;
    font-weight: bold;
  }
  .MuiInputBase-root {
    background-color: rgba(240, 248, 255, 0.9); 
    border-radius: 8px;
    padding: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 768px) {
    .MuiInputBase-root {
      width: 100%;
    }
  }
`;
const StyledButton = styled(Button)`
  background-color: ${props => props.variant === "outlined" ? "red" : "#175a94"} !important;
  color: white !important;
  border-radius: 8px !important;
  padding: 9px 18px !important;
  font-weight: bold !important;
  margin-top: 16px !important;

  &:hover {
    border-color:rgb(201, 213, 225) !important;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1) !important;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;


const InitialFormData = {
  complexity: 10,
  usability: 10,
  innovation: 10,
  presentation: 10,
  proficiency: 10,
  additionalComment: '',
  grade: 50,
};

const ProjectGradingForm = ({ projectId, onSubmit, onCancel }) => {
  const { userStorage } = storages;
  
  const [formData, setFormData] = useState(InitialFormData);
  const [graded, setGraded] = useState(false);
  const [loading, setLoading] = useState(true);
  const[judgeId, setJudgeId] = useState();

  // Calculate the total from grading fields
  const calculateTotal = (data) => {
    return (
      Number(data.complexity) +
      Number(data.usability) +
      Number(data.innovation) +
      Number(data.presentation) +
      Number(data.proficiency)
    );
  };

  // Fetch existing grade (if any) for this project by the current judge
  useEffect(() => {
    const fetchGrade = async () => {
      try {
        const token = localStorage.getItem('token');
        // Change the endpoint and query parameters as needed
        const response = await axios.get(`${backendURL}/projects/${projectId}/grade`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.gradeInfo) {
          const gradeInfo = response.data.gradeInfo;
          setJudgeId(gradeInfo.judge_id);
          setFormData({
            complexity: gradeInfo.complexity,
            usability: gradeInfo.usability,
            innovation: gradeInfo.innovation,
            presentation: gradeInfo.presentation,
            proficiency: gradeInfo.proficiency,
            additionalComment: gradeInfo.additionalComment,
            grade: gradeInfo.grade,
          });
          setGraded(true);
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
      // Use PUT if already graded, otherwise use POST.
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
      if (onSubmit) onSubmit(); // Notify parent if needed 
    } catch (error) {
      Swal.fire('Error', 'Failed to submit grade.', 'error');
    }
  };

  if (loading) return <p>Loading grading info...</p>;

  return (
    <form onSubmit={handleFormSubmit}>
      {graded && (
        <h4 className='boldonse-regular'>
          You have already graded this project. Your previous responses are shown below.
        </h4>
      )}
      {['complexity', 'usability', 'innovation', 'presentation', 'proficiency'].map((field) => (
        <StyledFormControl fullWidth key={field} margin="normal">
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
      <div style={{ marginTop: '16px' }}>
        <label htmlFor="additionalComment" className="playwrite-gb-j-guides-regular">Additional Comments</label>
        <br />
        <textarea
          id="additionalComment"
          value={formData.additionalComment}
          onChange={handleCommentChange}
          placeholder="Enter any additional comments..."
          style={{
            width: '100%',
            borderRadius: '6px',
            padding: '6px',
            backgroundColor: 'rgba(240, 248, 255, 0.9)',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            marginTop: '8px'
          }}
          rows="3"
        />
      </div>
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <strong className="playwrite-gb-j-guides-regular">Total:{formData.grade}</strong> 
      </div>
      <div style={{ marginTop: '16px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
        <StyledButton onClick={onCancel} variant="outlined">
          Cancel
        </StyledButton>
        <StyledButton type="submit" variant="contained">
          Submit Grade
        </StyledButton>
      </div>
    </form>
  );
};
//SUBMITTTT already graded

export default ProjectGradingForm;
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

// Styled components for the Grades Table
const TableContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  tbody tr:nth-child(even) {
    background-color: rgba(106, 208, 212, 0.23); /* Light blue color for even rows */
  }

  tbody tr:hover {
    border: 2px solid black;
  }
`;

const TableHeader = styled.th`
  background-color: #0e3f6d;
  padding: 10px;
  border: 1px solid #ddd;
  color: #ddd;
  text-align: center;
  white-space: nowrap;

  /* Hide columns on mobile */
  &:nth-child(1),
  &:nth-child(3),
  &:nth-child(5),
  &:nth-child(6),
  &:nth-child(7),
  &:nth-child(8),
  &:nth-child(9),
  &:nth-child(10) {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const SortButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;
  margin-left: 5px;

  &:hover {
    opacity: 1;
  }

  &.active {
    opacity: 1;
    color: #4CAF50;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
  background-color: inherit; /* Let the row background show */

  &:hover {
    background-color: rgba(37, 43, 49, 0.12);
  }

  /* Hide columns on mobile */
  &:nth-child(1),
  &:nth-child(3),
  &:nth-child(5),
  &:nth-child(6),
  &:nth-child(7),
  &:nth-child(8),
  &:nth-child(9),
  &:nth-child(10) {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const GradesManager = ({ grades, allProjects = [] }) => {
  const [judgeMap, setJudgeMap] = useState({});
  const [projectMap, setProjectMap] = useState({});
  const [sortedGrades, setSortedGrades] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  // Default values for unassigned projects
  const defaultGradeValues = {
    judge_id: 'Unassigned',
    judge_name: 'Unassigned',
    complexity: '-',
    usability: '-',
    innovation: '-',
    presentation: '-',
    proficiency: '-',
    additionalComment: 'Not yet assigned',
    grade: '-'
  };

  // Helper function to format grade values
  const formatGradeValue = (value) => {
    if (value === null || value === undefined) {
      return '?';
    }
    return value.toString();
  };

  // Map display names to field names
  const fieldNameMap = {
    'Judge ID': 'judge_id',
    'Judge Name': 'judge_name',
    'Project ID': 'project_id',
    'Project Name': 'project_name',
    'Complexity': 'complexity',
    'Usability': 'usability',
    'Innovation': 'innovation',
    'Presentation': 'presentation',
    'Proficiency': 'proficiency',
    'Additional Comment': 'additionalComment',
    'Total Grade': 'grade'
  };

  useEffect(() => {
    // Retrieve the cached judge and project maps from localStorage
    const cachedJudgeMap = JSON.parse(localStorage.getItem('judgeMap')) || {};
    const cachedProjectMap = JSON.parse(localStorage.getItem('projectMap')) || {};

    setJudgeMap(cachedJudgeMap);
    setProjectMap(cachedProjectMap);

    // Create a map of assigned project IDs
    const assignedProjectIds = new Set(grades?.map(grade => grade.project_id) || []);

    // Combine assigned grades with unassigned projects
    const allGrades = [
      ...(grades || []),
      ...(allProjects || [])
        .filter(project => !assignedProjectIds.has(project.id))
        .map(project => ({
          ...defaultGradeValues,
          project_id: project.id,
          project_name: project.name
        }))
    ];

    setSortedGrades(allGrades);
  }, [grades, allProjects]);

  const handleSort = (displayName, direction) => {
    const fieldName = fieldNameMap[displayName];
    setSortConfig({ key: fieldName, direction });

    const sortedData = [...sortedGrades].sort((a, b) => {
      let aValue, bValue;

      // Handle special cases for judge_name and project_name
      if (fieldName === 'judge_name') {
        aValue = judgeMap[a.judge_id] || '';
        bValue = judgeMap[b.judge_id] || '';
      } else if (fieldName === 'project_name') {
        aValue = projectMap[a.project_id] || '';
        bValue = projectMap[b.project_id] || '';
      } else {
        aValue = a[fieldName];
        bValue = b[fieldName];
      }

      // Handle numeric values
      if (['complexity', 'usability', 'innovation', 'presentation', 'proficiency', 'grade'].includes(fieldName)) {
        // Handle null values for sorting - treat them as lowest values
        aValue = aValue === null || aValue === undefined ? -1 : Number(aValue);
        bValue = bValue === null || bValue === undefined ? -1 : Number(bValue);
      }

      // Compare values
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setSortedGrades(sortedData);
  };

  const isSortActive = (displayName, direction) => {
    const fieldName = fieldNameMap[displayName];
    return sortConfig.key === fieldName && sortConfig.direction === direction;
  };

  const renderSortButtons = (displayName) => (
    <HeaderContent>
      {displayName}
      <div>
        <SortButton
          onClick={() => handleSort(displayName, 'asc')}
          className={isSortActive(displayName, 'asc') ? 'active' : ''}
          title="Sort ascending"
        >
          ▲
        </SortButton>
        <SortButton
          onClick={() => handleSort(displayName, 'desc')}
          className={isSortActive(displayName, 'desc') ? 'active' : ''}
          title="Sort descending"
        >
          ▼
        </SortButton>
      </div>
    </HeaderContent>
  );

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <TableHeader>{renderSortButtons('Judge ID')}</TableHeader>
            <TableHeader>{renderSortButtons('Judge Name')}</TableHeader>
            <TableHeader>{renderSortButtons('Project ID')}</TableHeader>
            <TableHeader>{renderSortButtons('Project Name')}</TableHeader>
            <TableHeader>{renderSortButtons('Complexity')}</TableHeader>
            <TableHeader>{renderSortButtons('Usability')}</TableHeader>
            <TableHeader>{renderSortButtons('Innovation')}</TableHeader>
            <TableHeader>{renderSortButtons('Presentation')}</TableHeader>
            <TableHeader>{renderSortButtons('Proficiency')}</TableHeader>
            <TableHeader>{renderSortButtons('Additional Comment')}</TableHeader>
            <TableHeader>{renderSortButtons('Total Grade')}</TableHeader>
          </tr>
        </thead>
        <tbody>
          {sortedGrades.map((grade, index) => (
            <tr key={index} style={{ opacity: grade.judge_id === 'Unassigned' ? 0.7 : 1 }}>
              <TableCell>{grade.judge_id}</TableCell>
              <TableCell>{grade.judge_name}</TableCell>
              <TableCell>{grade.project_id}</TableCell>
              <TableCell>{grade.project_name}</TableCell>
              <TableCell>{formatGradeValue(grade.complexity)}</TableCell>
              <TableCell>{formatGradeValue(grade.usability)}</TableCell>
              <TableCell>{formatGradeValue(grade.innovation)}</TableCell>
              <TableCell>{formatGradeValue(grade.presentation)}</TableCell>
              <TableCell>{formatGradeValue(grade.proficiency)}</TableCell>
              <TableCell>{grade.additionalComment}</TableCell>
              <TableCell>{formatGradeValue(grade.grade)}</TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default GradesManager; 
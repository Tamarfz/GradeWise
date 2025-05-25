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

const GradesManager = ({ grades }) => {
  const [judgeMap, setJudgeMap] = useState({});
  const [projectMap, setProjectMap] = useState({});

  useEffect(() => {
    // Retrieve the cached judge and project maps from localStorage
    const cachedJudgeMap = JSON.parse(localStorage.getItem('judgeMap')) || {};
    const cachedProjectMap = JSON.parse(localStorage.getItem('projectMap')) || {};

    setJudgeMap(cachedJudgeMap);
    setProjectMap(cachedProjectMap);
  }, []);

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <TableHeader>Judge ID</TableHeader>
            <TableHeader>Judge Name</TableHeader>
            <TableHeader>Project ID</TableHeader>
            <TableHeader>Project Name</TableHeader>
            <TableHeader>Complexity</TableHeader>
            <TableHeader>Usability</TableHeader>
            <TableHeader>Innovation</TableHeader>
            <TableHeader>Presentation</TableHeader>
            <TableHeader>Proficiency</TableHeader>
            <TableHeader>Additional Comment</TableHeader>
            <TableHeader>Total Grade</TableHeader>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade, index) => (
            <tr key={index}>
              <TableCell>{grade.judge_id}</TableCell>
              <TableCell>{judgeMap[grade.judge_id] || 'Unknown Judge'}</TableCell>
              <TableCell>{grade.project_id}</TableCell>
              <TableCell>{projectMap[grade.project_id] || 'Unknown Project'}</TableCell>
              <TableCell>{grade.complexity}</TableCell>
              <TableCell>{grade.usability}</TableCell>
              <TableCell>{grade.innovation}</TableCell>
              <TableCell>{grade.presentation}</TableCell>
              <TableCell>{grade.proficiency}</TableCell>
              <TableCell>{grade.additionalComment || 'N/A'}</TableCell>
              <TableCell>{grade.grade}</TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default GradesManager;

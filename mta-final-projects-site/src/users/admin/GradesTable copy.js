//V
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import "./GradesTable.css"; // Import the CSS file for styling



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

    <div class="container-manage-grades">
	<table className="table-manage-grades">
		<thead>
			<tr>
				<th>Judge ID</th>
				<th>Judge Name</th>
				<th>Project ID</th>
				<th>Project Name</th>
				<th>Complexity</th>
        <th>Usability</th>
        <th>Innovation</th>
        <th>Presentation</th>
        <th>Proficiency</th>
        <th>Additional Comment</th>
        <th>Total Grade</th>
			</tr>
		</thead>
		<tbody>
      {grades.map((grade, index) => (
            <tr key={index}>
              <td>{grade.judge_id}</td>
              {/* Use judgeMap to display judge name */}
              <td>{judgeMap[grade.judge_id] || 'Unknown Judge'}</td>
              <td>{grade.project_id}</td>
              {/* Use projectMap to display project name */}
              <td>{projectMap[grade.project_id] || 'Unknown Project'}</td>
              <td>{grade.complexity}</td>
              <td>{grade.usability}</td>
              <td>{grade.innovation}</td>
              <td>{grade.presentation}</td>
              <td>{grade.proficiency}</td>
              <td>{grade.additionalComment || 'N/A'}</td>
              <td>{grade.grade}</td>
			</tr>
      ))}
		</tbody>
	</table>
</div>
  );
};

export default GradesManager;

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { backendURL } from '../../config';

// Flex container to center its child
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* If you want to center vertically relative to viewport height, un-comment next line:
  min-height: 100vh; */
`;

const Ribbon = styled.div`
  font-size: 28px;
  font-weight: bold;
  color: #fff;
  
  /* New ribbon cutout style */
  --s: 1.8em; /* the ribbon size */
  --d: 0.8em;  /* the depth */
  --c: 0.8em;  /* the cutout part */
  
  padding: 0 calc(var(--s) + 0.5em) var(--d);
  line-height: 1.8;
  background:
    conic-gradient(at left var(--s) bottom var(--d), #0000 25%, #0008 0 37.5%, #0004 0) 0 / 50% 100% no-repeat,
    conic-gradient(at right var(--s) bottom var(--d), #0004 62.5%, #0008 0 75%, #0000 0) 100% / 50% 100% no-repeat;
  clip-path: polygon(
    0 var(--d),
    var(--s) var(--d),
    var(--s) 0,
    calc(100% - var(--s)) 0,
    calc(100% - var(--s)) var(--d),
    100% var(--d),
    calc(100% - var(--c)) calc(50% + var(--d)/2),
    100% 100%,
    calc(100% - var(--s) - var(--d)) 100%,
    calc(100% - var(--s) - var(--d)) calc(100% - var(--d)),
    calc(var(--s) + var(--d)) calc(100% - var(--d)),
    calc(var(--s) + var(--d)) 100%,
    0 100%,
    var(--c) calc(50% + var(--d)/2)
  );
  background-color: ${props => props.finished ? 'green' : 'rgb(219, 27, 27)'};
  width: fit-content;
  margin: 0;
`;

const StatText = styled.p`
  font-size: 1.5rem;
  margin: 0;
  color: #fff;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const JudgeProjectStats = ({ reload }) => {
  const [totalAssigned, setTotalAssigned] = useState(null);
  const [totalGraded, setTotalGraded] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchCounts = async () => {
      try {
        const res = await fetch(`${backendURL}/judge/counts`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setTotalAssigned(data.totalAssigned);
        setTotalGraded(data.totalGraded);
      } catch (error) {
        console.error('Error fetching judge counts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, [reload]);

  const finished = totalAssigned === totalGraded && totalAssigned !== null;

  return (
    <Wrapper>
      {loading ? (
        <Ribbon>
          <StatText>Loading...</StatText>
        </Ribbon>
      ) : (
        <Ribbon finished={finished}>
          <StatText>{totalGraded} / {totalAssigned} Graded</StatText>
        </Ribbon>
      )}
    </Wrapper>
  );
};

export default JudgeProjectStats;
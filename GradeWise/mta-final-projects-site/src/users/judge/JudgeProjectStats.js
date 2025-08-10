import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { backendURL } from '../../config';
import { FaCheckCircle, FaClock, FaTrophy } from 'react-icons/fa';

// Flex container to center its child
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

// Progress bar container
const ProgressContainer = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ProgressTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ProgressPercentage = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.finished ? '#43e97b' : '#667eea'};
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
  height: 12px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin-bottom: 15px;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: ${props => {
    if (props.loading) return 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
    return props.finished 
      ? 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)'
      : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)';
  }};
  border-radius: 6px;
  transition: width 0.8s ease-in-out;
  width: ${props => props.progress}%;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
  }
`;

const shimmer = keyframes`
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
`;

const ProgressStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #718096;
  font-weight: 500;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: ${props => {
    if (props.loading) return 'rgba(102, 126, 234, 0.2)';
    return props.finished ? 'rgba(67, 233, 123, 0.2)' : 'rgba(102, 126, 234, 0.2)';
  }};
  border-radius: 50%;
  color: ${props => {
    if (props.loading) return '#667eea';
    return props.finished ? '#43e97b' : '#667eea';
  }};
  font-size: 10px;
`;

// Modern badge animation
const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  }
`;

const successPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(67, 233, 123, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(67, 233, 123, 0.6);
  }
`;

const warningPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(219, 27, 27, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(219, 27, 27, 0.6);
  }
`;

const ModernBadge = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1.1rem;
  color: white;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
  min-width: 200px;
  justify-content: center;
  
  /* Dynamic styling based on finished state */
  background: ${props => {
    if (props.loading) {
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    return props.finished 
      ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
      : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
  }};
  
  box-shadow: ${props => {
    if (props.loading) {
      return '0 4px 15px rgba(102, 126, 234, 0.4)';
    }
    return props.finished 
      ? '0 4px 15px rgba(67, 233, 123, 0.4)'
      : '0 4px 15px rgba(219, 27, 27, 0.4)';
  }};
  
  animation: ${props => {
    if (props.loading) return pulse;
    return props.finished ? successPulse : warningPulse;
  }} 2s ease-in-out infinite;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => {
      if (props.loading) {
        return '0 8px 25px rgba(102, 126, 234, 0.5)';
      }
      return props.finished 
        ? '0 8px 25px rgba(67, 233, 123, 0.5)'
        : '0 8px 25px rgba(219, 27, 27, 0.5)';
    }};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    border-radius: 50px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 1rem;
    min-width: 180px;
  }
`;

const BadgeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(5px);
  font-size: 12px;
  
  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
`;

const StatText = styled.span`
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ProgressRing = styled.div`
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50px;
  background: conic-gradient(
    from 0deg,
    rgba(255, 255, 255, 0.3) 0deg,
    transparent ${props => (props.progress || 0) * 3.6}deg,
    transparent 360deg
  );
  z-index: -1;
  opacity: 0.7;
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
  const progress = totalAssigned > 0 ? (totalGraded / totalAssigned) * 100 : 0;

  const getIcon = () => {
    if (loading) return <FaClock />;
    if (finished) return <FaTrophy />;
    return <FaCheckCircle />;
  };

  const getText = () => {
    if (loading) return 'Loading...';
    return `${totalGraded} / ${totalAssigned} Graded`;
  };

  return (
    <Wrapper>
      <ProgressContainer>
        <ProgressHeader>
          <ProgressTitle>Grading Progress</ProgressTitle>
          <ProgressPercentage finished={finished}>
            {loading ? '...' : `${Math.round(progress)}%`}
          </ProgressPercentage>
        </ProgressHeader>
        
        <ProgressBarWrapper>
          <ProgressBarFill 
            progress={progress} 
            finished={finished} 
            loading={loading}
          />
        </ProgressBarWrapper>
        
        <ProgressStats>
          <StatItem>
            <StatIcon finished={finished} loading={loading}>
              <FaCheckCircle />
            </StatIcon>
            <span>Graded: {totalGraded || 0}</span>
          </StatItem>
          <StatItem>
            <StatIcon finished={finished} loading={loading}>
              <FaClock />
            </StatIcon>
            <span>Total: {totalAssigned || 0}</span>
          </StatItem>
        </ProgressStats>
      </ProgressContainer>


    </Wrapper>
  );
};

export default JudgeProjectStats;
import styled from 'styled-components';


const CenteredLoader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.7); // Optional, for a subtle overlay
  z-index: 1000;
`;


const Loader = styled.div`
position: relative;
  width: 164px;
  height: 164px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 40px;
    height: 40px;
    background-color:rgb(39, 12, 159);
    left: 50%;
    top: 50%;
    animation: rotate 1s ease-in infinite;
  }

  &::after {
    width: 20px;
    height: 20px;
    background-color:rgb(84, 162, 225);
    animation: rotate 1s ease-in infinite, moveY 1s ease-in infinite;
  }

  @keyframes moveY {
    0%, 100% {
      top: 10%;
    }
    45%, 55% {
      top: 59%;
    }
    60% {
      top: 40%;
    }
  }

  @keyframes rotate {
    0% {
      transform: translate(-50%, -100%) rotate(0deg) scale(1, 1);
    }
    25% {
      transform: translate(-50%, 0%) rotate(180deg) scale(1, 1);
    }
    45%, 55% {
      transform: translate(-50%, 100%) rotate(180deg) scale(3, 0.5);
    }
    60% {
      transform: translate(-50%, 100%) rotate(180deg) scale(1, 1);
    }
    75% {
      transform: translate(-50%, 0%) rotate(270deg) scale(1, 1);
    }
    100% {
      transform: translate(-50%, -100%) rotate(360deg) scale(1, 1);
    }
  }
`;

export default function Loading() {
    return (
        <CenteredLoader>
            <Loader />
        </CenteredLoader>
    );
}
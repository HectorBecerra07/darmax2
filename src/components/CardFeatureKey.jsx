import React from 'react';
import styled from 'styled-components';

const CardFeatureKey = ({ imagen, titulo, descripcion }) => {
  return (
    <StyledWrapper>
      <div className="e-card playing">
        <div className="image" />
        <div className="wave" />
        <div className="wave" />
        <div className="wave" />
        <div className="infotop">
          {imagen && (
            <img src={imagen} alt={titulo || 'feature icon'} className="icon" />
          )}
          <br />
          {titulo}
          <br />
          <div className="name">{descripcion}</div>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .e-card {
    margin: 20px auto;
    background: transparent;
    box-shadow: 0px 8px 28px -9px rgba(0,0,0,0.45);
    position: relative;
    width: 220px;
    height: 300px;
    border-radius: 16px;
    overflow: hidden;
  }

  .wave {
    position: absolute;
    width: 540px;
    height: 700px;
    opacity: 0.6;
    left: 0;
    top: 0;
    margin-left: -50%;
    margin-top: -70%;
    background: linear-gradient(#247eb9,#2997bc,#1aadbe 60%,#00ddeb);
  }

  .icon {
    width: 3.5em;
    height: 3.5em;
    object-fit: contain;
    margin-top: -1em;
    padding-bottom: 1em;
  }

  .infotop {
    text-align: center;
    font-size: 18px;
    position: absolute;
    top: 3.8em;
    left: 0;
    right: 0;
    color: rgb(255, 255, 255);
    font-weight: 600;
    padding: 0 1em;
  }

  .name {
    font-size: 13px;
    font-weight: 100;
    position: relative;
    top: 0.5em;
    text-transform: none;
    white-space: normal;
    word-wrap: break-word;
  }

  .wave:nth-child(2),
  .wave:nth-child(3) {
    top: 210px;
  }

  .playing .wave {
    border-radius: 40%;
    animation: wave 3000ms infinite linear;
  }

  .wave {
    border-radius: 40%;
    animation: wave 55s infinite linear;
  }

  .playing .wave:nth-child(2) {
    animation-duration: 4000ms;
  }

  .wave:nth-child(2) {
    animation-duration: 50s;
  }

  .playing .wave:nth-child(3) {
    animation-duration: 5000ms;
  }

  .wave:nth-child(3) {
    animation-duration: 45s;
  }

  @keyframes wave {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;

export default CardFeatureKey;
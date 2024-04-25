import React, { useState, useEffect, useRef } from "react";
import "./MarioGame.css"; // Import your CSS file with styles for the game

export default function MarioGame() {
  const [position, setPosition] = useState({ x: 100, y: 0 }); // Initial position of Mario
  const gameAreaRef = useRef(null);
  const obstacleRef = useRef(null);
  const [isJumping, setIsJumping] = useState(false); // State to track jumping
  const [isFalling, setIsFalling] = useState(false); // State to track falling
  const [isPaused, setIsPaused] = useState(false); // State to track if the game is paused
  const jumpHeight = 150; // Change the jump height as needed
  const obstacleSpeed = 10; // Change the obstacle speed as needed

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPaused) {
        if (e.key === "ArrowRight") {
          setPosition((prevPosition) => ({
            ...prevPosition,
            x: prevPosition.x + 5,
          }));
        } else if (e.key === "ArrowLeft") {
          setPosition((prevPosition) => ({
            ...prevPosition,
            x: prevPosition.x - 5,
          }));
        } else if (e.key === "ArrowUp" && !isJumping && !isFalling) {
          setIsJumping(true);
          setTimeout(() => {
            setIsJumping(false);
            setIsFalling(true);
            setTimeout(() => {
              setIsFalling(false);
            }, 300);
          }, 200);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isJumping, isFalling, isPaused]);

  useEffect(() => {
    const gameArea = gameAreaRef.current;
    const obstacle = obstacleRef.current;

    const handleObstacleAnimation = () => {
      let left = 800;
      let moveLeft = true;

      const moveObstacle = () => {
        if (left <= -200) {
          // Reset obstacle position when it goes out of the screen
          left = 1000;
          obstacle.style.left = `${left}px`;
        }

        if (!isPaused && moveLeft) {
          left -= obstacleSpeed;
        }

        obstacle.style.left = `${left}px`;

        if (gameArea.contains(obstacle)) {
          window.requestAnimationFrame(moveObstacle);
        }
      };

      window.requestAnimationFrame(moveObstacle);
    };

    handleObstacleAnimation();
  }, [obstacleSpeed, isPaused]);

  const handlePausePlay = () => {
    setIsPaused((prevIsPaused) => !prevIsPaused);
  };

  return (
    <div className="MarioGame" ref={gameAreaRef}>
      <div
        className="Mario"
        style={{
          left: `${position.x}px`,
          bottom: isJumping ? `${jumpHeight}px` : isFalling ? "0px" : "20px",
        }}
      ></div>
      <div className="Obstacle" ref={obstacleRef}></div>
      <div className="GameControls">
        <button className="PausePlayButton" onClick={handlePausePlay}>
          {isPaused ? "Play" : "Pause"}
        </button>
        <p
          className="Instructions"
          style={{
            textAlign: "left",
            fontFamily: "Press Start 2P",
            fontSize: "40px",
            fontWeight: "bold",
          }}
        >
          MARIO GAME
        </p>
        <p className="Instructions">
          INSTRUCTIONS: UP for Jump, DOWN for Down, RIGHT for Right, LEFT for
          Left
        </p>
      </div>
    </div>
  );
}

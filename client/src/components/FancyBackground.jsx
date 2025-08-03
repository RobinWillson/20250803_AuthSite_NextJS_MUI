import { Box } from '@mui/material';

const purple = 'rgb(232 121 249)';
const blue = 'rgb(96 165 250)';
const green = 'rgb(94 234 212)';

const animationTime = 45; // in seconds
const length = 25;

const colorPermutations = [
  [purple, blue, green],
  [purple, green, blue],
  [green, purple, blue],
  [green, blue, purple],
  [blue, green, purple],
  [blue, purple, green],
];

function getRandomColors() {
  return colorPermutations[Math.floor(Math.random() * colorPermutations.length)];
}

/**
 * Renders a dynamic, animated rainbow background effect using MUI's sx prop.
 */
function FancyBackground() {
  const rainbowDivs = Array.from({ length }, (_, i) => {
    const colors = getRandomColors();
    const animationDuration = animationTime - (animationTime / length / 2) * (i + 1);
    const animationDelay = `-${((i + 1) / length) * animationTime}s`;

    const sx = {
      height: '100vh',
      width: 0,
      top: 0,
      position: 'absolute',
      transform: 'rotate(10deg)',
      transformOrigin: 'top right',
      boxShadow: [
        '-130px 0 80px 40px white',
        `-50px 0 50px 25px ${colors[0]}`,
        `0 0 50px 25px ${colors[1]}`,
        `50px 0 50px 25px ${colors[2]}`,
        '130px 0 80px 40px white',
      ].join(', '),
      animation: `${animationDuration}s linear infinite slide`,
      animationDelay: animationDelay,
    };

    return <Box key={ i } sx={ sx } />;
  });

  return (
    <Box aria-hidden="true" sx={ { overflow: 'hidden' } }>
      { rainbowDivs }
      <Box
        className="h"
        sx={ {
          boxShadow: '0 0 50vh 40vh white',
          width: '100vw',
          height: 0,
          bottom: 0,
          left: 0,
          position: 'absolute',
        } }
      />
      <Box
        className="v"
        sx={ {
          boxShadow: '0 0 35vw 25vw white',
          width: 0,
          height: '100vh',
          bottom: 0,
          left: 0,
          position: 'absolute',
        } }
      />
    </Box>
  );
}

export default FancyBackground;
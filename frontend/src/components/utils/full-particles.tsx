import Particles from 'react-particles-js'

const FullParticles: React.FunctionComponent = () => {
  return (
    <Particles
      width="100%"
      height="100%"
      params={{
        interactivity: {
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true,
          }
        }
      }} />
    );
}
 
export default FullParticles;
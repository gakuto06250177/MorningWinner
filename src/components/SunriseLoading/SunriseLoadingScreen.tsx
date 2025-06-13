import { MountainLayers } from './MountainLayers';
import { ForestSilhouette } from './ForestSilhouette';
import { LoadingProgress } from './LoadingProgress';
import { FinaleScreen } from './FinaleScreen';

interface SunriseLoadingScreenProps {
  sunriseProgress: number;
}

export function SunriseLoadingScreen({ sunriseProgress }: SunriseLoadingScreenProps) {
  const skyColor = {
    backgroundColor: `rgb(${Math.floor(25 + sunriseProgress * 110)}, ${Math.floor(25 + sunriseProgress * 130)}, ${Math.floor(50 + sunriseProgress * 155)})`
  };
  
  const sunOpacity = Math.min(1, sunriseProgress * 1.5);
  const sunSize = 80 + sunriseProgress * 120;
  const sunY = 70 - sunriseProgress * 50;
  
  // Show finale when sun is fully risen (progress > 0.9)
  const showFinale = sunriseProgress > 0.9;
  const finaleOpacity = Math.min(1, Math.max(0, (sunriseProgress - 0.9) * 15));

  return (
    <div className="fixed inset-0 overflow-hidden" style={skyColor}>
      {/* Stars (fade out as sun rises) */}
      <div className="absolute inset-0" style={{opacity: 1 - sunriseProgress}}>
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 13) % 70}%`,
              animationDelay: `${(i * 0.04) % 2}s`
            }}
          />
        ))}
      </div>
      
      {/* Sun */}
      <div
        className="absolute rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-2xl"
        style={{
          width: `${sunSize}px`,
          height: `${sunSize}px`,
          left: '50%',
          top: `${sunY}%`,
          transform: 'translateX(-50%)',
          opacity: sunOpacity,
          boxShadow: `0 0 ${sunSize}px rgba(255, 204, 0, ${sunOpacity * 0.5})`
        }}
      />
      
      {/* Mountain and forest landscape */}
      <MountainLayers sunriseProgress={sunriseProgress} />
      <ForestSilhouette sunriseProgress={sunriseProgress} />
      
      {/* Content based on phase */}
      {!showFinale ? (
        <LoadingProgress sunriseProgress={sunriseProgress} />
      ) : (
        <FinaleScreen finaleOpacity={finaleOpacity} />
      )}
    </div>
  );
}
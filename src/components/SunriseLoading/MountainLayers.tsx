interface MountainLayersProps {
  sunriseProgress: number;
}

export function MountainLayers({ sunriseProgress }: MountainLayersProps) {
  return (
    <>
      {/* Far mountains */}
      <div 
        className="absolute bottom-0 w-full"
        style={{
          height: '50%',
          background: `linear-gradient(to bottom, transparent 0%, rgba(30, 58, 138, ${0.8 - sunriseProgress * 0.6}) 60%, rgba(15, 23, 42, ${0.9 - sunriseProgress * 0.7}) 100%)`,
          clipPath: 'polygon(0 80%, 15% 60%, 25% 70%, 40% 45%, 55% 55%, 70% 40%, 85% 50%, 100% 45%, 100% 100%, 0 100%)'
        }}
      />
      
      {/* Middle mountains */}
      <div 
        className="absolute bottom-0 w-full"
        style={{
          height: '45%',
          background: `linear-gradient(to bottom, transparent 0%, rgba(51, 65, 85, ${0.7 - sunriseProgress * 0.5}) 50%, rgba(15, 23, 42, ${0.8 - sunriseProgress * 0.6}) 100%)`,
          clipPath: 'polygon(0 90%, 20% 50%, 35% 65%, 50% 35%, 65% 45%, 80% 30%, 95% 40%, 100% 35%, 100% 100%, 0 100%)'
        }}
      />
      
      {/* Near mountains */}
      <div 
        className="absolute bottom-0 w-full"
        style={{
          height: '40%',
          background: `linear-gradient(to bottom, transparent 0%, rgba(71, 85, 105, ${0.6 - sunriseProgress * 0.4}) 40%, rgba(15, 23, 42, ${0.7 - sunriseProgress * 0.5}) 100%)`,
          clipPath: 'polygon(0 100%, 10% 45%, 30% 55%, 45% 25%, 60% 40%, 75% 20%, 90% 35%, 100% 30%, 100% 100%, 0 100%)'
        }}
      />
      
      {/* Rolling hills foreground */}
      <div 
        className="absolute bottom-0 w-full"
        style={{
          height: '25%',
          background: `linear-gradient(to bottom, transparent 0%, rgba(34, 197, 94, ${0.3 - sunriseProgress * 0.1}) 30%, rgba(15, 23, 42, ${0.8 - sunriseProgress * 0.6}) 100%)`,
          clipPath: 'polygon(0 70%, 25% 40%, 50% 50%, 75% 30%, 100% 45%, 100% 100%, 0 100%)'
        }}
      />
    </>
  );
}
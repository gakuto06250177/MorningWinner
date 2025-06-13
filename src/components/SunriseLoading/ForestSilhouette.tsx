interface ForestSilhouetteProps {
  sunriseProgress: number;
}

// Pre-generated tree data to avoid hydration mismatch
const treeData = Array.from({ length: 25 }, (_, i) => ({
  height: 60 + (i * 7) % 80,
  width: 8 + (i * 3) % 12,
  scaleY: 0.8 + (i * 0.02) % 0.4
}));

export function ForestSilhouette({ sunriseProgress }: ForestSilhouetteProps) {
  return (
    <div 
      className="absolute bottom-0 w-full flex items-end justify-center"
      style={{
        height: '35%',
        opacity: 0.9 - sunriseProgress * 0.6
      }}
    >
      {/* Trees */}
      {treeData.map((tree, i) => {
        const left = (i / 25) * 100;
        return (
          <div
            key={i}
            className="absolute bottom-0"
            style={{
              left: `${left}%`,
              width: `${tree.width}px`,
              height: `${tree.height}px`,
              background: `linear-gradient(to top, rgba(15, 23, 42, ${0.9 - sunriseProgress * 0.6}), rgba(30, 41, 59, ${0.7 - sunriseProgress * 0.4}))`,
              clipPath: 'polygon(0 100%, 20% 80%, 30% 85%, 40% 70%, 50% 0%, 60% 70%, 70% 85%, 80% 80%, 100% 100%)',
              transform: `scaleY(${tree.scaleY})`
            }}
          />
        );
      })}
    </div>
  );
}
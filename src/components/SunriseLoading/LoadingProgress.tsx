interface LoadingProgressProps {
  sunriseProgress: number;
}

export function LoadingProgress({ sunriseProgress }: LoadingProgressProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">
            朝活の始まり
          </h1>
          <p className="text-2xl text-white/90 drop-shadow-md">
            新しい一日が始まります...
          </p>
          
          {/* Progress bar */}
          <div className="w-96 h-2 bg-white/20 rounded-full mx-auto overflow-hidden backdrop-blur-sm">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-yellow-300 transition-all duration-100 ease-out"
              style={{width: `${sunriseProgress * 100}%`}}
            />
          </div>
          
          <p className="text-white/80 text-lg">
            {Math.floor(sunriseProgress * 100)}% 完了
          </p>
        </div>
      </div>
    </div>
  );
}
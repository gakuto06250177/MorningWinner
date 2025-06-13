import Image from 'next/image';

interface FinaleScreenProps {
  finaleOpacity: number;
}

export function FinaleScreen({ finaleOpacity }: FinaleScreenProps) {
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center"
      style={{opacity: finaleOpacity}}
    >
      <div className="text-center">
        {/* Epic flash effect */}
        <div className="absolute inset-0 bg-white animate-pulse" style={{opacity: finaleOpacity * 0.3}} />
        
        {/* Main logo */}
        <div className="relative z-10">
          <Image 
            src="/loading-icon.png" 
            alt="MORNINGWINNER" 
            width={600}
            height={600}
            className="mx-auto drop-shadow-2xl animate-pulse"
            style={{
              transform: `scale(${0.5 + finaleOpacity * 0.5})`,
              filter: 'drop-shadow(0 0 50px rgba(255, 255, 255, 0.8))'
            }}
          />
        </div>
        
        {/* Epic text */}
        <div className="mt-8 space-y-4">
          <h1 className="text-8xl font-black text-white drop-shadow-2xl tracking-wider animate-pulse">
            MORNING WINNER
          </h1>
          <div className="text-3xl font-bold text-yellow-300 drop-shadow-lg space-y-2">
            <p>〜 真の勝者は朝に決まる 〜</p>
            <p className="text-2xl text-white/90">運命を切り開く者たちよ、集え！</p>
          </div>
          <div className="text-xl text-orange-200 mt-6">
            <p>「早起きは三文の徳」ではない...</p>
            <p className="font-bold text-yellow-400">それは人生を変える力だ！</p>
          </div>
        </div>
      </div>
    </div>
  );
}
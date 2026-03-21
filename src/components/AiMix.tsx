
import AIMIX from '../assets/AI_MIX.png'


interface AiMixProps {
  onClick: ()=> void;
}

export const AiMix = ({onClick}:AiMixProps) => {
  return (
    <div  onClick={onClick}  className='relative bg-[var(--bg-surface)] overflow-hidden shadow-xl group cursor-pointer h-full'>
        <div className='absolute inset-0 overflow-hidden'>
            <img src={AIMIX} alt="" className='absolute inset-0 w-full h-full object-cover'/>
        </div>
        <div className='absolute bottom-8 left-10 text-[40px] text-white tracking-widest x-10'>AI MIX</div>
      
    </div>
  )
}

export default AiMix

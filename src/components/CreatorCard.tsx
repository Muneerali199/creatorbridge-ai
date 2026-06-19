import { type Creator, formatFollowers } from '../data/creators';
import { BadgeCheck } from 'lucide-react';

interface CreatorCardProps {
  creator: Creator;
  score?: number;
  rank?: number;
  onClick?: () => void;
  selected?: boolean;
}

export default function CreatorCard({ creator, score, rank, onClick, selected }: CreatorCardProps) {
  const scoreColor = score !== undefined
    ? score >= 80 ? 'bg-emerald-bg text-emerald-success' : score >= 50 ? 'bg-coral-muted text-coral-accent' : 'bg-red-500/10 text-red-400'
    : '';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer
        ${selected ? 'bg-[#2a2348]/60 border-l-4 border-[#ff6b8a]' : 'hover:bg-[#2a2348]/30 border-l-4 border-transparent'}
        ${rank && rank <= 3 ? 'bg-[#ff6b8a]/5' : ''}
      `}
    >
      {rank && (
        <span className="text-2xl font-bold text-[#9b8ec7]/40 w-8 text-center">
          {rank}
        </span>
      )}
      <div className="relative">
        <img
          src={creator.avatar}
          alt={creator.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        {creator.verified && (
          <div className="absolute -bottom-0.5 -right-0.5 bg-[#34d399] rounded-full p-0.5">
            <BadgeCheck className="w-3 h-3 text-[#0a0718]" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[#f0e6ff] font-semibold text-sm truncate">{creator.name}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] uppercase tracking-wider text-[#9b8ec7] bg-[#2a2348] px-2 py-0.5 rounded-full">
            {creator.niche}
          </span>
          <span className="text-xs text-[#9b8ec7]">{formatFollowers(creator.followers)}</span>
        </div>
      </div>
      {score !== undefined && (
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${scoreColor}`}>
          {score}
        </span>
      )}
    </div>
  );
}

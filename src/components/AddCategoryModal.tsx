import { useState } from 'react';
import { X } from 'lucide-react';
import { useStore } from '@/store/useStore';

const EMOJIS = ['🍔','🛍','✈','🏠','🎬','📚','🏋','💊','🐶','🎮','☕','🍺','🚗','💇','🧴','🎁','💻','🌿','🎵','💰'];
const COLORS = [
  { color: '#1D9E75', bg: '#E1F5EE', name: 'teal' },
  { color: '#7F77DD', bg: '#EEEDFE', name: 'purple' },
  { color: '#378ADD', bg: '#E6F1FB', name: 'blue' },
  { color: '#EF9F27', bg: '#FAEEDA', name: 'amber' },
  { color: '#E24B4A', bg: '#FBE7E6', name: 'coral' },
  { color: '#3FB173', bg: '#E3F4EA', name: 'green' },
];

export function AddCategoryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addCategory = useStore((s) => s.addCategory);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJIS[0]);
  const [colorIdx, setColorIdx] = useState(0);
  const [budget, setBudget] = useState('');

  if (!open) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    const { color, bg } = COLORS[colorIdx];
    addCategory({
      id: `cat-${Date.now()}`,
      name: name.trim(),
      emoji,
      color,
      bgColor: bg,
      budget: budget ? Number(budget) : 5000,
    });
    setName(''); setEmoji(EMOJIS[0]); setColorIdx(0); setBudget('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="w-full max-w-md rounded-t-3xl bg-white p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium text-[#2c2c2a]">New category</h2>
          <button onClick={onClose} className="p-1"><X size={20} className="text-[#888780]" /></button>
        </div>

        <label className="text-xs text-[#888780]">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Coffee"
          className="mt-1 w-full rounded-xl border border-[#e8e7e3] px-3 py-2.5 text-sm outline-none focus:border-[#7F77DD]"
        />

        <div className="mt-4">
          <div className="text-xs text-[#888780] mb-2">Emoji</div>
          <div className="grid grid-cols-10 gap-1.5">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setEmoji(e)}
                className={`aspect-square rounded-lg text-lg ${emoji === e ? 'bg-[#EEEDFE] ring-2 ring-[#7F77DD]' : 'bg-[#f5f4f1]'}`}
              >{e}</button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs text-[#888780] mb-2">Color</div>
          <div className="flex gap-2">
            {COLORS.map((c, i) => (
              <button
                key={c.name}
                onClick={() => setColorIdx(i)}
                className={`h-9 w-9 rounded-full ${colorIdx === i ? 'ring-2 ring-offset-2 ring-[#2c2c2a]' : ''}`}
                style={{ backgroundColor: c.color }}
              />
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs text-[#888780]">Monthly budget (optional)</label>
          <div className="mt-1 flex items-center rounded-xl border border-[#e8e7e3] px-3 py-2.5 focus-within:border-[#7F77DD]">
            <span className="text-sm text-[#888780] mr-2">₹</span>
            <input
              value={budget}
              onChange={(e) => setBudget(e.target.value.replace(/\D/g, ''))}
              placeholder="5000"
              inputMode="numeric"
              className="flex-1 text-sm outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleCreate}
          disabled={!name.trim()}
          className="mt-5 w-full rounded-xl bg-[#7F77DD] py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          Create category
        </button>
      </div>
    </div>
  );
}

import { AppTheme, AppFont, AppShape } from '@/types';
import { Label } from '@/components/ui/label';

interface ThemeCustomizerProps {
  currentTheme: AppTheme;
  currentFont: AppFont;
  currentShape: AppShape;
  onChange: (updates: { theme?: AppTheme; font?: AppFont; shape?: AppShape }) => void;
}

const themes: { id: AppTheme; name: string; color: string }[] = [
  { id: 'default', name: 'Teal', color: 'bg-teal-500' },
  { id: 'emerald', name: 'Emerald', color: 'bg-emerald-500' },
  { id: 'rose', name: 'Rose', color: 'bg-rose-500' },
  { id: 'amber', name: 'Amber', color: 'bg-amber-500' },
  { id: 'ocean', name: 'Ocean', color: 'bg-blue-500' },
];

const fonts: AppFont[] = ['Inter', 'Playfair Display', 'JetBrains Mono', 'Quicksand'];
const shapes: { id: AppShape; name: string }[] = [
  { id: 'sharp', name: 'Sharp' },
  { id: 'default', name: 'Default' },
  { id: 'rounded', name: 'Rounded' },
];

export function ThemeCustomizer({ currentTheme, currentFont, currentShape, onChange }: ThemeCustomizerProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-3 block">Theme Color</Label>
        <div className="flex gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange({ theme: t.id })}
              className={`w-10 h-10 rounded-full ${t.color} transition-all ${currentTheme === t.id ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
              title={t.name}
            />
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3 block">Font</Label>
        <div className="grid grid-cols-2 gap-2">
          {fonts.map((f) => (
            <button
              key={f}
              onClick={() => onChange({ font: f })}
              className={`p-3 rounded-lg border text-sm transition-all ${currentFont === f ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
              style={{ fontFamily: f }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3 block">Corner Style</Label>
        <div className="flex gap-2">
          {shapes.map((s) => (
            <button
              key={s.id}
              onClick={() => onChange({ shape: s.id })}
              className={`flex-1 p-3 border text-sm transition-all ${currentShape === s.id ? 'border-primary bg-primary/5' : 'hover:bg-muted'}`}
              style={{ borderRadius: s.id === 'sharp' ? '4px' : s.id === 'rounded' ? '16px' : '8px' }}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

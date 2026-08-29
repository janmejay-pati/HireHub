import { HiOutlineAdjustmentsHorizontal, HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2';

const fonts = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
  { label: 'Courier New', value: 'Courier New, monospace' },
];

const ResumeThemeCustomizer = ({ resume, onUpdate }) => {
  const accentColor = resume.accentColor || '#06b6d4';

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-(--text)">Accent color</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {['#06b6d4', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b'].map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => onUpdate({ accentColor: color })}
              className="h-9 w-9 rounded-full border-2"
              style={{ background: color, borderColor: accentColor === color ? 'var(--text)' : 'transparent' }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-(--text)">Font family</p>
        <select
          value={resume.fontFamily || 'Inter, sans-serif'}
          onChange={(event) => onUpdate({ fontFamily: event.target.value })}
          className="mt-3 w-full rounded-2xl border border-(--border) bg-(--surface) px-4 py-3 text-(--text)"
        >
          {fonts.map((font) => (
            <option key={font.value} value={font.value} className="bg-slate-950">
              {font.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-sm font-semibold text-(--text)">Resume mode</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onUpdate({ mode: 'light' })}
            className={`rounded-2xl border px-4 py-3 text-sm ${resume.mode === 'light' ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-(--border) bg-(--surface) text-(--text)'}`}
          >
            <div className="flex items-center justify-center gap-2"><HiOutlineSun className="h-4 w-4" />Light</div>
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ mode: 'dark' })}
            className={`rounded-2xl border px-4 py-3 text-sm ${resume.mode === 'dark' ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-(--border) bg-(--surface) text-(--text)'}`}
          >
            <div className="flex items-center justify-center gap-2"><HiOutlineMoon className="h-4 w-4" />Dark</div>
          </button>
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-(--text)">Sidebar style</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onUpdate({ sidebarStyle: 'left' })}
            className={`rounded-2xl border px-4 py-3 text-sm ${resume.sidebarStyle === 'left' ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-(--border) bg-(--surface) text-(--text)'}`}
          >
            Left sidebar
          </button>
          <button
            type="button"
            onClick={() => onUpdate({ sidebarStyle: 'right' })}
            className={`rounded-2xl border px-4 py-3 text-sm ${resume.sidebarStyle === 'right' ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200' : 'border-(--border) bg-(--surface) text-(--text)'}`}
          >
            Right sidebar
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-(--border) bg-(--surface) p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-(--text)">
          <HiOutlineAdjustmentsHorizontal className="h-4 w-4 text-cyan-300" />
          Live preview tuning
        </div>
        <p className="mt-2 text-sm text-(--muted)"> Theme and layout changes update instantly in the preview pane and remain saved in your draft.</p>
      </div>
    </div>
  );
};

export default ResumeThemeCustomizer;

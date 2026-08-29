import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

const SearchBar = ({ value, onChange, placeholder = 'Search', className = '' }) => (
  <div className={`relative w-full ${className}`}>
    <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
    <input
      type="search"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-3xl border border-slate-700 bg-slate-800/90 py-3 pl-12 pr-4 text-sm text-white outline-none transition duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/30"
    />
  </div>
);

export default SearchBar;

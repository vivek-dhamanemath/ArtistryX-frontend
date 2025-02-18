import { useState, useRef, useEffect } from "react";

export default function CustomSelect({ label, options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors backdrop-blur-sm"
      >
        {value || placeholder || "Select an option"}
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1">
          <ul className="w-full bg-gray-900 border border-white/10 rounded-lg overflow-y-auto backdrop-blur-sm"
              style={{ maxHeight: '200px', position: 'relative' }}>
            <li
              onClick={() => { onChange(""); setOpen(false); }}
              className="cursor-pointer px-4 py-2 text-white hover:bg-white/10 transition-colors"
            >
              {placeholder || "Select an option"}
            </li>
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className="cursor-pointer px-4 py-2 text-white hover:bg-white/10 transition-colors"
              >
                {opt.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

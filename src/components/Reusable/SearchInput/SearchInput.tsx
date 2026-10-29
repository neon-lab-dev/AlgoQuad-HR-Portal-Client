import React, { useState, useEffect } from "react";
import { BiSearch } from "react-icons/bi";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  delay?: number;
};

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
  delay = 500,
}) => {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (text === value) return;

    const handler = setTimeout(() => {
      onChange(text);
    }, delay);

    return () => clearTimeout(handler);
  }, [text, delay]);

  return (
    <div className={`relative w-full md:w-64 ${className}`}>
      <BiSearch
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-8 pr-3 text-sm py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary-10 focus:outline-none placeholder:text-neutral-40/70"
      />
    </div>
  );
};

export default SearchInput;
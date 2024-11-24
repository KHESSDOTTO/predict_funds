import {
  useState,
  useEffect,
  useRef
} from 'react';
import { SelectWithFilterProps } from './selectInputWithFilterTypes';
import type {
  MouseEvent,
  MutableRefObject
} from 'react';
import { consoleLog } from '@/utils/functions/genericFunctions';

export default function SelectWithFilter ({
  options,
  value,
  varNameForm,
  setForm,
  placeholder = "Select or search...",
}: SelectWithFilterProps) {
  const [filteredOptions, setFilteredOptions] = useState<string[]>(options);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || "");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  consoleLog({value});

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  useEffect(() => {
    setSearchTerm(value || ""); // Sync the input with the selected value
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setDropdownOpen(true); // Show dropdown when typing
  };

  const handleOptionClick = (option: string, varNameForm: string) => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current); // Clear any pending blur logic
    }

    const newForm = {
      [varNameForm]: option
    };

    setSearchTerm(option);
    setForm(newForm);
    setDropdownOpen(false);
  };

  const handleBlur = () => {
    // Delay to allow clicks on dropdown items to register
    blurTimeoutRef.current = setTimeout(() => {

      if (! options.includes(searchTerm)) {
        setSearchTerm(value || ""); // Reset to the last valid value
      } else {
        const newFormInput = {
          [varNameForm]: searchTerm
        };

        consoleLog({newFormInput})
        setForm({ [varNameForm]: searchTerm });
      }
  
      setDropdownOpen(false);
    }, 200);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (!options.includes(searchTerm)) {
        setSearchTerm(value || ""); // Reset to last valid value if invalid
      }
      setDropdownOpen(false); // Close dropdown on Enter
    }
  };

  const handleFocus = () => {
    setSearchTerm('');
    setDropdownOpen(true);
  };

  return (
    <div className='relative w-full'>
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className='w-full py-1 px-4 rounded-full outline-none z-10'
      />
      {isDropdownOpen && filteredOptions.length > 0 && (
        <ul className='absolute list-none top-[120%] left-0 right-0 max-h-32 overflow-y-auto bg-white z-50 rounded-b-sm'>
          {filteredOptions.map((option) => (
            <li
              key={option}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
              onClick={() => handleOptionClick(option, varNameForm)}
              className='p-2 cursor-pointer bg-transparent hover:bg[rgba(0, 0, 0, 0.1)] rounded-b-sm'
            >
              {option}
            </li>
          ))}
        </ul>
      )}
      <span className='absolute right-1 z-0 top-[50%] -translate-y-[50%]'>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="3"
          stroke="black"
          className="size-4 z-0"
          onClick={handleFocus}
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </span>
    </div>
  );
};

import {
  useState,
  useEffect,
  useRef
} from 'react';
import {
  handleBlur,
  handleFocus,
  handleInputChange,
  handleKeyDown,
  handleOptionClick
} from './selectInputWithFilterFunctions';
import type {
  HandleBlurParamsType,
  HandleFocusParamsType,
  HandleInputChangeStaticParamsType,
  HandleKeyDownStaticParamsType,
  HandleOptionClickStaticParamsType,
  SelectWithFilterProps,
  SelectWithFiltersOptionType
} from './selectInputWithFilterTypes';
import { consoleLog } from '@/utils/functions/genericFunctions';

export default function SelectWithFilter ({
  options,
  value,
  varNameForm,
  setForm,
  placeholder = "Select or search...",
}: SelectWithFilterProps) {
  const [filteredOptions, setFilteredOptions] = useState<SelectWithFiltersOptionType[]>(options);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleInputChangeStaticArgs: HandleInputChangeStaticParamsType = {
    setSearchTerm,
    setDropdownOpen
  }
  const handleFocusArgs: HandleFocusParamsType = {
    setSearchTerm,
    setDropdownOpen,
  }
  const handleBlurArgs: HandleBlurParamsType = {
    blurTimeoutRef,
    options,
    value,
    varNameForm,
    searchTerm,
    setSearchTerm,
    setForm,
    setDropdownOpen,
  }
  const handleKeyDownStaticArgs: HandleKeyDownStaticParamsType = {
    options,
    value,
    searchTerm,
    varNameForm,
    setSearchTerm,
    setDropdownOpen,
    setForm,
  }
  const handleOptionClickArgs: HandleOptionClickStaticParamsType = {
    varNameForm,
    blurTimeoutRef,
    setSearchTerm,
    setForm,
    setDropdownOpen,
  }

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  useEffect(() => {
    const selectedOption = options.find(cE => cE.value === value);

    setSearchTerm(selectedOption?.name || "");
  }, [value, options]);

  return (
    <div className='relative w-full'>
      <input
        ref={inputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => handleInputChange({ e, ...handleInputChangeStaticArgs })}
        onFocus={() => handleFocus(handleFocusArgs)}
        onBlur={() => handleBlur(handleBlurArgs)}
        onKeyDown={(e) => handleKeyDown({ e, ...handleKeyDownStaticArgs })}
        placeholder={placeholder}
        className='w-full py-1 pl-4 pr-5 rounded-full outline-none z-10 text-sm'
      />
      {isDropdownOpen && filteredOptions.length > 0 && (
        <ul className='absolute list-none top-[110%] right-0 lg:left-0 lg:right-auto max-h-64 lg:max-h-48 max-w-[80vw] lg:max-w-[80vw] overflow-y-auto bg-white z-50 rounded-b-sm'>
          {filteredOptions.map((option) => (
            <li
              key={option.name}
              data-name={option.name}
              data-value={option.value}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
              onClick={(e) => {
                let currOption: SelectWithFiltersOptionType = {
                  name: e.currentTarget.dataset.name ?? '',
                  value: e.currentTarget.dataset.value ?? '',
                };

                handleOptionClick({ option: currOption, ...handleOptionClickArgs })
              }}
              className='p-2 cursor-pointer bg-transparent hover:bg-[rgba(0,0,0,0.1)] rounded-b-sm whitespace-nowrap mx-w-32'
              title={option.name}
            >
              {option.name}
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
          className="size-3 z-0"
          onClick={() => handleFocus(handleFocusArgs)}
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

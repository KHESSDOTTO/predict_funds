import type {
  HandleInputChangeParamsType,
  HandleOptionClickParamsType,
  HandleKeyDownParamsType,
  HandleBlurParamsType,
  HandleFocusParamsType,
} from "./selectInputWithFilterTypes";

function handleInputChange ({
  e,
  setSearchTerm,
  setDropdownOpen
}: HandleInputChangeParamsType) {
  setSearchTerm(e.target.value);
  setDropdownOpen(true); // Show dropdown when typing
};

function handleOptionClick ({
  option,
  varNameForm,
  blurTimeoutRef,
  setSearchTerm,
  setForm,
  setDropdownOpen,
}: HandleOptionClickParamsType) {
  if (blurTimeoutRef.current) {
    clearTimeout(blurTimeoutRef.current); // Clear any pending blur logic
  }

  const newForm = {
    [varNameForm]: option.value
  };

  setForm((prevForm: any) => ({ ...prevForm, ...newForm }));
  setDropdownOpen(false);
};

function handleBlur ({
  blurTimeoutRef,
  searchTerm,
  options,
  setSearchTerm,
  value,
  setForm,
  varNameForm,
  setDropdownOpen,
}: HandleBlurParamsType) {
  // Delay to allow clicks on dropdown items to register
  blurTimeoutRef.current = setTimeout(() => {

    const optionNames = options.map(cE => cE.name);
    
    if (! optionNames.includes(searchTerm)) {
      const lastValidOption = options.find(cE => cE.value === value);

      setSearchTerm(lastValidOption?.name || ""); // Reset to the last valid value
    } else {
      const selOption = options.find(cE => cE.name === searchTerm)
      const newFormInput = {
        [varNameForm]: selOption?.value ?? (value || '')
      };

      setForm((prevForm: any) => ({ ...prevForm, ...newFormInput }));
    }

    setDropdownOpen(false);
  }, 100);
};

function handleKeyDown ({
  e,
  options,
  value,
  searchTerm,
  varNameForm,
  setSearchTerm,
  setDropdownOpen,
  setForm,
}: HandleKeyDownParamsType) {
  if (e.key === "Enter") {
    const optionNames = options.map(cE => cE.name);

    if (! optionNames.includes(searchTerm)) {
      const lastValidOption = options.find(cE => cE.value === value);

      setSearchTerm(lastValidOption?.name || ""); // Reset to last valid value if invalid
    } else {
      const selOption = options.find(cE => cE.name === searchTerm)
      const newFormInput = {
        [varNameForm]: selOption?.value ?? (value || '')
      };

      setForm((prevForm: any) => ({ ...prevForm, ...newFormInput }));
    }

    setDropdownOpen(false); // Close dropdown on Enter
  }
};

function handleFocus ({
  setSearchTerm,
  setDropdownOpen,
}: HandleFocusParamsType) {
  setSearchTerm('');
  setDropdownOpen(true);
};

export {
  handleInputChange,
  handleOptionClick,
  handleBlur,
  handleKeyDown,
  handleFocus,
}

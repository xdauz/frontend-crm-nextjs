"use client"

import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { Input } from "@/components/ui/input";
import _ from 'lodash';

interface User {
  id: string;
  name: string;
}

const AutocompleteComponent: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const debouncedFetchSuggestions = useRef(_.debounce(async (query: string) => {
    setIsLoading(true);
    // Replace this with actual API call
    const response = await fetchSuggestionsFromAPI(query);
    setIsLoading(false);
    setSuggestions(response);
  }, 500)).current;

  const fetchSuggestionsFromAPI = async (query: string): Promise<User[]> => {
    const response = await fetch('your_api_endpoint', { method: 'GET' });
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    if (isTyping) {
      debouncedFetchSuggestions(inputValue);
    }
  }, [inputValue, isTyping]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setIsTyping(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [suggestionsRef]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsTyping(true);
    setIsFocused(true);
  };

  const handleSelect = (selectedItem: User) => {
    setInputValue(selectedItem.name);
    setSuggestions([]);
    setIsTyping(false);
    setIsFocused(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <Input
        aria-label="Search"
        className="rounded-lg px-3 py-2 w-full"
        placeholder="Search..."
        value={inputValue}
        onChange={handleInputChange}
        onBlur={() => setIsTyping(false)}
        onFocus={() => setIsFocused(true)}
      />
      {isLoading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-25"></div>
      )}
      {suggestions.length > 0 && isFocused && !isLoading && (
        <div ref={suggestionsRef} className="absolute z-10 mt-2 bg-white shadow-lg rounded-lg overflow-hidden w-full">
          <ul className="divide-y divide-gray-200">
            {suggestions.map((item) => (
              <li key={item.id} onClick={() => handleSelect(item)}>
                <div className="block hover:bg-gray-50 p-2">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-900">{item.name}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutocompleteComponent;
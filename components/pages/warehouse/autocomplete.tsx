"use client"

import React, { useState, useEffect, ChangeEvent } from 'react';
import { debounce } from 'lodash';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { Command, CommandGroup, CommandItem } from '../../ui/command';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../../ui/button';
import { FormControl } from '../../ui/form';
import { Input } from '@/components/ui/input';

interface AutocompleteInputProps<T> {
    fetchSuggestions: (inputValue?: string) => Promise<T[]>;
    placeholder?: string;
    field: {
        value: string;
        onChange: (value: string) => void;
    };
    renderItem: (item: T) => React.ReactNode;
    getKey: (item: T) => string;
}

const AutocompleteInput = <T extends {}>({
    fetchSuggestions,
    placeholder,
    field,
    renderItem,
    getKey,
}: AutocompleteInputProps<T>) => {
    const [inputValue, setInputValue] = useState(field.value);
    const [suggestions, setSuggestions] = useState<T[]>([]);
    const [isListOpen, setIsListOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);

    const updateSuggestions = async (value: string) => {
        if (!value) {
            setSuggestions([]);
            setIsListOpen(false);
            return;
        }

        // Make an API call with the entered value
        try {
            const newSuggestions = await fetchSuggestions(value);
            setSuggestions(newSuggestions);
            setIsListOpen(true);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const debouncedUpdateSuggestions = debounce(updateSuggestions, 300);

    useEffect(() => {
        if (selectedItem && (inputValue == getKey(selectedItem))) {
            return;
        }

        debouncedUpdateSuggestions(inputValue);
        return () => {
            debouncedUpdateSuggestions.cancel();
        };
    }, [inputValue]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        field.onChange(value);
    };

    const handleSelect = (selected: T) => {
        setInputValue(getKey(selected) || '');
        setSelectedItem(selected);
        setIsListOpen(false);
        field.onChange(getKey(selected));
    };

    return (
        <Popover open={isListOpen} onOpenChange={setIsListOpen}>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isListOpen}
                        placeholder={placeholder}
                        value={field.value}
                        className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground'
                        )}
                    >
                        {selectedItem ? renderItem(selectedItem) : field.value || placeholder || 'Select...'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <div className="w-full">
                    <Command onChange={handleInputChange}>
                        <Input
                            placeholder={`Search...`}
                            className="h-9"
                            onChange={handleInputChange}
                            value={field.value}
                        />
                        <CommandGroup>
                            {suggestions.map((suggestion) => (
                                <CommandItem
                                    key={getKey(suggestion)}
                                    value={field.value}
                                    onSelect={() => handleSelect(suggestion)}
                                >
                                    {renderItem(suggestion)}
                                    <CheckIcon
                                        className={cn(
                                            'ml-auto h-4 w-4',
                                            field.value === getKey(suggestion) ? 'opacity-100' : 'opacity-0'
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default AutocompleteInput;
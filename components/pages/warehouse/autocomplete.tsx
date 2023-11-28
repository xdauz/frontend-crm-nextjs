import React, { useState, useEffect, ChangeEvent } from 'react';
import { debounce } from 'lodash';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { Command, CommandGroup, CommandInput, CommandItem } from '../../ui/command';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../../ui/button';
import { WarehouseItem } from './schema';
import { FormControl } from '../../ui/form';

interface AutocompleteInputProps {
    fetchSuggestions: (inputValue: string) => Promise<WarehouseItem[]>;
    placeholder?: string;
    field: {
        value: string;
        onChange: (value: string) => void;
    };
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
    fetchSuggestions,
    placeholder,
    field,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedItem, setSelectedItem] = useState<WarehouseItem | null>(null);
    const [suggestions, setSuggestions] = useState<WarehouseItem[]>([]);
    const [isListOpen, setIsListOpen] = useState(false);

    const updateSuggestions = async (value: string) => {
        if (!value) {
            setSuggestions([]);
            setIsListOpen(false);
            return;
        }

        const newSuggestions = await fetchSuggestions(value);
        setSuggestions(newSuggestions.slice(0, 3));
        setIsListOpen(true);
    };

    const debouncedUpdateSuggestions = debounce(updateSuggestions, 300);

    useEffect(() => {
        debouncedUpdateSuggestions(inputValue);
        return () => {
            debouncedUpdateSuggestions.cancel();
        };
    }, [inputValue]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        field.onChange(value); // Update the form value using onChange from field
    };

    const handleSelect = (selected: WarehouseItem) => {
        setInputValue(selected.name || '');
        setSelectedItem(selected);
        setIsListOpen(false);
        field.onChange(selected.name); // Update the form value using onChange from field
    };

    return (
        <Popover open={isListOpen} onOpenChange={setIsListOpen}>
            <PopoverTrigger asChild>
                <FormControl>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={isListOpen}
                        className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                        )}

                    >
                        {selectedItem ? selectedItem.name : inputValue || placeholder || 'Select...'}
                        <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder={placeholder || 'Search...'}
                        className="h-9"
                        value={inputValue}
                        onValueChange={(search) =>
                            handleInputChange({ target: { value: search } } as ChangeEvent<HTMLInputElement>)
                        }
                    />
                    <CommandGroup>
                        {suggestions.map((suggestion) => (
                            <CommandItem
                                key={suggestion.id}
                                value={suggestion.name}
                                onSelect={() => handleSelect(suggestion)}
                            >
                                {suggestion.name}
                                {selectedItem?.id === suggestion.id && (
                                    <CheckIcon className="ml-auto h-4 w-4 opacity-100" />
                                )}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default AutocompleteInput;
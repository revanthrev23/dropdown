import React, { useState, useEffect, useRef } from 'react';
import { useComics } from '../hooks/useListComics';
import './styles.css';
import { IDropdownProps } from './types';

const Dropdown: React.FC<IDropdownProps> = ({ url, onSelect, internalSearch = true }) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(searchTerm);
    const [offset, setOffset] = useState<number>(0);
    const [limit] = useState<number>(10);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // debouncing to ensure API is not called for every key press & to improve performance
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // event listener to close the dropdown when clicked outside the dropdown.
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Custom hook to make the API call using react query.
    const { data: options = [], isLoading, isFetching, error } = useComics(url, limit, offset, internalSearch ? undefined : debouncedSearchTerm);

    useEffect(() => {
        if (isOpen) {
            setOffset(0);
        }
    }, [isOpen]);

    // util function to handle infinite scrolling
    const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 20 && !isLoading && !isFetching) {
            setOffset(prevOffset => prevOffset + limit); // Load more options
        }
    };

    // Maintain previous data by combining with new options
    const allOptions = React.useMemo(() => {
        return [...options];
    }, [options]);

    const filteredOptions = internalSearch
        ? allOptions.filter(option => option && option.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
        : allOptions;

    const handleOptionClick = (option: any) => {
        setSelectedOption(option.title);
        setSearchTerm('');
        setIsOpen(false);
        onSelect(option.title);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="dropdown" ref={dropdownRef}>
            <div className={`dropdown-input ${error ? 'error' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                {isLoading ? (
                    <span className="loading-indicator">Loading...</span>
                ) : error ? (
                    <span className="error-message">{error.message}</span>
                ) : (
                    (selectedOption || 'Select a comic...')
                )}
            </div>

            {isOpen && (
                <div className={`dropdown-menu show`} onScroll={handleScroll}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    
                    <div className="dropdown-options">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, index) => (
                                <div
                                    key={index}
                                    className={`dropdown-option ${selectedOption === option.title ? 'selected' : ''}`}
                                    onClick={() => handleOptionClick(option)}
                                >
                                    {option.title}
                                </div>
                            ))
                        ) : (
                            !isLoading && !isFetching && (
                                <div className="no-options">No options found</div>
                            )
                        )}
                        
                        {isFetching && !isLoading && (
                            <div className="loading-indicator">Loading more...</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;

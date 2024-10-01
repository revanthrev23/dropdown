import React from 'react';
import { shallow } from 'enzyme';
import Dropdown from './Dropdown';

describe('<Dropdown />', () => {
    const mockUrl = 'https://gateway.marvel.com/v1/public/comics';
    const mockOnSelect = jest.fn();
    
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<Dropdown url={mockUrl} onSelect={mockOnSelect} />);
    });

    it('should render without crashing', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('should display placeholder when no option is selected', () => {
        const input = wrapper.find('.dropdown-input');
        expect(input.text()).toBe('Select a comic...');
    });

    it('should open dropdown on input click', () => {
        wrapper.find('.dropdown-input').simulate('click');
        expect(wrapper.find('.dropdown-menu').exists()).toBe(true);
    });

    it('should close dropdown when clicking outside', () => {
        wrapper.find('.dropdown-input').simulate('click');
        expect(wrapper.find('.dropdown-menu').exists()).toBe(true);

        // Simulate click outside
        document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        wrapper.update();

        expect(wrapper.find('.dropdown-menu').exists()).toBe(false);
    });

    it('should filter options based on internal search', () => {
        // Simulate opening the dropdown
        wrapper.find('.dropdown-input').simulate('click');
        wrapper.setState({ options: [{ title: 'Spider-Man' }, { title: 'Iron Man' }] });

        // Update search term
        wrapper.find('input[type="text"]').simulate('change', { target: { value: 'Spider' } });
        wrapper.update();

        const options = wrapper.find('.dropdown-option');
        expect(options.length).toBe(1);
        expect(options.at(0).text()).toBe('Spider-Man');
    });

    it('should call onSelect with selected option', () => {
        // Mock options and open dropdown
        wrapper.setState({ options: [{ title: 'Spider-Man' }, { title: 'Iron Man' }] });
        wrapper.find('.dropdown-input').simulate('click');

        // Select an option
        wrapper.find('.dropdown-option').at(0).simulate('click');

        expect(mockOnSelect).toHaveBeenCalledWith('Spider-Man');
    });

    it('should show loading state', () => {
        wrapper.setProps({ isLoading: true });
        expect(wrapper.find('.loading-indicator').exists()).toBe(true);
    });

    it('should show error message', () => {
        wrapper.setProps({ error: { message: 'Error fetching data' } });
        expect(wrapper.find('.error-message').text()).toBe('Error fetching data');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });
});

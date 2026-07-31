//createContext -> React Context: a shared channel for data across many components.
//useContext -> lets a component read data from that shared channel.
import React, { createContext, useContext, useState, useEffect } from 'react';

/*
creates the theme-data channel.
ThemeProvider provides theme data, any nested component can read it with useContext(ThemeContext).
Without Context, App.js would need to pass theme props through many intermediate components.
*/
const ThemeContext = createContext();

export const useTheme = () => {
    //useContext looks upward in the React component tree for the nearest: <ThemeContext.Provider ...>
    const context = useContext(ThemeContext);
    /*
    If a component tries to call useTheme() outside a ThemeProvider, useContext(...) returns the default context value - which is undefined here. It means -> forgot to wrap this component tree in <ThemeProvider>.
    */
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

/*
his defines and exports a React component named ThemeProvider.
It receives props, but immediately destructures one special prop: children.
children means whatever JSX is nested inside the component.
*/
export const ThemeProvider = ({ children }) => {
     /*
     isDarkMode -> current theme Boolean
     setIsDarkMode -> update function
     () => {} called lazy state initializer.
     React runs it only during the component’s first render, rather than reading localStorage on every re-render.
     The arrow function passed into useState returns the initial Boolean.
     Then useState(...) itself returns an array:
     [currentState, updateFunction]
     
     */
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check localStorage for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        // Default to light mode
        return false;
    });
    
    
    /*
    This runs after the component renders. Because its dependency array later contains: [isDarkMode]
    it runs after first render and every time isDarkMode changes
    */

    useEffect(() => {
        // Save theme preference to localStorage
        //
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        /*
        If dark mode is active, add this CSS class to the real browser <body> element.
        At the same time, remove the light-theme class so both themes are not active.
        */
        if (isDarkMode) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
        //The dependency array tells React: “Run this effect again only when isDarkMode changes.”
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    const value = {
        isDarkMode,
        toggleTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

/*
ThemeProvider owns isDarkMode state
- useTheme() lets nested components access it
-toggleTheme flips the state
- useEffect saves preference and updates body CSS classes
- ThemeProvider shares updated state with descendants
*/
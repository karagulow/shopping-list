import { useEffect, useState } from 'react';
import type { Theme } from '../types/shopping-item';

const THEME_KEY = 'shopping-list-theme';

function getInitialTheme(): Theme {
	try {
		return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
	} catch {
		return 'light';
	}
}

export function useTheme() {
	const [theme, setTheme] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		localStorage.setItem(THEME_KEY, theme);
	}, [theme]);

	function toggleTheme() {
		setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
	}

	return {
		theme,
		toggleTheme,
	};
}

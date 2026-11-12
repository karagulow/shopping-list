import React from 'react';
import { Moon, Sun } from 'lucide-react';

import type { Theme } from '../types/shopping-item';

interface ThemeToggleProps {
	theme: Theme;
	onToggle: () => void;
}

export const THemeTOggle: React.FC<ThemeToggleProps> = ({
	theme,
	onToggle,
}) => {
	return (
		<button
			type='button'
			onClick={onToggle}
			aria-label='Сменить тему'
			className='grid size-10.5 place-items-center rounded-full border border-border bg-surface text-foreground transition-transform hover:scale-105'
		>
			{theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
		</button>
	);
};

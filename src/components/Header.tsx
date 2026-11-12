import React from 'react';

import { getItemsWord } from '../utils/format';
import { THemeTOggle } from './ThemeToggle';

interface HeaderProps {
	activeCount: number;
	totalCount: number;
	theme: 'light' | 'dark';
	toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
	activeCount,
	totalCount,
	theme,
	toggleTheme,
}) => {
	return (
		<header className='mb-8 flex items-center justify-between'>
			<div>
				<h1 className='text-[27px] font-bold tracking-tight'>Покупки</h1>

				<p className='mt-1 text-sm text-muted'>
					{activeCount > 0
						? `${activeCount} ${getItemsWord(activeCount)} осталось`
						: totalCount > 0
							? 'Всё куплено'
							: 'Ваш список покупок'}
				</p>
			</div>

			<THemeTOggle theme={theme} onToggle={toggleTheme} />
		</header>
	);
};

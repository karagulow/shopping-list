import React from 'react';
import { Check } from 'lucide-react';

export const EmptyState: React.FC = () => {
	return (
		<section className='flex animate-appear flex-col items-center px-5 pt-24 text-center'>
			<div className='mb-5 grid size-14.5 place-items-center rounded-[20px] bg-accent-soft text-accent'>
				<Check size={25} />
			</div>

			<h2 className='text-[18px] font-semibold'>Пока ничего нет</h2>

			<p className='mt-2 text-sm text-muted'>
				Добавьте продукты, которые нужно купить
			</p>
		</section>
	);
};

import React, { useRef, useState, type SubmitEvent } from 'react';

import { Plus } from 'lucide-react';

interface Props {
	onAdd: (title: string) => void;
}

export const AddItemForm: React.FC<Props> = ({ onAdd }) => {
	const [input, setInput] = useState('');

	const inputRef = useRef<HTMLInputElement>(null);

	function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		const title = input.trim();

		if (!title) return;

		onAdd(title);
		setInput('');
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='fixed inset-x-4 bottom-[max(16px,env(safe-area-inset-bottom))] z-10 mx-auto flex w-[calc(100%-32px)] max-w-140 items-center gap-2.5 rounded-[18px] border border-black/5 bg-dock p-2 pl-4 shadow-dock backdrop-blur-2xl dark:border-white/[0.07]'
		>
			<input
				ref={inputRef}
				type='text'
				placeholder='Добавить покупку...'
				value={input}
				onChange={event => setInput(event.target.value)}
				aria-label='Название покупки'
				className='min-w-0 flex-1 bg-transparent text-[16px] leading-6 font-normal tracking-normal text-foreground placeholder:text-muted'
			/>

			<button
				type='submit'
				onPointerDown={event => event.preventDefault()}
				disabled={!input.trim()}
				aria-label='Добавить покупку'
				className='grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-white transition-all hover:bg-accent-hover active:scale-95 disabled:cursor-default disabled:opacity-45'
			>
				<Plus size={16} strokeWidth={3} />
			</button>
		</form>
	);
};

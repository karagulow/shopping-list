import React, { type AnimationEvent, type RefObject } from 'react';
import { Check, Pencil, Trash2, X } from 'lucide-react';

import type { ShoppingItem as ShoppingItemType } from '../types/shopping-item';

interface ShoppingItemProps {
	item: ShoppingItemType;
	isDeleting: boolean;
	isEditing: boolean;
	editableRef: RefObject<HTMLSpanElement | null>;
	onToggle: (id: string) => void;
	onDelete: (id: string) => void;
	onStartEditing: (item: ShoppingItemType) => void;
	onSaveEditing: (id: string) => void;
	onCancelEditing: () => void;
	onEditingTitleChange: (title: string) => void;
	onAnimationEnd: (event: AnimationEvent<HTMLElement>, id: string) => void;
}

export const ShoppingItem: React.FC<ShoppingItemProps> = ({
	item,
	isDeleting,
	isEditing,
	editableRef,
	onToggle,
	onDelete,
	onStartEditing,
	onSaveEditing,
	onCancelEditing,
	onEditingTitleChange,
	onAnimationEnd,
}) => {
	return (
		<article
			key={item.id}
			onAnimationEnd={event => onAnimationEnd(event, item.id)}
			className={`flex min-h-14.5 items-center gap-3.5 overflow-hidden border-b border-border ${
				isDeleting
					? 'animate-delete-item pointer-events-none'
					: 'animate-appear'
			}`}
		>
			<button
				type='button'
				onClick={() => onToggle(item.id)}
				disabled={isDeleting || isEditing}
				aria-label={
					item.completed ? 'Отметить как некупленное' : 'Отметить как купленное'
				}
				className={`grid size-6 shrink-0 place-items-center rounded-full border-[1.5px] transition-all ${
					item.completed
						? 'border-accent bg-accent text-white'
						: 'border-[#c9cdd4] text-white hover:border-accent'
				}`}
			>
				{item.completed && <Check size={15} strokeWidth={2.5} />}
			</button>

			<span
				ref={isEditing ? editableRef : null}
				contentEditable={isEditing ? 'plaintext-only' : false}
				suppressContentEditableWarning
				role={isEditing ? 'textbox' : undefined}
				aria-label={isEditing ? 'Название покупки' : undefined}
				onInput={event =>
					onEditingTitleChange(event.currentTarget.textContent ?? '')
				}
				onKeyDown={event => {
					if (!isEditing) return;

					if (event.key === 'Enter') {
						event.preventDefault();
						onSaveEditing(item.id);
					}

					if (event.key === 'Escape') {
						event.preventDefault();
						onCancelEditing();
					}
				}}
				className={`min-w-0 flex-1 text-[16px] leading-6 font-normal tracking-normal wrap-anywhere ${
					isEditing
						? 'cursor-text'
						: item.completed
							? 'text-muted line-through'
							: 'text-foreground'
				}`}
			>
				{item.title}
			</span>

			<div className='flex shrink-0 items-center gap-0.5'>
				{isEditing ? (
					<>
						<button
							type='button'
							onClick={() => onSaveEditing(item.id)}
							aria-label='Сохранить'
							className='grid size-8.5 place-items-center rounded-xl text-accent transition-colors hover:bg-accent-soft'
						>
							<Check size={17} />
						</button>

						<button
							type='button'
							onClick={onCancelEditing}
							aria-label='Отменить'
							className='grid size-8.5 place-items-center rounded-xl text-muted transition-colors hover:bg-accent-soft hover:text-accent'
						>
							<X size={17} />
						</button>
					</>
				) : (
					<>
						<button
							type='button'
							onClick={() => onStartEditing(item)}
							disabled={isDeleting}
							aria-label='Редактировать'
							className='grid size-8.5 place-items-center rounded-xl text-muted transition-colors hover:bg-accent-soft hover:text-accent'
						>
							<Pencil size={16} />
						</button>

						<button
							type='button'
							onClick={() => onDelete(item.id)}
							disabled={isDeleting}
							aria-label='Удалить'
							className='grid size-8.5 place-items-center rounded-xl text-muted transition-colors hover:bg-red-500/10 hover:text-danger'
						>
							<Trash2 size={17} />
						</button>
					</>
				)}
			</div>
		</article>
	);
};

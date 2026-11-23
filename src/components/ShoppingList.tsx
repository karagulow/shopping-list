import React from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Plus } from 'lucide-react';

import { ShoppingItem } from './ShoppingItem';
import type { useShoppingItems } from '../hooks/useShoppingItems';

type ShoppingListProps = ReturnType<typeof useShoppingItems>;

export const ShoppingList: React.FC<ShoppingListProps> = ({
	items,
	newItemId,
	editingId,
	editableRef,
	toggleItem,
	deleteItem,
	startEditing,
	saveEditing,
	cancelEditing,
	setEditingTitle,
	addItem,
}) => {
	const [parent] = useAutoAnimate({
		duration: 150,
		easing: 'ease-in-out',
	});

	return (
		<section ref={parent} className='flex flex-col'>
			{items.map(item => (
				<ShoppingItem
					key={item.id}
					item={item}
					isEditing={editingId === item.id}
					isNewItem={item.id === newItemId}
					editableRef={editableRef}
					onToggle={toggleItem}
					onDelete={deleteItem}
					onStartEditing={startEditing}
					onSaveEditing={saveEditing}
					onCancelEditing={cancelEditing}
					onEditingTitleChange={setEditingTitle}
				/>
			))}

			<button
				type='button'
				onClick={addItem}
				className='flex min-h-14.5 w-full items-center gap-3.5 border-b border-border text-muted hover:text-accent'
			>
				<span className='grid size-6 shrink-0 place-items-center'>
					<Plus size={19} strokeWidth={1.8} />
				</span>

				<span className='text-[16px] leading-6 font-normal'>
					Добавить покупку
				</span>
			</button>
		</section>
	);
};

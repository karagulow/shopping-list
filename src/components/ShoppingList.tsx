import React from 'react';

import { ShoppingItem } from './ShoppingItem';
import type { useShoppingItems } from '../hooks/useShoppingItems';

type ShoppingListProps = ReturnType<typeof useShoppingItems>;

export const ShoppingList: React.FC<ShoppingListProps> = ({
	items,
	editingId,
	deletingIds,
	editableRef,
	toggleItem,
	deleteItem,
	startEditing,
	saveEditing,
	cancelEditing,
	setEditingTitle,
	handleDeleteAnimationEnd,
}) => {
	return (
		<section className='flex flex-col'>
			{items.map(item => {
				return (
					<ShoppingItem
						key={item.id}
						item={item}
						isDeleting={deletingIds.has(item.id)}
						isEditing={editingId === item.id}
						editableRef={editableRef}
						onToggle={toggleItem}
						onDelete={deleteItem}
						onStartEditing={startEditing}
						onSaveEditing={saveEditing}
						onCancelEditing={cancelEditing}
						onEditingTitleChange={setEditingTitle}
						onAnimationEnd={handleDeleteAnimationEnd}
					/>
				);
			})}
		</section>
	);
};

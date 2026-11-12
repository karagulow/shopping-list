import {
	Header,
	ListActions,
	ShoppingList,
	AddItemForm,
	EmptyState,
} from './components';
import { useShoppingItems, useTheme } from './hooks';

export default function App() {
	const { theme, toggleTheme } = useTheme();
	const shoppingList = useShoppingItems();

	return (
		<div className='flex h-dvh min-h-0 flex-col overflow-hidden bg-background text-foreground transition-colors duration-200'>
			<main className='mx-auto min-h-0 w-full max-w-140 flex-1 overflow-y-auto overscroll-contain px-5 pt-10 pb-24 sm:pt-12'>
				<Header
					activeCount={shoppingList.activeCount}
					totalCount={shoppingList.items.length}
					theme={theme}
					toggleTheme={toggleTheme}
				/>

				{shoppingList.items.length === 0 ? (
					<EmptyState />
				) : (
					<>
						<ShoppingList {...shoppingList} />

						<ListActions
							completedCount={shoppingList.completedCount}
							onDeleteCompleted={shoppingList.deleteCompleted}
							onDeleteAll={shoppingList.deleteAll}
							disabled={shoppingList.deletingIds.size > 0}
						/>
					</>
				)}
			</main>
			<AddItemForm onAdd={shoppingList.addItem} />
		</div>
	);
}

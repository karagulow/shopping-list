import {
	useEffect,
	useRef,
	useState,
	type SubmitEvent,
	type AnimationEvent,
} from 'react';
import { Check, Moon, Pencil, Plus, Sun, Trash2, X } from 'lucide-react';

type ShoppingItem = {
	id: string;
	title: string;
	completed: boolean;
};

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'shopping-list-items';
const THEME_KEY = 'shopping-list-theme';

function getInitialItems(): ShoppingItem[] {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		return saved ? JSON.parse(saved) : [];
	} catch {
		return [];
	}
}

function getInitialTheme(): Theme {
	try {
		return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
	} catch {
		return 'light';
	}
}

function getItemsWord(count: number) {
	const lastTwoDigits = count % 100;
	const lastDigit = count % 10;

	if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'покупок';
	if (lastDigit === 1) return 'покупка';
	if (lastDigit >= 2 && lastDigit <= 4) return 'покупки';

	return 'покупок';
}

export default function App() {
	const [items, setItems] = useState<ShoppingItem[]>(getInitialItems);
	const [theme, setTheme] = useState<Theme>(getInitialTheme);
	const [input, setInput] = useState('');
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingTitle, setEditingTitle] = useState('');
	const [deletingIds, setDeletingIds] = useState<Set<string>>(() => new Set());

	const editableRef = useRef<HTMLSpanElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	}, [items]);

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		localStorage.setItem(THEME_KEY, theme);
	}, [theme]);

	useEffect(() => {
		if (!editingId || !editableRef.current) return;

		const element = editableRef.current;
		element.focus();

		const range = document.createRange();
		const selection = window.getSelection();

		range.selectNodeContents(element);
		range.collapse(false);

		selection?.removeAllRanges();
		selection?.addRange(range);
	}, [editingId]);

	const completedCount = items.filter(item => item.completed).length;
	const activeCount = items.length - completedCount;

	function addItem(event: SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		const title = input.trim();

		if (!title) return;

		setItems(prev => [
			...prev,
			{
				id: crypto.randomUUID(),
				title,
				completed: false,
			},
		]);

		setInput('');
	}

	function toggleItem(id: string) {
		if (deletingIds.has(id)) return;

		setItems(prev =>
			prev.map(item =>
				item.id === id ? { ...item, completed: !item.completed } : item,
			),
		);
	}

	function deleteItem(id: string) {
		if (deletingIds.has(id)) return;

		setDeletingIds(prev => new Set(prev).add(id));
	}

	function deleteCompleted() {
		const idsToDelete = items
			.filter(item => item.completed && !deletingIds.has(item.id))
			.map(item => item.id);

		if (idsToDelete.length === 0) return;

		setDeletingIds(prev => new Set([...prev, ...idsToDelete]));
	}

	function deleteAll() {
		const idsToDelete = items
			.filter(item => !deletingIds.has(item.id))
			.map(item => item.id);

		if (idsToDelete.length === 0) return;

		setDeletingIds(prev => new Set([...prev, ...idsToDelete]));
	}

	function handleDeleteAnimationEnd(
		event: AnimationEvent<HTMLElement>,
		id: string,
	) {
		if (event.animationName !== 'delete-item') return;

		setItems(prev => prev.filter(item => item.id !== id));

		setDeletingIds(prev => {
			const next = new Set(prev);
			next.delete(id);
			return next;
		});

		if (editingId === id) {
			cancelEditing();
		}
	}

	function startEditing(item: ShoppingItem) {
		setEditingId(item.id);
		setEditingTitle(item.title);
	}

	function cancelEditing() {
		if (editingId) {
			const item = items.find(item => item.id === editingId);

			if (editableRef.current && item) {
				editableRef.current.textContent = item.title;
			}
		}

		setEditingId(null);
		setEditingTitle('');
	}

	function saveEditing(id: string) {
		const title = editingTitle.trim();

		if (!title) {
			cancelEditing();
			return;
		}

		setItems(prev =>
			prev.map(item => (item.id === id ? { ...item, title } : item)),
		);

		cancelEditing();
	}

	function toggleTheme() {
		setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
	}

	return (
		<div className='flex h-dvh min-h-0 flex-col overflow-hidden bg-background text-foreground transition-colors duration-200'>
			<main className='mx-auto min-h-0 w-full max-w-140 flex-1 overflow-y-auto overscroll-contain px-5 pt-10 pb-24 sm:pt-12'>
				<header className='mb-8 flex items-center justify-between'>
					<div>
						<h1 className='text-[27px] font-bold tracking-tight'>Покупки</h1>

						<p className='mt-1 text-sm text-muted'>
							{activeCount > 0
								? `${activeCount} ${getItemsWord(activeCount)} осталось`
								: items.length > 0
									? 'Всё куплено'
									: 'Ваш список покупок'}
						</p>
					</div>

					<button
						type='button'
						onClick={toggleTheme}
						aria-label='Сменить тему'
						className='grid size-10.5 place-items-center rounded-full border border-border bg-surface text-foreground transition-transform hover:scale-105'
					>
						{theme === 'light' ? <Moon size={19} /> : <Sun size={19} />}
					</button>
				</header>
				{items.length === 0 ? (
					<section className='flex animate-appear flex-col items-center px-5 pt-24 text-center'>
						<div className='mb-5 grid size-14.5 place-items-center rounded-[20px] bg-accent-soft text-accent'>
							<Check size={25} />
						</div>

						<h2 className='text-[18px] font-semibold'>Пока ничего нет</h2>

						<p className='mt-2 text-sm text-muted'>
							Добавьте продукты, которые нужно купить
						</p>
					</section>
				) : (
					<>
						<section className='flex flex-col'>
							{items.map(item => {
								const isDeleting = deletingIds.has(item.id);
								const isEditing = editingId === item.id;

								return (
									<article
										key={item.id}
										onAnimationEnd={event =>
											handleDeleteAnimationEnd(event, item.id)
										}
										className={`flex min-h-14.5 items-center gap-3.5 overflow-hidden border-b border-border ${
											isDeleting
												? 'animate-delete-item pointer-events-none'
												: 'animate-appear'
										}`}
									>
										<button
											type='button'
											onClick={() => toggleItem(item.id)}
											disabled={isDeleting || isEditing}
											aria-label={
												item.completed
													? 'Отметить как некупленное'
													: 'Отметить как купленное'
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
												setEditingTitle(event.currentTarget.textContent ?? '')
											}
											onKeyDown={event => {
												if (!isEditing) return;

												if (event.key === 'Enter') {
													event.preventDefault();
													saveEditing(item.id);
												}

												if (event.key === 'Escape') {
													event.preventDefault();
													cancelEditing();
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
														onClick={() => saveEditing(item.id)}
														aria-label='Сохранить'
														className='grid size-8.5 place-items-center rounded-xl text-accent transition-colors hover:bg-accent-soft'
													>
														<Check size={17} />
													</button>

													<button
														type='button'
														onClick={cancelEditing}
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
														onClick={() => startEditing(item)}
														disabled={isDeleting}
														aria-label='Редактировать'
														className='grid size-8.5 place-items-center rounded-xl text-muted transition-colors hover:bg-accent-soft hover:text-accent'
													>
														<Pencil size={16} />
													</button>

													<button
														type='button'
														onClick={() => deleteItem(item.id)}
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
							})}
						</section>

						<div className='ml-auto mt-5 flex items-center justify-end gap-4'>
							{completedCount > 0 && (
								<button
									type='button'
									onClick={deleteCompleted}
									disabled={deletingIds.size > 0}
									className='py-2 text-[13px] text-muted transition-colors hover:text-danger disabled:opacity-40'
								>
									Удалить купленные ({completedCount})
								</button>
							)}

							<button
								type='button'
								onClick={deleteAll}
								disabled={deletingIds.size > 0}
								className='py-2 text-[13px] text-danger transition-colors hover:opacity-70 disabled:opacity-40'
							>
								Удалить всё
							</button>
						</div>
					</>
				)}
			</main>
			<form
				onSubmit={addItem}
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
		</div>
	);
}

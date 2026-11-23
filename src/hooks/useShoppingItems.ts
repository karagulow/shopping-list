import { useEffect, useRef, useState } from 'react';

import type { ShoppingItem } from '../types/shopping-item';

const STORAGE_KEY = 'shopping-list-items';

function getInitialItems(): ShoppingItem[] {
	try {
		const saved = localStorage.getItem(STORAGE_KEY);
		return saved ? JSON.parse(saved) : [];
	} catch {
		return [];
	}
}

export function useShoppingItems() {
	const [items, setItems] = useState<ShoppingItem[]>(getInitialItems);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingTitle, setEditingTitle] = useState('');

	const editableRef = useRef<HTMLSpanElement>(null);
	const newItemIdRef = useRef<string | null>(null);

	useEffect(() => {
		const itemsToSave = items.filter(item => item.id !== newItemIdRef.current);

		localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsToSave));
	}, [items]);

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

	function addItem() {
		if (editingId) {
			if (newItemIdRef.current === editingId && !editingTitle.trim()) {
				cancelEditing();
			} else {
				saveEditing(editingId);
			}
		}

		const id = crypto.randomUUID();

		setItems(prev => [
			...prev,
			{
				id,
				title: '',
				completed: false,
			},
		]);

		newItemIdRef.current = id;
		setEditingId(id);
		setEditingTitle('');
	}

	function toggleItem(id: string) {
		setItems(prev =>
			prev.map(item =>
				item.id === id ? { ...item, completed: !item.completed } : item,
			),
		);
	}

	function deleteItem(id: string) {
		setItems(prev => prev.filter(item => item.id !== id));
	}

	function deleteCompleted() {
		setItems(prev => prev.filter(item => !item.completed));
	}

	function deleteAll() {
		setItems([]);
	}

	function startEditing(item: ShoppingItem) {
		if (editingId && editingId !== item.id) {
			if (newItemIdRef.current === editingId && !editingTitle.trim()) {
				cancelEditing();
			} else {
				saveEditing(editingId);
			}
		}

		setEditingId(item.id);
		setEditingTitle(item.title);
	}

	function cancelEditing() {
		if (!editingId) return;

		if (newItemIdRef.current === editingId) {
			setItems(prev => prev.filter(item => item.id !== editingId));
			newItemIdRef.current = null;
		} else {
			const item = items.find(item => item.id === editingId);

			if (editableRef.current && item) {
				editableRef.current.textContent = item.title;
			}
		}

		setEditingId(null);
		setEditingTitle('');
	}

	function saveEditing(id: string, addNext = false) {
		const title = editingTitle.trim();

		if (!title) {
			cancelEditing();
			return;
		}

		setItems(prev =>
			prev.map(item => (item.id === id ? { ...item, title } : item)),
		);

		newItemIdRef.current = null;
		setEditingId(null);
		setEditingTitle('');

		if (addNext) {
			addItem();
		}
	}

	return {
		items,
		newItemId: newItemIdRef.current,
		editingId,
		editingTitle,
		editableRef,
		completedCount,
		activeCount,
		addItem,
		toggleItem,
		deleteItem,
		deleteCompleted,
		deleteAll,
		startEditing,
		cancelEditing,
		saveEditing,
		setEditingTitle,
	};
}

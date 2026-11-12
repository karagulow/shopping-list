import React from 'react';

interface ListActionsProps {
	completedCount: number;
	onDeleteCompleted: () => void;
	onDeleteAll: () => void;
	disabled: boolean;
}

export const ListActions: React.FC<ListActionsProps> = ({
	completedCount,
	onDeleteCompleted,
	onDeleteAll,
	disabled,
}) => {
	return (
		<div className='ml-auto mt-5 flex items-center justify-end gap-4'>
			{completedCount > 0 && (
				<button
					type='button'
					onClick={onDeleteCompleted}
					disabled={disabled}
					className='py-2 text-[13px] text-muted transition-colors hover:text-danger disabled:opacity-40'
				>
					Удалить купленные ({completedCount})
				</button>
			)}

			<button
				type='button'
				onClick={onDeleteAll}
				disabled={disabled}
				className='py-2 text-[13px] text-danger transition-colors hover:opacity-70 disabled:opacity-40'
			>
				Удалить всё
			</button>
		</div>
	);
};

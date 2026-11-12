export function getItemsWord(count: number): string {
	const lastTwoDigits = count % 100;
	const lastDigit = count % 10;

	if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
		return 'покупок';
	}

	if (lastDigit === 1) {
		return 'покупка';
	}

	if (lastDigit >= 2 && lastDigit <= 4) {
		return 'покупки';
	}

	return 'покупок';
}

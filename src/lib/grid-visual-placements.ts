export type GridVisualPlacement = {
	colStart: number;
	colSpan: number;
	rowStart: number;
	rowSpan: number;
	variant: "tall" | "wide";
};

/** Add visual panel slots until a fixed-column grid has no empty cells on the last row(s). */
export function gridVisualPlacements(
	itemCount: number,
	cols: number,
): GridVisualPlacement[] {
	if (cols < 2 || itemCount < 1) return [];

	const placements: GridVisualPlacement[] = [];
	let count = itemCount;

	while (count % cols !== 0) {
		const rem = count % cols;
		if (rem === 1) {
			placements.push({
				colStart: 2,
				colSpan: cols - 1,
				rowStart: Math.ceil(count / cols),
				rowSpan: 1,
				variant: "wide",
			});
			count += cols - 1;
		} else {
			placements.push({
				colStart: cols,
				colSpan: 1,
				rowStart: Math.ceil((count - rem) / cols) + 1,
				rowSpan: 2,
				variant: "tall",
			});
			count += 1;
		}
	}

	return placements;
}

export function gridVisualSlotStyle(p: GridVisualPlacement): string {
	return `--gv-col: ${p.colStart}; --gv-row: ${p.rowStart}; --gv-row-span: ${p.rowSpan}; --gv-col-span: ${p.colSpan};`;
}

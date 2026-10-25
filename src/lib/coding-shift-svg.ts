/**
 * "Where the work goes" — two segmented bars of the same lifecycle.
 *
 * Row one is the hand-written era: Code is the widest step. Row two is
 * agentic engineering: Code is the narrowest step by a lot, and the steps
 * around it grew. One string, used inline on /about and served raw at
 * /visuals/coding-shift.svg so people can screenshot or download it.
 *
 * Widths are proportions of an engineer's attention, not measurements.
 */

type Step = {
	label: string;
	/** Second line inside the box; omitted when the box is too narrow. */
	note?: string;
	width: number;
	/** The step the visual is about. */
	focus?: boolean;
};

type Row = {
	eyebrow: string;
	title: string;
	steps: Step[];
	/** Caption pinned under the focus step. */
	focusCaption: string;
};

const WIDTH = 1200;
const HEIGHT = 580;
const PAD_X = 60;
const GAP = 8;
const BOX_H = 92;

const FONT_SANS =
	"'IBM Plex Sans', 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif";
const FONT_MONO =
	"'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const C = {
	bg: "#06080f",
	panel: "rgba(255,255,255,0.07)",
	white: "#f8fafc",
	slate300: "#cbd5e1",
	slate400: "#94a3b8",
	slate500: "#64748b",
	boxStroke: "rgba(148,163,184,0.38)",
	boxFill: "rgba(148,163,184,0.07)",
	emerald: "#6ee7b7",
	emerald200: "#a7f3d0",
	emeraldFill: "rgba(110,231,183,0.14)",
	violet: "#9d7bf5",
	violetFill: "rgba(157,123,245,0.10)",
	violetStroke: "rgba(157,123,245,0.45)",
};

// Both rows sum to the same box width so the bars line up edge to edge.
const rows: Row[] = [
	{
		eyebrow: "Before · software written by hand",
		title: "Coding was the job. Everything else was overhead around it.",
		steps: [
			{ label: "Define", width: 120 },
			{ label: "Design", width: 120 },
			{
				label: "Code",
				note: "hand-written, line by line",
				width: 460,
				focus: true,
			},
			{ label: "Test", width: 130 },
			{ label: "Deploy", width: 100 },
			{ label: "Operate", width: 110 },
		],
		focusCaption: "most of the engineer's week",
	},
	{
		eyebrow: "Now · agentic engineering",
		title:
			"Coding is the narrow step. Judgment moved to the boundaries around it.",
		steps: [
			{ label: "Define", note: "intent · constraints", width: 230 },
			{ label: "Design", note: "architecture · seams · data", width: 230 },
			{ label: "Code", width: 70, focus: true },
			{ label: "Test", note: "evidence, not green dots", width: 200 },
			{ label: "Deploy", note: "gates", width: 150 },
			{ label: "Operate", note: "observe · govern", width: 160 },
		],
		focusCaption: "agents write it",
	},
];

function esc(s: string): string {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderRow(row: Row, top: number, grownStroke: boolean): string {
	const parts: string[] = [];
	parts.push(
		`<text x="${PAD_X}" y="${top}" font-family="${FONT_MONO}" font-size="13" fill="${C.emerald200}" fill-opacity="0.85">${esc(row.eyebrow)}</text>`,
		`<text x="${PAD_X}" y="${top + 28}" font-family="${FONT_SANS}" font-size="20" font-weight="600" fill="${C.white}" letter-spacing="-0.01em">${esc(row.title)}</text>`,
	);
	const boxTop = top + 50;
	let x = PAD_X;
	for (const step of row.steps) {
		const cx = x + step.width / 2;
		const stroke = step.focus
			? C.emerald
			: grownStroke
				? C.violetStroke
				: C.boxStroke;
		const fill = step.focus
			? C.emeraldFill
			: grownStroke
				? C.violetFill
				: C.boxFill;
		parts.push(
			`<rect x="${x}" y="${boxTop}" width="${step.width}" height="${BOX_H}" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="${step.focus ? 1.5 : 1}"/>`,
		);
		const labelY = step.note ? boxTop + BOX_H / 2 - 4 : boxTop + BOX_H / 2 + 6;
		parts.push(
			`<text x="${cx}" y="${labelY}" text-anchor="middle" font-family="${FONT_SANS}" font-size="18" font-weight="${step.focus ? 700 : 500}" fill="${step.focus ? C.emerald200 : C.slate300}">${esc(step.label)}</text>`,
		);
		if (step.note) {
			parts.push(
				`<text x="${cx}" y="${labelY + 22}" text-anchor="middle" font-family="${FONT_MONO}" font-size="12" fill="${step.focus ? C.emerald200 : C.slate400}" fill-opacity="${step.focus ? 0.8 : 1}">${esc(step.note)}</text>`,
			);
		}
		if (step.focus) {
			parts.push(
				`<line x1="${cx}" y1="${boxTop + BOX_H}" x2="${cx}" y2="${boxTop + BOX_H + 14}" stroke="${C.emerald}" stroke-opacity="0.6" stroke-width="1"/>`,
				`<text x="${cx}" y="${boxTop + BOX_H + 32}" text-anchor="middle" font-family="${FONT_MONO}" font-size="12" fill="${C.emerald200}" fill-opacity="0.85">${esc(row.focusCaption)}</text>`,
			);
		}
		x += step.width + GAP;
	}
	return parts.join("\n");
}

export type CodingShiftSvgOptions = {
	/** Intrinsic pixel size for the downloadable file; omit for a fluid inline copy. */
	standalone?: boolean;
};

export function codingShiftSvg({
	standalone = false,
}: CodingShiftSvgOptions = {}): string {
	const title = "Where the work goes";
	const subtitle =
		"Same lifecycle, six steps. The width of each box is how much of an engineer's attention it takes.";

	const body = [
		`<rect width="${WIDTH}" height="${HEIGHT}" fill="${C.bg}"/>`,
		`<rect x="0.5" y="0.5" width="${WIDTH - 1}" height="${HEIGHT - 1}" fill="none" stroke="${C.panel}"/>`,
		// Header
		`<circle cx="${PAD_X + 4}" cy="46" r="4" fill="${C.emerald}"/>`,
		`<text x="${PAD_X + 18}" y="50" font-family="${FONT_MONO}" font-size="13" fill="${C.emerald200}" fill-opacity="0.9">Agentic engineering · the shift in one picture</text>`,
		`<text x="${PAD_X}" y="92" font-family="${FONT_SANS}" font-size="34" font-weight="700" fill="${C.white}" letter-spacing="-0.015em">${esc(title)}</text>`,
		`<text x="${PAD_X}" y="120" font-family="${FONT_SANS}" font-size="15" fill="${C.slate400}">${esc(subtitle)}</text>`,
		// Rows
		renderRow(rows[0], 176, false),
		renderRow(rows[1], 364, true),
		// Footer
		`<line x1="${PAD_X}" y1="${HEIGHT - 44}" x2="${WIDTH - PAD_X}" y2="${HEIGHT - 44}" stroke="${C.panel}"/>`,
		`<text x="${PAD_X}" y="${HEIGHT - 20}" font-family="${FONT_MONO}" font-size="12" fill="${C.slate500}">Widths show where judgment and hours go. They are not a measurement.</text>`,
		`<text x="${WIDTH - PAD_X}" y="${HEIGHT - 20}" text-anchor="end" font-family="${FONT_MONO}" font-size="12" fill="${C.slate400}">aadm.io/about</text>`,
	].join("\n");

	return [
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" ${standalone ? `width="${WIDTH}" height="${HEIGHT}"` : `width="100%"`} role="img" aria-labelledby="coding-shift-title coding-shift-desc">`,
		`<title id="coding-shift-title">${esc(title)}: coding was the widest step of the lifecycle, now it is the narrowest</title>`,
		`<desc id="coding-shift-desc">Two rows of the same six lifecycle steps: define, design, code, test, deploy, operate. In the hand-written era the Code box is by far the widest. In agentic engineering the Code box is by far the narrowest and Define, Design, Test, Deploy and Operate have grown.</desc>`,
		body,
		"</svg>",
	].join("\n");
}

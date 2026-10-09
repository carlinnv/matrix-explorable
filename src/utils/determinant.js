// Pure 2x2 matrix math for the determinant explorable.
// A matrix is represented as { a, b, c, d } for A = [[a, b], [c, d]].

// Spinner inputs are rounded in floating point (e.g. 0.20000000000000018),
// so products like ad - bc can land near, but not exactly on, zero.
export const ZERO_TOLERANCE = 1e-9;

export const IDENTITY = { a: 1, b: 0, c: 0, d: 1 };

// Second column (1, 0.5) is half the first column (2, 1), so
// det = 2 * 0.5 - 1 * 1 = 0 and the unit square collapses onto a line segment.
export const SINGULAR_PRESET = { a: 2, b: 1, c: 1, d: 0.5 };

export const UNIT_SQUARE = [
	[0, 0],
	[1, 0],
	[1, 1],
	[0, 1]
];

export function determinant({ a, b, c, d }) {
	return a * d - b * c;
}

export function isNearlyZero(x, tolerance = ZERO_TOLERANCE) {
	return Math.abs(x) < tolerance;
}

export function isSingular(matrix, tolerance = ZERO_TOLERANCE) {
	return isNearlyZero(determinant(matrix), tolerance);
}

// Area of the transformed unit square
export function transformedArea(matrix) {
	return Math.abs(determinant(matrix));
}

// Apply A to the point (x, y)
export function apply({ a, b, c, d }, [x, y]) {
	return [a * x + b * y, c * x + d * y];
}

// Images of (0,0), (1,0), (1,1), (0,1): (0,0), (a,c), (a+b,c+d), (b,d)
export function transformUnitSquare(matrix) {
	return UNIT_SQUARE.map((p) => apply(matrix, p));
}

// What the unit square becomes: "area" (a parallelogram), "line" or "point"
export function collapseKind(matrix, tolerance = ZERO_TOLERANCE) {
	if (!isSingular(matrix, tolerance)) return "area";

	const allZero = Object.values(matrix).every((x) => isNearlyZero(x, tolerance));
	return allZero ? "point" : "line";
}

// Multiply one column (0 = first, 1 = second) by k
export function scaleColumn({ a, b, c, d }, column, k) {
	return column === 0 ? { a: a * k, b, c: c * k, d } : { a, b: b * k, c, d: d * k };
}

// Swap the columns: same shape, mirrored, so the determinant changes sign
export function swapColumns({ a, b, c, d }) {
	return { a: b, b: a, c: d, d: c };
}

export function entriesInRange(matrix, min, max) {
	return Object.values(matrix).every((x) => x >= min - ZERO_TOLERANCE && x <= max + ZERO_TOLERANCE);
}

// The matrix inputs round every entry to this step, including values set by buttons
export const INPUT_STEP = 0.1;

function snap(x, step = INPUT_STEP) {
	return parseFloat((Math.round(x / step) * step).toFixed(6));
}

function gcd(x, y) {
	return y === 0 ? x : gcd(y, x % y);
}

// True when every entry is a multiple of `step`, so the inputs won't round it
export function onInputGrid(matrix, step = INPUT_STEP) {
	return Object.values(matrix).every((x) => isNearlyZero(x - snap(x, step), 1e-6));
}

// Collapse the current shape: keep the first column and move the second column
// onto the first column's line, at the grid point closest to where it was.
// The result is singular (det = 0) and stays on the input grid within ±limit.
export function flattenOntoFirstColumn(matrix, limit = 3, step = INPUT_STEP) {
	const { a, b, c, d } = matrix;
	const p = Math.round(a / step);
	const q = Math.round(c / step);

	// First column is zero: det is already 0
	if (p === 0 && q === 0) return { ...matrix };

	// Smallest grid step along the first column's line
	const g = gcd(Math.abs(p), Math.abs(q));
	const [ux, uy] = [p / g, q / g];

	// Second column's projection onto the first column, in units of that step
	const t = (a * b + c * d) / (a * a + c * c);
	const kMax = Math.floor(limit / (step * Math.max(Math.abs(ux), Math.abs(uy))) + 1e-9);
	const k = Math.min(Math.max(Math.round(t * g), -kMax), kMax);

	return { a, c, b: snap(k * ux * step), d: snap(k * uy * step) };
}

// Unit direction that a singular matrix squashes to zero (A·n = 0):
// every input on a line through u in this direction lands on A·u.
// Returns null for an invertible matrix.
export function nullDirection(matrix, tolerance = ZERO_TOLERANCE) {
	if (!isSingular(matrix, tolerance)) return null;

	const { a, b, c, d } = matrix;
	// n is perpendicular to every row of A: rotate a nonzero row by 90°
	const [x, y] = Math.hypot(a, b) > tolerance ? [-b, a] : Math.hypot(c, d) > tolerance ? [-d, c] : [1, 0];
	const len = Math.hypot(x, y);
	return [x / len, y / len];
}

// Half-width of a square plot that fits all points, never smaller than `min`
export function plotBound(points, min = 6.5) {
	const extent = Math.max(0, ...points.flat().map(Math.abs));
	return Math.max(min, Math.ceil(extent) + 0.5);
}

// Format for display: up to 2 decimals, no trailing zeros, no "-0"
export function formatNumber(x) {
	if (isNearlyZero(x)) return "0";
	return String(parseFloat(x.toFixed(2)));
}

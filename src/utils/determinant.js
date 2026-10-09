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

// Format for display: up to 2 decimals, no trailing zeros, no "-0"
export function formatNumber(x) {
	if (isNearlyZero(x)) return "0";
	return String(parseFloat(x.toFixed(2)));
}

import { writable } from "svelte/store";
import { IDENTITY } from "$utils/determinant.js";

// 2x2 matrix for the determinant explorable, kept separate from `endMatrix`
// so the original scroll narrative and this page never overwrite each other.
export const detMatrix = writable({ ...IDENTITY });

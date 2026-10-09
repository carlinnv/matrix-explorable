# The Matrix Arcade: Determinants & Invertibility

An extension of **The Matrix Arcade**, a visual explorable of matrices and linear transformations, that adds an interactive explainer on **why a matrix with a determinant of 0 is not invertible**.

**Live site:** [carlinnv.github.io/matrix-explorable](https://carlinnv.github.io/matrix-explorable/)
**Go straight to the determinant explainer:** [carlinnv.github.io/matrix-explorable/determinant/v4/](https://carlinnv.github.io/matrix-explorable/determinant/v4/)

## Credit

The original explorable, including its visual design, 3D scene and matrix-multiplication article, was created by **[Yi Zhe Ang](https://github.com/yizhe-ang)**.

- Original repository: [yizhe-ang/matrix-explorable](https://github.com/yizhe-ang/matrix-explorable)
- Original live article: [yizhe-ang.github.io/matrix-explorable](https://yizhe-ang.github.io/matrix-explorable/)
- Support the original creator: [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/U7U4NH69A)

Original demo: 
https://github.com/yizhe-ang/matrix-explorable/assets/17507891/2f0beee1-ddcf-4252-8247-c8a6b43b2168

The original was made with:
- The Pudding's [Svelte Starter Template](https://github.com/the-pudding/svelte-starter)
- [Threlte](https://threlte.xyz/)
- [Mathbox](https://github.com/unconed/mathbox)
- [GSAP](https://greensock.com/gsap/)

## What I added

A new scroll-driven page that builds the idea step by step, aimed at high school and early undergraduate students. It reuses the original's stack, styling and matrix input controls, and adds no new dependencies.

1. **Transform the unit square.** An editable 2×2 matrix A. The unit square and its basis vectors animate as A changes, and the area of the transformed shape updates live.
2. **The determinant measures area.** The determinant appears next to the area, without the formula, so students see the connection directly. Shortcuts stretch, shrink or flip a column to show the determinant doubling, halving or changing sign along with the area.
3. **When the determinant is zero.** A "Collapse it" button flattens the current matrix into one with determinant 0, so the square becomes a line segment.
4. **Two inputs, two outputs.** Side-by-side input and output grids follow two vectors, u and v, through an invertible matrix.
5. **Two inputs, one output.** After collapsing A, u and v land on the same output. From the output alone you can't tell which input it came from, so the information is lost and A can't be undone.
6. **Not every input collides.** Students drag v on and off a dashed line of inputs that share u's output. v snaps onto the line, and a "Why a line?" dropdown explains where the line comes from.
7. **Play around with it.** A sandbox where A, u and v are all editable, with a "Collapse it" button and an optional hint.

Other details:
- A toggle shows or hides the basis vectors and unit square on the input/output grids.
- The original explainer's footer now links to the determinant explainer.

### Versions

The project was developed iteratively, and every version stays online for comparison:

| Version | Link | Summary |
|---|---|---|
| V1 | [/determinant/](https://carlinnv.github.io/matrix-explorable/determinant/) | Single page: editable matrix, transformed unit square, determinant formula and area, a det = 0 preset |
| V2 | [/determinant/v2/](https://carlinnv.github.io/matrix-explorable/determinant/v2/) | Scroll-driven steps; determinant introduced through area; a determinant-vs-area chart |
| V3 | [/determinant/v3/](https://carlinnv.github.io/matrix-explorable/determinant/v3/) | Clearer layout and wording; "Collapse it" works from the current matrix |
| V4 (final) | [/determinant/v4/](https://carlinnv.github.io/matrix-explorable/determinant/v4/) | Adds the "losing information" sections, draggable vectors and the sandbox |

The development process, design decisions and testing notes are recorded in [DEVLOG.md](./DEVLOG.md), and the requirements in [SPEC.md](./SPEC.md).

## Running locally

```bash
npm install
npm run dev
```

Then open `http://localhost:5173/` for the original explainer, or `http://localhost:5173/determinant/v4/` for the determinant explainer.

To publish to GitHub Pages (served from the `docs/` folder on `main`):

```bash
npm run build
make github
```

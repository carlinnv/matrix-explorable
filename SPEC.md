# Matrix Explainer Modification — Implementation Specification

## 1. Project Overview

This project modifies an existing interactive matrix-vector multiplication explainer to help students develop an intuitive understanding of matrix invertibility.

The original explainer teaches matrix-vector multiplication and linear transformations through interactive visualizations. My modification will extend this approach to explain the relationship between:

- Linear transformations of the unit square
- The determinant of a 2×2 matrix (without explicitly defining the determinant equation, to provide a generalized explanation) 
- The area of the transformed unit square
- Matrix invertibility
- Information loss when a transformation is not invertible

My primary goal is to help students understand **why a matrix with a determinant of zero is not invertible** beyond just memorizing this as a fact.

The target audience is high school or undergrad college students who have a basic understanding of vectors and matrices but are still developing intuition about linear transformations.

## 2. Existing Codebase

The original project is available at:

https://github.com/yizhe-ang/matrix-explorable

Before implementing anything, (1) Examine the existing project structure. (2) Identify any frameworks, libraries, and visualization components that are being used. (3) Determine how the current visualization works. (4) Reuse existing functionality, frameworks, and libraries where they can be reused. (5) Avoid unnecessarily rewriting the original project. 

The new functionality should feel like a natural extension of the original explainer. The visual styling may be changed, but do not modify it unnecessarily. 

## 3. Core Learning Objectives

After interacting with the modified explainer, students should be able to:

1. Explain the relationship between the standard basis vectors and unit square. They should also know how a given 2x2 matrix transforms the unit square. 
2. Recognize that the absolute value of the determinant represents the area scaling factor of a linear transformation.
3. Explain what happens to the unit square when the determinant approaches zero.
4. Explain why a zero determinant means the transformation cannot be reversed.
5. Understand that a non-invertible transformation loses information because different input vectors can produce the same output.

The explainer should emphasize visual intuition over formal mathematical proofs.

## 4. Version 1 — Interactive Determinant Visualization

In the first working version, focus exclusively on the relationship between the determinant and the transformed unit square.

### 4.1 Interactive Coordinate Plane

Display a 2D coordinate plane. Show the x-axis, y-axis, and grid. The visualization should start off with the unit square (vertices at (1,0), (0,1), (1, 1), and (0,0)).

The original unit square should remain visible as a reference throughout the interaction. 

### 4.2 Editable Matrix

Provide an interactive 2×2 matrix:

A = [[a, b], [c, d]]

Users should be able to modify all four entries. Changes to the matrix should immediately update the visualization.

### 4.3 Unit Square Transformation

When the matrix changes, apply the transformation to each vertex of the unit square.

The transformed vertices should be:

- (0, 0)
- (a, c)
- (a+b, c+d)
- (b, d)

Display the resulting shape on the coordinate plane, but make sure to use visually distinct colors for the original square and the transformed shape.

The visualization should update smoothly when matrix values change, ideally using animation.

### 4.4 Determinant and Area

Display the determinant calculation: det(A) = ad − bc. Make sure to include the sign of the determinant. 

Also display: Transformed Area = |det(A)|

Both values should update automatically as users modify the matrix.

Include a short explanation that the determinant represents signed area scaling, whereas its absolute value gives the area of the transformed unit square.

### 4.5 Preset Transformations

Provide a preset button that produces a determinant of 0. This preset should automatically update the matrix and visualization. This present should visibly collapse the unit square into a line segment or point.

### 4.6 Guided Explanation

Include concise explanatory text near the visualization. The explanation should change based on the determinant:

**Nonzero determinant:** The transformed square has nonzero area, and the transformation is invertible.

**Zero determinant:** The unit square collapses into a line segment or point, and the transformation is NOT invertible.


### 4.7 Interaction Design

The interface should be easy to explore.

Requirements:

- Clearly labeled matrix inputs
- Visually distinguishable original and transformed shapes
- Readable determinant and area values
- Responsive layout
- Reset button
- Sensible coordinate bounds and scaling
- No clipping or broken interactions for supported matrix values

Use a small floating-point tolerance when determining whether the determinant is numerically zero.

## 5. Version 2 — Planned Substantive Revision

Do not implement Version 2 yet. Do not extend beyond the objectives and features of Version 1. 

After Version 1 is complete, I will evaluate its effectiveness and identify problems that need improvement.


## 6. Implementation Expectations

Please follow these guidelines:

1. Use the existing project's technology stack whenever practical.
2. Keep the code readable and maintainable.
3. Separate mathematical calculations from visualization logic where possible.
4. Avoid introducing unnecessary dependencies.
5. Preserve the original explainer's existing functionality unless changes are required. Do not change existing functionality without explicit permission.
6. Explain significant architectural decisions before implementing them.
7. Implement Version 1 incrementally, rather than making all changes at once.
8. Test mathematical correctness and visual behavior.
9. Document important implementation decisions and problems encountered.

## 7. Iteration and Documentation

This project is part of an assignment that requires documenting an iterative development process.

Please help preserve that process by:

- Keeping changes focused and incremental.
- Explaining which files are modified and why.
- Recording implementation decisions and tradeoffs.
- Identifying any bugs or limitations discovered during testing.
- Distinguishing the first working version from later revisions.
- Avoiding unrequested changes that would make it difficult to compare versions.

After completing Version 1, stop and provide:

1. A summary of the implemented features.
2. A list of modified files.
3. Instructions for running the application locally.
4. A description of tests performed and their results.
5. Known limitations or potential usability problems.
6. Suggestions for evaluating the first version.

Do not begin Version 2 until I explicitly request it.

## 8. Final Project Requirements

Eventually, the modified explainer must:

- Run correctly in a web browser.
- Be hosted in a GitHub repository.
- Be publicly accessible through GitHub Pages.
- Include a working first version and a substantive revision documented through screenshots and development notes.

For now, focus on producing a working, testable Version 1.

## 9. Final Version Revision

After playing around with the first iteration of the project (which resulted in versions 1, 2, and 3), I want to make a substantive revision. 

This revision will add these features: 

- a new section that describes invertibility in more depth; specifically what it means to "lose information" during a transformation
- two side by side grids showing two distinct input vectors and their outputs post-matrix-multiplication
- both vectors, post-transformation, should map to the same line
- this section should show exactly why matrices with determinant 0 are not invertible
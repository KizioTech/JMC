# Recurrence Relations Tutorial

This tutorial covers recurrence relations, their solutions, and applications in discrete mathematics.

## What is a Recurrence Relation?

A recurrence relation defines a sequence where each term is defined in terms of previous terms.

### Example
The Fibonacci sequence: $$F_n = F_{n-1} + F_{n-2}$$ with initial conditions $$F_0 = 0$$, $$F_1 = 1$$.

## Linear Homogeneous Recurrence Relations

A recurrence of the form $$a_n = c_1 a_{n-1} + c_2 a_{n-2} + \dots + c_k a_{n-k}$$

### Characteristic Equation
For $$a_n = c_1 a_{n-1} + c_2 a_{n-2}$$, the characteristic equation is $$r^2 - c_1 r - c_2 = 0$$

### Solution
The general solution is $$a_n = A r_1^n + B r_2^n$$ where r1, r2 are roots of the characteristic equation.

## Linear Non-Homogeneous Recurrence Relations

A recurrence of the form $$a_n = c_1 a_{n-1} + c_2 a_{n-2} + \dots + c_k a_{n-k} + f(n)$$

### Particular Solution
Find a particular solution based on the form of f(n), then add to homogeneous solution.

## Solving Recurrence Relations

### Method 1: Iteration
Unwind the recurrence until a pattern emerges.

### Method 2: Characteristic Roots
For linear homogeneous recurrences.

### Method 3: Generating Functions
Use generating functions to solve recurrences.

## Applications

- Algorithm analysis (e.g., divide and conquer)
- Population growth models
- Financial mathematics
- Computer science (dynamic programming)

This is a placeholder tutorial. Content to be expanded later.
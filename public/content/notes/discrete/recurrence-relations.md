# DISCRETE MATHEMATICS WITH APPLICATIONS

Discrete Mathematics is the branch of mathematics that focuses on countable and distinct objects rather than continuous ones. It has applications in various fields, including computer science, cryptography, logic, and more.

> Definition: Key Concepts
>
> Discrete mathematics deals with concepts like:
>
> - Sets and relations
> - Functions and graphs
> - Combinatorics (counting and arranging objects)
> - Logic and proofs
> - Algorithms and complexity

---
# Chapter 3: Recurrence Relations

**Key Concepts**

Recurrence relations are equations that define sequences based on rules giving the next term as a function of previous terms. Key methods for solving include:

- Iteration Method
- Root Method
- Generating Function Method

## Formulation of Recurrence Relations

**Definition**

A recurrence relation defines a sequence where each term depends on previous terms. The simplest form is $a_n = f(a_{n-1})$ where the current term depends on the immediately previous term.

> Example: Permutations
>
> How many ways can $n$ distinct items be placed in $n$ distinct positions?
>
> **Solution:**

Let $P(n)$ = number of ways to arrange $n$ items in $n$ positions

For the last position, we have $n$ choices

After placing one item, we have $P(n-1)$ ways for remaining items

Therefore: $P(n) = n \cdot P(n-1)$ with $P(1) = 1$

Solution: $P(n) = n!$

> Example: Tower of Hanoi
>
> Find the minimum number of moves to transfer $n$ discs from rod A to rod C via rod B, where larger discs cannot be placed on smaller ones.
>
> **Solution:**

Let $H(n)$ = minimum moves for $n$ discs

To move $n$ discs:

1. Move top $n-1$ discs to intermediate rod: $H(n-1)$ moves
2. Move largest disc to destination: 1 move
3. Move $n-1$ discs from intermediate to destination: $H(n-1)$ moves

Therefore: $H(n) = 2H(n-1) + 1$ with $H(1) = 1$

Solution: $H(n) = 2^n - 1$

> Example: Binary Sequences
>
> Find the number of $n$-bit binary sequences with no two consecutive 0s.
>
> **Solution:**

Let $a_n$ = number of valid $n$-bit sequences

Case 1: Sequence ends with 1 → first $n-1$ bits form valid sequence of length $n-1$

Case 2: Sequence ends with 0 → previous bit must be 1, so first $n-2$ bits form valid sequence

Therefore: $a_n = a_{n-1} + a_{n-2}$ with $a_1 = 2, a_2 = 3$

This gives the Fibonacci-like sequence: 2, 3, 5, 8, 13, ...

## Iteration Method

**Iteration Method**

Solve recurrence relations by repeatedly applying the recurrence relation until a pattern emerges.

> Example: Solving $a_n = 3a_{n-1}$
>
> Solve $a_n = 3a_{n-1}$ with $a_0 = 1$.
>
> **Solution:**

$$a_1 = 3a_0 = 3 \cdot 1 = 3$$

$$a_2 = 3a_1 = 3 \cdot 3 = 3^2$$

$$a_3 = 3a_2 = 3 \cdot 3^2 = 3^3$$

Pattern: $a_n = 3^n$

> Example: Tower of Hanoi Solution
>
> Solve $H(n) = 2H(n-1) + 1$ with $H(1) = 1$.
>
> **Solution:**

$$H(1) = 1$$

$$H(2) = 2 \cdot 1 + 1 = 3$$

$$H(3) = 2 \cdot 3 + 1 = 7$$

$$H(4) = 2 \cdot 7 + 1 = 15$$

Pattern: $H(n) = 2^n - 1$

## Root Method

**Root Method**

For homogeneous linear recurrence relations of the form $a_n = c_1a_{n-1} + c_2a_{n-2} + \cdots + c_ka_{n-k}$, assume solution $a_n = r^n$ and solve the characteristic equation.

**Homogeneous Linear Recurrence**

An equation of the form $a_n = c_1a_{n-1} + c_2a_{n-2} + \cdots + c_ka_{n-k}$ where all coefficients are constants.

> Example: Fibonacci Sequence
>
> Solve $F_n = F_{n-1} + F_{n-2}$ with $F_0 = 0, F_1 = 1$.
>
> **Solution:**

Assume $F_n = r^n$, then $r^n = r^{n-1} + r^{n-2}$

Divide by $r^{n-2}$: $r^2 = r + 1$

Characteristic equation: $r^2 - r - 1 = 0$

Solutions: $r = \frac{1 \pm \sqrt{5}}{2}$

Let $\phi = \frac{1 + \sqrt{5}}{2}, \psi = \frac{1 - \sqrt{5}}{2}$

General solution: $F_n = A\phi^n + B\psi^n$

Using initial conditions: $A = \frac{1}{\sqrt{5}}, B = -\frac{1}{\sqrt{5}}$

Therefore: $F_n = \frac{1}{\sqrt{5}}(\phi^n - \psi^n)$

**Theorem (Distinct Roots)**

If the characteristic equation $r^k - c_1r^{k-1} - c_2r^{k-2} - \cdots - c_k = 0$ has $k$ distinct roots $r_1, r_2, \ldots, r_k$, then the general solution is:

$$a_n = A_1r_1^n + A_2r_2^n + \cdots + A_kr_k^n$$

**Theorem (Repeated Roots)**

If root $r$ has multiplicity $m$, then the corresponding terms in the general solution are:

$$(A_1 + A_2n + A_3n^2 + \cdots + A_mn^{m-1})r^n$$

> Example: Repeated Roots
>
> Solve $a_n = 4a_{n-1} - 4a_{n-2}$ with $a_0 = 1, a_1 = 3$.
>
> **Solution:**

Characteristic equation: $r^2 - 4r + 4 = 0$

$(r - 2)^2 = 0$ → double root $r = 2$

General solution: $a_n = (A + Bn)2^n$

Using initial conditions:

$$a_0 = A = 1$$

$$a_1 = 2A + 2B = 3 \rightarrow B = \frac{1}{2}$$

Therefore: $a_n = (1 + \frac{n}{2})2^n = 2^n + n \cdot 2^{n-1}$

## Generating Function Method

**Generating Function**

For sequence $\{a_n\}$, the generating function is $G(x) = \sum_{n=0}^{\infty} a_n x^n$.

> Example: Fibonacci Generating Function
>
> Find the generating function for $F_n = F_{n-1} + F_{n-2}$ with $F_0 = 0, F_1 = 1$.
>
> **Solution:**

Let $G(x) = \sum_{n=0}^{\infty} F_n x^n$

From recurrence: $F_n = F_{n-1} + F_{n-2}$ for $n \geq 2$

Multiply by $x^n$ and sum:

$$\sum_{n=2}^{\infty} F_n x^n = \sum_{n=2}^{\infty} F_{n-1} x^n + \sum_{n=2}^{\infty} F_{n-2} x^n$$

$$G(x) - F_0 - F_1 x = x \sum_{n=2}^{\infty} F_{n-1} x^{n-1} + x^2 \sum_{n=2}^{\infty} F_{n-2} x^{n-2}$$

$$G(x) - x = x(G(x) - F_0) + x^2 G(x)$$

$$G(x) - x = xG(x) + x^2G(x)$$

$$G(x)(1 - x - x^2) = x$$

$$G(x) = \frac{x}{1 - x - x^2}$$

**Theorem (Coefficient Extraction)**

If $G(x) = \sum_{n=0}^{\infty} a_n x^n$, then $a_n = \frac{1}{n!} G^{(n)}(0)$, where $G^{(n)}(0)$ is the $n$-th derivative of $G(x)$ evaluated at $x = 0$.

> Example: Coloring Problem
>
> How many ways can one color $n$ squares using 3 colors (black, blue, white) such that white appears at least once?
>
> **Solution:**

Total colorings without restriction: $3^n$

Colorings without white: $2^n$

Colorings with white at least once: $3^n - 2^n$

Using generating functions:

Black: $1 + x + x^2 + \cdots = \frac{1}{1-x}$

Blue: $1 + x + x^2 + \cdots = \frac{1}{1-x}$

White (at least once): $x + x^2 + x^3 + \cdots = \frac{x}{1-x}$

Combined: $\frac{1}{1-x} \cdot \frac{1}{1-x} \cdot \frac{x}{1-x} = \frac{x}{(1-x)^3}$

Coefficient of $x^n$: $\binom{n+2}{2}$ when $n \geq 1$

## Practice Activities

**Activity 3a**

a. A rectangle is formed from joining $1 \times 1$ squares. How many ways can one cover a $2 \times n$ rectangle with $1 \times 2$ tiles?
b. Find sequences of $n$ digits from $\{0, 1, 2\}$ with no consecutive identical digits.
c. Prove that $b_n = 2b_{n-1}$ for sequences of $n$ binary digits.
d. Show derangement formula: $D_n = (n-1)(D_{n-1} + D_{n-2})$.
e. Bacteria doubles every second. Formulate recurrence for half-bottle filling time.

**Activity 3b**

a. Solve $a_n = 5a_{n-1} - 6a_{n-2}$ with $a_0 = 1, a_1 = 0$
b. Find solution to $f(n) = 2f(n-1) + 1$ with $f(0) = 1$
c. Solve $a_n = 6a_{n-1} - 9a_{n-2}$ with $a_0 = 1, a_1 = 6$
d. Use iteration for $T(n) = 2T(n-1) + n$ with $T(1) = 1$
e. Find solution to $a_n = a_{n-1} + 2a_{n-2}$

**Activity 3c**

a. Solve $B_n - 8B_{n-1} + 16B_{n-2} = 0$ with $B_0 = 2, B_1 = 20$
b. Find solution to $A_m = 6A_{m-1} - 9A_{m-2}$ with $A_0 = 1, A_2 = 2$
c. Solve $a_n = 5a_{n-1} - 6a_{n-2}$ with given initial conditions
d. Find Fibonacci sequence solution: $C_k = 2C_{k-1} - C_{k-2}$ with $C_0 = 0, C_1 = 1$
e. Solve $a_n = 4a_{n-1} - 4a_{n-2}$ with appropriate conditions

**Activity 3d**

a. Find derivatives of generating functions and their coefficients
b. Apply generating function to solve $a_k - 5a_{k-1} = 0$ with $a_0 = 1$
c. Rewrite recurrence relations using generating function notation
d. Color 10 rectangular blocks with 2 colors, color 1 appears at least twice
e. Use generating functions to solve $B_n - B_{n-1} - 2B_{n-2} = 0$
f. Color $n$ squares of chessboard with black, red, white under various constraints

---

## REFERENCES

Levin O. (2019). Discrete Mathematics: An open Introduction, 3rd Edition. University of Northern Colorado. http://math.oscarlevin.com/

Keller M. T. & Trotter W. T. (2023). Applied Combinatorics. Libre Texts

Susanna S. Epp. (2010). Discrete Mathematics with Applications, 4th Edition. Brooks/Cole. DePaul University

Rosen K. H. (2019). Discrete Mathematics with Applications, 8th Edition. McGraw Hill

Hammack R. (n.d). Elements of Discrete Mathematics. Virginia Commonwealth University

Levin O. (2023). Discrete Mathematics. University of Northern Colorado. Libre Texts.
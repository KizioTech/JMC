# Solving Quadratic Equations

## Introduction

Quadratic equations are polynomial equations of the form $ax^2 + bx + c = 0$, where $a \neq 0$. These equations appear frequently in mathematics, physics, engineering, and many other fields. This guide covers the main methods for solving quadratic equations: factoring, completing the square, and the quadratic formula.

## Standard Form

A quadratic equation is written in standard form as:
$$ax^2 + bx + c = 0$$

Where:
- $a$ is the coefficient of $x^2$ (leading coefficient)
- $b$ is the coefficient of $x$
- $c$ is the constant term

## Methods of Solution

### 1. Factoring

If the quadratic equation can be factored, we can solve it by setting each factor equal to zero.

**Example:** Solve $x^2 + 5x + 6 = 0$

First, factor the quadratic:
$(x + 2)(x + 3) = 0$

Set each factor equal to zero:
$x + 2 = 0$ → $x = -2$
$x + 3 = 0$ → $x = -3$

Solutions: $x = -2, -3$

### 2. Completing the Square

This method involves rewriting the quadratic in vertex form.

**Example:** Solve $x^2 + 6x - 7 = 0$

Move constant to the right:
$x^2 + 6x = 7$

Complete the square by adding $(b/2)^2 = (6/2)^2 = 9$ to both sides:
$x^2 + 6x + 9 = 7 + 9$
$(x + 3)^2 = 16$

Take square root:
$x + 3 = \pm 4$
$x = -3 \pm 4$

Solutions: $x = 1, x = -7$

### 3. Quadratic Formula

The quadratic formula provides a general solution for any quadratic equation:
$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

**Example:** Solve $2x^2 - 5x + 2 = 0$

Here, $a = 2$, $b = -5$, $c = 2$

First, calculate the discriminant:
$d = b^2 - 4ac = (-5)^2 - 4(2)(2) = 25 - 16 = 9$

Then apply the formula:
$x = \frac{-(-5) \pm \sqrt{9}}{2(2)} = \frac{5 \pm 3}{4}$

Solutions: $x = \frac{8}{4} = 2$, $x = \frac{2}{4} = \frac{1}{2}$

## The Discriminant

The discriminant $d = b^2 - 4ac$ determines the nature of the solutions:

- If $d > 0$: Two distinct real solutions
- If $d = 0$: One repeated real solution
- If $d < 0$: Two complex solutions

## Applications

Quadratic equations model many real-world phenomena:

1. **Projectile motion**: The height of a projectile follows a quadratic equation
2. **Area problems**: Finding dimensions given area
3. **Optimization**: Maximizing or minimizing quadratic functions
4. **Physics**: Position as a function of time under constant acceleration

## Practice Problems

1. Solve: $x^2 - 7x + 12 = 0$
2. Solve: $3x^2 + 2x - 1 = 0$
3. Solve: $x^2 + 4x + 4 = 0$
4. Find the roots of $2x^2 - 8x + 6 = 0$

## Solutions

1. $(x - 3)(x - 4) = 0$ → $x = 3, 4$
2. $x = \frac{-2 \pm \sqrt{4 + 12}}{6} = \frac{-2 \pm \sqrt{16}}{6} = \frac{-2 \pm 4}{6}$ → $x = \frac{1}{3}, x = -1$
3. $(x + 2)^2 = 0$ → $x = -2$ (repeated root)
4. $d = 64 - 48 = 16$ → $x = \frac{8 \pm 4}{4}$ → $x = 3, x = 1$
# Solving Quadratic Equations - Interactive Tutorial

## Introduction to Quadratic Equations

A quadratic equation is a polynomial equation of degree 2, typically written in the form:

$$ax² + bx + c = 0$$

where $a$, $b$, and $c$ are constants and $a ≠ 0$.

## Methods of Solving Quadratic Equations

### 1. Factoring Method

When possible, factor the equation into the product of two binomials:
- $(x + p)(x + q) = 0$
- Then $x = -p$ or $x = -q$

**Example Problem:**
Solve: $x² + 5x + 6 = 0$

:::question
**Question 1:** Can you factor $x² + 5x + 6$? What are the factors?
:::

:::solution
**Solution:**
Look for two numbers that multiply to 6 and add to 5. The numbers are 2 and 3.

$(x + 2)(x + 3) = 0$

Therefore, $x = -2$ or $x = -3$
:::

### 2. Quadratic Formula

For any quadratic equation $ax² + bx + c = 0$, the solutions are:

$$x = \frac{-b \pm \sqrt{b² - 4ac}}{2a}$$

**Example Problem:**
Solve: $2x² - 7x + 3 = 0$

:::question
**Question 2:** Use the quadratic formula to solve $2x² - 7x + 3 = 0$. Show your work.
:::

:::solution
**Solution:**
First, identify the coefficients:
- $a = 2$
- $b = -7$
- $c = 3$

Plug into the quadratic formula:

$$x = \frac{-(-7) \pm \sqrt{(-7)² - 4(2)(3)}}{2(2)}$$

$$x = \frac{7 \pm \sqrt{49 - 24}}{4}$$

$$x = \frac{7 \pm \sqrt{25}}{4}$$

$$x = \frac{7 \pm 5}{4}$$

Therefore:
- $x = \frac{12}{4} = 3$
- $x = \frac{2}{4} = \frac{1}{2}$
:::

## Practice Problems

:::question
**Question 3:** Solve $x² + 6x + 9 = 0$ using factoring.
:::

:::solution
**Solution:**
$x² + 6x + 9 = (x + 3)(x + 3) = (x + 3)² = 0$

$x + 3 = 0$
$x = -3$

(Discriminant = 0, so one repeated root)
:::

:::question
**Question 4:** Solve $2x² - x - 6 = 0$ using the quadratic formula.
:::

:::solution
**Solution:**
$a = 2$, $b = -1$, $c = -6$

$$x = \frac{-(-1) \pm \sqrt{(-1)² - 4(2)(-6)}}{2(2)}$$

$$x = \frac{1 \pm \sqrt{1 + 48}}{4}$$

$$x = \frac{1 \pm \sqrt{49}}{4}$$

$$x = \frac{1 \pm 7}{4}$$

- $x = \frac{8}{4} = 2$
- $x = \frac{-6}{4} = -\frac{3}{2}$
:::

:::question
**Question 5:** Solve $x² - 4 = 0$ by taking square roots.
:::

:::solution
**Solution:**
$x² - 4 = 0$
$x² = 4$
$x = \pm \sqrt{4}$
$x = \pm 2$
:::

## Key Concepts Summary

- Every quadratic equation has exactly two solutions (which may be equal)
- The discriminant $(b² - 4ac)$ determines the nature of roots:
  - Positive: Two distinct real roots
  - Zero: One repeated real root
  - Negative: Two complex roots
- If a quadratic can be factored, that's usually the fastest method
- The quadratic formula works for all quadratic equations

## Next Steps

Great job completing this tutorial! Try the [Matrix Operations Tutorial](../linear-algebra/matrices.md) next.
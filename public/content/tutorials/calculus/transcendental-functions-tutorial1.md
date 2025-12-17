# Calculus II - Transcendental Functions Tutorial

## Introduction to Transcendental Functions

Transcendental functions are a class of functions that are not algebraic, meaning they cannot be expressed as a finite combination of algebraic operations. These functions are essential in calculus and have many applications in various fields.

The basic exponential function is written as:

$$y = e^x$$

where $e$ is the base of the natural logarithm. In this tutorial, we'll explore several types of transcendental functions:

- Exponential Functions
- Logarithmic Functions
- Inverse Trigonometric Functions
- Reduction Formulas
- Hyperbolic Functions

**Key Point:** Transcendental functions are essential in calculus and have many applications in various fields.

---

## Exponential and Logarithmic Functions

Exponential functions are of the form $y = e^x$, where $e$ is the base of the natural logarithm. Logarithmic functions are the inverses of exponential functions, of the form $y = \ln(x)$.

**Key Point:** Exponential functions are essential in calculus and have many applications in various fields. Logarithmic functions are the inverses of exponential functions, of the form $y = \ln(x)$.

### Logarithmic Differentiation

Logarithmic differentiation is a technique used to differentiate functions that are expressed as powers of other functions. It is particularly useful when the function is a product or quotient of two or more functions, or when the function is a power of a function.

The technique involves taking the natural logarithm of both sides of the equation and then differentiating both sides with respect to the variable. This allows us to avoid using the product rule or quotient rule, which can be complex and time-consuming.

**Steps for logarithmic differentiation:**
1. Take the natural logarithm of both sides of the equation.
2. Differentiate both sides with respect to the variable.

:::question
Differentiate the function $y = x^x$ with respect to $x$.
:::

:::solution
**Solution:**

Since both the base and the exponent involve the variable $x$, we use logarithmic differentiation.

1. **Take the natural logarithm of both sides:**
   $$\ln y = \ln(x^x)$$

2. **Apply the logarithm property $\ln(a^b) = b \ln a$:**
   $$\ln y = x \ln x$$

3. **Differentiate both sides with respect to $x$:**
   The left side, $\ln y$, requires implicit differentiation. The right side, $x \ln x$, requires the product rule, where $(uv)' = u'v + uv'$. Let $u=x$ and $v=\ln x$.
   
   $$\frac{d}{dx}(\ln y) = \frac{d}{dx}(x \ln x)$$
   
   $$\frac{1}{y} \cdot \frac{dy}{dx} = (1) \cdot \ln x + x \cdot \frac{1}{x}$$
   
   $$\frac{1}{y} \frac{dy}{dx} = \ln x + 1$$

4. **Solve for $\frac{dy}{dx}$:**
   $$\frac{dy}{dx} = y (\ln x + 1)$$

5. **Substitute $y=x^x$:**
   $$\therefore \frac{dy}{dx} = x^x (\ln x + 1)$$
:::

:::question
Find $\displaystyle \frac{dy}{dx}$ if $y = \ln(x^2 + 1)^{\sin x}$.
:::

:::solution
**Solution:**

1. **Take the natural logarithm:**
   $$\ln y = \sin x \cdot \ln(x^2 + 1)$$

2. **Differentiate both sides:**
   $$\frac{1}{y} \frac{dy}{dx} = \cos x \cdot \ln(x^2 + 1) + \sin x \cdot \frac{2x}{x^2 + 1}$$

3. **Multiply by $y$ and substitute:**
   $$\therefore \frac{dy}{dx} = (x^2 + 1)^{\sin x} \left[ \cos x \cdot \ln(x^2 + 1) + \sin x \cdot \frac{2x}{x^2 + 1} \right]$$
:::

:::question
Differentiate the function $y = (x^2 + 1)^{\tan x}$ with respect to $x$.
:::

:::solution
**Solution:**

1. **Take the natural logarithm:**
   $$\ln y = \tan x \cdot \ln(x^2 + 1)$$

2. **Differentiate both sides:**
   $$\frac{1}{y} \frac{dy}{dx} = \sec^2 x \cdot \ln(x^2 + 1) + \tan x \cdot \frac{2x}{x^2 + 1}$$

3. **Multiply by $y$ and substitute:**
   $$\therefore \frac{dy}{dx} = (x^2 + 1)^{\tan x} \left[ \sec^2 x \cdot \ln(x^2 + 1) + \tan x \cdot \frac{2x}{x^2 + 1} \right]$$
:::

:::question
Find $\displaystyle \frac{dy}{dx}$ if $y = \frac{(x^2 + 3)^5}{(2x - 1)^4}$.
:::

:::solution
**Solution:**

1. **Take the natural logarithm:**
   $$\ln y = 5 \ln(x^2 + 3) - 4 \ln(2x - 1)$$

2. **Differentiate both sides:**
   $$\frac{1}{y} \frac{dy}{dx} = 5 \cdot \frac{2x}{x^2 + 3} - 4 \cdot \frac{2}{2x - 1}$$

3. **Multiply by $y$:**
   $$\frac{dy}{dx} = \frac{(x^2 + 3)^5}{(2x - 1)^4} \left( \frac{10x}{x^2 + 3} - \frac{8}{2x - 1} \right)$$
:::

:::question
Differentiate $y = x^2 \sqrt{x+1} \, e^{3x}$ with respect to $x$.
:::

:::solution
**Solution:**

1. **Take the natural logarithm:**
   $$\ln y = 2\ln x + \frac{1}{2}\ln(x+1) + 3x$$

2. **Differentiate both sides:**
   $$\frac{1}{y} \frac{dy}{dx} = \frac{2}{x} + \frac{1}{2(x+1)} + 3$$

3. **Multiply by $y$:**
   $$\therefore \frac{dy}{dx} = x^2 \sqrt{x+1} \, e^{3x} \left( \frac{2}{x} + \frac{1}{2(x+1)} + 3 \right)$$
:::

### Logarithmic Integration

Logarithmic integration is a technique used to evaluate integrals that involve logarithmic functions. It is particularly useful when dealing with integrals of the form $\int \frac{f(x)}{g(x)} \, dx$.

:::question
Evaluate the integral $\displaystyle \int \frac{1}{x} \, dx$.
:::

:::solution
**Solution:**

Using the property of logarithmic integration:
$$\int \frac{1}{x} \, dx = \ln |x| + C$$
:::

:::question
Evaluate the integral $\displaystyle \int \frac{2x}{x^2 + 1} \, dx$.
:::

:::solution
**Solution:**

Let $u = x^2 + 1$, so $du = 2x\,dx$.
$$\int \frac{2x}{x^2 + 1} \, dx = \int \frac{1}{u} \, du = \ln|u| + C = \ln|x^2 + 1| + C$$
:::

:::question
Evaluate the integral $\displaystyle \int \frac{1}{3x+2} \, dx$.
:::

:::solution
**Solution:**

Let $u = 3x + 2$, so $du = 3\,dx$, $dx = \frac{du}{3}$.
$$\int \frac{1}{3x+2} \, dx = \int \frac{1}{u} \cdot \frac{du}{3} = \frac{1}{3} \ln|u| + C = \frac{1}{3} \ln|3x+2| + C$$
:::

:::question
Evaluate the integral $\displaystyle \int \frac{5}{2x-7} \, dx$.
:::

:::solution
**Solution:**

Let $u = 2x - 7$, so $du = 2\,dx$, $dx = \frac{du}{2}$.
$$\int \frac{5}{2x-7} \, dx = 5 \int \frac{1}{u} \cdot \frac{du}{2} = \frac{5}{2} \ln|u| + C = \frac{5}{2} \ln|2x-7| + C$$
:::

:::question
Evaluate the integral $\displaystyle \int \frac{1}{x^2-4} \, dx$.
:::

:::solution
**Solution:**

1. **Factor denominator:** $x^2-4 = (x-2)(x+2)$. Use partial fractions:
   $$\frac{1}{x^2-4} = \frac{A}{x-2} + \frac{B}{x+2}$$

2. **Solve for $A$ and $B$:**
   $$1 = A(x+2) + B(x-2)$$

3. **Let $x=2$:** $1 = A(4) \implies A = \frac{1}{4}$

4. **Let $x=-2$:** $1 = B(-4) \implies B = -\frac{1}{4}$

5. **Integrate:**
   $$\int \frac{1}{x^2-4} dx = \frac{1}{4} \ln|x-2| - \frac{1}{4} \ln|x+2| + C$$
:::

---

## Inverse Trigonometric Functions

Inverse trigonometric functions are the inverse functions of the trigonometric functions. They are used to find the angle when the sine, cosine, or tangent of an angle is known.

- Mathematically, the six basic trigonometric functions do not have inverses because their graphs repeat periodically and do not pass the horizontal line test.
- However, inverses of trigonometric functions are widely used in finding angles that are associated with specific ratios. These inverses usually give angles in the range $-\frac{\pi}{2}\leq\theta\leq\frac{\pi}{2}$.

For example:
$$\sin x = \frac{1}{2} \quad \Rightarrow \quad x = \sin^{-1} \frac{1}{2}= 30°$$

### Derivatives of Inverse Trigonometric Functions

The derivatives of inverse trigonometric functions are important in calculus and have various applications in mathematics and physics.

:::question
Find $\displaystyle \frac{d}{dx} \arcsin(2x)$.
:::

:::solution
**Solution:**

Let $y = \arcsin(2x)$. By the chain rule:
$$\frac{dy}{dx} = \frac{1}{\sqrt{1-(2x)^2}} \cdot 2 = \frac{2}{\sqrt{1-4x^2}}$$
:::

:::question
Differentiate $y = x \arctan x$ with respect to $x$.
:::

:::solution
**Solution:**

Use the product rule:
$$\frac{dy}{dx} = \arctan x + x \cdot \frac{1}{1+x^2}$$

So:
$$\frac{dy}{dx} = \arctan x + \frac{x}{1+x^2}$$
:::

:::question
Find $\displaystyle \frac{d}{dx} \arccos(\sqrt{x})$ for $0 < x < 1$.
:::

:::solution
**Solution:**

Let $y = \arccos(\sqrt{x})$. By the chain rule:
$$\frac{dy}{dx} = -\frac{1}{\sqrt{1-(\sqrt{x})^2}} \cdot \frac{1}{2\sqrt{x}} = -\frac{1}{2\sqrt{x}\sqrt{1-x}}$$
:::

:::question
Differentiate $y = \arctan\left(\frac{1}{x}\right)$ for $x > 0$.
:::

:::solution
**Solution:**

Let $y = \arctan\left(\frac{1}{x}\right)$. By the chain rule:
$$\frac{dy}{dx} = \frac{1}{1+\left(\frac{1}{x}\right)^2} \cdot \left(-\frac{1}{x^2}\right) = \frac{-1}{x^2 + 1}$$
:::

:::question
Find $\displaystyle \frac{d}{dx} \left[ x^2 \arcsin x \right]$.
:::

:::solution
**Solution:**

Use the product rule:
$$\frac{d}{dx} \left[ x^2 \arcsin x \right] = 2x \arcsin x + x^2 \cdot \frac{1}{\sqrt{1-x^2}}$$
:::

### Integrals Involving Inverse Trigonometric Functions

The integrals involving inverse trigonometric functions arise from a wide range of complicated rational functions that are difficult to integrate using other elementary methods.

:::question
Evaluate the integral $\displaystyle \int \frac{1}{\sqrt{1-x^2}} \, dx$.
:::

:::solution
**Solution:**

This is a standard integral involving the inverse sine function:
$$\int \frac{1}{\sqrt{1-x^2}} \, dx = \arcsin x + C$$
:::

:::question
Evaluate the integral $\displaystyle \int \frac{1}{1+x^2} \, dx$.
:::

:::solution
**Solution:**

This is a standard integral involving the inverse tangent function:
$$\int \frac{1}{1+x^2} \, dx = \arctan x + C$$
:::

:::question
Evaluate the integral $\displaystyle \int \frac{1}{|x|\sqrt{x^2-1}} \, dx$ for $|x|>1$.
:::

:::solution
**Solution:**

This is a standard integral involving the inverse secant function:
$$\int \frac{1}{|x|\sqrt{x^2-1}} \, dx = \text{arcsec} |x| + C$$
:::

:::question
Evaluate the integral $\displaystyle \int \frac{2}{4 + x^2} \, dx$.
:::

:::solution
**Solution:**

Rewrite $4 + x^2 = 2^2 + x^2$ and use the formula $\int \frac{1}{a^2 + x^2} dx = \frac{1}{a} \arctan\left(\frac{x}{a}\right) + C$:
$$\int \frac{2}{4 + x^2} dx = 2 \cdot \frac{1}{2} \arctan\left(\frac{x}{2}\right) + C = \arctan\left(\frac{x}{2}\right) + C$$
:::

:::question
Evaluate the integral $\displaystyle \int_0^{1/2} \frac{1}{\sqrt{1-x^2}} \, dx$.
:::

:::solution
**Solution:**

The antiderivative is $\arcsin x$. Thus:
$$\int_0^{1/2} \frac{1}{\sqrt{1-x^2}} dx = \arcsin\left(\frac{1}{2}\right) - \arcsin(0) = \frac{\pi}{6} - 0 = \frac{\pi}{6}$$
:::

:::question
Evaluate the integral $\displaystyle \int \frac{1}{\sqrt{9 - x^2}} \, dx$.
:::

:::solution
**Solution:**

Let $a = 3$, so use $\int \frac{1}{\sqrt{a^2 - x^2}} dx = \arcsin\left(\frac{x}{a}\right) + C$:
$$\int \frac{1}{\sqrt{9 - x^2}} dx = \arcsin\left(\frac{x}{3}\right) + C$$
:::

:::question
Evaluate the integral $\displaystyle \int \frac{1}{x^2 + 6x + 10} \, dx$.
:::

:::solution
**Solution:**

Complete the square: $x^2 + 6x + 10 = (x+3)^2 + 1$.
$$\int \frac{1}{(x+3)^2 + 1} dx = \arctan(x+3) + C$$
:::

:::question
Evaluate the integral $\displaystyle \int \frac{1}{\sqrt{4x - x^2}} \, dx$ for $0 < x < 4$.
:::

:::solution
**Solution:**

Complete the square: $4x - x^2 = -(x^2 - 4x) = -(x^2 - 4x + 4 - 4) = -[(x-2)^2 - 4] = 4 - (x-2)^2$.
$$\int \frac{1}{\sqrt{4x - x^2}} dx = \arcsin\left(\frac{x-2}{2}\right) + C$$
:::

:::question
Evaluate the integral $\displaystyle \int \frac{1}{x^2 - 4x + 5} \, dx$.
:::

:::solution
**Solution:**

Complete the square: $x^2 - 4x + 5 = (x-2)^2 + 1$.
$$\int \frac{1}{(x-2)^2 + 1} dx = \arctan(x-2) + C$$
:::

:::question
Evaluate the definite integral $\displaystyle \int_0^1 \frac{1}{1 + x^2} \, dx$.
:::

:::solution
**Solution:**

The antiderivative is $\arctan x$:
$$\int_0^1 \frac{1}{1 + x^2} dx = \arctan(1) - \arctan(0) = \frac{\pi}{4} - 0 = \frac{\pi}{4}$$
:::

---

## Summary

In this tutorial, we covered the main methods for solving transcendental equations:

**Key Takeaways:**
- **Logarithmic Differentiation:** Essential technique for differentiating complex exponential and power functions
- **Logarithmic Integration:** Useful for integrating rational functions using substitution and partial fractions
- **Inverse Trigonometric Functions:** Critical for finding angles and solving integrals involving radicals and quadratics
- **Derivatives and Integrals:** Understanding the relationship between inverse trigonometric functions and their derivatives/integrals

Practice these methods with different types of transcendental equations to build your confidence and fluency.
# CALCULUS II - TRANSCENDENTAL FUNCTIONS

Transcendental functions are mathematical functions that are not algebraic, meaning they cannot be expressed as roots of polynomial equations with finite degree. Common examples include exponential, logarithmic, trigonometric, and hyperbolic functions.

## Key Concepts

Transcendental functions in calculus include:

- Exponential functions ($f(x) = a^x$)
- Logarithmic functions ($f(x) = \log_a x$)
- Trigonometric functions ($\sin x$, $\cos x$, etc.)
- Hyperbolic functions ($\sinh x$, $\cosh x$, etc.)

---

# Chapter 3: Hyperbolic Functions

## Introduction

- Hyperbolic functions are a special case of exponential functions.
- These functions are formed by taking the combination of mainly two exponential functions; $e^x$ and $e^{-x}$
- The hyperbolic function of sine, denoted as sinh $x$, and the hyperbolic function of cosine, denoted cosh $x$, are defined by:

$$\sinh x = \frac{e^x - e^{-x}}{2} \quad \text{and} \quad \cosh x = \frac{e^x + e^{-x}}{2}$$

where $x$ is a real number.

- sinh $x$ is read as "cinch $x$" or "the hyperbolic sine of $x$" and cosh $x$ is read as "kosh $x$" or "the hyperbolic cosine of $x$"

From the definitions of sinh $x$ and cosh $x$, we can deduce the following hyperbolic functions:

The terms "tanh," "sech," and "csch" are pronounced "tanch," "seech," and "coseech," respectively.

$$
\begin{aligned}
\sinh x &= \frac{e^x - e^{-x}}{2} \\[6pt]
\text{csch}\, x &= \frac{1}{\sinh x}
               = \frac{2}{e^x - e^{-x}} \\[6pt]
\cosh x &= \frac{e^x + e^{-x}}{2} \\[6pt]
\text{sech}\, x &= \frac{1}{\cosh x}
               = \frac{2}{e^x + e^{-x}} \\[6pt]
\tanh x &= \frac{\sinh x}{\cosh x}
        = \frac{e^x - e^{-x}}{e^x + e^{-x}} \\[6pt]
\coth x &= \frac{1}{\tanh x}
        = \frac{e^x + e^{-x}}{e^x - e^{-x}}
\end{aligned}
$$


## Identities of Hyperbolic Functions

The identities of hyperbolic functions are similar to those of trigonometric functions in many forms as shown below:

$$
\begin{aligned}
\sinh(-x) &= -\sinh x \\[6pt]
\cosh(-x) &= \cosh x \\[6pt]

\cosh^2 x - \sinh^2 x &= 1 \\[6pt]
\tanh^2 x + \text{sech}^2 x &= 1 \\[6pt]
\coth^2 x - \text{csch}^2 x &= 1 \\[10pt]

\sinh(x+y) &= \sinh x \cosh y + \cosh x \sinh y \\[6pt]
\cosh(x+y) &= \cosh x \cosh y + \sinh x \sinh y \\[6pt]

\sinh(x-y) &= \sinh x \cosh y - \cosh x \sinh y \\[6pt]
\cosh(x-y) &= \cosh x \cosh y - \sinh x \sinh y \\[10pt]

\sinh 2x &= 2\sinh x \cosh x \\[6pt]
\cosh 2x &= \cosh^2 x + \sinh^2 x \\[10pt]
\sinh^2 x &= \tfrac{1}{2}(\cosh 2x - 1) \\[6pt]
\cosh^2 x &= \tfrac{1}{2}(\cosh 2x + 1)
\end{aligned}
$$


> Example
>
> Prove that $\cosh^2 x - \sinh^2 x = 1$.
>
> **Solution:**

Since we know that $\sinh x = \frac{e^x - e^{-x}}{2}$ and $\cosh x = \frac{e^x + e^{-x}}{2}$,

$$
\begin{aligned}
\cosh^2 x - \sinh^2 x
&= \left(\frac{e^x + e^{-x}}{2}\right)^2
   - \left(\frac{e^x - e^{-x}}{2}\right)^2 \\[6pt]
&= \frac{e^{2x} + 2e^x e^{-x} + e^{-2x}}{4}
   - \frac{e^{2x} - 2e^x e^{-x} + e^{-2x}}{4} \\[6pt]
&= \frac{e^{2x} + 2 + e^{-2x}}{4}
   - \frac{e^{2x} - 2 + e^{-2x}}{4} \\[6pt]
&= \frac{e^{2x} + 2 + e^{-2x} - e^{2x} + 2 - e^{-2x}}{4} \\[6pt]
&= \frac{4}{4} \\[6pt]
&= 1
\end{aligned}
$$

## Derivatives of Hyperbolic Functions

Derivatives of hyperbolic functions can be obtained by expressing the functions in terms of $e^x$ and $e^{-x}$. After this, differentiating these combinations provides the respective derivatives.

For example, consider:

$$
\begin{aligned}
\frac{d}{dx}\cosh x
&= \frac{d}{dx}\left(\frac{e^x + e^{-x}}{2}\right) \\[6pt]
&= \frac{1}{2} \times \frac{d}{dx}(e^x + e^{-x})
= \frac{1}{2}(e^x - e^{-x}) \\[6pt]
&= \frac{e^x - e^{-x}}{2}
= \sinh x
\end{aligned}
$$


And consider:

$$
\begin{aligned}
\frac{d}{dx}\sinh x
&= \frac{d}{dx}\left(\frac{e^x - e^{-x}}{2}\right) \\[6pt]
&= \frac{1}{2} \times \frac{d}{dx}(e^x - e^{-x})
= \frac{1}{2}(e^x + e^{-x}) \\[6pt]
&= \frac{e^x + e^{-x}}{2}
= \cosh x
\end{aligned}
$$


For tanh $x$, the following approach will be used:

Since $\tanh x = \frac{\sinh x}{\cosh x}$, we will use the logarithmic differentiation or quotient rule. In this example, we will use logarithmic differentiation.

Let $y = \frac{\sinh x}{\cosh x}$, thus, $\ln y = \ln\left(\frac{\sinh x}{\cosh x}\right) = \ln \sinh x - \ln \cosh x$.

Since $(\ln u)' = \frac{u'}{u}$, we have:

$$
\begin{aligned}
\frac{y'}{y}
&= \frac{\cosh x}{\sinh x} - \frac{\sinh x}{\cosh x} \\[6pt]
&= \frac{\cosh^2 x - \sinh^2 x}{\sinh x \cosh x} \\[6pt]
&= \frac{1}{\sinh x \cosh x}
\end{aligned}
$$

Multiply by $y$ both sides:

$$
\begin{aligned}
y'
&= \frac{1}{\sinh x \cosh x} \times y \\[6pt]
&= \frac{1}{\sinh x \cosh x}
   \times \frac{\sinh x}{\cosh x} \\[6pt]
&= \frac{1}{\cosh^2 x}
= \text{sech}^2 x
\end{aligned}
$$


Below is the summary of all the derivatives of the hyperbolic functions:
$$
\begin{aligned}
1.\;& \frac{d}{dx}\sinh u
= \cosh u \times \frac{du}{dx} \\[6pt]

2.\;& \frac{d}{dx}\cosh u
= \sinh u \times \frac{du}{dx} \\[6pt]

3.\;& \frac{d}{dx}\tanh u
= \text{sech}^2 u \times \frac{du}{dx} \\[6pt]

4.\;& \frac{d}{dx}\coth u
= -\text{csch}^2 u \times \frac{du}{dx} \\[6pt]

5.\;& \frac{d}{dx}\text{sech } u
= -\text{sech } u \tanh u \times \frac{du}{dx} \\[6pt]

6.\;& \frac{d}{dx}\text{csch } u
= -\text{csch } u \coth u \times \frac{du}{dx}
\end{aligned}
$$

> Example
>
> Find $f'(x)$ if $f(x) = \cosh(x^2 - 1)$.
>
> **Solution:**

Let $u = x^2 - 1$, $\frac{du}{dx} = 2x$

Since $f(x) = \cosh u$ and $\frac{d}{dx}\cosh u = \sinh u \times \frac{du}{dx}$;

$$f'(x) = \sinh u \times 2x = 2x \sinh u$$

After substituting $u$ back,

$$f'(x) = 2x \sinh(x^2 - 1)$$

## Integrals of Hyperbolic Functions

The integration formulas that correspond to the differentiation above are as follows:

$$
\begin{aligned}
\int \sinh u \, du &= \cosh u + c \\[6pt]
\int \cosh u \, du &= \sinh u + c \\[6pt]
\int \text{sech}^2 u \, du &= \tanh u + c \\[6pt]
\int \text{csch}^2 u \, du &= -\coth u + c \\[6pt]
\int \text{sech } u \tanh u \, du &= -\text{sech } u + c \\[6pt]
\int \text{csch } u \coth u \, du &= -\text{csch } u + c
\end{aligned}
$$

> Example
>
> Evaluate $\int x^2 \sinh(x^3) \, dx$.
>
> **Solution:**

Let $u = x^3$, $dx = \frac{du}{3x^2}$

$$\int x^2 \sinh(x^3) \, dx = \int x^2 \sinh u \times \frac{du}{3x^2}$$

$$\int \frac{1}{3}\sinh u \, du = \frac{1}{3}\int \sinh u \, du = \frac{1}{3}\cosh u + c$$

$$\therefore \int x^2 \sinh(x^3) \, dx = \frac{1}{3}\cosh(x^3) + c$$

**Practice Questions**

Evaluate the following:

1. $\frac{d}{dx}\sinh(x^2 + 1)$

2. $\frac{d}{dx}\arctan(\tanh x)$

3. $\frac{d}{dx}(e^{3x}\text{sech } x)$

4. $\frac{d}{dx}\ln(\sinh 2x)$

5. $\int \tanh^2 3x \text{ sech}^2 3x \, dx$

6. $\int e^{\sinh x}\text{sech } x \, dx$

7. $\int \frac{\text{sech}^2 x}{1 - 2\tanh x} \, dx$

8. $\int \frac{\cosh(\ln x)}{x} \, dx$

Find $y'$ if $x^2 \tanh y = \ln y$

## Inverse Hyperbolic Functions

The inverses of hyperbolic functions are expressed in terms of natural logarithms. This is so because as we all know from the other parts of this session, we tend to express the hyperbolic functions as a combination of exponential functions $e^x$ and $e^{-x}$.

For example, below are the log forms for $\sinh^{-1} x$, $\cosh^{-1} x$ and $\tanh^{-1} x$:

- $\sinh^{-1} x = \ln(x + \sqrt{x^2 + 1})$, $x \in \mathbb{R}$

- $\cosh^{-1} x = \ln(x + \sqrt{x^2 - 1})$, $x \geq 1$

- $\tanh^{-1} x = \frac{1}{2}\ln\left(\frac{1 + x}{1 - x}\right)$, $-1 < x < 1$

### Derivation of $\sinh^{-1} x$

Given $y = \sinh^{-1} x$; $x = \sinh y = \frac{e^y - e^{-y}}{2}$. Multiply RHS by $\frac{e^y}{e^y}$

$$x = \frac{e^y - e^{-y}}{2} \times \frac{e^y}{e^y} = \frac{e^{2y} - 1}{2e^y}$$

Multiply by $2e^y$ both sides:

$$2xe^y = e^{2y} - 1$$

$$e^{2y} - 2xe^y - 1 = 0$$

Using the quadratic formula:

$$e^y = \frac{-(-2x) \pm \sqrt{(2x)^2 - 4(1)(-1)}}{2(1)} = \frac{2x \pm \sqrt{4x^2 + 4}}{2}$$

$$e^y = \frac{2x \pm 2\sqrt{x^2 + 1}}{2} = x \pm \sqrt{x^2 + 1} = x + \sqrt{x^2 + 1}$$

(since $e^y$ is always positive.)

Therefore, $y = \ln(x + \sqrt{x^2 + 1})$ when you take natural logs both sides.

Using a similar process to the one above, we can find all the other inverse hyperbolic functions in natural logarithmic form.

## Derivatives of Inverse Hyperbolic Functions

Differentiating the inverse hyperbolic functions might be done through two different ways:

1. Using the natural logarithmic forms of the inverse hyperbolic functions. Differentiating these expressions will give the derivative of their respective inverse hyperbolic functions.

2. Using implicit differentiation to differentiate the function part of the hyperbolic functions. After applying a series of identities, find the derivatives of the respective hyperbolic functions.

### Method 1: Implicit Differentiation

For example; given $y = \sinh^{-1} x$; we know that $x = \sinh y$. Using implicit differentiation,

$$1 = \cosh y \times \frac{dy}{dx}$$

thus, $\frac{dy}{dx} = \frac{1}{\cosh y}$

But $\cosh^2 y - \sinh^2 y = 1$, $\cosh^2 y = 1 + \sinh^2 y$ and $\cosh y = \sqrt{1 + \sinh^2 y}$

$$\frac{dy}{dx} = \frac{1}{\sqrt{1 + \sinh^2 y}}$$

But $\sinh y = x$

Therefore:

$$\frac{d}{dx}\sinh^{-1} x = \frac{1}{\sqrt{1 + x^2}}$$

### Method 2: Using Logarithmic Form

On the same question using logarithms, we know that, if $y = \sinh^{-1} x$, then $y = \ln(x + \sqrt{x^2 + 1})$. Using Chain rule, let $u = x + \sqrt{x^2 + 1}$.

$$\frac{du}{dx} = 1 + \frac{2x}{2\sqrt{x^2 + 1}} = 1 + \frac{x}{\sqrt{x^2 + 1}}$$

and $y = \ln u$, thus, $\frac{dy}{du} = \frac{1}{u}$

Hence:

$$
\begin{aligned}
\frac{dy}{dx} &= \frac{1}{u} \times \left(1 + \frac{x}{\sqrt{x^2 + 1}}\right)\\
&= \frac{1}{x + \sqrt{x^2 + 1}} \times \left(1 + \frac{x}{\sqrt{x^2 + 1}}\right)\\
&= \frac{1}{x + \sqrt{x^2 + 1}} \times \frac{\sqrt{x^2 + 1} + x}{\sqrt{x^2 + 1}}\\
&= \frac{1}{\sqrt{x^2 + 1}}
\end{aligned}
$$

Since addition is commutative, $x^2 + 1 = 1 + x^2$;

Therefore:

$$\frac{d}{dx}\sinh^{-1} x = \frac{1}{\sqrt{1 + x^2}}$$

Here is the summary of all the derivatives involving inverse hyperbolic functions:

$$
\begin{aligned}
\frac{d}{dx}\sinh^{-1} u &= \frac{1}{\sqrt{1 + u^2}}\frac{du}{dx}\\
\frac{d}{dx}\text{csch}^{-1} u &= -\frac{1}{|u|\sqrt{1 + u^2}}\frac{du}{dx}; \quad u \neq 0\\
\frac{d}{dx}\cosh^{-1} u &= \frac{1}{\sqrt{u^2 - 1}}\frac{du}{dx}; \quad u > 1\\
\frac{d}{dx}\text{sech}^{-1} u &= -\frac{1}{u\sqrt{1 - u^2}}\frac{du}{dx}; \quad 0 < u < 1\\
\frac{d}{dx}\tanh^{-1} u &= \frac{1}{1 - u^2}\frac{du}{dx}; \quad |u| < 1\\
\frac{d}{dx}\coth^{-1} u &= \frac{1}{1 - u^2}\frac{du}{dx}; \quad |u| > 1
\end{aligned}
$$

> Example
>
> Find $\frac{dy}{dx}$ if $y = \sinh^{-1}(\tan x)$.
>
> **Solution:**

Let $u = \tan x$; $\frac{du}{dx} = \sec^2 x$

$$\frac{dy}{du} = \frac{d}{du}\sinh^{-1} u = \frac{1}{\sqrt{1 + u^2}}$$

Since, $\frac{dy}{dx} = \frac{dy}{du} \times \frac{du}{dx}$;

$$\frac{dy}{dx} = \frac{1}{\sqrt{1 + u^2}} \times \sec^2 x = \frac{\sec^2 x}{\sqrt{1 + \tan^2 x}}$$

But $1 + \tan^2 x = \sec^2 x$;

$$\frac{dy}{dx} = \frac{\sec^2 x}{\sec x}$$

Therefore:

$$\frac{d}{dx}\sinh^{-1}(\tan x) = \sec x$$

**Practice Questions:**

Differentiate the following with respect to $x$:

a) $\sinh^{-1}(5x)$
b) $\tanh^{-1}(x)$
c) $\sinh^{-1}(e^x)$
d) $\tanh^{-1}(\sin 3x)$
e) $\ln(\cosh^{-1}(4x))$
f) $\cosh^{-1}(\ln 4x)$

## Integrals of Inverse Hyperbolic Functions

Below are some of the integrals that result into inverse hyperbolic functions:

1. $\int \frac{1}{\sqrt{u^2 + a^2}} \, du = \sinh^{-1}\left(\frac{u}{a}\right) + c$, $a > 0$

2. $\int \frac{1}{\sqrt{u^2 - a^2}} \, du = \cosh^{-1}\left(\frac{u}{a}\right) + c$, $u > a > 0$

3. $\int \frac{1}{a^2 - u^2} \, du = \frac{1}{a}\tanh^{-1}\left(\frac{u}{a}\right) + c$, $a > 0$, $|u| < a$

4. $\int \frac{1}{u\sqrt{a^2 - u^2}} \, du = \frac{1}{a}\text{sech}^{-1}\left(\frac{u}{a}\right) + c$, $a > 0$, $0 < u < a$

> Example
>
> Evaluate $\int \frac{1}{9x^2 + 25} \, dx$
>
> **Solution:**

$$\int \frac{1}{9x^2 + 25} \, dx = \int \frac{1}{25\left(\frac{9x^2}{25} + 1\right)} \, dx = \int \frac{1}{5\sqrt{\frac{9x^2}{25} + 1}} \, dx$$

Let $u = \frac{3x}{5}$, $du = \frac{3}{5}dx$; thus, $dx = \frac{5}{3}du$.

$$\int \frac{1}{5\sqrt{u^2 + 1}} \times \frac{5}{3} \, du &= \int \frac{1}{3\sqrt{u^2 + 1}} \, du\\
&= \frac{1}{3}\int \frac{1}{\sqrt{u^2 + 1}} \, du\\
&= \frac{1}{3}\sinh^{-1}(u) + c
\end{aligned}
$$

Therefore:

$$\int \frac{1}{9x^2 + 25} \, dx = \frac{1}{3}\sinh^{-1}\left(\frac{3x}{5}\right) + c$$

> Example
>
> Evaluate $\int \frac{e^x}{\sqrt{16 - e^{2x}}} \, dx$
>
> **Solution:**

$$\int \frac{e^x}{\sqrt{16 - e^{2x}}} \, dx = \int \frac{e^x}{\sqrt{16\left(1 - \frac{e^{2x}}{16}\right)}} \, dx$$

Let $u = \frac{e^x}{4}$; $du = \frac{e^x}{4}dx$ and $dx = \frac{4du}{e^x}$

$$= \int \frac{e^x}{\sqrt{16(1 - u^2)}} \times \frac{4du}{e^x} = \int \frac{1}{4\sqrt{1 - u^2}} \, du$$

$$= \frac{1}{4}\tanh^{-1}(u) + c$$

Therefore:

$$\int \frac{e^x}{\sqrt{16 - e^{2x}}} \, dx = \frac{1}{4}\tanh^{-1}\left(\frac{e^x}{4}\right) + c$$

**Practice Questions**

Evaluate the following integrals:

a) $\int \frac{1}{\sqrt{16x^2 - 9}} \, dx$

b) $\int \frac{\sin x}{1 + \cos^2 x} \, dx$

c) $\int \frac{1}{x\sqrt{9 - x^4}} \, dx$

d) $\int \frac{e^{2x}}{\sqrt{5 - e^{2x}}} \, dx$

---

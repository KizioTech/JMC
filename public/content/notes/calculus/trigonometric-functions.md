# CALCULUS II - TRANSCENDENTAL FUNCTIONS

Transcendental functions are mathematical functions that are not algebraic, meaning they cannot be expressed as roots of polynomial equations with finite degree. Common examples include exponential, logarithmic, trigonometric, and hyperbolic functions.

### Key Concepts

Transcendental functions in calculus include:

- Exponential functions ($f(x) = a^x$)
- Logarithmic functions ($f(x) = \log_a x$)
- Trigonometric functions ($\sin x$, $\cos x$, etc.)
- Hyperbolic functions ($\sinh x$, $\cosh x$, etc.)

---

# Chapter 2: Trigonometric Functions

## Introduction

Trigonometric functions are fundamental in calculus, particularly in integration and differentiation. They include sine, cosine, tangent, and their inverses. They also include their reciprocals namely Cosecant, secant and cotangent, in that order, and their inverses too. These functions are periodic and have unique properties that make them essential for solving various mathematical problems.

The derivatives and integrals of these six basic trigonometric functions were discussed in previous module called Introduction to Calculus. In this chapter, we will look at the derivatives and integrals of the inverse trigonometric functions, powers of trigonometric functions, products of multiple angles, and trigonometric substitutions.

## Inverse Trigonometric Functions

Mathematically, the six basic trigonometric functions do not have inverses because their graphs repeat periodically and do not pass the horizontal line test.

However, inverses of trigonometric functions are widely used in finding angles that are associated with specific ratios. These inverses usually give angles which are in the range $-\frac{\pi}{2}\leq\theta\leq\frac{\pi}{2}$. For example, consider:

$$
\sin x = \frac{1}{2}\text{;} \quad x = \sin^{-1} \frac{1}{2}= 30^\circ
$$

## Derivatives of Inverse Trigonometric Functions

When differentiating these functions, careful attention has to be taken to avoid confusing them with normal function as their behaviour is not even the same with the inverses of other functions.

To derive the derivatives of inverse functions, we will use the formula for finding derivatives of general functions. Thus if $f(x) \text{ and } g(x)$ are inverses of each other, then

$$
\boxed{g'(x)=\frac{1}{f'(g(x))}} 
$$

And always remember from inverse function that, two functions $f(x) \text{ and } g(x)$ are inverses if and only if $f(g(x))=g(f(x))=x$.

In this section, we will derive the derivatives of the inverses for all the six trigonometric functions.

Before we start diving into the derivations, it might be important to note that the inverses are written in two forms, that is, $\sin^{-1} x$ can also be written as $\arcsin x$.

### The Derivative of $y=\sin^{-1} x$

From previous knowledge, we know that if $y=\sin^{-1}x$, then $x=\sin y$. Since these two functions are inverses of each other, their derivative will follow **Inverse Derivative**. Thus,

$$
\frac{d}{dx}(\sin^{-1}x)= \frac{dy}{dx}=\frac{1}{\cos y}=\frac{1}{\cos (\sin^{-1}x )}
$$

To solve for the equivalence of $\cos(\sin^{-1}x)$, we can use a lot of methods. One of the methods is transforming the question into a triangle. Since $\cos y = x$, we can also write this as $\cos y = \frac{x}{1}$. Using **SOHCAHTOA**, $x$ is the **opposite** side and $1$ is the **hypotenuse** to angle $y$ of a right-angled triangle. Consider the figure below,

![inverse sine diagram](/assets/images/invsine.svg)

$$
\boxed{\cos (\sin^{-1}x)= \sqrt{1-x^2}}
$$

Here, the third side, $\sqrt{1-x^2}$, has been found by using the Pythagoras theorem. Therefore,

$$
\boxed{\frac{d}{dx}(\arcsin x)=\frac{1}{\sqrt{1-x^2}}}
$$

Another method to find the same result is to use implicit differentiation and trigonometric identities.

$$
\text{Given } y = \sin^{-1} x \text{ then, } x= \sin y
$$

If you differentiate $x=\sin y$ implicitly,

$$
1=\cos y \times\frac{dy}{dx} \quad \text{ and } \quad \frac{dy}{dx}=\frac{1}{\cos y}
$$

Using $\cos^2 y +\sin^2 y= 1$, we know that $\cos^2 y = 1- \sin^2 y$ and $\cos y =\sqrt{1-\sin^2 y}$. Thus,

$$
\frac{dy}{dx} = \frac{1}{\sqrt{1-\sin^2y}}
$$

Since $\sin y = x$, $\sin^2 y = x^2$, so $\sqrt{1-\sin^2 y}=\sqrt{1-x^2}$. After substitution,

$$
\frac{d}{dx}(\arcsin x)=\frac{1}{\sqrt{1-x^2}}
$$

### The Derivative of $y=\cos^{-1} x$

Using the inverse derivative equation,

$$
\frac{d}{dx}(\cos^{-1}x)= \frac{dy}{dx}=-\frac{1}{\sin y}=-\frac{1}{\sin (\cos^{-1}x )}
$$

For $\cos y = x$, let $x$ be the adjacent side and $1$ be the hypotenuse. Consider the figure below:

![inverse cosine diagram](/assets/images/invcos.svg)

$$
\boxed{\sin (\cos^{-1}x)=\sqrt{1-x^2}}
$$

Therefore, if we substitute this third side we get the final derivative of $\arccos$ as follows:

$$
\boxed{\frac{d}{dx}(\arccos x)=-\frac{1}{\sqrt{1-x^2}}}
$$

Using identities:

$$
\text{Given } y =\cos^{-1} x \text{, then } x=\cos y
$$

$$
1 = -\sin y \times \frac{dy}{dx} \text{ and } \frac{dy}{dx} = -\frac{1}{\sin y}
$$

But $\sin^2 y + \cos ^2 y = 1$, hence, $\sin y= \sqrt{1-\cos^2 y}$ and $\sin y = \sqrt{1-x^2}$ because it has been shown from the question that when $y = \cos^{-1}x$, $x=\cos y$.

$$
\begin{aligned}
&-\frac{1}{\sin y}=-\frac{1}{\sqrt{1-\cos^2 y}}=-\frac{1}{\sqrt{1-x^2}}\\
&\therefore \boxed{\frac{d}{dx}(\arccos x)=-\frac{1}{\sqrt{1-x^2}}}
\end{aligned}
$$

### The Derivative of $y=\tan^{-1} x$

Firstly, we will use the inverse functions derivative equation.

$$
\frac{d}{dx}(\tan^{-1}x)=\frac{dy}{dx}=\frac{1}{\sec^2y}=\frac{1}{\sec^2(\tan^{-1}x)}
$$

After drawing a triangle in the figure below to represent $\tan y = \frac{x}{1}$:

![inverse tangent diagram](/assets/images/invtan.svg)

Since $\sec x = \frac{1}{\cos x}$, using **SOHCAHTOA**, $\sec x = \frac{\text{Hypotenuse}}{\text{Adjacent}}$. In this case,

$$
\begin{aligned}
&\sec (\tan^{-1}x)=\frac{\sqrt{1+x^2}}{1}=\sqrt{1+x^2}\\
&\text{Therefore; } \sec^2 (\tan^{-1}x) = (\sqrt{1+x^2})^2=1+x^2\\
&\therefore\boxed{\frac{d}{dx}(\arctan x)=\frac{1}{1+x^2}}
\end{aligned}
$$

**NOTE:** You can try to use the identities to verify this as well. In addition, the derivations of the reciprocal functions, **Secant, Cosecant and Cotangent** have been intentionally left out for your practice.

### Summary of Differentiation Formulas

$$
\frac{d}{dx}(\sin^{-1} u)=\frac{1}{\sqrt{1-u^2}}\cdot \frac{du}{dx}
$$

$$
\frac{d}{dx}(\cos^{-1} u)=-\frac{1}{\sqrt{1-u^2}}\cdot \frac{du}{dx}
$$

$$
\frac{d}{dx}(\tan^{-1} u)=\frac{1}{1+u^2}\cdot \frac{du}{dx}
$$

$$
\frac{d}{dx}(\cot^{-1}u)=-\frac{1}{1+u^2}\cdot \frac{du}{dx}
$$

$$
\frac{d}{dx}(\sec^{-1}u)=\frac{1}{|u|\sqrt{u^2-1}}\cdot \frac{du}{dx}
$$

$$
\frac{d}{dx}(\csc^{-1}u)=-\frac{1}{|u|\sqrt{u^2-1}}\cdot \frac{du}{dx}
$$

> Example 1

> Differentiate $y=\sin^{-1}(x^3)$ with respect to $x$

> **Solution**

We will use chain rule to differentiate this. Thus;

$$
\text{Let } u = x^3; \quad\quad \frac{du}{dx}=3x^2
$$

This leaves us with $y=\sin^{-1}u$.

$$
\frac{dy}{dx}=\frac{dy}{du}\times\frac{du}{dx}=\frac{1}{\sqrt{1-u^2}}\times3x^2=\frac{3x^2}{\sqrt{1-(x^3)^2}}
$$

$$
\therefore \boxed{\frac{d}{dx}(\sin^{-1}x^3)=\frac{3x^2}{\sqrt{1-x^6}}}
$$

> Example 2
>
>Differentiate $y=\sec^{-1}(e^x)$ with respect to $x$
>
>**Solution**

$$
\text{Let }u=e^x \quad\quad\quad \frac{du}{dx}=e^x
$$

Since $\frac{d}{dx}(\sec^{-1}u)=\frac{1}{|u|\sqrt{u^2-1}}\cdot \frac{du}{dx}$; Then,

$$
\frac{d}{dx}(\sec^{-1}(e^x))=\frac{1}{|\cancel{e^x}|\sqrt{(e^x)^2-1}}\cdot \cancel{e^x}
$$

$$
\therefore \boxed{\frac{d}{dx}(\sec^{-1}(e^x))=\frac{1}{\sqrt{e^{2x}-1}}}
$$

> Example 3
>
> Find $\frac{dy}{dx}  \text{ if } y = x^2(\sin^{-1}x)^3$
>
>**Solution**

$$
\text{Let }u=\sin^{-1} x \quad\quad\quad \frac{du}{dx}=\frac{1}{\sqrt{1-x^2}}
$$

This leaves us with $y=x^2u^3$. Using **Product rule**;

$$
\frac{dy}{dx}=2xu^3+3x^2u^2\frac{du}{dx}
$$

Substitute everything back;

$$
\therefore\boxed{\frac{dy}{dx}=2x(\sin^{-1}x)^3+3x^2(\sin^{-1}x)^2\frac{1}{\sqrt{1-x^2}}}
$$

## Integrals Involving Inverse Trigonometric Functions

The derivatives on **Summary of Derivatives**, are very useful in integrating some expressions. Looking at the derivatives correctly, pairs of the derivatives are similar.

As such, only the positive derivatives are used for the integrals and the negative ones can be solved using the same positive derivatives.

Below are the integral functions we will use.

### Integrals Involving Inverse Trig Fns

$$
\begin{aligned}
&\int \frac{1}{\sqrt{1-u^2}} \, du=\sin^{-1}u + C\\
&\int \frac{1}{1+u^2}\cdot \frac{du}{dx} \, du = \tan^{-1}u + C\\
&\int \frac{1}{|u|\sqrt{u^2-1}}\, du = \sec^{-1}u + C
\end{aligned}
$$

> Example 4
>
> Evaluate $\displaystyle\int \frac{e^x}{\sqrt{1-e^{2x}}}\, dx$
>
> **Solution**

We will integrate by substitution.

Let $u= e^x$; then $\frac{du}{dx}=e^x$, so $dx = \frac{du}{e^x}$.

$$
\int \frac{e^x}{\sqrt{1-e^{2x}}}\, dx = \int \frac{1}{\sqrt{1-u^2}}\, du = \sin^{-1}u +C
$$

Substituting $u$ back gives:

$$
\boxed{\int\frac{e^x}{\sqrt{1-e^{2x}}}\, dx = \sin^{-1} (e^x) +C}
$$

> Example 5
>
>Evaluate $\displaystyle\int \frac{1}{1+3x^2}\, dx$.
>
>**Solution**

The only challenging part is finding the $u$-substitution. The idea is to make the terms in the radical squared. For example, $3x^2 = (\sqrt{3}x)^2$.

Let $u=\sqrt{3}\, x$, so $du=\sqrt{3}\, dx$ and $dx = \frac{du}{\sqrt{3}}$.

$$
\int \frac{1}{1+3x^2}\, dx = \frac{1}{\sqrt{3}}\int \frac{1}{1+u^2}\, du=\frac{1}{\sqrt{3}}\tan^{-1}u+C
$$

Substituting $u$ back:

$$
\boxed{\int \frac{1}{1+3x^2}\, dx=\frac{1}{\sqrt{3}}\tan^{-1}\left(\sqrt{3}\, x\right)+C}
$$

> Example 6
>
> Evaluate $\displaystyle\int \frac{dx}{a^2 + x^2}$ where $a\neq0$ is a constant.
>
> **Solution**

The first term of the denominators is always $1$. Factorise $a^2$ on the denominator:

$$
\int \frac{1}{a^2\left(1+\frac{x^2}{a^2} \right) }\, dx=\int \frac{1}{a^2\left( 1+\left(\frac{x}{a}\right)^2\right)}\, dx
$$

Let $u = \frac{x}{a}$; then $du=\frac{1}{a}\, dx$ and $dx=a\, du$.

$$
\int \frac{1}{a^{2}\left( 1+u^2\right) }\, a \, du = \frac{1}{a}\int \frac{1}{1+u^2}\, du
$$

$$
\frac{1}{a}\int \frac{1}{1+u^2}\, du = \frac{1}{a}\tan^{-1}u+C
$$

Substitute $u$ back:

$$
\therefore \boxed{\int \frac{dx}{a^2 + x^2}=\frac{1}{a}\tan^{-1}\left(\frac{x}{a} \right)+C}
$$

This process can be used to integrate slightly complicated expressions. Similar processes done for the other integrals give a set of usable equations to simplify the work.

Here are the equations to use whenever the constant $a\neq 0$ is not equal to $1$:

### Useful Integrals

$$
\begin{aligned}
&\int \frac{du}{\sqrt{a^2-u^2}}=\sin^{-1}\frac{u}{a}+C\\
&\int \frac{du}{a^2 + u^2}=\frac{1}{a}\tan^{-1}\left(\frac{u}{a} \right)+C\\
&\int \frac{du}{u\sqrt{ u^2-a^2}}=\frac{1}{a}\sec^{-1}\left|\frac{u}{a} \right|+C
\end{aligned}
$$

> Example 7
>
> Evaluate $\displaystyle\int\frac{dx}{\sqrt{2-x^2}}$
>
> **Solution**

There are two approaches: use the formulas above, find the necessary substitutions and integrate, or go through the integration process step by step.

$$
\int \frac{dx}{\sqrt{2-x^2}}=\int\frac{dx}{\sqrt{\left(\sqrt{2}\right)^2-x^2}}
$$

Here, $a =\sqrt{2}$ and $u = x$. Since $\int \frac{du}{\sqrt{a^2-u^2}}=\sin^{-1}\frac{u}{a}+C$,

$$
\therefore\int\frac{dx}{\sqrt{2-x^2}}=\sin^{-1} \left( \frac{x}{\sqrt{2}}\right)  + C
$$

> Example 8
>
>Evaluate $\displaystyle\int \frac{dx}{\sqrt{9-x^2}}$
>
>**Solution**

Let's use the step by step approach. Factorise $9$ to remain with $1$ on the first term of the radical:

$$
\int \frac{dx}{\sqrt{9-x^2}}=\int \frac{dx}{\sqrt{9\left( 1-\frac{x^2}{9}\right)}}
$$

Take out $9$ from the root; it becomes $3$ outside. Find $u$ and proceed with substitution:

$$
=\int\frac{dx}{3\sqrt{1-\left( \frac{x}{3}\right) ^2}} \quad u= \frac{x}{3}, \quad du = \frac{dx}{3}
$$

$$
=\int\frac{du}{\sqrt{1-u ^2}}=u +C
$$

Substitute $u = \frac{x}{3}$ back:

$$
\therefore \boxed{\int \frac{dx}{\sqrt{9-x^2}}=\sin^{-1}\left(\frac{x}{3}\right) +C}
$$

> Example 9
>
> Evaluate $\displaystyle\int \frac{dy}{y\sqrt{5y^2 -3}}$
>
> **Solution**

Factorise $3$ and take it out of the radical:

$$
\int \frac{dy}{y\sqrt{5y^2 -3}}=\int \frac{dy}{y\sqrt{3\left(\frac{5y^2}{3}-1\right)}}=\int \frac{dy}{\sqrt{3}y\sqrt{\left(\frac{\sqrt{5}y}{\sqrt{3}}\right)^2 -1}}
$$

Let $u = \frac{\sqrt{5}y}{\sqrt{3}}$, then $dy = \frac{\sqrt{3}\, du}{\sqrt{5}}$

$$
=\int \frac{du}{\sqrt{3}\, y \sqrt{(u^2-1)}}
$$

Eliminate $y$ using $u = \frac{\sqrt{5}y}{\sqrt{3}}$, so $y = \frac{\sqrt{3}\, u}{\sqrt{5}}$:

$$
\int \frac{du}{\sqrt{3}\, u \sqrt{(u^2-1)}}=\frac{1}{\sqrt{3}}\int \frac{du}{u \sqrt{(u^2-1)}}
$$

Final answer:

$$
\therefore \boxed{\int \frac{dy}{y\sqrt{5y^2 -3}}=\frac{1}{\sqrt{3}}\sec^{-1}\left|\frac{\sqrt{5}\, y}{\sqrt{3}}\right| + C}
$$

## Powers of Trigonometric Functions

### Reduction Formula

**Definition**

A Reduction Formula for an integral is a formula which connects an integral linearly with another integral of the same type, but of lower degree.

For example, consider $\displaystyle\int \sin^5 x \cos x \, dx$; if we let $u = \sin x$, then $\int u^5 \, dx = \frac{1}{6}\sin^6 x + c$ settles the problem.

This is not always possible according to the nature of integrands. For example, for $\displaystyle\int \sin^5 x \, dx$, there is no way u-substitution can work. Hence, we apply the method below.

A reduction formula is generally obtained by repeated application of integration by parts.

Recall, integration by parts:

Consider a product of two functions $uv$. To find the derivative using the product rule:

$$
d(uv) = v \cdot d(u) + u \cdot d(v)
$$

If we take integrals of both sides:

$$
\displaystyle\int d(uv) = \int u\,dv + \int v\,du
$$

But

$$
\int d(uv) = uv
$$

Make $\int u\,dv$ the subject of the formula:

**Integration by Parts**

$$\int u\,dv = uv - \int v\,du$$

**Reduction Formula for $\displaystyle\int \sin^n x \, dx$; $n \geq 2$**

In order to apply integration by parts, we split $\sin^n x$ into two parts: $\sin^n x = (\sin^{n-1} x)(\sin x)$.

| $dv = \sin x \, dx$ | $u = \sin^{n-1} x$ |
|---------------------|---------------------|
| $v = -\cos x$ | $du = (n-1) \sin^{n-2} x \cos x \, dx$ |

Since, $\int u\,dv = uv - \int v\,du$:

$$
\begin{aligned}
\int \sin^n x \, dx
&= -\cos x \sin^{n-1} x + (n-1)\int \sin^{n-2} x \cos^2 x \, dx \\
&= -\cos x \sin^{n-1} x + (n-1)\int \sin^{n-2} x (1-\sin^2 x)\,dx \\
&= -\cos x \sin^{n-1} x + (n-1)\int \sin^{n-2} x\,dx
   - (n-1)\int \sin^n x\,dx \\
n\int \sin^n x\,dx
&= -\cos x \sin^{n-1} x + (n-1)\int \sin^{n-2} x\,dx
\end{aligned}
$$

$$
\boxed{
\int \sin^n x\,dx
= -\frac{1}{n}\cos x \sin^{n-1} x
+ \frac{n-1}{n}\int \sin^{n-2} x\,dx + C
}
$$


> Example 10
>
> Use the formula above to evaluate $\displaystyle\int \sin^7 x \, dx$.
>
> **Solution:**

**Reduction formula:**

$$
\int \sin^n x \, dx = -\frac{\sin^{n-1}x \cos x}{n} + \frac{n-1}{n} \int \sin^{n-2}x \, dx, \quad n \geq 2
$$

Apply the formula with $n = 7$:

$$
\int \sin^7 x \, dx = -\frac{\sin^6 x \cos x}{7} + \frac{6}{7} \int \sin^5 x \, dx
$$

Apply the formula to $\int \sin^5 x \, dx$ ($n = 5$):

$$
\int \sin^5 x \, dx = -\frac{\sin^4 x \cos x}{5} + \frac{4}{5} \int \sin^3 x \, dx
$$

Apply the formula to $\int \sin^3 x \, dx$ ($n = 3$):

$$
\int \sin^3 x \, dx = -\frac{\sin^2 x \cos x}{3} + \frac{2}{3} \int \sin x \, dx$$

Since $\int \sin x \, dx = -\cos x + C$, we have:

$$\int \sin^3 x \, dx = -\frac{\sin^2 x \cos x}{3} - \frac{2}{3} \cos x + C
$$

Substituting into $\int \sin^5 x \, dx$:

$$
\int \sin^5 x \, dx = -\frac{\sin^4 x \cos x}{5} + \frac{4}{5} \left( -\frac{\sin^2 x \cos x}{3} - \frac{2}{3} \cos x \right) + C
$$

Substituting into $\int \sin^7 x \, dx$:

$$
\int \sin^7 x \, dx = -\frac{\sin^6 x \cos x}{7} + \frac{6}{7} \left[ -\frac{\sin^4 x \cos x}{5} + \frac{4}{5} \left( -\frac{\sin^2 x \cos x}{3} - \frac{2}{3} \cos x \right) \right] + C
$$

This is the fully reduced expression obtained through repeated applications of the reduction formula.

**Reduction Formula for $\displaystyle\int \cos^n x \, dx$; $n \geq 2$**

The same method has to be applied when deriving the reduction formula for cosine.

That is, by splitting $\cos^n x$ into $\cos^{n-1} x$ and $\cos x$ and applying the integration by parts method of integration.

A similar expression to the one found earlier on reduction formula for sine will be found.

In order to apply integration by parts, we split $\cos^n x$ in two parts $\cos^n x = (\cos^{n-1} x)(\cos x)$

| $dv = \cos x \, dx$ | $u = \cos^{n-1} x$ |
|---------------------|---------------------|
| $v = \sin x$ | $du = -(n-1) \cos^{n-2} x \sin x \, dx$ |

Since, $\displaystyle\int udv = uv - \int vdu$,

$$
\begin{aligned}
\int \cos^n x \, dx
&= \sin x \cos^{n-1} x + (n-1)\int \cos^{n-2} x \sin^2 x \, dx \\
&= \sin x \cos^{n-1} x + (n-1)\int \cos^{n-2} x (1-\cos^2 x)\,dx \\
&= \sin x \cos^{n-1} x + (n-1)\int \cos^{n-2} x\,dx
   - (n-1)\int \cos^n x\,dx \\
n\int \cos^n x\,dx
&= \sin x \cos^{n-1} x + (n-1)\int \cos^{n-2} x\,dx
\end{aligned}
$$

$$
\boxed{
\int \cos^n x\,dx
= \frac{1}{n}\sin x \cos^{n-1} x
+ \frac{n-1}{n}\int \cos^{n-2} x\,dx + C
}
$$


> Example 11
>
> Evaluate $\displaystyle \int \cos^3 x \, dx$ using the reduction formula.
>
> **Solution:**

We use the reduction formula for cosine:

$$\int \cos^n x \, dx = \frac{\cos^{n-1}x \sin x}{n} + \frac{n-1}{n} \int \cos^{n-2}x \, dx, \quad n \geq 2$$

For $n = 3$:

$$\int \cos^3 x \, dx = \frac{\cos^2 x \sin x}{3} + \frac{2}{3} \int \cos x \, dx$$

$$= \frac{\cos^2 x \sin x}{3} + \frac{2}{3} \sin x + C$$

> Example 12
>
> Evaluate $\displaystyle \int \cos^6 x \, dx$ using repeated application of the reduction formula.
>
> **Solution:**

Reduction formula:

$$\int \cos^n x \, dx = \frac{\cos^{n-1}x \sin x}{n} + \frac{n-1}{n} \int \cos^{n-2}x \, dx, \quad n \geq 2$$

Apply the formula with $n = 6$:

$$\int \cos^6 x \, dx = \frac{\cos^5 x \sin x}{6} + \frac{5}{6} \int \cos^4 x \, dx$$

Apply the formula to $\int \cos^4 x \, dx$ ($n = 4$):

$$\int \cos^4 x \, dx = \frac{\cos^3 x \sin x}{4} + \frac{3}{4} \int \cos^2 x \, dx$$

Apply the formula to $\int \cos^2 x \, dx$ ($n = 2$):

$$\int \cos^2 x \, dx = \frac{\cos x \sin x}{2} + \frac{1}{2} \int \cos^0 x \, dx$$

Since $\int \cos^0 x \, dx = \int 1 \, dx = x + C$, we have:

$$\int \cos^2 x \, dx = \frac{\cos x \sin x}{2} + \frac{x}{2} + C$$

Substituting into $\int \cos^4 x \, dx$:

$$\int \cos^4 x \, dx = \frac{\cos^3 x \sin x}{4} + \frac{3}{4} \left( \frac{\cos x \sin x}{2} + \frac{x}{2} \right) + C$$

Substituting into $\int \cos^6 x \, dx$:

$$\int \cos^6 x \, dx = \frac{\cos^5 x \sin x}{6} + \frac{5}{6} \left[ \frac{\cos^3 x \sin x}{4} + \frac{3}{4} \left( \frac{\cos x \sin x}{2} + \frac{x}{2} \right) \right] + C$$

### Products of Powers | Sine and Cosine

**Old Powers of Sine and Cosine**

Apart from the **Reduction Formula**, these kind of integrals can be solved with other methods too applied to the specific nature of the power, either even or odd.

Our goal here is to reduce the power into a simplified form that allows integration by substitution.

In this method, you write the integral of $\sin^n x$ and $\cos^n x$ as $\sin^{n-1} x \sin x$ and $\cos^{n-1} x \cos x$ respectively.

Since $n$ is odd, $(n-1)$ will always be even. Hence, the use of the Pythagorean identity, $\cos^2 x + \sin^2 x = 1$ and the u-substitution of $u = \cos x$ or $u = \sin x$ settles the integrand.

> Example 13
>
> Evaluate $\displaystyle\int \sin^5 \theta \, d\theta$.
>
> **Solution:**

We know that $\int \sin^5 \theta \, d\theta = \int \sin^4 \theta \sin \theta \, d\theta$

$$\int \sin^4 \theta \sin \theta \, d\theta = \int (\sin^2 \theta)^2 \sin \theta \, d\theta \text{ since } \sin^2 \theta = 1 - \cos^2\theta$$

$$= \int (1 - \cos^2 \theta)^2 \sin \theta \, d\theta = \int (1 - 2\cos^2 \theta + \cos^4 \theta) \sin \theta \, d\theta$$

Let $u = \cos \theta$; $du = -\sin \theta \, d\theta$; $d\theta = \frac{du}{-\sin \theta}$

$$-\int (1 - 2u^2 + u^4) du = -\left(u - \frac{2}{3}u^3 + \frac{1}{5}u^5\right) + c$$

Substituting $u$ back:

$$-\left(u - \frac{2}{3}u^3 + \frac{1}{5}u^5\right) + c = -\left(\cos \theta - \frac{2}{3}\cos^3 \theta + \frac{1}{5}\cos^5 \theta\right) + c$$

Therefore:

$$\boxed{\int \sin^5 \theta \, d\theta = -\cos \theta + \frac{2}{3}\cos^3 \theta - \frac{1}{5}\cos^5 \theta + c}$$

For an odd power of cosine apply the same concepts

### Even Powers for Sine and Cosine

For powers that are already even, we apply the double angle formulas for cosine to simplify the integrand.

**Double Angle Formulas**

Recall, the double angle formulas for cosine as follows:

$$
\begin{aligned}
\cos 2x &= \cos^2 x - \sin^2 x\\
\cos 2x &= 2 \cos^2 x - 1\\
\cos 2x &= 1 - 2 \sin^2 x
\end{aligned}
$$

The u-substitution of angle multiples deals with the integral such that

$$
\int \sin nx \, dx = \frac{-1}{n} \cos nx + c \text{ and } \int \cos nx \, dx = \frac{1}{n} \sin nx + c
$$

> Example 14
>
> Evaluate $\int \cos^4 x \, dx$
>
> **Solution:**

Since $\cos^4 x$ is in terms of cosine form, we will substitute the identity 2 from the preceding slide. That is, $\cos^2 x = \frac{1}{2}(1 + \cos 2x)$.

$$\int \cos^4 x \, dx = \int \left(\frac{1}{2}(1 + \cos 2x)\right)^2 dx = \int \frac{1}{4}(1 + 2 \cos 2x + \cos^2 2x) dx$$

Manipulating the same identity we get $\cos^2 2x = \frac{1}{2}(1 + \cos 4x)$

$$= \int \frac{1}{4}\left(1 + 2 \cos 2x + \frac{1}{2}(1 + \cos 4x)\right) dx$$

$$\int \frac{1}{4}\left(1 + 2\cos 2x + \frac{1}{2} + \frac{1}{2}\cos 4x\right) dx = \int \left(\frac{3}{8} + \frac{1}{2}\cos 2x + \frac{1}{8}\cos 4x\right) dx$$

Therefore:

$$\boxed{\int \cos^4 x \, dx = \frac{3}{8}x + \frac{1}{4}\sin 2x + \frac{1}{32}\sin 4x + c}$$

**PROOF: Evaluate $\displaystyle\int \frac{1}{a} \sin nx \, dx$**

Factor out the constant:

$$\int \frac{1}{a} \sin nx \, dx = \frac{1}{a} \int \sin nx \, dx$$

Let $u = nx$ and $du = n \, dx$, so $dx = \frac{du}{n}$

Substitute:

$$\frac{1}{a} \int \sin nx \, dx = \frac{1}{a} \int \sin u \cdot \frac{du}{n} = \frac{1}{an} \int \sin u \, du$$

Apply basic integral:

$$\int \sin u \, du = -\cos u + C$$

Therefore:

$$\frac{1}{an} \int \sin u \, du = -\frac{1}{an} \cos u + C$$

Substitute back $u = nx$:

$$\boxed{\int \frac{1}{a}\sin nx \, dx=-\frac{1}{an} \cos nx + C}$$

**PROOF: Evaluate $\displaystyle\int \frac{1}{a}\cos nx \, dx$**

Factor out the constant:

$$\int \frac{1}{a} \cos nx \, dx = \frac{1}{a} \int \cos nx \, dx$$

Let $u = nx$ and $du = n \, dx$, so $dx = \frac{du}{n}$

Substitute:

$$\int \frac{1}{a}\cos nx \, dx = \frac{1}{a}\int \cos u \cdot \frac{du}{n} = \frac{1}{an} \int \cos u \, du$$

Apply basic integral:

$$\int \cos u \, du = \sin u + C$$

Therefore:

$$\frac{1}{an} \int \cos u \, du = \frac{1}{an} \sin u + C$$

Substitute back $u = nx$:

$$\boxed{\int \frac{1}{a}\cos nx \, dx=\frac{1}{an} \sin nx + C}$$

The reason for knowing these two integrals is that they are very crucial since we can always skip some long processes that can waste our time and directly jump into the answer since these steps are not necessary here but in elementary calculus.

### Products of Powers for Sine and Cosine

In some questions, you might be given an expression which is the product of sine and cosine. The question comes in this form: $\int \sin^m x \cos^n x \, dx$.

**Strategy for Products of Powers**

The approach to this questions changes depending on which one between $m$ and $n$ is even or odd.

In this integral if the exponent on the sines ($m$) is odd we can strip out one sine, convert the rest to cosines and then use the substitution $u = \cos x$. Likewise, if the exponent on the cosines ($n$) is odd we can strip out one cosine and convert the rest to sines using and the use the substitution $u = \sin x$.

If both of them are odd, just chose one function ($\sin^m x$ or $\cos^n x$) to dissolve into the other.

In the case where both of them are even, the technique we used in the first descriptions simply won't work and in fact there really isn't any one set method for doing these integrals. Each integral is different and in some cases there will be more than one way to do the integral.

> Example 15
>
> Evaluate $\displaystyle\int \sin^6 x \cos^3 x \, dx$.
>
> **Solution:**

In this case the exponent on the sine is even while the exponent on the cosine is odd. So, this time we'll strip out a cosine and convert the rest to sines.

$$\int \sin^6 x \cos^3 x \, dx = \int \sin^6 x \cos^2 x \cos x \, dx \text{ but } \cos^2 x = 1 - \sin^2 x$$

$$= \int \sin^6 x (1 - \sin^2 x) \cos x \, dx = \int (\sin^6 x - \sin^8 x) \cos x \, dx$$

Let $u = \sin x$; $du = \cos x \, dx$

$$\boxed{\therefore\int (u^6 - u^8) du = \frac{1}{7}u^7 - \frac{1}{9}u^9 + c = \frac{1}{7}\sin^7 x - \frac{1}{9}\sin^9 x + c}$$

> Example 16
>
> Evaluate $\displaystyle\int \sin^2 x \cos^2 x \, dx$.
>
> **Solution 1:**

Write $\sin^2 x$ and $\cos^2 x$ in terms of double angle formulae

$$
\begin{aligned}
\int \sin^2 x \cos^2 x \, dx &= \int \left(\frac{1-\cos 2x}{2}\right)\left(\frac{1+\cos 2x}{2}\right) dx \quad \text{(diff. of squares)} \\
&= \int \frac{1}{4}(1 - \cos^2 2x) \, dx = \int \frac{1}{4}\left(1 - \frac{1 + \cos 4x}{2}\right) dx \quad \text{(since $\cos^2 2x = \frac{1 + \cos 4x}{2}$)} \\
&= \int \frac{1}{4}\left(1 - \frac{1}{2} - \frac{1}{2}\cos 4x\right) dx = \int \left(\frac{1}{8} - \frac{1}{8}\cos 4x\right) dx = \frac{1}{8}x - \frac{1}{32}\sin 4x + c
\end{aligned}
$$

**Solution 2:**

$$
\int \sin^2 x \cos^2 x \, dx = \int (\sin x \cos x)^2 dx
$$

Since $2 \sin x \cos x = \sin 2x$, $\sin x \cos x = \frac{1}{2}\sin 2x$

$$
\begin{aligned}
\int (\sin x \cos x)^2 dx &= \int \left(\frac{1}{2}\sin 2x\right)^2 dx \quad \text{but } \sin^2 2x = \frac{1 - \cos 4x}{2} \\
&= \int \frac{1}{4}\left(\frac{1 - \cos 4x}{2}\right) dx = \int \left(\frac{1}{8} - \frac{1}{8}\cos 4x\right) dx
\end{aligned}
$$

Therefore:

$$\boxed{\int \sin^2 x \cos^2 x \, dx = \frac{1}{8}x - \frac{1}{32}\sin 4x + c}$$

### Products of Powers | Tangent and Secant

Powers of tangent functions go hand and hand with powers of secant functions as shown below:

**General Form**

$$\displaystyle \int \tan^m x \sec^n x \, dx$$

Differences in approach comes due to changes in the nature of the powers of tangent and secant respectively.

$m$ and $n$ can either be even or odd depending on the question given.

In one of the situations, secant will have an even power and tan will have an odd or even power, that is, $n$ is even.

If this happens you write the integral as

**When n is even**

$$\displaystyle \int \tan^m x \sec^{n-2} x \sec^2 x \, dx$$

Then, you have to write $\sec^{n-2} x$ in terms as $\tan x$ using the identity $\sec^2 x = 1 + \tan^2 x$. If $n - 2$ is greater than 2, you will express it as power multiple of since it will be even. Letting $u = \tan x$, the integrand is simplified and $\sec^2 x$ gets eliminated.

> Example 17
>
> Evaluate $\displaystyle \int \tan^2 x \sec^4 x \, dx$.
>
> **Solution:**

Firstly, we have to simplify $\tan^2 x \sec^4 x$ using the rules provided.

$$\tan^2 x \sec^4 x = \tan^2 x \sec^{4-2} x \sec^2 x = \tan^2 x \sec^2 x \sec^2 x$$

But $\sec^2 x = 1 + \tan^2 x$, we substitute on one $\sec^2 x$ and simplify.

$$= \tan^2 x (1 + \tan^2 x) \sec^2 x = (\tan^2 x + \tan^4 x) \sec^2 x$$

This means that $\displaystyle \int \tan^2 x \sec^4 x \, dx = \int (\tan^2 x + \tan^4 x) \sec^2 x \, dx$. Using substitution method of integration, let $u = \tan x$.

$$du = \sec^2 x \, dx; \, dx = \frac{du}{\sec^2 x}$$

Since the remaining function is $\displaystyle \int (u^2 + u^4) \sec^2 x \, dx$, substitute $dx$.

$$= \int (u^2 + u^4) \sec^2 x \times \frac{du}{\sec^2 x} = \int (u^2 + u^4) du = \frac{1}{3}u^3 + \frac{1}{5}u^5 + c$$

After substituting $u$ back,

$$\boxed{\displaystyle \int \tan^2 x \sec^4 x \, dx = \frac{1}{3}\tan^3 x + \frac{1}{5}\tan^5 x + c}$$

Below are the points we should take closer attention at.

When simplifying the function, on the first step we are having $\int \tan^m x \sec^{n-2} x \sec^2 x \, dx$ which is found by applying rules of indices.

The other thing we should see is that since $n$ is even, $n - 2$ will always be even. Hence if it is greater than 2, the provided identity will always work e.g. $\sec^{6-2} x \sec^2 x = \sec^4 x \sec^2 x = (1 + \tan^2 x)^2 \sec^2 x$.

The idea of taking out $\sec^2 x$ from $\sec^m x$ is brought into account to enable elimination through substituting the differentiation of $\tan x$ which is $\sec^2 x$.

Once the power secant is odd, the preceding method does not work. In this case we consider another situation of having an odd power of tangent.

In this case you write the integral $\int \tan^m x \sec^n x \, dx$ where m is odd as shown below:

**When m is odd**

$$\int \tan^{m-1} x \sec^{n-1} x \tan x \sec x \, dx$$

Once this happens, we know that $m - 1$ is now even. That is, we will apply $\sec^2 x = 1 + \tan^2 x$ but this time to write $\tan x$ in terms of $\sec x$. Then the substitution of $u = \sec x$ simplifies the integrand.

> Example 18
>
> Evaluate $\displaystyle\int \tan^3 x \sec^3 x \, dx$.
>
> **Solution:**

Firstly, we have to simplify $\tan^3 x \sec^3 x$ using the rules provided.

$$\tan^3 x \sec^3 x = \tan^{3-1} x \sec^{3-1} x \tan x \sec x = \tan^2 x \sec^2 x \tan x \sec x$$

But $\sec^2 x - 1 = \tan^2 x$, we substitute on $\tan^2 x$ and simplify.

$$= (\sec^2 x - 1) \sec^2 x \tan x \sec x = (\sec^4 x - \sec^2 x) \tan x \sec x$$

Thus, $\displaystyle\int \tan^3 x \sec^3 x \, dx = \int (\sec^4 x - \sec^2 x) \tan x \sec x \, dx$

Let $u = \sec x$, $du = \tan x \sec x \, dx$; $dx = \frac{du}{\tan x \sec x}$

Since the remaining function is $\int (u^4 - u^2) \tan x \sec x \, dx$, substitute $dx$.

$$= \int (u^4 - u^2) \tan x \sec x \times \frac{du}{\tan x \sec x} = \int (u^4 - u^2) du= \frac{1}{5}u^5 - \frac{1}{3}u^3 + c$$

After substituting $u$ back,

$$\boxed{\int \tan^3 x \sec^3 x \, dx = \frac{1}{5}\sec^5 x - \frac{1}{3}\sec^3 x + c}$$

If n is odd and m is even, this situation do not match any of the presented method.

In such a case, the use other methods like integration by parts should be used instead.

### Products of Multiple Angles for Sine and Cosine

Upon looking at products of powers of sine and cosine, our attention draws to products of sine and cosine which involve multiple angles.

That is, $\displaystyle\int \sin nx \cos mx \, dx$ where m and n are integers. This type of integrals use the trigonometric product formulae also known as the product-to-sum identities. Recall the product formulae,

**Product-to-Sum Identities**

$$
\begin{aligned}
\sin A \sin B &= \frac{1}{2}[\cos(A - B) - \cos(A + B)]\\
\cos A \cos B &= \frac{1}{2}[\cos(A - B) + \cos(A + B)]\\
\cos A \sin B &= \frac{1}{2}[\sin(A + B) - \sin(A - B)]
\end{aligned}
$$

> Example 19
>
> Evaluate $\displaystyle\int \sin 5x \cos 3x \, dx$.
>
> **Solution:**

We will use the product-to-sum identity $\sin A \cos B = \frac{1}{2}[\sin(A + B) + \sin(A - B)]$ as follows:

Let $A = 5x$ and $B = 3x$, so

$$
\int \sin 5x \cos 3x \, dx = \int \frac{1}{2} [\sin(5x + 3x) + \sin(5x - 3x)] \, dx = \int \frac{1}{2} [\sin 8x + \sin 2x] \, dx
$$

$$
= \frac{1}{2} \left( -\frac{1}{8} \cos 8x - \frac{1}{2} \cos 2x \right) + C = -\frac{1}{16} \cos 8x - \frac{1}{4} \cos 2x + C
$$

Therefore:

$$
\boxed{\int \sin 5x \cos 3x \, dx = -\frac{1}{16} \cos 8x - \frac{1}{4} \cos 2x + C}
$$

## Trigonometric Substitutions

Trigonometric substitutions are used to simplify integrals involving expressions of the form $\sqrt{a^2 - x^2}$, $\sqrt{a^2 + x^2}$, or $\sqrt{x^2 - a^2}$. These substitutions transform the integral into one involving trigonometric functions, which can often be evaluated using standard techniques.

Integrals involving trigonometric functions may grow complicated to an extent that we apply the identities to simplify them. This is what we have been doing so far.

But in some occasions, this is not always the story. We might tend to encounter some integrands involving radicals which are seemingly impossible to integrate.

For example, integrands like $\sqrt{a^2 - x^2}$, $\sqrt{a^2 + x^2}$ and $\sqrt{x^2 - a^2}$ which have no clear way to use in the integration process.

Therefore, the substitution of a specific trig function helps to eliminate the radicals and usually simplifies the integrand.

Before we dive deep into the process, you might wish to recall the Pythagorean trig identity, $\cos^2 x + \sin^2 x = 1$ which gives birth to $1 + \tan^2 x = \sec^2 x$ and $\cot^2 x + 1 = \csc^2 x$.

The table below shows specific trig substitution to match each given radical.

### Trigonometric Substitution Table

| Expression Given | Trig Substitution |
|------------------|-------------------|
| $\sqrt{a^2 - x^2}$ | $x = a\sin\theta$ |
| $\sqrt{a^2 + x^2}$ | $x = a\tan\theta$ |
| $\sqrt{x^2 - a^2}$ | $x = a\sec\theta$ |

**POINTS TO NOTE:**
- When making substitutions we assume that $\theta$ is in the range of their respective inverse functions.
- If the radicals appear in the denominators, always add a condition restricting the value of the denominator to never be equal to zero. For example, if $\sqrt{a^2 - x^2}$ is a denominator always say "where $|x| \neq a$".

> Example 20
>
> Evaluate $\displaystyle\int \frac{dx}{x^2\sqrt{16-x^2}}$.
>
> **Solution:**

Let $a = \sqrt{16} = 4$ and considering the radical, $x = a\sin \theta = 4\sin \theta$, thus:

$$
\begin{aligned}
\int \frac{dx}{x^2\sqrt{16-x^2}} &= \int \frac{dx}{(4\sin \theta)^2\sqrt{16-(4\sin \theta)^2}} \\
&= \int \frac{1}{16\sin^2 \theta \sqrt{16(1-\sin^2 \theta)}} dx \\
&= \int \frac{1}{16\sin^2 \theta \sqrt{16\cos^2 \theta}} dx \quad \text{since } 1-\sin^2 \theta = \cos^2 \theta \\
&= \int \frac{1}{16\sin^2 \theta (4\cos \theta)} dx
\end{aligned}
$$

Since $x = 4\sin \theta$, $dx = 4\cos\theta d\theta$. This will eliminate $dx$ and allow us to integrate with respect to $\theta$.

**Eliminate dx and simplify:**

$$
= \int \frac{1}{16\sin^2 \theta (4\cos \theta)} \times 4\cos \theta \, d\theta = \int \frac{1}{16\sin^2 \theta} d\theta = \int \frac{1}{16} \csc^2 \theta \, d\theta
$$

Therefore, it is simple to integrate $\csc^2 \theta$:

$$
= -\frac{1}{16} \cot \theta + C
$$

It is now necessary to get back to the original variable, $x$. Since $x = 4\sin \theta$, $\sin \theta = \frac{x}{4}$.

*Therefore,* $\theta = \sin^{-1}\frac{x}{4}$

Using the triangle below:

![Cotangent Triangle](/assets/images/cot.svg)

$$
\cot \theta = \frac{1}{\tan \theta} = \frac{\text{adjacent}}{\text{opposite}}
$$

Therefore $\cot \theta = \frac{\sqrt{16-x^2}}{x}$

**Finally:**

$$
\boxed{\int \frac{dx}{x^2\sqrt{16-x^2}} = -\frac{\sqrt{16-x^2}}{16x} + C}
$$

## Chapter Review

### Practice Problems

#### Inverse Trigonometric Functions

1. Find $\frac{dy}{dx}$ if $y = \sin^{-1}(3x^2)$.
2. Differentiate $y = x \tan^{-1}(2x)$ using the product rule.
3. Find the derivative of $y = \cos^{-1}\left(\frac{x}{\sqrt{1+x^2}}\right)$.
4. Evaluate $\displaystyle\int \frac{dx}{\sqrt{4-9x^2}}$.
5. Find $\displaystyle\int \frac{dx}{25 + x^2}$.
6. Compute $\displaystyle\int \frac{dx}{x\sqrt{x^2-16}}$ where $|x| > 4$.

#### Reduction Formulas

7. Use the reduction formula to evaluate $\displaystyle\int \sin^6 x \, dx$.
8. Apply the reduction formula to find $\displaystyle\int \cos^5 x \, dx$.
9. Evaluate $\displaystyle\int_0^{\pi/2} \sin^4 x \cos^2 x \, dx$ using reduction formulas.
10. Find $\displaystyle\int \cos^8 x \, dx$ by applying the reduction formula repeatedly.

#### Powers of Trigonometric Functions

11. Evaluate $\displaystyle\int \sin^3 x \cos^4 x \, dx$.
12. Find $\displaystyle\int \sin^2 x \cos^4 x \, dx$ using double angle formulas.
13. Compute $\displaystyle\int \tan^4 x \sec^2 x \, dx$.
14. Evaluate $\displaystyle\int \sin^5 x \, dx$.
15. Find $\displaystyle\int \cos^6 x \, dx$ using power reduction formulas.
16. Compute $\displaystyle\int \tan^3 x \sec^5 x \, dx$.

#### Products of Multiple Angles

17. Evaluate $\displaystyle\int \sin 7x \cos 3x \, dx$ using product-to-sum formulas.
18. Find $\displaystyle\int \cos 4x \cos 2x \, dx$.
19. Compute $\displaystyle\int \sin 5x \sin 2x \, dx$.
20. Evaluate $\displaystyle\int_0^{\pi} \sin 3x \cos x \, dx$.

#### Trigonometric Substitutions

21. Evaluate $\displaystyle\int \frac{dx}{\sqrt{9-x^2}}$ using trigonometric substitution.
22. Find $\displaystyle\int \frac{x^2}{\sqrt{16-x^2}} \, dx$.
23. Compute $\displaystyle\int \frac{dx}{(x^2+4)^{3/2}}$ using $x = 2\tan\theta$.
24. Evaluate $\displaystyle\int \frac{\sqrt{x^2-25}}{x} \, dx$ for $x > 5$.
25. Find $\displaystyle\int \frac{dx}{x^2\sqrt{x^2+9}}$.

#### Challenge Problems

26. Prove that $\frac{d}{dx}[\sec^{-1}x] = \frac{1}{|x|\sqrt{x^2-1}}$ for $|x| > 1$.
27. Show that $\displaystyle\int_0^{\pi/2} \sin^n x \, dx = \int_0^{\pi/2} \cos^n x \, dx$ for any positive integer $n$.
28. Evaluate $\displaystyle\lim_{x \to 0} \frac{\sin x - x \cos x}{x^3}$.
29. Find all solutions to $\sin 2x = \cos 3x$ in the interval $[0, 2\pi)$.
30. Prove the identity: $\tan\left(\frac{x}{2}\right) = \frac{\sin x}{1 + \cos x} = \frac{1 - \cos x}{\sin x}$.
31. Evaluate $\displaystyle\int \frac{\sin x}{1 + \cos^2 x} \, dx$.

---

### References

Stewart, J. (2020). *Calculus: Early Transcendentals*. 9th Edition. Cengage Learning.

Anton, H., Bivens, I., & Davis, S. (2016). *Calculus: Early Transcendentals*. 11th Edition. Wiley.

Larson, R., & Edwards, B. H. (2018). *Calculus*. 11th Edition. Cengage Learning.
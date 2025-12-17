# CALCULUS II - TRANSCENDENTAL FUNCTIONS

Transcendental functions are mathematical functions that are not algebraic, meaning they cannot be expressed as roots of polynomial equations with finite degree. Common examples include exponential, logarithmic, trigonometric, and hyperbolic functions.

## Key Concepts

Transcendental functions in calculus include:

- Exponential functions ($f(x) = a^x$)
- Logarithmic functions ($f(x) = \log_a x$)
- Trigonometric functions ($\sin x$, $\cos x$, etc.)
- Hyperbolic functions ($\sinh x$, $\cosh x$, etc.)

---

# Chapter 1: Exponential & Logarithmic Functions

## Introduction

A review of the fundamental properties and calculus rules for logarithmic and exponential functions.

Firstly, it is well known that Exponential and Logarithmic Functions are inverses of each other. That is, they satisfy the fact that:

$$
f(f^{-1}(x))=f^{-1}(f(x))=x
$$

That means,

$$
\log_{a} (a^{x}) = a^{\log_{a}(x)}=x
$$

as long as the base $a$ remains constant throughout.

In addition, we also know how to change logarithms from one base to the other.

### Change of Base Formula

For example, if you want to change a logarithm of $x$ in base $a$ to base $b$, we use:

$$
\log_{a}x=\frac{\log_{b}x}{\log_{b}a}
$$

In MAT121, we looked at the differentiation and integration of the basic exponential and logarithmic functions. Here, we discussed that the derivative of an exponential function $y=e^x$ is $e^x$. When the base is $e$, it is called **Natural Exponential Function**.

For any other base $a$, we found the derivative of the function $y=a^x$ to be $a^x \ln a$.

For logarithms, we discussed that the natural logarithmic function of x is present as $\ln x$ as a short form of $\log_e x$.

We also discussed that the derivative of the function $y=\ln x$ is $\frac{1}{x}$. And for any other general base $a$ we first change it to base $e$ using **Change of Base equation** and then differentiate which yielded the derivative of $y=\log_a x$ as $\frac{1}{x \ln a}$.

On **Integration**, we found the reverse processes of the above derivatives. And for most questions we used **integration by substitution** to solve them.

### Summary of Derivatives

$$
\begin{aligned}
&\frac{d}{dx}\left(e^{u(x)}\right) = e^{u(x)} \cdot \frac{du}{dx}\\
&\frac{d}{dx}\left( a^{u(x)}\right) = a^{u(x)}\ln a \cdot \frac{du}{dx}\\
&\frac{d}{dx}\left( \ln u(x)\right) = \frac{1}{u(x)} \cdot \frac{du}{dx}\\
&\frac{d}{dx}\left( \log_{a}u(x)\right) = \frac{1}{u(x)\ln a} \cdot \frac{du}{dx}
\end{aligned}
$$

### Summary of Integrals

$$
\begin{aligned}
\int e^{u(x)} \, du &= e^u+C\\
\int a^{u(x)} \, du &= \frac{a^{u(x)}}{\ln a}+C\\
\int \frac{1}{u(x)}\, du &= \ln |u(x)|+C
\end{aligned}
$$

## Logarithmic Differentiation

The other thing that we looked at in MAT121 is the **Quotient Rule** which dealt with the differentiation of rational functions. However, some rational functions are so complicated such that using the quotient seems almost impossible.

For example, consider the function below:

$$
y=\frac{x^5}{(1-10x)\sqrt{x^2+2}}
$$

The above function can be solved using the quotient rule but the process will be very complicated to follow. Therefore we will be using the **Logarithmic Differentiation**.

In this process of differentiation, we will be introducing natural logarithms both sides and solve the function implicitly (Check and review on [Implicit Differentiation](https://tutorial.math.lamar.edu/classes/calci/implicitdiff.aspx) too).

> Example 1

> Find the derivative of $y=\frac{x^5}{(1-10x)\sqrt{x^2+2}}$ with respect to $x$.

> **Solution**

Given $y=\frac{x^5}{(1-10x)\sqrt{x^2+2}}$, introduce natural logarithms both sides.

$$
\ln (y)=\ln \left(\frac{x^5}{(1-10x)\sqrt{x^2+2}} \right)
$$

We then apply the rules of indices and logarithms where we know that if the expressions are multiplying, then, their logs are adding and if the expressions are dividing, then their logs are subtracting, and a power is a product of a log.

$$
\ln y = \ln x^5 - \ln\left((1-10x)\sqrt{x^2+2} \right) =\ln x^5 - \left[ \ln(1-10x)+\ln (x^2+2)^{\frac{1}{2}} \right]
$$

$$
\ln y = \ln x^5 -\ln(1-10x)-\frac{1}{2}\ln (x^2+2)
$$

After this, we will differentiate implicitly; each term on its own using the derivative rules from equations on the summaries, where in simplified terms, for $y=\ln u$, $y'=\frac{u'}{u}$.

Let's now use the implicit differentiation to differentiate $\ln y = \ln x^5 -\ln(1-10x)-\ln \sqrt{x^2 +2}$ term by term as follows:

$$
\frac{dy}{dx}(\ln y)=\frac{1}{y}\times\frac{dy}{dx}=\frac{y'}{y} \text{ since }\frac{dy}{dx}=y'
$$

$$
\frac{dy}{dx}(\ln x^5)=\frac{5x^4}{x^{5}}=\frac{5}{x}
$$

$$
\frac{dy}{dx}(\ln(1-10x))=\frac{-10}{1-10x}
$$

$$
\frac{dy}{dx}\left( \frac{1}{2}\ln (x^2+2)\right) =\frac{1}{2}\times \frac{2x}{x^2+2}=\frac{x}{x^2+2}
$$

From here, we just need to combine everything and simplify if possible.

Therefore, the derivative of $y=\frac{x^5}{(1-10x)\sqrt{x^2+2}}$ is

$$
\frac{y'}{y}=\frac{5}{x}-\left( \frac{-10}{1-10x}\right) - \frac{x}{x^2 + 2}=\frac{5}{x}+\frac{10}{1-10x} - \frac{x}{x^2 + 2}
$$

If we multiply $y$ both sides,

$$
y'=\left( \frac{5}{x}+ \frac{10}{1-10x}- \frac{x}{x^2 + 2}\right) \times y
$$

But $y=\frac{x^5}{(1-10x)\sqrt{x^2+2}}$, if we substitute we get the final derivative of $y$ as,

$$
\therefore \boxed{\frac{dy}{dx}=\left( \frac{5}{x}+ \frac{10}{1-10x}- \frac{x}{x^2 + 2}\right) \left( \frac{x^5}{(1-10x)\sqrt{x^2+2}}\right) }
$$

We can see here that it's slightly simpler to do the differentiation using logarithms that it could be if we have used the product and quotient rules. In addition, the answers are also simplified which improves our understanding to the process.

The same approach is also used to differentiate expressions in which functions are raised to other functions. Thus:

$$
\text{If } y=f(x)^{g(x)} \text{, then, } \ln y = \ln \left( f(x)^{g(x)}\right)=g(x)\ln f(x)
$$

Then, we apply **implicit differentiation** and use the product rule on the right hand side to finish the differentiation process.

> Example 2

> Find the derivative of $y=x^x$ with respect to $x$.

> **Solution**

Firstly, we can happily see that both power rule $y'=nx^{n-1}$ and the exponential differentiation $y'=a^x \ln a$ won't work. So, let's introduce the logarithms.

$$\ln y = \ln x^x = x\ln x$$

Here, we will differentiate $\ln y$ implicitly and $x\ln x$ using the product rule.

$$\frac{1}{y}\cdot \frac{dy}{dx}=1\cdot\ln x + x\cdot\left( \frac{1}{x}\right) =\ln x + 1$$

Multiplying by $y$ both sides yields

$$\boxed{ \frac{dy}{dx}=(\ln x + 1)x^x}$$

> Example 3

> Differentiate $y=(1-3x)^{\cos x}$ with respect to $x$

> **Solution**

Let $y = (1-3x)^{\cos x}$. To differentiate, introduce natural logarithms on both sides:

$$\ln y = \ln \left( (1-3x)^{\cos x} \right) = \cos x \cdot \ln(1-3x)$$

Now, differentiate both sides with respect to $x$:

$$\frac{1}{y} \frac{dy}{dx} = \frac{d}{dx} \left( \cos x \cdot \ln(1-3x) \right)$$

Apply the product rule to the right side:

$$\frac{d}{dx} \left( \cos x \cdot \ln(1-3x) \right) = -\sin x \cdot \ln(1-3x) + \cos x \cdot \frac{-3}{1-3x}$$

So,

$$\frac{1}{y} \frac{dy}{dx} = -\sin x \cdot \ln(1-3x) - \frac{3\cos x}{1-3x}$$

Multiply both sides by $y$:

$$\therefore\boxed{ \frac{dy}{dx} = \left[ -\sin x \cdot \ln(1-3x) - \frac{3\cos x}{1-3x} \right] (1-3x)^{\cos x} }$$

> Example 4

> Differentiate $y=\left(\frac{2x+1}{3x-1}\right)^{x^2}$ with respect to $x$

> **Solution**

Let $y = \left(\frac{2x+1}{3x-1}\right)^{x^2}$. To differentiate, introduce natural logarithms on both sides:

$$\ln y = \ln \left( \left(\frac{2x+1}{3x-1}\right)^{x^2} \right) = x^2 \cdot \ln\left(\frac{2x+1}{3x-1}\right)$$

Now, differentiate both sides with respect to $x$:

$$\frac{1}{y} \frac{dy}{dx} = \frac{d}{dx} \left( x^2 \cdot \ln\left(\frac{2x+1}{3x-1}\right) \right)$$

Apply the product rule to the right side:

$$\frac{d}{dx} \left( x^2 \cdot \ln\left(\frac{2x+1}{3x-1}\right) \right) = 2x \cdot \ln\left(\frac{2x+1}{3x-1}\right) + x^2 \cdot \frac{(2(3x-1) - (2x+1)3)}{(2x+1)(3x-1)}$$

So,

$$\frac{1}{y} \frac{dy}{dx} = 2x \cdot \ln\left(\frac{2x+1}{3x-1}\right) + x^2 \cdot \frac{(6x-2 - 6x - 3)}{(2x+1)(3x-1)}$$

Multiply both sides by $y$:

$$\therefore\boxed{ \frac{dy}{dx} = \left[ 2x \cdot \ln\left(\frac{2x+1}{3x-1}\right) + x^2 \cdot \frac{-5}{(2x+1)(3x-1)} \right] \left(\frac{2x+1}{3x-1}\right)^{x^2} }$$

### Basic Differentiation Formulas

Before we look more examples, let's revise some of the basic differentiation formulas to avoid confusion.

| Derivative | Name |
|------------|------|
| $\frac{d}{dx}(c) = 0$ | Constant Differentiation |
| $\frac{d}{dx}(x^n) = nx^{n-1}$ | Power Rule |
| $\frac{d}{dx}(a^x) = a^x\ln a$ | Derivative of an Exponential Function |
| $\frac{d}{dx}(x^x) = x^x(1+\ln x)$ | Logarithmic Differentiation |

It's very useful to keep an eye on the theorems we use to avoid costly mistakes since a lot of things look similar but are mathematically different.

> Example 5
>
> Differentiate $f(x)=(5-3x^2)^7\sqrt{6x^2+8x-12}$
>
> **Solution:**

$$\ln f(x)=\ln\left[(5-3x^2)^7\sqrt{6x^2+8x-12} \right] =\ln(5-3x^2)^7+\ln(6x^2+8x-12)^{\frac{1}{2}}$$

$$\ln f(x)=7\ln(5-3x^2)+\frac{1}{2}\ln(6x^2+8x-12)$$

$$\frac{f'(x)}{f(x)}=7\left(\frac{-6x}{5-3x^2} \right) +\frac{1}{2}\left( \frac{12x+8}{6x^2+8x-12} \right)$$

$$f'(x)=f(x)\left( \frac{-42x}{5-3x^2}+\frac{6x+4}{6x^2+8x-12}\right) $$

$$\therefore \boxed{ f'(x)=(5-3x^2)^7\sqrt{6x^2+8x-12}\left[ \frac{-42x}{5-3x^2}+\frac{6x+4}{6x^2+8x-12}\right]}$$

> Example 6

> Differentiate $y=(2x-e^{8x})^{\sin 2x}$

> **Solution:**

$$\ln y = \ln \left(2x-e^{8x} \right)^{\sin 2x}=\sin 2x \ln(2x-e^{8x})$$

$$\frac{y'}{y} = (2\cos 2x)\cdot\ln(2x-e^{8x})+\sin 2x\cdot\left(\frac{2-8e^{8x}}{2x-e^{8x}} \right) $$

$$y'=\left(2\cos 2x\ln(2x-e^{8x})+\frac{\sin 2x(2-8e^{8x})}{2x-e^{8x}} \right) \times y$$

$$\therefore \boxed{y'=\left[2\cos 2x\ln(2x-e^{8x})+\frac{\sin 2x(2-8e^{8x})}{2x-e^{8x}} \right]\left[ (2x-e^{8x})^{\sin 2x}\right] }$$

> Example 7

> Differentiate $y=\frac{\sqrt{5x+8}\sqrt[3]{1-9\cos4x}}{\sqrt[4]{t^2+10t}}$.

> **Solution:**

$$\ln y = \ln \left( \frac{\sqrt{5x+8}\sqrt[3]{1-9\cos4x}}{\sqrt[4]{t^2+10t}} \right) = \ln (5x+8)^{\frac{1}{2}}+\ln (1-9\cos 4x)^{\frac{1}{3}}-\ln (t^2+10t)^{\frac{1}{4}}$$

$$\ln y = \frac{1}{2}\ln (5x+8)+\frac{1}{3}\ln (1-9\cos4x)-\frac{1}{4}\ln (t^2+10t)$$

$$\frac{y'}{y}=\frac{1}{2}\cdot\frac{5}{5x+8}+ \frac{1}{3}\cdot\frac{12\sin 4x}{1-9\cos 4x}-\frac{1}{2}\cdot\frac{t+5}{t^2 +10t}$$

$$y'=\left[ \frac{5}{2(5x+8)}+\frac{12\sin4x}{1-9\cos4x}+\frac{t+5}{2(t^2+10t)}\right]\times y$$

$$\therefore \boxed{y'=\left[ \frac{5}{2(5x+8)}+\frac{12\sin4x}{1-9\cos4x}+\frac{t+5}{2(t^2+10t)}\right]\left[ \frac{\sqrt{5x+8}\sqrt[3]{1-9\cos4x}}{\sqrt[4]{t^2+10t}}\right] }$$

## Logarithmic Integration

So far, we have seen that the derivative of $\ln x$ is $\frac{1}{x}$. And let's say we want to integrate $\frac{1}{x}$ using the power rule; $\int x^n \, dx = \frac{x^{n+1}}{n+1}+C$.

Firstly we will write $\frac{1}{x}$ as $x^{-1}$ using the rules of indices. If we apply the power rule here,

$$\int x^{-1}\, dx = \frac{x^{-1+1}}{-1+1}=\frac{x^0}{0}=\frac{1}{0}$$

which is undefined.

Now, knowing the fact that the integral is an antiderivative of a given function, we can happily conclude from **Integral Equations** that $\ln x$ is an antiderivative of $\frac{1}{x}$ on the interval $(-\infty,0)\cup(0,\infty)$ that doesn't contain $0$. Therefore:

### Important Integral

$$\int \frac{1}{u} \, du = \ln |u|+C$$

This result comes from the derivative of $\ln x$ and cannot be solved using the power rule.

> Example 8

> Evaluate $\displaystyle\int\limits_1^e \frac{1}{x} \, dx$

> **Solution**

We will firstly find the indefinite integral then handle the limits later. Thus,

$$\int \frac{1}{x} = \ln |x| + C$$

Bringing the limits in,

$$\int\limits_1^e \frac{1}{x}\, dx = [\ln x]_1^e=\ln e - \ln 1=1-0=1$$

from rules of logarithms, we know that $\ln e = \log_{e}e = 1$ and $\ln 1 = 0$.

> Example 9

> Evaluate $\displaystyle\int \frac{3x^2}{x^3 +5}\, dx$.

> **Solution**

We will be using **Integration by Substitution**. The idea is to eliminate a certain part of the expression by substituting a derivative of another part of the given expression. Here, let $u=x^3+5$, after differentiating $\frac{du}{dx}=3x^2$. Making $dx$ a subject of the formula, we get $dx=\frac{du}{3x^2}$. Hence we will substitute $u$ and $dx$:

$$\int \frac{3x^2}{u}\cdot\frac{du}{3x^2}=\int \frac{1}{u}du=\ln u +C$$

And substituting $u$ back, yields

$$\int \frac{3x^2}{x^3 +5}\, dx = \ln |x^3+5|+C$$

> Example 10

> Evaluate $\displaystyle\int \tan x \, dx$

> **Solution**

Apply the trig identity: $\tan x = \frac{\sin x}{\cos x}$.

$$\int \tan x \, dx = \int \frac{\sin x}{\cos x}\, dx$$

Let $u = \cos x$, then $du = -\sin x \, dx$.

$$\int \frac{\sin x}{\cos x} \, dx = -\int \frac{du}{u} = -\ln |u| + C$$

Substitute $u$ back:

$$\int \tan x \, dx = - \ln |\cos x| + C$$

> Example 11

> Integrate $\displaystyle\int \frac{dx}{x\ln x}$.

> **Solution:**

Let $u = \ln x$, then $du = \frac{1}{x}\, dx$.

Substitute to get:

$$\int \frac{dx}{x\ln x} = \int \frac{du}{u} = \ln |u| + C$$

Substitute $u$ back:

$$\int \frac{dx}{x\ln x} = \ln |\ln x| + C$$

> Example 12
>
> Evaluate $\displaystyle\int \frac{\sin 3\theta}{1+\cos 3\theta}\, d\theta$.
>
> **Solution:**

Let $u = 1 + \cos 3\theta$, then $du = -3\sin 3\theta\, d\theta$.

$$\int \frac{\sin 3\theta}{1+\cos 3\theta}\, d\theta = -\frac{1}{3}\int \frac{du}{u} = -\frac{1}{3}\ln |u| + C$$

Substitute $u$ back:

$$\int \frac{\sin 3\theta}{1+\cos 3\theta}\, d\theta = -\frac{1}{3}\ln |1+\cos 3\theta| + C$$

> Example 13

> Evaluate $\displaystyle\int \cot x \, dx$.

> **Solution:**

$\cot x = \frac{\cos x}{\sin x}$, let $u = \sin x$, $du = \cos x\, dx$.

$$\int \cot x \, dx = \int \frac{\cos x}{\sin x}\, dx = \int \frac{du}{u} = \ln |u| + C$$

Substitute $u$ back:

$$\int \cot x \, dx = \ln |\sin x| + C$$

## Chapter Review

1. Use logarithmic differentiation to find $\frac{dy}{dx}$ for $y = \frac{x^3\sqrt{2x+1}}{(x^2-5)^4}$.
2. Differentiate $y = (3x^2 + 1)^{\sin x}$ using logarithmic differentiation.
3. Find $\frac{dy}{dx}$ if $y = x^{\ln x}$.
4. Use logarithmic differentiation to find the derivative of $y = \frac{(x-1)^3(x+2)^2}{\sqrt{x^2+4}}$.
5. Differentiate $y = (\cos x)^x$ for $x \in (0, \pi/2)$.
6. Evaluate $\displaystyle\int \frac{2x}{x^2 + 3} \, dx$.
7. Find $\displaystyle\int \frac{e^{2x}}{1 + e^{2x}} \, dx$.
8. Evaluate $\displaystyle\int \frac{\ln x}{x} \, dx$.
9. Compute $\displaystyle\int \frac{dx}{x \ln x \ln(\ln x)}$.
10. Find $\displaystyle\int_1^e \frac{\ln x}{x^2} \, dx$.

---

## References

Stewart, J. (2020). *Calculus: Early Transcendentals*. 9th Edition. Cengage Learning.

Anton, H., Bivens, I., & Davis, S. (2016). *Calculus: Early Transcendentals*. 11th Edition. Wiley.

Larson, R., & Edwards, B. H. (2018). *Calculus*. 11th Edition. Cengage Learning.
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

# Chapter 2: Pigeonhole Principles

The pigeonhole principle is a powerful and intuitive technique used in mathematics to prove the existence of repetitions or collisions. At its core, it says:

**If you place more items than containers, at least one container must hold more than one item.**

This idea has countless applications in combinatorics, number theory, computer science, and real life.

**Table of Contents**

- Introduction
- The Simplest Form
- The Regular Form
- Extended Regular Form
- Generalised Form

## Introduction to the Pigeonhole Principle

**Definition**

Let $A$ and $B$ be two finite sets where the number of elements in $A$ is greater than the number of elements in $B$:

$$|A| > |B|$$

Then, for any function $f : A \to B$, there exists at least one element $b \in B$ such that:

$$|\{ a \in A \mid f(a) = b \}| \geq 2$$

This means that some element $b \in B$ is the image of two or more elements from $A$.

> Example: Birth Months
>
> **Statement:** Among any 13 people, at least two must have been born in the same month.
>
> **Explanation:**

$$
\begin{aligned}
\text{People} &= 13 \quad (\text{pigeons}) \\
\text{Months} &= 12 \quad (\text{pigeonholes}) \\
\text{Since } 13 > 12, &\text{ at least one month must be shared by at least 2 people.}
\end{aligned}
$$

> Example: The Shoebox Argument
>
> Suppose you randomly pick 11 shoes from a drawer containing 10 pairs (20 shoes total). You are guaranteed to get at least one matching pair.
>
> **Why?** Because:

$$\begin{align*}
\text{Pigeonholes} &= 10 \text{ (shoe types)} \\
\text{Pigeons} &= 11 \text{ (individual shoes)} \\
\Rightarrow &\text{One type must appear at least twice} \\
&\text{→ a matched pair is guaranteed.}
\end{align*}$$

**Theorem (Basic Pigeonhole Principle)**

If $n$ items are placed into $m$ containers and $n > m$, then at least one container holds more than one item.

**Generalized Pigeonhole Principle**

If $n$ items are placed into $m$ containers, then at least one container holds at least:

$$\left\lceil \frac{n}{m} \right\rceil \quad \text{items}$$

Here, $\lceil x \rceil$ means the smallest integer ≥ $x$ (the ceiling function).

> Example: Handshake Problem
>
> In a group of 8 people, if each person shakes hands with at least one other, then at least two people shook hands the same number of times.
>
> **Why?** Handshake counts must be in the range $1$ to $7$. But 8 people can't all have different values from this range — there's only 7 options. So some two people share a count.

> Example: Sock Drawer
>
> If you pick 4 socks from a drawer containing only red, blue, and green socks, you are guaranteed to have at least two of the same color.
>
> **Explanation:** By the pigeonhole principle:

$$\begin{align*}
\text{Colors} &= 3 \\
\text{Socks Picked} &= 4 \\
\Rightarrow &\text{At least one color appears at least twice.}
\end{align*}$$

### Why It Matters

The pigeonhole principle may seem obvious, but it's incredibly powerful. It can be used to prove unexpected results, such as:

- Two people in Malawi having the same number of hairs (pigeons = people, holes = number of possible hair counts)
- In a group of students, at least two will score the same on a multiple-choice test with limited score options
- There are always at least two people in any group of 367 who share a birthday (since there are only 366 possible birthdays, including leap day)

### Coming Next

In the next sections, we'll explore fascinating applications and clever problems where the pigeonhole principle helps solve difficult puzzles with simple logic.

## The Simplest Form of Pigeonhole Principle

**Theorem (Simplest Form)**

If $n + 1$ pigeons are placed in $n$ pigeonholes, there will be a pigeonhole with more than one pigeon in it.

**Proof by contradiction:**

Assume each pigeonhole has ≤1 pigeon.

That means;

| $\leq1$ | $\leq1$ | $\leq1$ | $\dots$ | $\leq1$ |
|---------|---------|---------|---------|---------|

Here, the total is $\leq n$. But we have a total of $n+1$ pigeons. So, by the pigeonhole principle, at least one pigeonhole must contain more than one pigeon. This contadicts our hypothesis. So, our assumption that each pigeonhole has $\leq1$ pigeon must be false. Therefore, the simplest form of the pigeionhole must always be true.

> Example: PIN Codes
>
> Prove that among auto-teller card holders in Malawi, at least two share the same 4-digit PIN code.
>
> **Solution:**

This questions follows the fact that we have various banks available in malawi. Since the banks issue a four-digit pin code to each card holder, we can consider the number of pin codes as the pigeonholes and the card holders as the pigeons.

**For 4-digit pin codes**

- Possible PIN codes: $10^4 = 10,000$ using product rule
- Pigeonholes = 10,000 possible codes

Here, we only need a minimum of 10,001 card holders to guarantee that at least two share the same pin code.

> Example: Number Divisibility
>
> For $N = 21$ and $M = 617$, prove ∃ number of form $212121\cdots2100\cdots0$ divisible by 617.
>
> **Solution:**

Firstly, we will create a sequence where the number of 21s in the term $T_n$ is equal to $n$ as follows:

- $T_1 = 21$ (one 21)
- $T_2 = 2121$ (Two 21s)
- $T_3 = 212121$ (Three 21s)

$\vdots$

- $T_{617} = 2121212121\ldots 21$ (617 21s)

From the division understanding, remainders of division to a number $1$ less than the divisor. As such, in this we have $617$ remainders that arise from dividing by $617$ in the range $0\leq r < 617$.

Let $r_i$, where $i\in \mathbb{N}$, be the remainder left when $T_i$ is divided by $617$. This means that we have another sequence of remainders only; $r_1, r_2, r_3, \ldots, r_{617}$.

If there exists any $r_i = 0$, then there is a number a number $212121\ldots21$ divisible by $617$. And hence, it is also obvious that that there will exist a number the form $212121\ldots 21210000\ldots0$ divisible by $617$.

However, if none of the remainders is equal to $0$, then we will have some easy work to do. Remember the sequence of remainders? since $0$ isn't part of the remainders anymore, our remainders will now range from $1$ to $616$ such that

$$1\leq r_1, r_2, r_3, r_4, \ldots, r_{617}\leq 616$$

Clearly, we have $617$ total remainders and only $616$ possible or available remainders. By the pigeonhole principle, the number of pigeons (total remainders) is greater than the number of pigeonholes (possible remainders). Hence at least two terms leave the same remainders when divided by $617$.

Therefore, lets assume that $T_i$ and $T_j$, where $T_j$ is greater (or conatins more 21s) than $T_i$, leave the same remainder.

$$r_i=r_j \quad \quad \forall i< j$$

Applying the Division Algorithm, we can write the terms as follows

$$T_i = 617 \times W + r_i$$

$$T_j = 617 \times Z + r_j$$

When subtract the two numbers on the Left Handside of the $=$ sign.

| $21$ | $21$ | $21$ | $\dots$ | $21$ | $21$ | $21$ | $21$ | $\dots$ | $21$ |
|------|------|------|---------|------|------|------|------|---------|------|
| $-$  |      |      |         |      | $21$ | $21$ | $21$ | $\ldots$ | $21$ |
|------|------|------|---------|------|------|------|------|---------|------|
| $21$ | $21$ | $21$ | $\dots$ | $21$ | $0$  | $0$  | $0$  | $\dots$ | $0$  |

The 21s that are in the smaller number, will make 0s at the end of the larger number. On the other hand, if we subtract on the Right Handside, we will get:

$$(617\times Z)-(617\times W)=617(Z-W)$$

since $r_j-r_i=0$

Thus, $212121\dots 21000\ldots 0=617(Z-W)$ which is a product. **Hence, There is indeed a number of the form $212121\ldots 21000\ldots 0$ which is divisible by 617.**

## The Regular Form

**Theorem (Regular Form)**

If $nr + 1$ letters are placed in $n$ pigeonholes, then ∃ pigeonhole with $> r$ letters.

> Example: Birth Months
>
> Among 49 persons, prove >4 born in same month.
>
> **Solution:**

$$49 = 12 \times 4 + 1 \text{ persons (pigeons), 12 months (holes)}$$

$$\Rightarrow \text{∃ month with >4 persons}$$

## Extended Regular Form

**Theorem (Extended Form)**

If $n$ letters in $k$ pigeonholes, ∃ hole with $> \left\lfloor \frac{n-1}{k} \right\rfloor$ letters.

**Proof:** If all holes had ≤ $\left\lfloor \frac{n-1}{k} \right\rfloor$ letters, total ≤ $k \cdot \left\lfloor \frac{n-1}{k} \right\rfloor \leq n-1$, contradiction.

> Example: School Classes
>
> 401 students in 4 classes ⇒ ∃ class with >100 students.

$$\left\lfloor \frac{401-1}{4} \right\rfloor = 100 \Rightarrow \text{>100 students}$$

## Generalized Form

**Theorem (Generalized Form)**

If $q_1 + q_2 + \cdots + q_r - r + 1$ letters in $r$ holes, then hole 1 has ≥ $q_1$ letters OR hole 2 has ≥ $q_2$ letters ... OR hole r has ≥ $q_r$ letters.

> Example: Birth Months
>
> Minimum persons to guarantee ≥3 born in same month:

$$q_i = 3 \text{ for 12 months, } N = 12 \times 3 - 12 + 1 = 25$$

**Average Value Theorem**

For numbers $x_1, x_2, \ldots, x_n$:

1. ∃ $x_i \leq$ average
2. ∃ $x_j \geq$ average

**Proof:** By contradiction. If all $x_i >$ average, sum > n·average, contradiction.

## Practice Activities

**Activity 2a**

a. Prove: 367 babies born in 2008 ⇒ at least two share birthday
b. Minimum persons to guarantee shared first initials (English alphabet)
c. 101 numbers from {1,2,...,200} ⇒ ∃ two coprime numbers

**Activity 2b**

a. Studied 4 hours in 3 days ⇒ ∃ day studied ≤ 1h20m
b. Studied 4 hours in 3 days ⇒ ∃ day studied > 1 hour
c. 11 numbers from {1,2,...,20} ⇒ ∃ pair where one divides other

---

## REFERENCES

Levin O. (2019). Discrete Mathematics: An open Introduction, 3rd Edition. University of Northern Colorado. http://math.oscarlevin.com/

Keller M. T. & Trotter W. T. (2023). Applied Combinatorics. Libre Texts

Susanna S. Epp. (2010). Discrete Mathematics with Applications, 4th Edition. Brooks/Cole. DePaul University

Rosen K. H. (2019). Discrete Mathematics with Applications, 8th Edition. McGraw Hill

Hammack R. (n.d). Elements of Discrete Mathematics. Virginia Commonwealth University

Levin O. (2023). Discrete Mathematics. University of Northern Colorado. Libre Texts.
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

# Chapter 1: Counting Techniques

> Theorem: Fundamental Counting Principles
>
> Counting techniques form the foundation of combinatorics. The two fundamental principles are:
>
> 1. **Product Rule:** Used when events occur in sequence
> 2. **Sum Rule:** Used when events are mutually exclusive
---

## The Product Rule

The product rule is a fundamental principle in combinatorics that helps you count the number of ways to perform a sequence of tasks.

> Theorem: Product Rule Definition
>
> It states that if you have two independent tasks, and there are $m$ ways to perform the first task and $n$ ways to perform the second task, then there are $m \times n$ ways to perform both tasks in sequence.

> Example: Circuit Diagram Example
>
> ![Circuit diagram](/assets/images/circuit.svg)
>
> **Problem:** In how many ways can the switches be connected such that the bulb gives light?
>
> **Solution:**
>
> - Switch a can be connected to switch 1, 2 and 3 on the other side. That is, the connections will be a1, a2 and a3
> - Switch b can be connected to those three other switches too formulating connections b1, b2 and b3.
>
> Therefore, using the product rule, we can simply multiply the two tasks and get the total number of ways to connect the switches as:
>
> $$2 \times 3 = 6 \text{ ways}$$

> Example 1
>
> How many pairs of numbers can be made from two sets $X = \{1, 2, 3\}$ and $Y = \{4, 5, 6, 7, 8\}$ such that each set has got a member of both sets?
>
> **Solution:**
>
> Since we are given two sets, the total number of ways is the product of elements in either set. That is, $n(X) \times n(Y)$
>
> $$= 3 \times 5 = 15 \text{ ways}$$

> Example 2
>
> How many license plates can you make out of three letters followed by three numerical digits?
>
> **Solution:**
>
> Here we have six events: the first letter, the second letter, the third letter, the first digit, the second digit, and the third digit. The first three events can each happen in 26 ways; the last three can each happen in 10 ways. Using product rule, the total number of license plates will be:
>
> $$26 \times 26 \times 26 \times 10 \times 10 \times 10 = 17,576,000$$

> Example 3
>
> How many two-digit numbers are there?
>
> **Solution:**
>
> - **First Digit:** Cannot be zero. Thus, $X = \{1, 2, 3, \ldots, 9\}$, which has $9$ possible choices.
> - **Second Digit:** Can include zero. Thus, $Y = \{0, 1, 2, \ldots, 9\}$, which has $10$ possible choices.
>
> Using the product rule, the total number of two-digit numbers is the product of the number of choices for each digit:
>
> $$9 \times 10 = 90 \text{ numbers}$$
>
> **Note:** Theoretically, two-digit numbers start at 10 and end at 99, from 1 to 9 are single digit numbers. In other words, therefore, two-digit numbers = $99 - 9 = 90$

> Example 4
>
> How many different ways can you sit people into two chairs chosen from a group of 9 people?
>
> **Solution:**
>
> To determine the number of ways to seat people into two distinct chairs:
>
> - **First Chair:** Can be occupied by any of the 9 people.
> - **Second Chair:** After seating the first person, 8 people remain. Thus, there are 8 choices.
>
> Since the selection is without replacement, the total number of ways is:
>
> $$9 \times 8 = 72 \text{ ways}$$

> Example 5
>
> How many distinct four-digit numbers are there?
>
> **Solution:**
>
> To count distinct four-digit numbers with no repeated digits:
>
> - **First Digit:** Must be non-zero. Choices: $\{1, 2, \ldots, 9\}$ ⟹ $9$ ways.
> - **Second Digit:** Any digit except the first. Choices: $10 - 1 = 9$ ways.
> - **Third Digit:** Excluding the first two. Choices: $10 - 2 = 8$ ways.
> - **Fourth Digit:** Excluding the first three. Choices: $10 - 3 = 7$ ways.
>
> Using the product rule for distinct digits:
>
> $$9 \times 9 \times 8 \times 7 = 4536 \text{ distinct four-digit numbers}$$

---

## The Sum Rule

This rule comes into play when you have to make a choice between two or more options that are mutually **Exclusive** or **disjoint**. The sum rule helps you count the total number of ways you can make such a choice. It is important that the events must be disjoint: i.e., that there is no way for both to happen at the same time.

For example, a normal deck of 52 cards contains red cards and face cards. However, the number of ways to select a card which is either red or a face card is not 26 + 12. This is because there are 6 cards which are both red and face cards. The problem consisting of common elements in sets have been tackled on [Inclusion and Exclusion Principle](#inclusion-exclusion-principle) later in this document.

> Theorem: Sum Rule Definition
>
> If there are $m$ ways to do one thing and $n$ ways to do another, and the two actions cannot happen simultaneously, then there are $m + n$ ways to choose one of the actions.
>
> In other words, the additive principle states that if event A can occur in $m$ ways, and event B can occur in exclusive or disjoint $n$ ways, then the event "A or B" can occur in $m+n$ ways.

> Example 1
>
> Suppose you're ordering a pizza and can choose toppings from two different categories: vegetables and meats. There are 4 vegetable toppings and 3 meat toppings.
>
> **Solution:**
>
> You can either choose toppings from the vegetable category or the meat category.
>
> - Ways to choose vegetable toppings: $4$
> - Ways to choose meat toppings: $3$
>
> By the sum rule, the number of topping choices is:
>
> $$4 + 3 = 7 \text{ choices}$$

**Note on Sets:**

In cases of sets, the total number of selections is equal to the union of the two sets. Given $A$ and $B$ as finite sets, such that no element of the sets is common, the number of ways to choose from either set is equal to the union of the two sets.

Mathematically, given $A$ and $B$, such that $A \cap B = \{\}$,

Number of ways $A \cup B = n(A) + n(B)$; $n(A \cap B) = 0$

$$(A \cap B) = \{ x \mid x \in A \text{ and } x \in B \}$$

**Thus:** The sets should not have common elements.

> Example 2
>
> A class has 50 girls and 150 boys. In how many ways can a teacher choose a representative such that it's either a boy or a girl?
>
> **Solution:**
>
> Let $A$ be the set of girls, $A = \{\text{girls}\}$.
> Let $B$ be the set of boys, $B = \{\text{boys}\}$.
> Since no one is both a boy and a girl, $A \cap B = \emptyset$.
>
> By the sum rule, the number of ways to choose a representative is:
>
> $$50 + 150 = 200 \text{ ways}$$

> Example 3
>
> How many ways can you choose a fruit from a basket containing 5 apples and 3 oranges?
>
> **Solution:**
>
> Let $A$ be the set of apples, $A = \{\text{apples}\}$.
> Let $B$ be the set of oranges, $B = \{\text{oranges}\}$.
> Since no fruit is both an apple and an orange, $A \cap B = \emptyset$.
>
> By the sum rule, the number of ways to choose a fruit is:
>
> $$n(A \cup B) = |A| + |B| = 5 + 3 = 8$$
>
> **Number of ways = 8 ways**

> Example 4
>
> In a school club, there are 12 science books and 8 art books. If a student is allowed to pick one book, how many different choices does the student have?
>
> **Solution:**
>
> The student can choose either a science book or an art book, and no book is both a science and an art book.
>
> - Ways to choose a science book: $12$
> - Ways to choose an art book: $8$
>
> By the sum rule, the total number of choices is $12 + 8 = 20$.
>
> $$\text{Total choices} = 12 + 8 = 20$$
>
> **Number of ways = 20 ways**

### Comparison: Product Rule vs. Sum Rule

| Feature | Product Rule | Sum Rule |
|---------|-------------|----------|
| **Type of Events** | Sequential/Independent (AND) | Mutually Exclusive/Disjoint (OR) |
| **Question Keywords** | "and", "followed by", "then", "in sequence" | "or", "either...or", "choose one of" |
| **Example Scenario** | Choosing an outfit: shirt **and** pants | Choosing a snack: apple **or** banana |
| **Mathematical Operation** | Multiplication ($m \times n$) | Addition ($m + n$) |
| **When to Use** | When all choices are made together, one after another | When only one choice is made from several disjoint options |
| **Typical Question** | How many ways to do A **and** B? | How many ways to do A **or** B? |

**Tip:** If the question involves making several choices in a row, use the product rule. If it involves picking one from separate groups, use the sum rule.

---

## Combinations and Permutations

Combinations and permutations are two fundamental concepts in combinatorics that deal with the arrangement and selection of objects. Understanding the difference between them is crucial for solving problems related to counting arrangements.


### Permutations

> Definition: Permutations
>
> Permutations are arrangements where order matters.
>
> **Key Points:**
>
> - **Order matters:** Changing the order of objects creates a new permutation. For example, the arrangements **ABC** and **BAC** are considered different.
> - **No repetition (by default):** In most basic permutation problems, each object is used only once. For example, arranging the letters A, B, and C with no repeats.
> - **With repetition:** Sometimes, objects can repeat (like letters in "MISSISSIPPI"), but unless stated, assume no repetition.

> Theorem: What is a permutation?
>
> A permutation is a way of arranging all or part of a set of objects. The number of permutations depends on:
>
> - How many objects you have in total (n)
> - How many you are arranging at a time (r)
> - Whether repetition is allowed or not

> Example: Simple Example - Arranging Letters
>
> Consider the letters **(a, b, c)**. Let's list all the possible ways to arrange them so that no letter is repeated:
>
> **abc, acb, bac, bca, cab, cba**
>
> **How did we get these?**
>
> - For the first position, we have 3 choices (a, b, or c).
> - For the second position, only 2 choices remain.
> - For the last position, only 1 choice is left.
>
> So, the total number of arrangements is:
>
> $$3 \times 2 \times 1 = 6$$
>
> This is an example of the **multiplicative principle** (product rule).

> Theorem: General Formula for Permutations
>
> The number of ways to arrange **n** distinct objects in a line is called "**n factorial**", written as **n!**:
>
> $$n! = n \times (n-1) \times (n-2) \times \cdots \times 2 \times 1$$
>
> If you want to arrange only **r** objects out of **n** (where order matters), the number of permutations is:
>
> $$P(n, r) = \frac{n!}{(n - r)!}$$
>
> **Where:**
>
> - **n** = total number of objects
> - **r** = number of positions to fill (how many you are arranging)

> Example 1
>
> How many ways can you arrange 5 different books on a shelf?
>
> **Solution**
>
> Since all 5 books are being arranged, the answer is:
>
> $$5! = 5 \times 4 \times 3 \times 2 \times 1 = 120$$
>
> **There are 120 ways.**

> Example 2
>
> In how many ways can you select and arrange 3 students from a group of 8 for first, second, and third place?
>
> **Solution**
>
> Here, order matters (since each place is different), so use permutations:
>
> $$P(8, 3) = \frac{8!}{(8-3)!} = \frac{8 \times 7 \times 6 \times 5!}{5!} = 8 \times 7 \times 6 = 336$$
>
> **There are 336 ways.**

> Theorem: Permutations with Repeated Objects
>
> Sometimes, some objects are identical (repeated). In such cases, the number of **distinct** permutations is reduced because swapping identical objects does not create a new arrangement.
>
> **Example:** How many ways can you arrange the letters in the word **LEVEL**?
>
> - Total letters: 5
> - L appears 2 times, E appears 2 times, V appears 1 time
>
> The formula for permutations with repeated objects is:
>
> $$\text{Number of arrangements} = \frac{n!}{n_1! \times n_2! \times \cdots \times n_k!}$$
>
> Where $n$ is the total number of objects, and $n_1, n_2, \ldots$ are the counts of each repeated object. In other words, $n_1, n_2, \ldots$ are amount of times each element appears in the stack of elements given.
>
> For LEVEL:
>
> $$\frac{5!}{2! \times 2! \times 1!} = \frac{120}{2 \times 2 \times 1} = \frac{120}{4} = 30$$
>
> **There are 30 distinct arrangements.**

> Example 4
>
> Three eagles are flying over 365 chambo fish that have been laid for sun drying. The eagles plan to descend, each to pin a chambo of its own. In how many ways can they pick 3 fish?
>
> **Solution:**

 Since each eagle picks one fish and no fish can be picked twice, the number of ways is:

 Since the eagles will pick one fish, the possibilities decrease by 1 after every successful pick.

 $$\text{Number ways} = 365\times(365-1)\times(365-2)$$

 **Applying the permutation formula:**

 $${}^{365}P_3 = \frac{365!}{(365-3)!} = \frac{365!}{362!}$$

 $${}^{365}P_3 = \frac{365 \times 364 \times 363 \times 362!}{362!} = 365 \times 364 \times 363$$

 $${}^{365}P_3 = 48\,228\,180$$

 **There are $48,228,180$ ways for the eagles to pick 3 fish.**

**Summary: When to Use Permutations**

- Use permutations when **order matters** (e.g., races, seating arrangements, passwords where order is important).
- If objects are all different and used only once, use **n!** or **P(n, r)**.
- If some objects repeat, divide by the factorial of each repeated object's count.
- If order does **not** matter, use **combinations** (covered in the next section).

---

### Combinations

> Definition: Combinations
>
> **Combinations** is a technical term meaning **selections**. We use it to refer to the number of different sets of a certain size that can be selected from a larger collection of objects **where order does not matter**.
>
> **Key Points:**
>
> - Order does **not** matter: Selecting AB is the same as BA.
> - Combinations count **groups** or **subsets**, not arrangements.

> Example
>
> Suppose there is a group of 3 lawn tennis players: X, Y, and Z. A team consisting of two players is to be formed. In how many ways can this be done?
>
> **Working**

 - At first glance, you might list: XY, XZ, YX, YZ, ZX, ZY (6 ways).
 - But since order does not matter (XY is the same as YX), only 3 unique teams exist: XY, YZ, ZX.

 **So, there are 3 ways to form the team.**

 Theorem: Notation and Calculation

 - ${}^nC_r$ or $\binom{n}{r}$ or $n(c,r)$ and are read as **"n choose r"**
 - This stands for the number ways to choose $r$ items from $n$ items. In this case we find total selections and get rid of groups with the same items despite the order.

 **Formula (using permutations and factorial notation):**

 $${}^nC_r = \frac{{}^nP_r}{r!} = \frac{n!}{(n-r)! \, r!}$$

> Example 1
>
> How many three person committees can be formed from the five people: **A, B, C, D,** and **E**?
>
> **Solution**

 In this question we are solving for the number of 3-member subsets from the five given letters, ${}^5C_3$.

 $${}^5C_3 = \binom{5}{3}=\frac{{}^5P_3}{3!}=\frac{5!}{(5-3)!3!}$$

 $$= \frac{5 \times 4 \times 3!}{2! \times 3!}=\frac{20}{2} = 10$$

 $\therefore$ **We get 10 committees of 3 people each from a group of five people.**

> Example 2
>
> How many different five-card hands can be dealt from a deck of 52 playing cards?
>
> **Solution**
>
> Because the order in which the cards are dealt is not an issue, we are working with combination problem. Thus, using the formula for Combination for n = 52 and r = 5, we have:
>
> $${}^{52}C_5 = \frac{52!}{(52-5)!5!}=\frac{52 \times 51 \times 50 \times 49 \times 48 \times 47!}{5!\times 47!}$$
>
> $$=\frac{52 \times 51 \times 50 \times 49 \times 48}{5 \times 4 \times 3 \times 2 \times 1} =2, 598, 960$$

> Example 3
>
> The sequence $\{x, y, x, y, x, y, y, y\}$ has 3x's and 5y's. Find the number of distinct sequences possible.
>
> | x | y | x | y | x | y | y | y |
> |---|---|---|---|---|---|---|---|
>
> **Solution:**

 Number of sequences = number of choosing either $x$'s or $y$'s from a group of 8.

 You can either choose the $x$'s first then choose the $y$'s or the other ways round and we will get the following:

 $$\text{Number of sequences} = \binom{8}{3} = \binom{8}{5} = \frac{8!}{3!5!} = 56$$

 **Key Observation:** This demonstrates the combinatorial identity:

 $$\binom{n}{r} = \binom{n}{n-r}$$

 Here, $\binom{8}{3} = \binom{8}{5}$ since $5 = 8-3$. Note that we will come back to this idea later in this document.

> Example 4: Road Network Paths
>
> In a city, the road network consists of horizontal and vertical streets meeting at nodes/junctions (circles). How many paths exist from point A to point B moving only east and north?
>
> ![Street Grid Map](/assets/images/streetmap1.svg)
>
> **Solution:**

 - Regardless of which path to take from A to B, we make one step horizontally ($x$) or one step vertically ($y$) and then combine the subsequent steps.
 - Another observation that we can make is that no matter what path we choose, the number of horizontal and vertical moves are always independently the same. In addition the total number of moves for each path is also constant.
 - For example, we have marked two paths:
   1. $x, x, x, x, y, y, y, y, y$ (brown junctions)
   2. $x, y, x, y, x, y, y, x, y$ (blue junctions)

 ![Street Grid Map with paths](/assets/images/streetmap2.svg)

 **Note:** When counting paths make sure that you count the arrows/connectors and not the nodes/junctions

 The number of distinct paths is the number of ways to arrange the sequence of moves. In this case, the total number of moves per path is 9. We will be taking 4 horizontal moves and 5 vertical moves to move from **A** to **B**. Thus, we're simply responding the question **"how many paths of length 9 can we make out of 4 $x$'s and 5 $y$'s?"**

 This means that we need to choose 4 $x$ - positions and place $y$'s or you can choose 5 $y$ - positions and place $x$'s

 $$\text{Number of paths} = \binom{x+y}{x,y} = {}^9C_4 = {}^9C_5 = 126$$

---

## Binomial Coefficients

> Definition
>
> - Binomial coefficients represent the coefficients of the terms in the expansion of a binomial raised to a power. For example, each and every term in $(x+y)^n$ will have a particular coefficient.
> - These particular coefficients are denoted as "$n$ choose $k$" or $\binom{n}{k}$ given by the formula $\binom{n}{k}=\frac{n!}{(n-k)!k!}$.
> - Multiplication is a choice of a term in each bracket. That is, when you expand $(x+y)^n$, you are literally choosing how many $k$ brackets to pick $x$ from and then you choose $y$ from the remaining $n-k$ brackets.

> Example
>
> Consider the process of expanding of $(x+y)^n$, where you may have two terms in the brackets multiplied multiple times. For example, expanding $(x+y)^2$.
> **Solution**

 $$(x+y)^2=(x+y)(x+y)$$

 When multiplying, you choose one term from each bracket as shown:

 1. $x \cdot x$ (choosing $x$ in both brackets)
 2. $x \cdot y$ (choosing $x$ in the first and $y$ in the second brackets)
 3. $y \cdot x$ (choosing $y$ in the first and $x$ in the second brackets)
 4. $y \cdot y$ (choosing $y$ in both brackets)

 Each of these choices contributes a term in the final expansion.

 $$(x+y)^2=(x+y)(x+y)=x\cdot x + x\cdot y + y\cdot x + y\cdot y$$

 $$=x^2+xy+yx+y^2=x^2+2xy+y^2$$

> Example 1
>
> Find the coefficient of $x^3y^6$ in the expansion of $(x+y)^9$.
>
> **Solution**

 In this case we have 9 brackets multiplying as follows:

 $$(x+y)^9 = (x+y)(x+y)(x+y)(x+y)(x+y)(x+y)(x+y)(x+y)(x+y)$$

 Since our question has the highest power 9, we can make up to 9 choices. In this case, $x^3y^6$ stands for choosing $x$ from 3 brackets and $y$ from 6 brackets.

 $$\text{The coefficient} =\binom{9}{3} = \binom{9}{6}=84; \text{ the term is } 84x^3y^6.$$

> Example 2
>
> Find the coefficient of $x^3y^3$ in the expansion of $(-2\sqrt{x}+3y^{0.75})^{10}$.
>
> **Solution**

 - Here, we have 10 brackets that are multiplying. We have to be careful how we create as to avoid messing up.
 - The power of $x$ comes from $\left( -2 \sqrt{x} \right)^{10 - r}$. The total power of $x$ is:

 $$x^{\frac{10 - r}{2}}$$

 - The power of $y$ comes from $\left( 3 y^{0.75} \right)^{r}$. The total power of $y$ is:

 $$y^{0.75r}$$

 We want the term with $x^3 y^3$. Set up the following:

 1. $\frac{10 - r}{2} = 3$ ⟹ $10 - r = 6$ ⟹ $r = 4$. Thus, $-2\sqrt{x}$ comes from 6 brackets.
 2. $0.75r = 3$ ⟹ $0.75 \times 4 = 3$. Thus, $3y^{0.75}$ comes from 4 brackets.

 You can verify this by multiplying $\sqrt{x}$ 6 times and $y^{0.75}$ 4 times and see if they will bring $x^3$ and $y^3$ respectively.

 $$\text{Coefficient} = \binom{10}{4} \left(-2\right)^{6} \left(3\right)^{4}$$

 $$= 210 \times 64 \times 81 = 1,088,640$$

---

### Binomial Expansions in Sigma Notation

> Theorem
>
> - A binomial expansion for $(x+y)^n$ can be expressed in sigma notation as follows:
>
> $$\sum_{r=0}^n \binom{n}{r} x^{n-r}y^{r}$$
>
> - As we have seen so far, expansion is a choice of terms from multiplying brackets of binomials. Sigma helps us to add everything up and get the full expression. That is:
>
> $$(x+y)^n=(x+y)_1 \times (x+y)_2 \times (x+y)_3 \times \dots \times (x+y)_n$$
>
> - After making the choices, typical term is of the form; $\binom{n}{r}x^{n-r}y^r$ where:
>   1. $y$'s are coming from $r$ out of $n$ brackets
>   2. $x$'s are coming from the remaining $(n-r)$ brackets
>   3. $\binom{n}{r}$ is the binomial coefficient.

> Example
>
> Expand $(x+y)^4$ using the binomial expansion.
>
> **Solution**

 $$(x+y)^4 = \sum_{r=0}^4 \binom{4}{r} x^{4-r}y^r$$

 Let's go through the expansion step by step:

 1. For $r = 0$: $\binom{4}{0} x^4 = x^4$
 2. For $r = 1$: $\binom{4}{1} x^3y = 4x^3y$
 3. For $r = 2$: $\binom{4}{2} x^2y^2 = 6x^2y^2$
 4. For $r = 3$: $\binom{4}{3} xy^3 = 4xy^3$
 5. For $r = 4$: $\binom{4}{4} y^4 = y^4$

 After all this we just have to add them all up:

 $$(x+y)^4 = \binom{4}{0} x^4 + \binom{4}{1} x^3y + \binom{4}{2} x^2y^2 + \binom{4}{3} xy^3 + \binom{4}{4} y^4$$

 $$\therefore (x+y)^4 = x^4 + 4x^3y + 6x^2y^2 + 4xy^3 + y^4$$

> Example
>
> Expand $(\sqrt{x}-3y^{0.75})^{10}$ using the binomial expansion.
>
> **Solution**

 $$(\sqrt{x} - 3y^{0.75})^{10} = \sum_{r=0}^{10} \binom{10}{r} (\sqrt{x})^{10-r} \left(-3y^{0.75}\right)^r$$

 Let's expand this term by term:

 $$(\sqrt{x} - 3y^{0.75})^{10} = x^5 - 30x^{\frac{9}{2}}y^{0.75} + 405x^4y^{1.5} - 3240x^{\frac{7}{2}}y^{2.25} + 17010x^3y^3 - 61236x^{\frac{5}{2}}y^{3.75} + 153090x^2y^{4.5} - 262440x^{\frac{3}{2}}y^{5.25} + 295245xy^6 - 196830\sqrt{x}y^{6.75} + 59049y^{7.5}$$

---

### Proving Binomial Identities

The binomial theorem is not just a powerful tool for expanding expressions like $(x+y)^n$—it also leads to many beautiful and useful identities involving binomial coefficients. Proving these identities helps deepen our understanding of combinatorics and algebra. In this section, we'll explore some classic binomial identities and see how to prove them, often using clever algebraic manipulations or combinatorial arguments.

> Example 1
>
> **Identity:** Prove that
>
> $$2^n = \binom{n}{0}+\binom{n}{1}+\binom{n}{2}+ \binom{n}{3}+\dots+\binom{n}{n}$$
> **Solution**
 **Proof (Algebraic):** Let's use the binomial theorem, which states that for any real numbers $x$ and $y$ and any non-negative integer $n$,

 $$(x + y)^n = \sum_{k=0}^n \binom{n}{k} x^{n-k} y^k$$

 Now, set $x = 1$ and $y = 1$. Substituting these values gives:

 $$(1 + 1)^n = \sum_{k=0}^n \binom{n}{k} 1^{n-k} 1^k$$

 Since $1^{n-k} = 1$ and $1^k = 1$ for any $k$, this simplifies to:

 $$(1 + 1)^n = \sum_{k=0}^n \binom{n}{k}$$

 But $(1 + 1)^n = 2^n$, so we have:

 $$\sum_{k=0}^n \binom{n}{k} = 2^n$$

 This shows that the sum of the binomial coefficients for a fixed $n$ is $2^n$.

 **Proof (Combinatorial):** Let's interpret both sides combinatorially. The left side,

 $$\sum_{k=0}^n \binom{n}{k}$$

 counts the total number of ways to choose $k$ objects from a set of $n$ objects, for all possible $k$ (from $0$ to $n$). In other words, it counts the total number of subsets of an $n$-element set, since each subset has some size $k$ for $0 \leq k \leq n$.

 Now, for each of the $n$ elements, there are two choices: either include it in a subset or not. Therefore, the total number of subsets is $2 \times 2 \times \cdots \times 2 = 2^n$ (with $n$ factors of $2$). Thus, the right side also counts the total number of subsets of an $n$-element set.

 Since both sides count the same thing (the total number of subsets), we have:

 $$\sum_{k=0}^n \binom{n}{k} = 2^n$$

> Example 2
>
> **Identity:** Prove that
>
> $$\binom{m}{n} \binom{n}{r} = \binom{m}{r} \binom{m-r}{n-r}$$
>
> where $m$, $n$, and $r$ are non-negative integers with $r \leq n \leq m$.
> **Solution**
 **Proof (Algebraic):** Let's expand both sides using the definition of binomial coefficients and carefully simplify step by step.

 1. **Write out the left-hand side using factorials:**

 $$\binom{m}{n} \binom{n}{r} = \frac{m!}{n! (m-n)!} \times \frac{n!}{r! (n-r)!}$$

 2. **Simplify by canceling $n!$ in the numerator and denominator:**

 $$= \frac{m!}{(m-n)!} \times \frac{1}{r! (n-r)!}$$

 or, combining into a single fraction:

 $$= \frac{m!}{(m-n)! (n-r)! r!}$$

 3. **Introduce a factor of $(m-r)!/(m-r)!$ (which equals 1) to help match the right-hand side:**

 $$= \frac{m!}{(m-n)! (n-r)! r!} \times \frac{(m-r)!}{(m-r)!}$$

 4. **Regroup the terms to separate into two binomial coefficients:**

 $$= \left( \frac{m!}{(m-r)! r!} \right) \times \left( \frac{(m-r)!}{(m-n)! (n-r)!} \right)$$

 The first factor is $\binom{m}{r}$, and the second is $\binom{m-r}{n-r}$:

 $$= \binom{m}{r} \binom{m-r}{n-r}$$

 5. **Conclusion:** This matches the right-hand side, so the identity is proven.

 **Proof (Combinatorial):** Consider a group of $m$ people. Both sides count the number of ways to form a committee of $n$ people with $r$ designated leaders.

 **Left-Hand Side Interpretation:**

 $$\binom{m}{n} \binom{n}{r}$$

 1. $\binom{m}{n}$: Choose $n$ committee members from $m$ people.
 2. $\binom{n}{r}$: From these $n$ members, choose $r$ leaders.

 **Right-Hand Side Interpretation:**

 $$\binom{m}{r} \binom{m-r}{n-r}$$

 1. $\binom{m}{r}$: Out of the total $m$ people, select $r$ individuals to serve as the leaders of the committee.
 2. $\binom{m-r}{n-r}$: After the leaders have been chosen, there are $m - r$ people left. From these, select the remaining $n - r$ committee members.

 **Why do both sides count the same thing?**

 - **Left-Hand Side (LHS):** First, choose all $n$ committee members from $m$ people, then pick $r$ leaders from within the committee.
 - **Right-Hand Side (RHS):** First, choose the $r$ leaders from the whole group, then fill out the committee by choosing the remaining $n - r$ members from those not already chosen as leaders.

 Both approaches result in a committee of $n$ people with $r$ designated leaders, just in a different order. Every possible committee with $r$ leaders is counted exactly once by both methods, so the two expressions are equal.

> Example 3
>
> **Identity:** Prove that
>
> $$\binom{2n}{n} = \sum_{r=0}^n \binom{n}{r} \binom{n}{n-r} = \sum_{r=0}^n \binom{n}{r}^2$$
>
> where $n$ is a non-negative integer.
> **Solution**

 **Combinatorial Proof:** Consider a set of $2n$ distinct items. We'll count the number of ways to choose exactly $n$ items from these $2n$ items.

 **Left-Hand Side Interpretation:**

 $$\binom{2n}{n}$$

 This directly counts the number of ways to choose $n$ items from $2n$ items.

 **Right-Hand Side Interpretation:** Split the $2n$ items into two groups $A$ and $B$ of size $n$ each. Any selection of $n$ items must consist of $r$ items from group $A$ and $n-r$ items from group $B$ for some $r$ between $0$ and $n$.

 For a fixed $r$:

 - Choose $r$ items from group $A$: $\binom{n}{r}$ ways
 - Choose $n-r$ items from group $B$: $\binom{n}{n-r}$ ways

 By the product rule, the number of ways for this $r$ is:

 $$\binom{n}{r} \binom{n}{n-r}$$

 Summing over all possible $r$ gives:

 $$\sum_{r=0}^n \binom{n}{r} \binom{n}{n-r}$$

 Since $\binom{n}{n-r} = \binom{n}{r}$ (choosing $n-r$ items is equivalent to choosing which $r$ items to exclude), we can write:

 $$\sum_{r=0}^n \binom{n}{r} \binom{n}{n-r} = \sum_{r=0}^n \binom{n}{r} \binom{n}{r} = \sum_{r=0}^n \binom{n}{r}^2$$

 Both expressions count the same selection process:

 - LHS counts $n$-item subsets directly from $2n$ items
 - RHS counts the same by partitioning items into two groups and summing over possible distributions

Therefore, the identity holds.

> Example 4
>
> **Identity:** Prove that
> 
> $$1 \cdot n + 2 \cdot (n-1) + 3 \cdot (n-2) + \cdots + (n-1) \cdot 2 + n \cdot 1 = \binom{n+2}{3}$$
>
> where $n$ is a positive integer.
>
> **Solution**

**Algebraic Proof:** We express the left-hand side as a summation:

$$\sum_{k=1}^n k \cdot (n - k + 1)$$

Expand the general term:

$$k(n - k + 1) = k(n+1) - k^2$$

Split the summation:

$$\sum_{k=1}^n \left[k(n+1) - k^2\right] = (n+1)\sum_{k=1}^n k - \sum_{k=1}^n k^2$$

Apply summation formulas:

$$(n+1) \cdot \frac{n(n+1)}{2} - \frac{n(n+1)(2n+1)}{6} = \frac{n(n+1)^2}{2} - \frac{n(n+1)(2n+1)}{6}$$

Factor out $n(n+1)$:

$$n(n+1) \left[ \frac{n+1}{2} - \frac{2n+1}{6} \right] = n(n+1) \left[ \frac{3n+3 - 2n - 1}{6} \right] = n(n+1) \cdot \frac{n+2}{6}$$

Simplify to get:

$$\frac{n(n+1)(n+2)}{6} = \binom{n+2}{3}$$

Where we can easily note that

$$\binom{n+2}{3}=\frac{(n+2)!}{3!(n+2-3)!}=\frac{(n+2)!}{3!(n-1)!}=\frac{(n+2)(n+1)n}{6}$$

**Combinatorial Proof:** Consider selecting 3 distinct numbers from $\{1, 2, \dots, n+2\}$. The right-hand side $\binom{n+2}{3}$ counts these selections directly.

For the left-hand side, let the *middle* number be $k+1$ (where $1 \leq k \leq n$). Then:

- Choose smaller numbers from $\{1, 2, \dots, k\}$: $k$ choices
- Choose larger numbers from $\{k+2, \dots, n+2\}$: $(n+2) - (k+1) = n - k + 1$ choices

The number of triples with middle number $k+1$ is $k \cdot (n - k + 1)$. Summing over all possible middle numbers:

$$\sum_{k=1}^n k \cdot (n - k + 1)$$

which equals the left-hand side. Both sides count the same selections, proving the identity.

### The Pascal's Triangle

**Definition**

The Pascal's Triangle is an infinite triangular array of the binomial coefficients. It is named after the French mathematician Blaise Pascal, who introduced it in the 17th century. The triangle is constructed by starting with 1 at the top, and then each number is the sum of the two numbers directly above it. The triangle is symmetric and the numbers in the triangle are the binomial coefficients.

The Pascal's Triangle is a useful tool for expanding binomials and for finding binomial coefficients.

**The Pascal's Triangle**

![Pascal's Triangle](/assets/images/PascalsTriangle.gif)

In the diagram above, we have the coefficients of respective terms in the expansion of $(x+y)^n$ where $n$ increase from 0 in the first row to 4 in the 5th row. The next rows are found by adding two close numbers in the preceding row.

Here we would like to connect the Pascal's Triangle to the binomial theorem and understand Why the numbers in the Pascal's Triangle are the binomial coefficients.

**Consider the binomial identity $\binom{n}{k}=\binom{n-1}{k-1}+\binom{n-1}{k}$.**

**From the Right-Hand Side**

We can prove this identity by expanding the binomial coefficients and using the properties of binomial coefficients.

$$\binom{n}{k}=\frac{n!}{k!(n-k)!}$$

Hence, we have

$$\binom{n-1}{k-1}=\frac{(n-1)!}{((n-1)-(k-1))!((k-1))!}=\frac{(n-1)!}{(n-k)!(k-1)!}$$

$$\binom{n-1}{k-1} + \binom{n-1}{k} = \frac{(n-1)!}{(n-k)!(k-1)!} + \frac{(n-1)!}{(n-1-k)!k!}$$

To add these two fractions, we need a common denominator. Notice that:

$$\frac{(n-1)!}{(n-k)!(k-1)!} = \frac{(n-1)! \cdot k}{(n-k)! \, k!}$$

$$\frac{(n-1)!}{(n-1-k)!k!} = \frac{(n-1)! \cdot (n-k)}{(n-k)! \, k!}$$

Now, both terms have the same denominator, so we can combine them:

$$\frac{(n-1)! \cdot k}{(n-k)! \, k!} + \frac{(n-1)! \cdot (n-k)}{(n-k)! \, k!} = \frac{(n-1)! \left[ k + (n-k) \right]}{(n-k)! \, k!} = \frac{(n-1)! \cdot n}{(n-k)! \, k!}$$

This simplifies to:

$$\frac{n!}{k!(n-k)!} = \binom{n}{k}$$

**Practical Understanding**

![Pascal's Triangle](/assets/images/pascals.svg)

**From the pascal's triangle, Our goal is to find $\binom{4}{2}$ which is equal to $\binom{4-1}{2-1}+\binom{4-1}{2}=\binom{3}{1}+\binom{3}{2}=3+3=6$ as shown on the figure.**

What the identity means is that the number of ways to choose $k$ elements from a set of $n$ elements is the same as the number of ways to choose $k-1$ elements from the set of $n-1$ elements and then add the number of ways to choose $k$ elements from the set of $n-1$ elements.

### Number of Rectangles

**Number of Rectangles**

**Consider**

![Rectangles](/assets/images/rectangles.png)

**How many rectangles are on this diagram?**

You will note that counting naturally, you will find the number rectangles to be 80 or so. But you should understand there are more rectangles than what you can see. For example; despite the inner small rectangles, some of the rectangle examples are the shaded ones.

![Rectangles](/assets/images/rectangles2.png)

That is, if you look closely, you are choosing two random vertical lines and two random horizontal lines since any rectangle has to be formed within such metrics.

- **In that case, you chose two lines from the vertical lines which, from our question, can be done in $\binom{11}{2}$ ways.**
- **You also have to chose two random horizontal lines which can be done in $\binom{9}{2}$ ways.**
- **Now, using product rule;**

$$\binom{11}{2} \times \binom{9}{2} = 55 \times 36 = 1980$$

## Multinomial Theorem

The multinomial theorem extends the binomial theorem to multiple categories. Multinomial coefficients count the number of ways to distribute $n$ objects into $k$ distinct categories, where each category can receive a different number of objects. They generalize binomial coefficients for more than two categories. In this part you determine the number of sequences or subsets by choose from group which has more two types of possibilities.

Let $X$ be a set of $n$ elements. Recall that if we have two colors of paint, say red and blue, and we are going to choose a subset of $k$ elements to be painted red with the rest painted blue. Then the number of different ways this can be done is just the binomial coefficient $\binom{n}{k}$. Now suppose that we have three different colors, say red, blue, and green. We will choose some to be colored red, some to be colored blue, and the remaining are to be colored green. In this case, we are choosing multi categories, hence, multinomial coefficients.

**Example**

Count the number of sequences in three $x$'s, two $y$'s and four $z$'s. e.g., $x, x,x,y,y,z,z,z,z$.

**This is how the selection is done:**

- Firstly, choose 3 $x$'s from 9 positions which can be done in $\binom{9}{3}$ ways
- Secondly, choose 2 $y$'s from the remaining 6 positions which can be done in $\binom{9-3}{2}$ ways
- Finally, choose 4 $z$'s from the remaining 4 positions which can be done in $\binom{9-3-2}{4}$ ways

Since, we have done the selection in a sequential manner, we can use the product rule to get the total number of sequences.

**Hence, the total number of sequences is:**

$$\binom{9}{3} \times \binom{9-3}{2} \times \binom{9-3-2}{4} = \binom{9}{3} \times \binom{6}{2} \times \binom{4}{4} = 84 \times 15 \times 1 = 1260$$

### Multinomial Coefficient

Multinomial coefficients are denoted as $\binom{n}{n_1, n_2, \ldots, n_k}$ where $n$ is the total number of elements $(n_1+n_2+\ldots+n_k)$ and $n_1, n_2, \ldots, n_k$ represent the number of objects placed into each of the categories.

Since we are using the product rule, if we have $r$ categories;

$$\binom{n}{k_1, k_2, k_3, \ldots} = \binom{n}{k_1} \times \binom{n-k_1}{k_2} \times \binom{n-k_1-k_2}{k_3} \times \ldots \times \binom{n-k_1-\ldots-k_{r-1}}{k_r}$$

We can simplify this expression using the definition of binomial coefficients:

$$\binom{n}{k_1, k_2, k_3, \ldots} = \frac{n!}{k_1!(n-k_1)!} \times \frac{(n-k_1)!}{k_2!(n-k_1-k_2)!} \times \frac{(n-k_1-k_2)!}{k_3!(n-k_1-k_2-k_3)!} \times \ldots$$

Notice that many terms cancel out in this product. After cancellation, we get:

$$\binom{n}{k_1, k_2, k_3, \ldots, k_r} = \frac{n!}{k_1! \times k_2! \times k_3! \times \ldots \times k_r!}$$

This is the simplified formula for multinomial coefficients. It counts the number of ways to arrange $n$ objects where there are $k_1$ objects of type 1, $k_2$ objects of type 2, and so on.

> Example 1
>
> Count the number of sequences in three $x$'s, two $y$'s and four $z$'s. e.g., $x, x,x,y,y,z,z,z,z$.
>
> **Solution:**

Solving the same question above, the number of sequences is:

$$\binom{9}{3,2,4} = \frac{9!}{3!2!4!} = 1260$$

> Example 2
>
> Find the coefficient of $x^3 y^2 z^4$ in the expansion of $(x+y+z)^9$.
>
> **Solution:**

Since multiplication is a choice of terms from brackets, below is the breakdown of this term:

- $x^3$ means that $x$ comes from 3 out of 9 brackets
- $y^2$ means that $y$ comes from 2 out 9 brackets
- $z^4$ means that $z$ comes from 4 out 9 brackets

The coefficient of $x^3 y^2 z^4$ in the expansion of $(x+y+z)^9$ is given by:

$$\binom{9}{3,2,4} = \frac{9!}{3!2!4!} = 1260$$

**That is, the full term is $1260x^3 y^2 z^4$.**

> Example 3
>
> Find the coefficient of $x^3 y^2 z^4$ in the expansion of $(x^5+\frac{2}{x^2}+y^{\frac{1}{2}}+z+3)^{11}$
>
> **Solution:**

The breakdown of this term is:

- $z^4$ implies that $z$ is coming from 4 brackets
- $y^2=y^{\frac{1}{2}} \cdot y^{\frac{1}{2}} \cdot y^{\frac{1}{2}} \cdot y^{\frac{1}{2}}$, i.e. $y^{\frac{1}{2}}$ is chosen from 4 brackets
- $x^5 \times \frac{2}{x^2} = 2x^3$, i.e. Both $x^5$ and $\frac{2}{x^2}$ come from 1 bracket each
- $3$ is coming from 1 bracket

**Warning**

Your choices must always sum up to the degree of your expansion!

This is the simplified breakdown 

$$\left[(z)^4 \left(y^{\frac{1}{2}} \right)^4 (x^5 )^1 \left(\frac{2}{x^2} \right)^1 (3)^1 \right]$$

Hence, the coefficient of $x^3 y^2 z^4$ in the expansion of is given by:

$$\binom{11}{4,4,1,1,1} = \frac{11!}{4!4!1!1!1!} = 34650$$

However, we must also consider the coefficients from the original terms:

$$\binom{11}{4,4,1,1,1} \times 2^1 \times 3^1 = 34650 \times 2 \times 3 = 207900$$

### Integer-Part Functions

**Definition**

An integer-part function is a function that maps a real number to the greatest integer less than or equal to that number. It is denoted by $\lfloor x \rfloor$.

**Mathematically**

$$\lfloor x \rfloor = \max \{ n \in \mathbb{Z} \mid n \leq x \}$$

This means $\lfloor x \rfloor$ is the largest $n$ such that $n \leq x$.

**Examples**

- $\lfloor 3.7 \rfloor = 3$
- $\lfloor -3.7 \rfloor = -4$
- $\lfloor 5 \rfloor = 5$

> Example
>
> Find the number of integers divisible by 3 in the set $\left\{1, 2, 3, …, 579\right\}$.
> **Solution**

The total number will be $\lfloor \frac{579}{3} \rfloor$ the integer part symbol will help us eliminate decimals if found.

But, the total number of integers =$\lfloor 193 \rfloor=193$

Therefore: the number of integers is 193.

## Inclusion-Exclusion Principle

### Definition

The inclusion-exclusion principle acts as a continuation to the sum rule we looked at before. In this part we deal with the cardinality of unions in sets depending on the type of those particular sets. Recall that ways to choose things from two sets $A$ and $B$ was equal to number of elements in set $A$ plus number of elements in set $B$. But, this statement is only true if and only if sets $A$ and $B$ are disjoint: they don't have common elements. Now, if they have common elements, the exclusion of repeated is needed. Therefore the use of this principle.

From Sum Rule Definition, for example, a normal deck of 52 cards contains red cards and face cards. However, the number of ways to select a card which is either red or a face card is not 26 + 12 by using the sum rule. This is because there are 6 cards which are both red and face cards. In short, these are not disjoint sets. That means the correct way would be applying inclusion - exclusion principle by simply subtracting 6 from sum 26 + 12.

**Mathematically:**

Given two sets, $A$ and $B$, $n(A)$ is the number of elements in set $A$ and $n(B)$ is the number of elements in set $B$.

And: $n(A \cup B) = n(A) + n(B)$ if $(A \cap B) = \emptyset$ (disjoint sets done in sum rule). But, when the sets are not disjoint, this will mean repeating certain elements. That means we should remove repetition by subtracting $n(A \cap B)$. That is,

$$\boxed{n(A \cup B) = n(A) + n(B) - n(A \cap B)}$$

By definition, this principle is called Inclusion-exclusion principle because the number $n(A \cup B)$ is found by adding $n(A)$ and $n(B)$ which includes the common terms. And we, then, subtract $(A \cap B)$ which excludes the repetition of the common terms.

> Example 1
>
> Given a set $\left\{1, 2, 3, 4, …, 579\right\}$, find the number of integers divisible by 2 or 3.
>
> **Solution:**

- Let set of all the numbers divisible by 2 be $A$
- Let set of the numbers divisible by 3 be $B$

$$n(A \cup B) = n(A) + n(B) - n(A \cap B)$$

$$= \left\lfloor \frac{579}{2} \right\rfloor + \left\lfloor \frac{579}{3} \right\rfloor - \left\lfloor \frac{579}{6} \right\rfloor = 386$$

**Note**

Here, 6 stands for all numbers divisible by both 2 and 3. This is where sets $A$ and $B$ intersect. In this case we use the LCM of the two given numbers (divisors).

**Inclusion-Exclusion for Three Sets**

If you have been given three or more sets, you simply modify the same equation. For example, For three sets $A$, $B$, and $C$:

$$n(A \cup B \cup C) = n(A)+n(B)+n(C)-(A \cap B)-(A \cap C)-(C \cap B)+(A \cap B \cap C)$$

> Example 2
>
> Give the set $\left\{1, 2, 3, … , 2000\right\}$, how many numbers are divisible by 8 or 9 or 12?
>
> **Solution:**

Let $A$ be numbers divisible by 8, $B$ by 9 and $C$ by 12.

$n(A \cup B \cup C) = n(A)+n(B)+n(C)-(A \cap B)-(A \cap C)-(C \cap B)+(A \cap B \cap C)$

$$\left\lfloor \frac{2000}{8} \right\rfloor + \left\lfloor \frac{2000}{9} \right\rfloor + \left\lfloor \frac{2000}{12} \right\rfloor - \left\lfloor \frac{2000}{8 \times 9} \right\rfloor - \left\lfloor \frac{2000}{8 \times 12} \right\rfloor - \left\lfloor \frac{2000}{9 \times 12} \right\rfloor + \left\lfloor \frac{2000}{8 \times 9 \times 12} \right\rfloor$$

$$= 250 + 222 + 166 - 27 - 20 - 18 + 2 = 575$$

Therefore, the number of numbers divisible by 8 or 9 or 12 in the set $\left\{1, 2, 3, … , 2000\right\}$ is $575$.

> Example 3
>
> How many sequences of three $x$'s, four $y$'s, five $z$'s and six $w$'s are there where the $x$'s or $y$'s or $z$'s appear together (consecutive among themselves)?
>
> **Solution:**

Let $A$, $B$ and $C$ be the sets of sequences where the $x$'s, $y$'s, and $z$'s appear together, respectively.

When a group of identical letters is required to appear together in a sequence, we treat all of them as a single block or unit. This block is then placed among the other remaining letters or groups. Since the letters in the block are identical, their internal arrangement does not matter. We now calculate the sizes of these sets.

Our goal is to determine $n(A \cup B \cup C)$, the total number of sequences in which at least one of the sets of $x$'s, $y$'s, or $z$'s appears together.

- **For $n(A)$** where $x$'s appear together: 1 $x$-block, 4 $y$'s, 5 $z$'s, 6 $w$'s

$$n(A) = \frac{(1+4+5+6)!}{1! \cdot 4! \cdot 5! \cdot 6!} = \frac{16!}{1! \cdot 4! \cdot 5! \cdot 6!} = 10090080$$

- **For $n(B)$** where $y$'s appear together: 3 $x$'s, 1 $y$-block, 5 $z$'s, 6 $w$'s

$$n(B) = \frac{(3+1+5+6)!}{3! \cdot 1! \cdot 5! \cdot 6!} = \frac{15!}{3! \cdot 1! \cdot 5! \cdot 6!} = 2522520$$

- **For $n(C)$** where $z$'s appear together: 3 $x$'s, 4 $y$'s, 1 $z$-block, 6 $w$'s

$$n(C) = \frac{(3+4+1+6)!}{3! \cdot 4! \cdot 1! \cdot 6!} = \frac{14!}{3! \cdot 4! \cdot 1! \cdot 6!} = 840840$$

- **For $n(A \cap B)$** where both $x$'s and $y$'s appear together: 1 $x$-block, 1 $y$-block, 5 $z$'s, 6 $w$'s

$$n(A \cap B) = \frac{(1+1+5+6)!}{1! \cdot 1! \cdot 5! \cdot 6!} = \frac{13!}{1! \cdot 1! \cdot 5! \cdot 6!} = 72072$$

- **For $n(B \cap C)$** where both $y$'s and $z$'s appear together: 3 $x$'s, 1 $y$-block, 1 $z$-block, 6 $w$'s

$$n(B \cap C) = \frac{(3+1+1+6)!}{3! \cdot 1! \cdot 1! \cdot 6!} = \frac{11!}{3! \cdot 1! \cdot 1! \cdot 6!} = 9240$$

- **For $n(A \cap C)$** where both $x$'s and $z$'s appear together: 1 $x$-block, 4 $y$'s, 1 $z$-block, 6 $w$'s

$$n(A \cap C) = \frac{(1+4+1+6)!}{1! \cdot 4! \cdot 1! \cdot 6!} = \frac{12!}{1! \cdot 4! \cdot 1! \cdot 6!} = 27720$$

- **For $n(A \cap B \cap C)$** where $x$'s, $y$'s and $z$'s all appear together: 1 $x$-block, 1 $y$-block, 1 $z$-block, 6 $w$'s

$$n(A \cap B \cap C) = \frac{(1+1+1+6)!}{1! \cdot 1! \cdot 1! \cdot 6!} = \frac{9!}{1! \cdot 1! \cdot 1! \cdot 6!} = 504$$

Using the inclusion-exclusion principle:

$$n(A \cup B \cup C) = n(A) + n(B) + n(C) - n(A \cap B) - n(A \cap C) - n(B \cap C) + n(A \cap B \cap C)$$

$$= 10090080 + 2522520 + 840840 - 72072 - 27720 - 9240 + 504 = 103344912$$

Therefore, the number of sequences of three $x$'s, four $y$'s, five $z$'s and six $w$'s where the $x$'s or $y$'s or $z$'s appear together is **$103344912$**.

## Counting with Restrictions

**Definition**

Counting with restrictions is a technique used to count the number of objects that satisfy certain conditions. It is a powerful tool in combinatorics and probability theory. It is called **counting complements.**

Suppose you want to count elements in set A but it is not easy. The other simple approach is by finding the number of elements in the universal set and the number of elements number of elements outside set A. As shown:

![Counting with Restrictions](/assets/images/set.png)

That is, n(A) = n(U) - n(A^c) where A^c is the set of elements outside set A but within the universal set.

> Example 1
>
> How many permutations of the numbers $1, 2, 3, \dots, 12$ are there if 1 comes first, 2 comes fifth, and 12 does *not* come twelfth?
>
> **Solution:**

We begin by visualizing the positions of the 12 elements in the permutation:

![Counting with Restrictions](/assets/images/permutations.png)

Let $U$ be the set of all possible permutations of the numbers $1$ through $12$.

Then $n(U) = 12!$, which is the total number of unrestricted permutations.

Now define set $A \subseteq U$ to be the set of permutations where:

- 1 is fixed in the **1st position**,
- 2 is fixed in the **5th position**, and
- 12 is fixed in the **12th position**.

Because 3 positions are already taken (by 1, 2, and 12), we are left with 9 positions to fill using the remaining 9 numbers. These remaining numbers can be placed in any order.

So, the number of such permutations is:

$$n(A) = {}^{12-3}P_{12-3} = {}^{9}P_9 = 9!$$

Next, define $U^* \subseteq U$ to be the set of permutations where:

- 1 is in the 1st position,
- 2 is in the 5th position,
- **But 12 is unrestricted** (it can be placed anywhere except the 12th position, which will be handled shortly).

Here, only 2 positions are fixed (1st and 5th), so we are left with 10 numbers to arrange freely in the remaining 10 positions. Therefore,

$$n(U^*) = {}^{12-2}P_{12-2} = {}^{10}P_{10} = 10!$$

We are interested in the number of permutations where 1 is in position 1, 2 is in position 5, and 12 **is not** in position 12.

From $U^*$, we subtract those permutations where 12 appears in the 12th position (i.e., the set $A$).

So, the required number of valid permutations is:

$$n(U^*) - n(A) = 10! - 9! = 3628800 - 362880 = 3265920$$

**Final Answer:** There are **3,265,920** such permutations where 1 is first, 2 is fifth, and 12 does not appear in the twelfth position.

> Example 2
>
> Consider the street map below:
>
> ![Street Map](/assets/images/complementstreetmap1.svg)
>
> Count the number of shortest routes in the above street in moving from **A** to **B** that do not pass through junction **X**.
>
> **Solution:**

Let $AB$ be a set of all routes from $A$ to $B$.

$AX$ and $XB$ be routes from $A$ to $X$ and $X$ to $B$ in that order.

**Recall**

To find number of routes from one point to another, you need to add the horizontal movements ($x$) and the vertical movements ($y$) then chose any combination you want.

$$n(AB) = \binom{x+y}{x} = \binom{x+y}{y}$$

$$n(AB) = \binom{4+5}{4} = \binom{9}{4} = 126$$

$$n(AX) = \binom{2+3}{2} = \binom{5}{2} = 10$$

$$n(XB) = \binom{2+2}{2} = \binom{4}{2} = 6$$

Number of routes passing through junction X:

$$n(AX) \times n(XB) = 10 \times 6 = 60$$

Therefore, number of routes that do not pass through X:

$$n(AB) - n(AX) \times n(XB) = 126 - 60 = 66$$

Therefore, the number of shortest routes in the above street in moving from $A$ to $B$ that do not pass through junction $X$ is **$66$**.

> Example 3
>
> Count the number of ways to move from A to D passing through B or C but not both, using the street map shown below.
>
> ![Street Grid Map](/assets/images/complementstreetmap2.svg)
>
> **Solution:**

Let:

- $AB$ be the set of different ways to move from A to B
- $ABD$ be the set of ways to move from A to D through B
- $ACD$ be the set of ways to move from A to D through C
- $ABCD$ be the set of paths from A to D through both B and C

We are interested in the number of paths that pass through **either B or C, but not both**.

First, apply the inclusion-exclusion principle:

$$n(ABD \cup ACD) = |ABD| + |ACD| - |ABCD| = 1320 + 1260 - 600 = 1980$$

This is the number of paths that pass through either **B** or **C** or both. To get the number of paths that pass through either **B** or **C** but not both, we need to subtract the paths that go through both **B** and **C** (i.e., $n(ABCD)$):

$$n(ABD \cup ACD) - n(ABCD) = 1980 - 600 = 1380$$

**Final Answer:** There are **1380 distinct paths** from **A** to **D** that pass through either **B** or **C** but not both.

**Note**

If you checked properly, you may notice that you simply removed the intersection entirely by subtracting it twice on the inclusion - exclusion principle as follows:

**We know that $n(ABD)= 1320$, $n(ACD) = 1260$ and $n(ABD \cap ACD) = n(ABCD) = 600$**

$$n(ABD \cup ACD)= n(ABD)+ n(ACD) - n(ABCD) - n(ABCD)$$

$$= 1320 + 1260 - 600 - 600 =1380$$

**Thus, double exclusion makes sure that there is no common term remaining.**

## Practice Exercises

1. How many 4-digit numbers have at least one even digit?
2. How many ways to arrange the letters in "MATHEMATICS"?
3. In a group of 50 people, 20 speak French, 25 speak German, and 10 speak both. How many speak at least one language?
4. How many subsets of {1,2,3,4,5} contain at least one even number?

---

## REFERENCES

Levin O. (2019). Discrete Mathematics: An open Introduction, 3rd Edition. University of Northern Colorado. http://math.oscarlevin.com/

Keller M. T. & Trotter W. T. (2023). Applied Combinatorics. Libre Texts

Susanna S. Epp. (2010). Discrete Mathematics with Applications, 4th Edition. Brooks/Cole. DePaul University

Rosen K. H. (2019). Discrete Mathematics with Applications, 8th Edition. McGraw Hill

Hammack R. (n.d). Elements of Discrete Mathematics. Virginia Commonwealth University

Levin O. (2023). Discrete Mathematics. University of Northern Colorado. Libre Texts.
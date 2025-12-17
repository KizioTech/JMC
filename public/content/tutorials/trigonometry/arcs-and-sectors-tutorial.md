# Arcs and Sectors Tutorial

## Guidelines for Solving Questions in this Section

The following guidelines should be followed to get accurate answers and better explanations of your work.

1. You must make a diagrammatic representation of the information given in the question where there isn't any given in advance. This helps in having a better understanding of what the questions really want.
2. Convert any angle given in degrees to radians since our formulas in practice only allow angles that are in radians.
3. Keep your solved values that will be used on the next stages of the question in fraction or surd forms. **Do not round them off** as this might lead to changes in the values as compared to the originals. Although those changes might not affect the final answer at all, we shouldn't take chances.

---

:::question
Find the length of an arc that subtends the central angle of $30°$ in a circle of radius $4 \text{ cm}$.
:::

:::solution
**Solution:**

First of all you have to draw the diagrammatic representation of the given question. You have to do this for each and every question.

![A circle with center O. Two radius lines are drawn from O: one horizontal to point A (labeled 4 cm) and one at 30° angle to point B. The arc AB is highlighted in red. The angle at O between the two radii is marked as 30°.]

Since the given angle is in degree measure, it has to be converted to radians to be useful in our formula. As such we will multiply $30°$ by a factor and we will get 

$$30° \cdot \frac{\pi}{180°} = \frac{\pi}{6}$$

Then we will use the arc length formula to find the length of the arc.

Thus

$$AB = (4)\left(\frac{\pi}{6}\right) = \frac{2\pi}{3}$$

Therefore, the length of the arc is $2.094 \text{ cm}$ to 3 decimal places.
:::

---

:::question
The length of an arc in a circle of radius $5 \text{ cm}$ is $6 \text{ cm}$. Find the angle subtended by the arc at the centre of the circle.

![A complete circle with center O and radius 5 cm. Two radius lines extend from O: one horizontal to point A and one at angle θ to point B. The arc AB is highlighted in blue and labeled 6 cm. The radius to A is labeled 5 cm below. The angle at O is labeled θ.]
:::

:::solution
**Solution:**

We have been given a radius of a circle and an arc length. Using the theorem $s = r\theta$. Thus,

$$6 = 5\theta$$

$$\theta = \frac{6}{5} \text{ rad}$$
:::

---

:::question
A sector of a circle has radius $r$ and angle $\theta$. Find the value of $\theta$ correct to 3 significant figures if the perimeter of the sector equals half the circumference of the circle.
:::

:::solution
**Solution:**

The perimeter of the sector $= r + r + r\theta = r(2 + \theta)$.

Then $r(2 + \theta) = \frac{1}{2} \times 2\pi r$ and 

$$2 + \theta = \pi$$

giving $\theta = \pi - 2 \approx 1.14$ rad.
:::

---

:::question
A sector of angle $\theta$ in a circle of radius $r$ cm has an area of 5 cm² and its perimeter is 9 cm. Find the values of $r$ and $\theta$.
:::

:::solution
**Solution:**

$$\text{Area} = \frac{1}{2} r^2 \theta = 5 \text{ so } r^2 \theta = 10 \quad \text{(i)}$$

$$\text{Perimeter} = r + r + r\theta = 2r + r\theta = 9 \quad \text{(ii)}$$

We solve these two equations.

From (i), $\theta = \frac{10}{r^2}$.

Substitute in (ii), $2r + r \frac{10}{r^2} = 9$ which gives $2r^2 + 10 = 9r$ or $2r^2 - 9r + 10 = 0$.

Hence $(2r - 5)(r - 2) = 0$ and $r = 2\frac{1}{2}$ or 2 cm.

From (i), the corresponding values of $\theta$ are 1.6 or 2.5 rad.
:::

---

:::question
In a circle with centre O, $AOB$ and $COD$ are two concentric sectors. The lengths of the arcs AB and DC are 2.8 cm and 2 cm respectively, and AD = 2 cm. Calculate:

(a) the length of OC,

(b) $\angle AOB$ in radians,

(c) the area of ABCD.

![Two concentric sectors with center O. The outer sector has radius extending to points A and B, with arc AB. The inner sector has radius extending to points D and C, with arc DC. Point D is on the radius OA at distance 2 cm from A. Point C is on the radius OB. The arc AB is labeled 2.8 cm, arc DC is labeled 2 cm, and the distance AD is labeled 2 cm. The angle at O is labeled θ.]
:::

:::solution
**Solution:**

We have seen from the arc length theorem that $s = r\theta$. Hence, if we let $OC$ to be $r$; we will have $OA = r + 2$. From here we will define two simultaneous equations.

From the inner sector:

$$2 = r\theta \quad \text{(i)}$$

and from the outer sector:

$$2.8 = (r+2)\theta \quad \text{(ii)}$$

If we simplify equation 2, we will get, $2.8 = r\theta + 2\theta$

Let's use substitution method to solve this system of equations. We will there go ahead to substitute 2 from (i) for $r\theta$ above.

$$2.8 = 2 + 2\theta \text{ and } 2.8 - 2 = 0.8 = 2\theta$$

That means

$$\theta = \frac{0.8}{2} = 0.4 \text{ rad}$$

**(a)** $OC$ is the radius to the inner sector. As such, we will use $s = r\theta$ to solve this part.

$$2 = r(0.4) \text{ and } r = \frac{2}{0.4} = 5 \text{ cm}$$

**(b)** $\angle AOB = \theta$. Therefore, $\angle AOB = 0.4 \text{ rad} \approx 22.92°$.

**(c)** Area of $ABCD$ is a bordered area. That is, the area is simply the difference of the inner sector from the outer sector. Using $A = \frac{1}{2}r^2 \theta$:

$$ABCD = \left(\frac{1}{2} \times (5+2)^2 \times 0.4\right) - \left(\frac{1}{2} \times 5^2 \times 0.4\right)$$

$$ABCD = \frac{49}{5} - 5 = \frac{24}{5} = 4.8 \text{ cm}^2$$
:::

---

:::question
A piece of wire, $10 \text{ cm}$ long, is formed into the shape of a sector of a circle of radius $r$ cm and angle $\theta$ radians.

(a) Show that $\theta = \frac{10 - 2r}{r}$.

(b) Show also that $A \text{ cm}^2$ of the sector is given by $A = 5r - r^2$

![A sector of a circle with center O, radius r, and central angle θ. Two radius lines of length r extend from O, and an arc of length rθ connects them. The angle at O is labeled θ, and all three sides are labeled with their respective measurements.]
:::

:::solution
**Solution:**

**(a)** The length equals perimeter of the sector.

$$\text{The length of the wire} = r\theta + 2r = 10$$

$$r\theta + 2r = 10$$

$$r(\theta + 2) = 10$$

$$\theta + 2 = \frac{10}{r}$$

$$\theta = \frac{10}{r} - 2$$

Therefore

$$\theta = \frac{10 - 2r}{r}$$

**(b)** Using $\theta$ from (a) above,

$$A = \frac{1}{2} r^2 \theta$$

$$A = \frac{1}{2} r^2 \left(\frac{10 - 2r}{r}\right)$$

$$A = \frac{1}{2} r(10 - 2r)$$

$$A = \frac{1}{2} \times (10r - 2r^2)$$

$$A = 5r - r^2$$
:::

---

:::question
The figure shows a semicircle $AOBC$ with centre $O$. $CD$ is an arc of another circle with centre $A$. If the length of $AO$ is $4 \text{ cm}$, calculate the area of the shaded part.

![A semicircle AOBC with center O and radius 4 cm. Point A is at the left end of the diameter, O is at the center, and B is at the right end. Point C is at the top of the semicircle. A right angle is marked at O between the y-axis and x-axis. An arc CD is drawn from C with center A, where D is on the positive x-axis. The region enclosed by OC, the arc CD, and OD is shaded in blue. The distance AO is labeled 4 cm.]
:::

:::solution
**Solution:**

In this figure, you might notice that $AO = OC = OB = 4 \text{ cm}$ since those are just radii of the semicircle. For the same reason, $AC = AD$ (radii of the sector ADC).

Using Pythagoras theorem, $AC^2 = AO^2 + OC^2$, Thus,

$$AC = \sqrt{4^2 + 4^2} = \sqrt{32} = 4\sqrt{2} \text{ cm}$$

**Note:** It's nice most of the times if we keep it in surd form. Rounding off decimals might change the values.

Now, for us to be able to find the area of the sector $ADC$, we need to know the value of $\angle CAD$, since $\triangle AOC$ is right angled, then $\tan AOC = \frac{OC}{AO} = \frac{4}{4} = 1$.

Thus,

$$\angle A = \tan^{-1} 1 = 45° = \frac{\pi}{4} \text{ rad}$$

If you look at the picture carefully, you will notice that the area of the shaded part is simply a difference of the area of triangle $AOC$ from the area of the sector $ACD$.

**a. Area of $\triangle AOC$**

Recall, $\text{area of triangle} = \frac{1}{2} \times \text{base} \times \text{height}$. Thus,

$$\text{Area of } \triangle AOC = \frac{1}{2} \cdot 4 \cdot 4 = 8 \text{ cm}^2$$

**b. Area of sector $ACD$**

Using the area of sector theorem, $\text{area of sector} = \frac{1}{2}r^2\theta$ in this case,

$$\text{Area of } ACD = \frac{1}{2} \cdot (\sqrt{32})^2 \cdot \left(\frac{\pi}{4}\right) = \frac{1}{2} \cdot 32 \cdot \left(\frac{\pi}{4}\right)$$

This means that

$$\text{Area of } ACD = 4\pi \text{ cm}^2$$

Lastly,

$$\text{Area of the shaded part} = \text{area of sector } ACD - \text{Area of triangle } AOC$$

$$\text{Area of the shaded part} = (4\pi - 8) \text{ cm}^2$$

Therefore, the area of the shaded part is $4.566 \text{ cm}^2$ to 3 decimal places.
:::

---

:::question
The area of the sector $OAB$ is $150 \text{ cm}^2$. Calculate

(a) $\theta$ (in radians),

(b) The length of arc $AB$,

(c) If this sector is folded up to form a cone, what is the radius of the cone?

![A sector OAB with center O, radius 12 cm, and central angle θ. Point A is on the horizontal radius, point B is at the end of the arc. The angle θ is marked at O with a small arc. The radius OA is labeled 12 cm.]
:::

:::solution
**Solution:**

**(a)** We've been given the area of a sector and its radius. Using the area theorem, $\text{Area} = \frac{1}{2}r^2 \theta$. Thus:

$$150 \text{ cm}^2 = \frac{1}{2}(12 \text{ cm})^2 \theta = \frac{1}{2}(144 \text{ cm}^2)\theta = 72\theta \text{ cm}^2$$

If we make $\theta$ subject of the formula,

$$\theta = \frac{150}{72} = 2.083 \text{ rad}$$

**(b)** Since we have the radius given, and angle found in (a) above, using the arc length theorem,

$$AB = 12 \times \frac{150}{72} = 25 \text{ cm}$$

**Note:** It is advisable to use the fraction form of $\theta$. Using rounded-off values has has a lot of setbacks. For example, in this case $12 \times 2.083 = 24.996$ and not exactly $25$ as it is in the final answer although technically, both answers might be considered as true.

**(c)** Once a sector is transformed into a cone, the arc length of the sector is eventually the circumference of the cone. From the figure, $AB$ will be a circle of radius $R$. Thus:

![A cone with vertex O at the top. The base is a circle with arc AB marked on the circumference. A dashed ellipse shows the circular base. The radius R of the base is marked from the center to point B on the circumference. The slant height from O to the base is shown.]

$$2\pi R = 25$$

And

$$R = \frac{25}{2\pi} = 3.98 \text{ cm}$$
:::

---

## Summary

In this tutorial, we covered the main methods for solving arc length and sector area problems:

**Key Takeaways:**
- **Arc Length Formula:** $s = r\theta$ where $s$ is arc length, $r$ is radius, and $\theta$ is in radians
- **Sector Area Formula:** $A = \frac{1}{2}r^2\theta$ for calculating the area of a sector
- **Perimeter of Sector:** $P = 2r + r\theta = r(2 + \theta)$
- **Angle Conversion:** Always convert degrees to radians: $\theta_{\text{rad}} = \theta_{\text{deg}} \times \frac{\pi}{180}$
- **Concentric Sectors:** Use simultaneous equations when dealing with multiple sectors
- **Completing the Square:** Essential for complex problems involving quadratic expressions

Practice these methods with different types of problems to build your confidence and fluency.

For theoretical background, see the [Arcs and Sectors Notes](../notes/trigonometry/arcs-and-sectors.md)
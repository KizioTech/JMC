# Angular Measure Tutorial

This tutorial covers the measurement of angles, conversion between degrees and radians, and related concepts.

## Degrees and Radians

### Degrees
- A degree is 1/360 of a full circle
- 90° = right angle
- 180° = straight angle
- 360° = full circle

### Radians
- A radian is the angle subtended by an arc equal in length to the radius
- 1 radian ≈ 57.2958°
- π radians = 180°

## Conversion Formulas

### Degrees to Radians
$$\theta_{\text{radians}} = \theta_{\text{degrees}} \times \frac{\pi}{180}$$

### Radians to Degrees
$$\theta_{\text{degrees}} = \theta_{\text{radians}} \times \frac{180}{\pi}$$

## Common Angle Conversions

| Degrees | Radians |
|---------|---------|
| 0°      | 0       |
| 30°     | π/6     |
| 45°     | π/4     |
| 60°     | π/3     |
| 90°     | π/2     |
| 120°    | 2π/3    |
| 135°    | 3π/4    |
| 150°    | 5π/6    |
| 180°    | π       |
| 270°    | 3π/2    |
| 360°    | 2π      |

# Coterminal Angles Tutorial

## Introduction to Coterminal Angles

Coterminal angles are angles that share the same terminal side when drawn in standard position. Two angles are coterminal if they differ by an integer multiple of $360°$ (or $2\pi$ radians).

**Formula for coterminal angles:**
$$\theta + 360°k \quad \text{where } k \in \mathbb{Z}$$

---

## Finding Negative Coterminal Angles

:::question
**Question 1:** Find the negative coterminal angle of $30°$.
:::

:::solution
**Solution:**

To find a negative coterminal angle, we subtract multiples of $360°$ from the given angle until the result is negative. Starting with $30°$:

**Start with the formula for coterminal angles:**
$$\theta + 360°k$$

**For a negative coterminal angle:**
$$\text{Negative coterminal angle} = 30° + 360°(-1)$$
$$= 30° - 360° = -330°$$

Thus, the negative coterminal angle of $30°$ is $-330°$ and the representation is shown in the figure below.

![Graph showing coterminal angles for 30°. The figure displays coordinate axes with two angle representations: a blue arc showing the positive 30° angle from the positive x-axis, and a red arc showing the negative -330° angle (measured clockwise). Both terminal sides end at the same position in the first quadrant.](/assets/images/Corteminal Angles for 30 degrees.svg)
:::


:::question
**Question 2:** Find one positive and one negative coterminal angle for $\theta = 45°$.
:::

:::solution
**Solution:**

**Start with the formula for coterminal angles:**
$$\theta + 360°k$$

**For one positive coterminal angle:**
$$45° + 360°(1) = 405°$$

**For one negative coterminal angle:**
$$45° + 360°(-1) = -315°$$

Therefore, the coterminal angles are $405°$ and $-315°$ as shown in the figure below:

![Graph showing coterminal angles for 45°. The figure displays coordinate axes with three angle representations: a blue arc showing 45°, a red arc showing -315° (measured clockwise), and a green arc showing 405° (completing more than one full rotation). All three terminal sides end at the same position at a 45° angle in the first quadrant.](/assets/images/Corteminal angles for 45 degree.svg)
:::


## Finding the Least Possible Coterminal Angle

We recall that coterminal angles differ by integer multiples of $360°$. That is, to find a coterminal angle, we add or subtract $360°k$ (where $k \in \mathbb{Z}$) until the angle lies in the range $0° \leq \text{angle} < 360°$ (for the least positive coterminal angle) or $-360° < \text{angle} \leq 0°$ (for the least negative coterminal angle).

:::question
**Question 3:** Find the least possible measure coterminal with $908°$.
:::

:::solution
**Solution:**

Start with the given angle:
$$908°$$

Subtract multiples of $360°$ until the angle falls within $0° \leq \text{angle} < 360°$:
$$908° - 360° \cdot 2 = 908° - 720° = 188°$$

Thus, the least positive coterminal angle is:
$$\boxed{188°}$$

**Note: Another Method**

If the angle is positive, then divide the angle by $360°$. The remainder will be a coterminal angle between $0°$ and $360°$. Now, if the given angle is negative, then divide the angle by $360°$. The remainder gives a negative coterminal angle between $-360°$ and $0°$. Finally, add $360°$ to this angle to get a coterminal angle between $0°$ and $360°$.
:::

:::question
**Question 4:** Find the least possible measure coterminal with $-75°$.
:::

:::solution
**Solution:**

Start with the given angle:
$$-75°$$

Add multiples of $360°$ until the angle falls within $0° \leq \text{angle} < 360°$:
$$-75° + 360° = 285°$$

Thus, the least positive coterminal angle is:
$$\boxed{285°}$$

If we need the least negative coterminal angle, it is the angle itself since $-75°$ is already within the range $-360° < \text{angle} \leq 0°$:
$$\boxed{-75°}$$
:::


## Checking if Angles are Coterminal

**Key Concept:** Two angles are coterminal if they differ by a multiple of $360°$ (or $2\pi$ radians).

:::question
**Question 5:** Check if the following pairs of angles are coterminal or not.

(a) $30°$ and $330°$

(b) $125°$ and $845°$

(c) $\frac{\pi}{3}$ and $\frac{7\pi}{3}$

(d) $-60°$ and $250°$
:::

:::solution
**Solution:**

**(a) $30°$ and $330°$**

$$330° - 30° = 300°$$

Since $300°$ is not a multiple of $360°$, these angles are **not** coterminal.

**(b) $125°$ and $845°$**

$$845° - 125° = 720°$$

Since $720° = 2 \times 360°$, these angles **are** coterminal.

**(c) $\frac{\pi}{3}$ and $\frac{7\pi}{3}$**

$$\frac{7\pi}{3} - \frac{\pi}{3} = \frac{6\pi}{3} = 2\pi$$

Since the difference is $2\pi$, these angles **are** coterminal.

**(d) $-60°$ and $250°$**

$$250° - (-60°) = 250° + 60° = 310°$$

Since $310°$ is not a multiple of $360°$, these angles are **not** coterminal.
:::


## Converting Radians to Degrees

**Conversion Formula:**
$$\text{Degrees} = \text{Radians} \times \frac{180°}{\pi}$$

:::question
**Question 6:** Convert the following radians to degree measure.

(a) $\frac{\pi}{3}$

(b) $\frac{\pi}{6}$

(c) $\frac{3\pi}{4}$

(d) $2$ radians

(e) $\frac{\pi}{8}$

(f) $\frac{3\pi}{2}$ rads

(g) $3$ rads

(h) $\frac{\pi}{4}$ rads
:::

:::solution
**Solution:**

**(a) $\frac{\pi}{3}$:**
$$\text{Degrees} = \frac{\pi}{3} \times \frac{180°}{\pi} = \frac{180°}{3} = 60°$$

**(b) $\frac{\pi}{6}$:**
$$\text{Degrees} = \frac{\pi}{6} \times \frac{180°}{\pi} = \frac{180°}{6} = 30°$$

**(c) $\frac{3\pi}{4}$:**
$$\text{Degrees} = \frac{3\pi}{4} \times \frac{180°}{\pi} = \frac{3 \cdot 180°}{4} = 135°$$

**(d) $2$ radians:**
$$\text{Degrees} = 2 \times \frac{180°}{\pi} \approx \frac{360°}{3.14159} \approx 114.59°$$

**(e) $\frac{\pi}{8}$:**
$$\text{Degrees} = \frac{\pi}{8} \times \frac{180°}{\pi} = \frac{180°}{8} = 22.5°$$

**(f) $\frac{3\pi}{2}$ rads:**
$$\frac{3\pi}{2} \times \frac{180°}{\pi} = 270°$$

**(g) $3$ rads:**
$$3 \times \frac{180°}{\pi} = 3 \times 57.296 = 171.9°$$

**(h) $\frac{\pi}{4}$ rads:**
$$\frac{\pi}{4} \times \frac{180°}{\pi} = 45°$$
:::


## Converting Degrees to Radians

**Conversion Formula:**
$$\text{Radians} = \text{Degrees} \times \frac{\pi}{180°}$$

:::question
**Question 7:** Convert the following to radian measure as a multiple of $\pi$.

(a) $30°$

(b) $135°$

(c) $540°$

(d) $105°$

(e) $75°$

(f) $135°$

(g) $210°$
:::

:::solution
**Solution:**

**(a) $30°$:**
$$\text{Radians} = 30° \times \frac{\pi}{180°} = \frac{\pi}{6}$$

**(b) $135°$:**
$$\text{Radians} = 135° \times \frac{\pi}{180°} = \frac{3\pi}{4}$$

**(c) $540°$:**
$$\text{Radians} = 540° \times \frac{\pi}{180°} = 3\pi$$

**(d) $105°$:**
$$\text{Radians} = 105° \times \frac{\pi}{180°} = \frac{7\pi}{12}$$

**(e) $75°$:**
$$\text{Radians} = 75° \times \frac{\pi}{180°} = \frac{5\pi}{12}$$

**(f) $135°$:**

If $180° = \pi$ radians, then $135°$ is less.

Thus, we have:
$$135° \times \frac{\pi}{180°} = \frac{3\pi}{4} \text{ rads}$$

**(g) $210°$:**

If $180° = \pi$ radians, then $210°$ is more.

Hence, we have:
$$210° \times \frac{\pi}{180°} = \frac{7\pi}{6} \text{ rads}$$
:::

---

## Key Concepts Summary

- **Coterminal angles** share the same terminal side and differ by multiples of $360°$ (or $2\pi$ radians)
- Use the formula $\theta + 360°k$ to find coterminal angles
- To find the least positive coterminal angle, add or subtract $360°$ until the angle is in the range $[0°, 360°)$
- To check if two angles are coterminal, verify that their difference is a multiple of $360°$
- **Conversion formulas:**
  - Radians to degrees: multiply by $\frac{180°}{\pi}$
  - Degrees to radians: multiply by $\frac{\pi}{180°}$

---

## Practice Tips

- Always identify whether you need a positive or negative coterminal angle
- When converting between degrees and radians, keep track of $\pi$ as a factor
- Remember that coterminal angles have the same trigonometric function values

For theoretical background, see the [Angular Measure Notes](../notes/trigonometry/angular-measure.md)
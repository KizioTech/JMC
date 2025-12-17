# Arcs and Sectors

## Introduction

>**Definition**
>
>Before we start anything, let's define the following terms: 
>
>1. **Arc:** An arc is a portion of the circumference of a circle. It is defined by two points on the circle and the continuous portion of the circle between those two points. An arc can either be a minor arc (less than half the circle) or a major arc (more than half the circle).
>		
>2. **Sector:** A sector is a region of a circle enclosed by two radii and the arc between them. It resembles a "slice of pie" or "pizza slice."
>
>

Below are diagrams to illustrate an arc and a sector:

![A diagram of two circles showing a visual definition of arcs and sectors](/assets/images/arcssectors.svg)

## Arc Length

From the definition of degree measure, we can examine the relationship between the length of an arc and the circumference of a circle.

Consider an arc AP subtending an angle θ at the center of a circle. The relationship between the arc length and the circumference can be expressed as:

$$\frac{\text{Length of arc AP}}{\text{Circumference}} = \frac{\theta}{360°} = \frac{\theta}{2\pi}$$

Thus,

$$\text{Length of arc AP} = \frac{\theta \times \text{Circumference}}{2\pi}$$

$$= \frac{\theta \times 2\pi r}{2\pi} \quad \text{(Since Circumference} = 2\pi r)$$

$$= r\theta$$

**Therefore, the length of arc AP = $r\theta$, where $\theta$ is in radians.**

>**Theorem: Arc Length Formula**
>
>In general, arc length is commonly denoted as $s$ and is given by:
>
>$$s = r\theta$$
>
>for any $\theta$ in **radian measure**.

## Area of a Sector

Consider a sector AOB with angle $\theta$ radians in a circle with center O and radius $r$. Using the concept of proportionality, the area of the sector is proportional to $\theta$.

$$\frac{\text{Area of sector AOB}}{\text{Area of circle}} = \frac{\theta}{2\pi}$$

Hence,

$$\text{Area of sector AOB} = \frac{\theta}{2\pi} \times \pi r^2 = \frac{1}{2} r^2 \theta$$

>**Theorem: Area of a Sector**
>
>In general, the area of a sector is given by:
>
>$$\text{Area of sector} = \frac{1}{2} r^2 \theta$$
>
>for any $\theta$ in **radian measure**.

## Important Notes

1. **Radian Measure:** Both formulas ($s = r\theta$ and $A = \frac{1}{2}r^2\theta$) require that the angle $\theta$ be measured in **radians**, not degrees.

2. **Unit Consistency:** Ensure that the radius $r$ and arc length $s$ are in the same units (e.g., both in meters, centimeters, etc.).

3. **Relationship Between Formulas:** Notice that the area formula can also be written as $A = \frac{1}{2}rs$ by substituting $s = r\theta$.

See also: [Arcs and Sectors Tutorial](../tutorials/trigonometry/arcs-and-sectors-tutorial.md)

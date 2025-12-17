# Angular Measure

## Introduction

>**Definition:** 
>
>An **angle** is a geometric figure formed by two rays (called the **arms** or **sides** of the angle) sharing a common endpoint, known as the **vertex** of the angle. Angles measure the amount of rotation between the two arms, and this rotation can be described in degrees (°) or radians.

![An angle formed by two rays sharing a common vertex. Shows Arm 1 extending horizontally to the right, Arm 2 extending at approximately 45 degrees upward, meeting at a vertex point. An arc is drawn between the arms labeled with θ.](/assets/images/angle.svg)

*Figure: An Angle Formed by Two Rays Sharing a Common Vertex*

An angle that is measured in an anticlockwise direction is **POSITIVE** and angle measured in a clockwise direction is **NEGATIVE**. To visualise these said directions, look at the figure below:

![Two diagrams showing positive and negative angles. Top diagram shows a positive angle θ with counterclockwise rotation from horizontal axis. Bottom diagram shows a negative angle -θ with clockwise rotation from horizontal axis.](/assets/images/positive-negative.svg)

*Figure: Positive and negative angles*

## Standard Position of an Angle

An angle is said to be in **standard position** if:

- Its vertex is located at the origin of the Cartesian plane.
- One arm (the initial side) lies along the positive $x$-axis.
- The other arm (the terminal side) is rotated from the initial side either counterclockwise (positive angle) or clockwise (negative angle).

![A coordinate system with x and y axes. An angle θ is shown in standard position with the initial side along the positive x-axis and the terminal side extending into the second quadrant. An arc connects the two sides at the origin.](/assets/images/standard.svg)

*Figure: Angle in Standard Position*

A special case of the angles in standard position arise in situations where the terminal side aligns with either $x$-axis or $y$-axis. These angles include $0°$, $90°$, $180°$, $270°$ and $360°$. In addition, these angles have a special name, **QUADRANTAL ANGLES**[^1].

[^1]: These angles are called **Quadrantal angles** because they divide the circle into four equal parts called **Quadrants**. We will use them in solving equations later in this section.

The figure below shows these quadrantal angles in their standard positions.

![A unit circle with center at origin. The circle has radius 2 units. Points are marked at (1,0), (0,1), (-1,0), and (0,-1), labeled with angles 0°/360°, 90°, 180°, and 270° respectively. The x and y axes extend beyond the circle.](/assets/images/quadrantal.svg)

*Figure: Quadrantal Angles*

## Coterminal Angles

>**Theorem:** 
>
>Two angles are **coterminal** if they share the same initial side and terminal side, but differ by a full rotation of $360°$. For any given angle $\theta$, the coterminal angles can be expressed as:
>
>$$
>\boxed{\theta + 360°k \quad \text{where } k \in \mathbb{Z}}
>$$

For visualisation, below are two angles that are sharing the same initial and terminal side:

![A coordinate system showing two angles with the same terminal position. One angle (in blue) shows a 30° rotation counterclockwise from the positive x-axis. Another angle (in red) shows a -330° rotation clockwise, arriving at the same terminal position. Both share the same initial and terminal sides.](/assets/images/coterminal.svg)

*Figure: Coterminal angles*

Another simple method that can be used to find coterminal angles is continuously adding or subtracting $360°$ to the given angle. Every time you add or subtract $360°$ to an angle, you find a coterminal angle of the given angle.

## Degree Measure

A complete revolution, i.e. when the initial and terminal sides are in the same position after rotating clockwise or anticlockwise, is divided into 360 units called degrees. So, if the rotation from the initial side to the terminal side is $\left(\frac{1}{360}\right)$ of a revolution, then the angle is said to have a measure of one degree. It is denoted as $1°$.

Mathematically, consider a unit circle on the figure below.

![A unit circle with radius 2 centered at the origin. The x and y axes are shown. A radius line extends from the origin O to point A on the positive x-axis, and another radius extends to point P at approximately 30° from the horizontal. An arc AP is drawn in red connecting these points. The angle θ is marked at the origin, and the sector is shaded in light green.](/assets/images/degrees.svg)

*Figure: Unit Circle - Degree Measure*

As $\theta = \angle AOP$ increases, the length of arc $AP$ increases as well. Thus, $AP$ is proportional to $\theta$. Then, we shall say that $\angle AOP$ has degree measure if and only if

$$
\frac{\text{Length of arc } AP}{\text{Circumference}} = \frac{\theta}{360°}
$$

Making $\theta$ the subject of the formula yields

$$
\theta = \frac{360° \times \text{Length of arc } AP}{2\pi}
$$

Note that Circumference $= 2\pi r$ where $r = 1$. Also, the angle is measured in an anticlockwise direction from $A$.

## Radian Measure

>**Definition:**
>
>**Radian Measure** is the standard unit of angular measurement which is based on the ratio of the arc's length to the radius of the circle it is part of. The unit used in this method is the **"radian"** (commonly denoted by **"rad"**)

In a circle of radius $r$, center $O$, we take an arc $AB$ also of length $r$. Then the angle $\angle AOB$ is the unit of radian measurement, called **one radian**.

- For example, if arc $AC = 2r$, then $\angle AOC = 2$ radians, and so on.
- If the arc is $kr$, the angle subtended is $k$ radians.
- **Key Note**: The size of $1$ radian does not depend on the length of $r$ or any arbitrary number.

>**Theorem:** 
>We define $1$ radian as:
>
>$$
>1 \text{ radian} = \text{Angle subtended at the center by an arc of length equal to the radius.}
>$$
>
>![A circle with center O and radius r. Point A is on the positive x-axis. Arc AB of length r extends from A to point B at approximately 40°. Arc BC (dashed) of length r continues from B to point C at approximately 80°. Multiple radius lines are drawn: solid lines from O to A and O to B, and a dashed line from O to C. The arcs and radii are all labeled with 'r'. An arrow shows the direction of measurement along the arc from A to C.](/assets/images/radians.svg)
>
>*Figure: Radian Measure*
>
>Since an angle in radians is based on the multiple of the radius, and circumference of a circle is given by $\text{Circumference}=2\pi r$, the angle subtended by the circumference at the centre of a circle is equal to $2\pi$. And from degree measure, the complete revolutions $360°$, hence, the complete revolution in radians is $2\pi$.

---

### Radian-Degree Conversions

Converting angles from degree to radians or vice versa is based on the fact that 

$$2\pi \text{ rad}=360°$$

or in its simpler form 

$$\pi \text{ rad}=180°$$

Given an angle $x$, you can use if-then relations or use the following:

1. If you are given an angle in degree to be converted to radians, multiply the angle by a conversion factor $\frac{\pi}{180°}$
2. And if the angle is in radians to be converted to degrees, multiply by $\frac{180°}{\pi}$

See also: [Angular Measure Tutorial](../tutorials/trigonometry/angular-measure-tutorial.md)
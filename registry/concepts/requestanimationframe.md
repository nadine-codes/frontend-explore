---
title: requestAnimationFrame
summary: Run a function right before the next screen paint, so animation stays in step with the display.
---

# requestAnimationFrame

`requestAnimationFrame` calls a function just before the browser paints the next frame. Calling it again from inside that function makes a loop that runs once per frame.

A good loop stops itself when nothing is moving. [[3d-tilt-hover]] eases toward its target a little each frame and stops once the card is still, so an idle card costs nothing. Values go to the DOM through [[refs-over-state]].

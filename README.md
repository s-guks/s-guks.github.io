# github.io

## How to Run Locally:

This program can be run by right-clicking the index.html file and clicking "Open with Live Server."

# Link to visualization: https://s-guks.github.io/

# Link to code base: https://github.com/s-guks/s-guks.github.io

## Description of Interactivity

This data visualization's interactivity is controlled by the arrows on the bottom. Clicking the forward arrow scrolls through the poem, updates the chart, and updates the description text in the right column. Using the back arrow scrolls back in the poem, updates the description text, and reverts the chart to its previous state. Regardless as to if the user moves forwards or backwards, the charts update dynamically using transitions. Hovering over "rage" and "hate" causes these words to turn red. The buttons appear to 'press' downwards when clicked and turn purple on hover. Sources are disclosed and linked in the description text.

## Description and Justification of Changes

I decided to iterate on the static visualizations I designed for M3. I didn’t like how the design on my fifth sheet only displayed some of the data I was interested in. Given both Professor Wall’s and my interest in showing the correlation between social vulnerability and vaccine hesitancy, I decided to include this representation as well as a simplified version of my original design. As my poem is about both COVID-19’s impact on vulnerable populations and about COVID-19 misinformation, I’m happy that I can explore both of these datasets in this project. 

On load, the page displays a scatterplot showing the correlation between vaccination rates and social vulnerability of counties in the United States. There is a line of best fit which more clearly illuminates the correlation. The dots are colored in accordance to the rates of vaccine hesitancy in the county. Interaction on this graph includes the color appearing, the line of best fit appearing, and a key showing what the colors mean.

On verse 7, the scatterplot is replaced by a pie chart. This pie chart shows the breakdown of relative frequencies of motivations for COVID-19 misinformation attempts. 


## Tutorials Referenced:

Scatterplots
https://d3-graph-gallery.com/graph/scatter_basic.html

Color Scales
https://d3-graph-gallery.com/graph/custom_color.html
https://observablehq.com/@tmcw/d3-scalesequential-continuous-color-legend-example

Line of Best Fit
https://observablehq.com/@harrystevens/linear-regression
https://d3js.org/d3-shape/line

Axis Labels
https://observablehq.com/@mbostock/the-wealth-health-of-nations

Pie Chart
https://d3-graph-gallery.com/graph/pie_basic.html

Legend
https://d3-graph-gallery.com/graph/custom_legend.html







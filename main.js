
//FUNCTIONS THAT MAKE THE WEBSITE WORK

//keyframes: these hold the active verse/lines, and the SVG updates
let keyframes = [
    {
        activeVerse: 1,
        activeLines: [1, 2, 3],
        activeText: 1,
        svgUpdate: drawScatterPlotInitial
    },
    {
        activeVerse: 2,
        activeLines: [1, 2, 3],
        activeText: 2,
        svgUpdate: fillDotColors
    },
    {
        activeVerse: 3,
        activeLines: [1, 2],
        activeText: 3,
        svgUpdate:lineOfBestFit
    },
    {
        activeVerse: 4,
        activeLines: [1, 2],
        activeText: 4,
        svgUpdate: fillVeryHesitant
    },
    {
        activeVerse: 5,
        activeLines: [1, 2, 3],
        activeText: 5,
        svgUpdate: fillLowHesitant
    },
    {
        activeVerse: 6,
        activeLines: [1, 2, 3],
        activeText: 6,
        svgUpdate: fillDotAndLine
    },
    {
        activeVerse: 7,
        activeLines: [1, 2, 3, 4, 5],
        activeText: 7,
        svgUpdate: drawPie
    },
    {
        activeVerse: 8,
        activeLines: [1, 2, 3],
        activeText: 8
    },
    {
        activeVerse: 9,
        activeLines: [1],
        activeText: 9
    }
]

let svg = d3.select("#svg");
let keyframeIndex = 0;

const width = 600;
const height = 500;

let chart;
let chartWidth;
let chartHeight;

let xScale;
let yScale;

let misinfoData;
let vaccineHesData;

let isPie;
let isVeryHes;
let bestFitExists;
let scaleExists = false;

//forward/back buttons
document.getElementById("forward-button").addEventListener("click", forwardClicked);
document.getElementById("backward-button").addEventListener("click", backwardClicked);

function forwardClicked() {
    if (keyframeIndex < keyframes.length - 1) {
        keyframeIndex++;
        drawKeyframe(keyframeIndex);
    }
}

function backwardClicked() {
    if (keyframeIndex > 0) {
        keyframeIndex--;
        drawKeyframe(keyframeIndex);
      }
}

//load data from CSV files
async function loadData() {
    await d3.csv("covid-misinfo-simple.csv").then(data => {
        misinfoData = data;
    });
    await d3.csv("vaccine-hes.csv").then(data => {
        vaccineHesData = data;
    });
}

//update the SVG based on active keyframe
function drawKeyframe(kfi) {
    let kf = keyframes[kfi];
    resetActiveLines();
    updateActiveVerse(kf.activeVerse);
    updateActiveText(kf.activeText);
    for (line of kf.activeLines){
        updateActiveLine(kf.activeVerse, line);  
    }
    if (kf.svgUpdate) {
        kf.svgUpdate();
    }
}

function resetActiveLines() {
    d3.selectAll(".line").classed("active-line", false);
}

function updateActiveVerse(id) {
    d3.selectAll(".verse").classed("active-verse", false);
    d3.select("#verse"+id).classed("active-verse", true);

    scrollLeftColumnToActiveVerse(id);
}

function updateActiveLine(vid, lid) {
    let thisVerse = d3.select("#verse" + vid);
    thisVerse.select("#line" + lid).classed("active-line", true);
}

function updateActiveText(id) {
    d3.selectAll(".text").classed("active-text", false);
    d3.select("#text"+id).classed("active-text", true);

    scrollRightColumnToActiveText(id);
}

function scrollRightColumnToActiveText(id) {

    var rightColumn = document.querySelector(".right-column-content");

    var activeText = document.getElementById("text" + id);

    var textRect = activeText.getBoundingClientRect();
    var rightColumnRect = rightColumn.getBoundingClientRect();

    var desiredScrollTop = textRect.top + rightColumn.scrollTop - rightColumnRect.top - (rightColumnRect.height - textRect.height) / 2;

    rightColumn.scrollTo({
        top: desiredScrollTop,
        behavior: 'smooth'
    })
}

function scrollLeftColumnToActiveVerse(id) {

    var leftColumn = document.querySelector(".left-column-content");

    var activeVerse = document.getElementById("verse" + id);

    var verseRect = activeVerse.getBoundingClientRect();
    var leftColumnRect = leftColumn.getBoundingClientRect();

    var desiredScrollTop = verseRect.top + leftColumn.scrollTop - leftColumnRect.top - (leftColumnRect.height - verseRect.height) / 2;

    leftColumn.scrollTo({
        top: desiredScrollTop,
        behavior: 'smooth'
    })
}

//FUNCTIONS THAT MANIPULATE THE GRAPHS BETWEEN KEYFRAMES

//draw different versions of the graphs based on the keyframe
function drawScatterPlotInitial() {
    updateDotPlot(vaccineHesData, "Percent of Adults Vaccinated Vs. Social Vulnerability in the United States", "Social Vulnerability Index (SVI)", "Percent adults fully vaccinated against COVID-19");
    if (scaleExists) {
        svg.selectAll(".colorLegend").transition().duration(1000).attr("transform", "translate(0, 1000)").remove();
        scaleExists = false;
    }
}

function drawScatterPlot() {
    updateDotPlot(vaccineHesData, "Percent of Adults Vaccinated Vs. Social Vulnerability in the United States", "Social Vulnerability Index (SVI)", "Percent adults fully vaccinated against COVID-19");
}

function drawPie() {
    if (!isPie) {
        makeItAPie(misinfoData, "Motivations for COVID-19 Misinformation");
    }
}

//if the graph is currently a pie chart, turn it back into a line graph
//if not, fill in the colors
function fillDotAndLine() {
    if(isPie) {
        drawScatterPlot();
        setTimeout(() =>{fillDotColors()}, "1000");
        setTimeout(() =>{lineOfBestFit()}, "1000");
    }
    else {
        //drawScatterPlot();
        setTimeout(() =>{fillDotColors()}, "500");
        setTimeout(() =>{lineOfBestFit()}, "500");
    }
    
}

//FUNCTIONS THAT MANIPULATE THE SVGS

//initialize the SVG
function initializeSVG() {
    svg.attr("width", width);
    svg.attr("height", height);

    svg.selectAll("*").transition().duration(1000).attr("transform", "translate(0, 1000)").remove();

    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    //chartWidth = width - margin.left - margin.right;
    //chartHeight = height - margin.top - margin.bottom;

    chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    xScale = d3.scaleBand()
        .domain([])
        .range([0, chartWidth])
        .padding(0.1);

    yScale = d3.scaleLinear()
        .domain([])
        .nice()
        .range([chartHeight, 0]);

    //title
    svg.append("text")
        .attr("id", "chart-title")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font", "20px times")
        .style("fill", "darkslateblue")
        .text("");
}

async function initialize() {
    await loadData();
    initializeSVG();
    drawKeyframe(keyframeIndex);
}

//create or update the dot plot
function updateDotPlot(data, title = "", xTitle = "", yTitle = "") {

    //margin
    const margin = { top: 50, right: 50, bottom: 30, left: 60 };
    chartWidth = (width - margin.left) - margin.right;
    chartHeight = (height - margin.top) - margin.bottom -100;

    if (isPie) {   
        isPie = false; 
        svg.selectAll("*").transition().duration(1000).attr("transform", "translate(0, 1000)").remove();
        initializeSVG();
    }

    //define x and y scales
    xScale = d3.scaleLinear()
        .domain([d3.min(data, function (d) {
            return d["Social Vulnerability Index (SVI)"];
        }), d3.max(data, function (d) {
            return d["Social Vulnerability Index (SVI)"];
        })]).range([0, chartWidth+10]);
    yScale = d3.scaleLinear()
        .domain([d3.min(data, function (d) {
            return d["Percent adults fully vaccinated against COVID-19 (as of 6/10/21)"];
        }), d3.max(data, function (d) {
            return d["Percent adults fully vaccinated against COVID-19 (as of 6/10/21)"];
        })]).range([chartHeight, 10]);

    //draw the dots
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .transition()
        .duration(1000)
            .attr("cx", function (d) { return (xScale(d["Social Vulnerability Index (SVI)"])+margin.left); } )
            .attr("cy", function (d) { return (yScale(d["Percent adults fully vaccinated against COVID-19 (as of 6/10/21)"])+margin.bottom); } )
            .attr("r", 1.5)
            .style("fill", "darkslateblue");

    //add x-axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(10,${chartHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text");

    //add y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .attr("transform", `translate(10, 0)`)
        .selectAll("text");
    
    //update axes
    chart.transition()
        .duration(1000)
        .select(".x-axis")
        .call(d3.axisBottom(xScale));
    
    chart.transition()
        .duration(1000)
        .select(".y-axis")
        .call(d3.axisLeft(yScale));

    //title
    if (title.length > 0) {
        svg.select("#chart-title")
            .transition()
            .duration(1000)
            .text(title)
            .style("font", "19px times");
    }

    //x-axis label
    svg.append("text")
        .transition()
        .duration(1000)
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", 400)
        .attr("y", chartHeight + 70)
        .style("font", "15px times")
        .style("fill", "darkslateblue")
        .text(xTitle);

    
    //y-axis label
    svg.append("text")
        .transition()
        .duration(1000)
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 10)
        .attr("x", -50)
        .attr("dy", "1em")
        .attr("transform", "rotate(-90)")
        .style("font", "15px times")
        .style("fill", "darkslateblue")
        .text(yTitle);

}

//fill in the dot colors in the scatterplot
function fillDotColors() {
    data = vaccineHesData;
    
    //use viridis as a color scale based on the min/max values of 'estimated hesitant or unsure'
    var colorScale = d3.scaleSequential()
        .domain([
            d3.min(data, function (d) {
                return d["Estimated hesitant or unsure"];
            }), 
            d3.max(data, function (d) {
                return d["Estimated hesitant or unsure"];
            })]).interpolator(d3.interpolateViridis);
    
            //select all the scatterplot dots
    svg.selectAll("circle")
        .transition().duration(1000)
        .style("fill", function (d) {
            {
                return colorScale(d["Estimated hesitant or unsure"]);
            }
        })
        .attr("r", 1.5);
      
    //create the scale if it doesn't exist
    if (!scaleExists) {
        const defs = svg.append("defs");
  
        const linearGradient = defs.append("linearGradient")
            .attr("id", "linear-gradient");
        
        linearGradient.selectAll("stop")
          .data(colorScale.ticks().map((t, i, n) => ({ offset: `${100*i/n.length}%`, color: colorScale(t) })))
          .enter().append("stop")
          .attr("offset", d => d.offset)
          .attr("stop-color", d => d.color);
    
        svg.append("g")
            .append("rect")
            .attr("x", 20)
            .attr("y", 430)
            .attr("class", "colorLegend")
            .transition()
            .duration(1000)
            .attr("width", width-40)
            .attr("height", "30px")
            .style("fill", "url(#linear-gradient)");

        svg.append("text")
            .transition()
            .duration(1000)
            .attr("class", "colorLegend")
            .attr("text-anchor", "end")
            .attr("x", 338)
            .attr("y", chartHeight + 100)
            .style("font", "15px times")
            .style("fill", "darkslateblue")
            .text("Percent of County Hesitant or Unsure of Vaccination");

        svg.append("text")
            .transition()
            .duration(1000)
            .attr("class", "colorLegend")
            .attr("text-anchor", "end")
            .attr("x", 60)
            .attr("y", chartHeight + 160)
            .style("font", "15px times")
            .style("fill", "darkslateblue")
            .text("0.05%");
        
        svg.append("text")
            .transition()
            .duration(1000)
            .attr("class", "colorLegend")
            .attr("text-anchor", "end")
            .attr("x", 578)
            .attr("y", chartHeight + 160)
            .style("font", "15px times")
            .style("fill", "darkslateblue")
            .text("32%");
            
            scaleExists = true;
    }

    //remove the line of best fit if the user moves from verse 2 to verse 1
    if (bestFitExists && keyframeIndex == 1) {
        bestFitExists = false;
        svg.selectAll(".bestFitLine").transition().duration(1000).attr("transform", "translate(0, 1000)").remove();
    }
    
}

//add the trendline to the scatterplot
function lineOfBestFit() {

    //if moving from verse 4 to 3, reset the colors
    if (isVeryHes) {
        drawScatterPlot();
        setTimeout(() =>{fillDotColors()}, "1000");
        isVeryHes = false;
    }
    
    //find the x and y of the line
    data = vaccineHesData;
    var lineGen = d3.regressionLinear()
        .x(d => d["Social Vulnerability Index (SVI)"])
        .y(d => d["Percent adults fully vaccinated against COVID-19 (as of 6/10/21)"])
        .domain([0, 1]);

        var pointX1 = (chartWidth)*(lineGen(data)[0][0]);
        var pointX2 = (chartWidth+10)*(lineGen(data)[1][0]);

        var pointY1 = chartHeight*(lineGen(data)[1][1]);
        var pointY2 = chartHeight*(lineGen(data)[0][1]);

    //append the line to the scatterplot
    chart.append("line")
            .transition()
            .duration(1000)
            .attr("x1", pointX1)
            .attr("x2", pointX2)
            .attr("y1", pointY1)
            .attr("y2", pointY2)
            .attr("class", "bestFitLine")
            .attr("stroke", "darkslateblue")
            .attr("stroke-width", "2px")
            .attr("transform", `translate(10, 75)`);
    
    bestFitExists = true;
}

//highlight the datapoints that are MOST vaccine hesitant
function fillVeryHesitant() {
    data = vaccineHesData;
    //make sure that the new data group has the same color scale as the old one
    //(so the colors are the same)
    var colorScale = d3.scaleSequential()
        .domain([
            d3.min(data, function (d) {
                return d["Estimated hesitant or unsure"];
            }), 
            d3.max(data, function (d) {
                return d["Estimated hesitant or unsure"];
            })]).interpolator(d3.interpolateViridis);
    
    //set the range of the second scale to 0-100
    //this way the value can be used to find the top 1/3 of values
    var colorScale2 = d3.scaleSequential()
        .domain([
            d3.min(data, function (d) {
                return d["Estimated hesitant or unsure"];
            }), 
            d3.max(data, function (d) {
                return d["Estimated hesitant or unsure"];
            })]).range([0, 100]);
    
    //gray out all dots in the bottom 66% (roughly 2/3)
    //that way only the most hesitant 1/3 are in viridis
    //then, make the top 1/3 of dots slightly larger and bottom 2/3 dots disappear
    svg.selectAll("circle")
        .transition().duration(1000)
        .style("fill", function (d) {
            {
                let f = colorScale2(d["Estimated hesitant or unsure"])
                if (f >= 66) {
                    return colorScale(d["Estimated hesitant or unsure"]);
                }
                else {
                    return "lightgray";
                }
            }
        })
        .transition().duration(1000)
        .attr("r", function (d){
            {
                let f = colorScale2(d["Estimated hesitant or unsure"])
                if (f >= 66) {
                    return 2;
                }
                else {
                    return 0;
                }
            }
        });

        //remove the best fit line
        isVeryHes = true;
        bestFitExists = false;
        svg.selectAll(".bestFitLine").transition().duration(1000).attr("transform", "translate(0, 1000)").remove();
}

/*
//highlight the datapoints that are in the middle 1/3 of vaccine hesitant
function fillModHesitant() {
    data = vaccineHesData;
    //make sure that the new data group has the same color scale as the old one
    //(so the colors are the same)
    var colorScale = d3.scaleSequential()
        .domain([
            d3.min(data, function (d) {
                return d["Estimated hesitant or unsure"];
            }), 
            d3.max(data, function (d) {
                return d["Estimated hesitant or unsure"];
            })]).interpolator(d3.interpolateViridis);

    //set the range of the second scale to 0-100
    //this way the value can be used to find the middle 1/3 of values
    var colorScale2 = d3.scaleSequential()
        .domain([
            d3.min(data, function (d) {
                return d["Estimated hesitant or unsure"];
            }), 
            d3.max(data, function (d) {
                return d["Estimated hesitant or unsure"];
            })]).range([0, 100]);

    //gray out all dots in the top 33% and bottom 33%
    //that way only the moderately hesitant 1/3 are in viridis
    //then, make the middle 1/3 of dots slightly larger and top/bottom 2/3 dots disappear
    svg.selectAll("circle")
        .style("fill", function (d) {
            {
                let f = colorScale2(d["Estimated hesitant or unsure"])
                if (f < 66 && f > 33) {
                    return colorScale(d["Estimated hesitant or unsure"]);
                }
                else {
                    return "lightgray";
                }
            }
        })
        .attr("r", function (d){
            {
                let f = colorScale2(d["Estimated hesitant or unsure"])
                if (f < 66 && f > 33) {
                    return 2;
                }
                else {
                    return 0;
                }
            }
        });

        bestFitExists = false;
        svg.selectAll(".bestFitLine").transition().duration(1000).attr("transform", "translate(0, 1000)").remove();
}
*/

//highlight the datapoints that are LEAST vaccine hesitant
function fillLowHesitant() {
    data = vaccineHesData;
    
    //make sure that the new data group has the same color scale as the old one
    //(so the colors are the same)
    var colorScale = d3.scaleSequential()
        .domain([
            d3.min(data, function (d) {
                return d["Estimated hesitant or unsure"];
            }), 
            d3.max(data, function (d) {
                return d["Estimated hesitant or unsure"];
            })]).interpolator(d3.interpolateViridis);

    //set the range of the second scale to 0-100
    //this way the value can be used to find the bottom 1/3 of values
    var colorScale2 = d3.scaleSequential()
        .domain([
            d3.min(data, function (d) {
                return d["Estimated hesitant or unsure"];
            }), 
            d3.max(data, function (d) {
                return d["Estimated hesitant or unsure"];
            })]).range([0, 100]);

    //gray out all dots in the top 66% (roughly 2/3)
    //that way only the least hesitant 1/3 are in viridis
    //then, make the bottom 1/3 of dots slightly larger and top 2/3 dots disappear
    svg.selectAll("circle")
        .transition().duration(1000)
        .style("fill", function (d) {
            {
                let f = colorScale2(d["Estimated hesitant or unsure"])
                if (f <= 33) {
                    return colorScale(d["Estimated hesitant or unsure"]);
                }
                else {
                    return "lightgray";
                }
            }
        })
        .transition().duration(1000)
        .attr("r", function (d){
            {
                let f = colorScale2(d["Estimated hesitant or unsure"])
                if (f <= 33) {
                    return 2;
                }
                else {
                    return 0;
                }
            }
        });

        //remove the line of best fit
        bestFitExists = false;
        svg.selectAll(".bestFitLine").transition().duration(1000).attr("transform", "translate(0, 1000)").remove();
}

//helper function that delays the clearing of the SVG and generation of the pie chart
//reduces animation bugs and removes the scatterplot
function makeItAPie(data, title = "") {
    setTimeout(() =>{makePie(data, title)}, "1000");
    svg.selectAll("*").transition().attr("transform", "translate(0, 1000)").duration(900).remove();
}

//creates the pie chart
function makePie(data, title = "") {

    // Define the margin so that there is space around the vis for axes and labels
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    let chartWidth1 = width - margin.left - margin.right;
    let chartHeight2 = height - margin.top - margin.bottom;
    var radius = (Math.min(chartWidth1, chartHeight2)-40) / 2;

    // Create a 'group' variable to hold the chart
    let chart = svg.append("g")
        .attr("transform", "translate(" + (width/2 +40) + "," + 250 + ")");

    //grab pie data
    var pie = d3.pie()
        .value(function(d) {
            return d.Count;
        });
      const pieData = pie(data, d => d.Motive);
     
    //create color scale
    var colorScale = d3.scaleSequential()
      .domain([0, 8]).interpolator(d3.interpolateViridis);

    //fill in colors
    chart.selectAll('slices')
        .data(pieData)
        .join('path')
        .attr('d', d3.arc()
          .innerRadius(0)
          .outerRadius(radius)
        )
        .attr("fill", function (d, i) {
            return colorScale(i);
        });

    motives = ["Fear", "Politics", "Downplay Severity", "Other", "False Hope", "Profit", "Help", "Undermine Target Country"]; //data.value(function(d) { return d.Motive });
    counts = [230, 177, 92, 87, 52, 37, 21, 21];

    pos = 215+100;
    pos2 = 20;

    //legend
    for (i = 0; i < counts.length; i++) {
        svg.append("circle")
            .transition()
            .duration(1000)
            .attr("cx", pos2)
            .attr("cy", pos+20)
            .attr("r", 6)
            .attr("fill", colorScale(i));
        
        svg.append("text")
            .transition()
            .duration(1000)
            .attr("x", pos2+ 25)
            .attr("y", pos+20)
            .text(motives[i])
            .style("font-size", "15px")
            .attr("fill", "darkslateblue")
            .attr("alignment-baseline","middle");
            pos = pos + 20;
    }

    //labels
    chart.selectAll('slices')
        .data(pieData)
        .join('text')
        .transition()
        .duration(1000)
        .text(function(d, i) {
            return (Math.round((counts[i]/717)*100) + "%");
        })
        .attr("transform", function(d) { 
            return ("translate(" + d3.arc()
                .innerRadius(0)
                .outerRadius(radius)
                .centroid(d) + ")"); 
        })
        .style("text-anchor", "middle")
        .style("font", "12px times")
        .style("fill", "white");

    //title
    svg.append("text")
        .transition()
        .duration(2000)
        .attr("id", "chart-title")
        .attr("x", width / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font", "20px times")
        .style("fill", "darkslateblue")
        .text(title);


    isPie = true;
    scaleExists = false;
}

//initialize the SVG!
initialize();
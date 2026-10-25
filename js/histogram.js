
/* Step 6: Draw the initial histogram */

const drawHistogram = (data) => {

    // Remove previous chart if present
    d3.select("#histogram")
        .selectAll("*")
        .remove();

    /* Step 6.1: Set up SVG chart */

    const svg = d3.select("#histogram")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr(
            "aria-label",
            "Histogram of TV annual energy consumption"
        );

    const innerChart = svg.append("g")
        .attr(
            "transform",
            `translate(${margin.left},${margin.top})`
        );


    /* Step 6.2: Generate bins */

    const bins = binGenerator(data);

    const binsMaxLength =
        d3.max(bins, d => d.length) || 0;


    /* Step 6.3: Define scales */

    xScale
        .domain([energyMin, energyMax])
        .range([0, innerWidth]);

    yScale
        .domain([0, Math.max(1, binsMaxLength)])
        .range([innerHeight, 0])
        .nice();


    /* Step 6.4: Draw histogram bars */

    innerChart
        .selectAll(".histogram-bar")
        .data(bins)
        .join("rect")
        .attr("class", "histogram-bar")
        .attr("x", d => xScale(d.x0))
        .attr("y", d => yScale(d.length))
        .attr("width", d =>
            Math.max(
                0,
                xScale(d.x1) - xScale(d.x0) - 2
            )
        )
        .attr("height", d =>
            innerHeight - yScale(d.length)
        )
        .attr("fill", barColor)
        .attr("stroke", bodyBackgroundColor)
        .attr("stroke-width", 1)
        .append("title")
        .text(d =>
            `${d.x0}–${d.x1} kWh/year: ${d.length} TVs`
        );


    /* Step 6.5: Add X-axis */

    innerChart
        .append("g")
        .attr("class", "axis x-axis")
        .attr(
            "transform",
            `translate(0,${innerHeight})`
        )
        .call(
            d3.axisBottom(xScale)
                .tickValues(d3.range(0, 1801, 200))
        );


    /* Step 6.6: Add Y-axis */

    innerChart
        .append("g")
        .attr("class", "axis y-axis")
        .call(
            d3.axisLeft(yScale)
                .ticks(8)
                .tickFormat(d3.format("d"))
        );


    /* X-axis label */

    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", width - margin.right)
        .attr("y", height - 12)
        .text(
            "Labeled Energy Consumption (kWh/year)"
        );


    /* Y-axis label */

    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", 20)
        .attr("y", 22)
        .text("Frequency");

};

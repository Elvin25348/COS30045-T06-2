
/* =====================================
   Step 2: Draw Scatterplot
===================================== */

const drawScatterplot = (data) => {

    // Clear existing scatterplot
    d3.select("#scatterplot")
        .selectAll("*")
        .remove();


    /* =====================================
       Step 2.2: Set Up Chart Area
    ===================================== */

    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("role", "img")
        .attr(
            "aria-label",
            "TV energy consumption by star rating, coloured by screen technology"
        );

    // Scatterplot inner chart
    innerChartS = svg.append("g")
        .attr(
            "transform",
            `translate(${margin.left},${margin.top})`
        );


    /* =====================================
       Step 2.3: Set Up Scales
    ===================================== */

    // Remove invalid data
    const validData = data.filter(d =>
        Number.isFinite(d.star) &&
        Number.isFinite(d.energyConsumption) &&
        d.energyConsumption >= 0 &&
        ["LED", "LCD", "OLED"].includes(d.screenTech)
    );

    // Find the extent of star ratings
    const starExtent = d3.extent(
        validData,
        d => d.star
    );

    // Find maximum energy consumption
    const maxEnergy = d3.max(
        validData,
        d => d.energyConsumption
    ) || 1;

    // X-axis: Star Rating
    xScaleS
        .domain([
            Math.min(0, starExtent[0] ?? 0),
            Math.max(8, starExtent[1] ?? 8)
        ])
        .range([0, innerWidth]);

    // Y-axis: Energy Consumption
    yScaleS
        .domain([0, maxEnergy])
        .range([innerHeight, 0])
        .nice();


    /* =====================================
       Step 2.4 and 2.5:
       Draw Scatterplot Circles
    ===================================== */

    innerChartS
        .selectAll(".scatter-point")
        .data(validData)
        .join("circle")

        .attr("class", "scatter-point")

        // X position = Star Rating
        .attr("cx", d => xScaleS(d.star))

        // Y position = Energy Consumption
        .attr("cy", d =>
            yScaleS(d.energyConsumption)
        )

        // Circle size
        .attr("r", 4)

        // Circle colour by screen technology
        .attr("fill", d =>
            colorScale(d.screenTech)
        )

        // Make overlapping circles transparent
        .attr("opacity", 0.5);


    /* =====================================
       Step 2.6: Add X-axis
    ===================================== */

    const bottomAxis = d3.axisBottom(xScaleS)
        .ticks(8);

    innerChartS.append("g")
        .attr("class", "axis")
        .attr(
            "transform",
            `translate(0,${innerHeight})`
        )
        .call(bottomAxis);


    /* X-axis Label */

    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", width - margin.right)
        .attr("y", height - 12)
        .text("Star Rating");


    /* =====================================
       Step 2.6: Add Y-axis
    ===================================== */

    const leftAxis = d3.axisLeft(yScaleS)
        .ticks(8);

    innerChartS.append("g")
        .attr("class", "axis")
        .call(leftAxis);


    /* Y-axis Label */

    svg.append("text")
        .attr("class", "axis-label")
        .attr(
            "transform",
            `translate(19,${height / 2}) rotate(-90)`
        )
        .attr("text-anchor", "middle")
        .text(
            "Labeled Energy Consumption (kWh/year)"
        );


    /* =====================================
       Step 2.7: Add Legend
    ===================================== */

    // Create legend in top-right corner
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr(
            "transform",
            `translate(${width - 110},${margin.top})`
        );

    // Screen technology categories
    const uniqueTechs = [
        "LED",
        "LCD",
        "OLED"
    ];

    uniqueTechs.forEach((tech, i) => {

        const item = legend.append("g")
            .attr(
                "transform",
                `translate(0,${i * 24})`
            );

        // Legend colour square
        item.append("rect")
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", colorScale(tech));

        // Legend label
        item.append("text")
            .attr("x", 19)
            .attr("y", 11)
            .attr("class", "legend-label")
            .text(tech);

    });

};

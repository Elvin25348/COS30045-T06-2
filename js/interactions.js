
/* =====================================
   Step 7: Histogram Filters
===================================== */

const populateFilters = (data) => {

    // Currently selected filters
    let selectedTech = "all";
    let selectedSize = "all";


    /* Create Technology Filter Buttons */

    const techButtons = d3.select("#filters_screen")
        .selectAll("button")
        .data(filters_screen)
        .join("button")
        .attr("type", "button")
        .attr("class", "filter-btn")
        .text(d => d.label);


    /* Create Screen Size Filter Buttons */

    const sizeButtons = d3.select("#filters_size")
        .selectAll("button")
        .data(filters_size)
        .join("button")
        .attr("type", "button")
        .attr("class", "filter-btn")
        .text(d => d.label);


    /* Update Active Button States */

    function refreshButtonStates() {

        techButtons
            .classed("active", d => d.isActive)
            .attr(
                "aria-pressed",
                d => String(d.isActive)
            );

        sizeButtons
            .classed("active", d => d.isActive)
            .attr(
                "aria-pressed",
                d => String(d.isActive)
            );

    }


    /* Update Histogram with Filtered Data */

    const updateHistogram = () => {

        const updatedData = data.filter(tv =>

            (selectedTech === "all" ||
                tv.screenTech === selectedTech) &&

            (selectedSize === "all" ||
                tv.screenSize === selectedSize)

        );


        // Generate updated bins
        const updatedBins =
            binGenerator(updatedData);

        const maxCount =
            d3.max(updatedBins, d => d.length) || 0;


        // Update Y-axis scale
        yScale
            .domain([0, Math.max(1, maxCount)])
            .nice();


        // Create transition
        const t = d3.transition()
            .duration(500)
            .ease(d3.easeCubicInOut);


        // Update bars
        d3.select("#histogram")
            .selectAll(".histogram-bar")
            .data(updatedBins)
            .join("rect")
            .attr("class", "histogram-bar")
            .attr("x", d => xScale(d.x0))
            .attr("width", d =>
                Math.max(
                    0,
                    xScale(d.x1) - xScale(d.x0) - 2
                )
            )
            .attr("fill", barColor)
            .attr("stroke", bodyBackgroundColor)
            .attr("stroke-width", 1)
            .interrupt()
            .transition(t)
            .attr("y", d => yScale(d.length))
            .attr("height", d =>
                innerHeight - yScale(d.length)
            );


        // Update histogram bar tooltips
        d3.select("#histogram")
            .selectAll(".histogram-bar")
            .each(function(d) {

                d3.select(this)
                    .selectAll("title")
                    .data([d])
                    .join("title")
                    .text(bin =>
                        `${bin.x0}–${bin.x1} kWh/year: ` +
                        `${bin.length} TVs`
                    );

            });


        // Update histogram Y-axis
        d3.select("#histogram .y-axis")
            .interrupt()
            .transition(t)
            .call(
                d3.axisLeft(yScale)
                    .ticks(8)
                    .tickFormat(d3.format("d"))
            );


        console.log(
            `Filter: ${selectedTech}, ` +
            `size: ${selectedSize}, ` +
            `TVs: ${updatedData.length}`
        );

    };


    /* Technology Button Events */

    techButtons.on("click", (event, d) => {

        if (d.isActive) return;

        selectedTech = d.id;

        filters_screen.forEach(filter => {
            filter.isActive =
                filter.id === d.id;
        });

        refreshButtonStates();
        updateHistogram();

    });


    /* Screen Size Button Events */

    sizeButtons.on("click", (event, d) => {

        if (d.isActive) return;

        selectedSize = d.id;

        filters_size.forEach(filter => {
            filter.isActive =
                filter.id === d.id;
        });

        refreshButtonStates();
        updateHistogram();

    });


    // Initial button appearance
    refreshButtonStates();

};


/* =====================================
   Step 3: Create Scatterplot Tooltip
===================================== */

const createTooltip = () => {

    // Create tooltip group
    const tooltip = innerChartS.append("g")
        .attr("class", "scatter-tooltip")
        .style("opacity", 0)
        .style("pointer-events", "none");


    /* Tooltip Background Rectangle */

    tooltip.append("rect")
        .attr("width", tooltipWidth)
        .attr("height", tooltipHeight)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("fill", barColor)
        .attr("fill-opacity", 0.92);


    /* Tooltip Text */

    const text = tooltip.append("text")
        .attr("class", "tooltip-text")
        .attr("x", 10)
        .attr("y", 20);


    // Brand
    text.append("tspan")
        .attr("class", "tooltip-brand")
        .attr("x", 10);


    // Model
    text.append("tspan")
        .attr("class", "tooltip-model")
        .attr("x", 10)
        .attr("dy", 22);


    // Screen Size
    text.append("tspan")
        .attr("class", "tooltip-size")
        .attr("x", 10)
        .attr("dy", 22);

};


/* =====================================
   Step 3.6–3.8: Handle Mouse Events
===================================== */

const handleMouseEvents = () => {

    // Select the tooltip
    const tooltip = innerChartS
        .select(".scatter-tooltip");


    // Select scatterplot circles
    innerChartS
        .selectAll(".scatter-point")


        /* Mouse Enter Event */

        .on("mouseenter", (event, d) => {

            console.log(
                "Mouse entered circle",
                d
            );


            /* Step 1: Update Tooltip Text */

            tooltip.select(".tooltip-brand")
                .text(`Brand: ${d.brand}`);

            tooltip.select(".tooltip-model")
                .text(`Model: ${d.model}`);

            tooltip.select(".tooltip-size")
                .text(
                    `Screen size: ${d.screenSize} inches`
                );


            /* Step 2: Get Circle Position */

            const cx = +event.currentTarget
                .getAttribute("cx");

            const cy = +event.currentTarget
                .getAttribute("cy");


            /* Step 3: Position Tooltip */

            // Keep tooltip within the chart width
            const tx = Math.max(
                0,
                Math.min(
                    innerWidth - tooltipWidth,
                    cx - tooltipWidth / 2
                )
            );

            // Show above circle when there is room
            const ty = cy >= tooltipHeight + 15
                ? cy - tooltipHeight - 12
                : cy + 12;


            /* Step 4: Show Tooltip */

            tooltip
                .interrupt()
                .attr(
                    "transform",
                    `translate(${tx},${ty})`
                )
                .transition()
                .duration(200)
                .style("opacity", 1);


            // Bring tooltip above the circles
            tooltip.raise();

        })


        /* Mouse Leave Event */

        .on("mouseleave", (event, d) => {

            console.log(
                "Mouse left circle",
                d
            );

            // Hide tooltip
            tooltip
                .interrupt()
                .transition()
                .duration(120)
                .style("opacity", 0);

        });

};

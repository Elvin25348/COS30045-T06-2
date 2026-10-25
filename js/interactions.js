
/* Step 7: Build interactive filters */

const populateFilters = (data) => {

    // Store currently selected filters
    let selectedTech = "all";
    let selectedSize = "all";


    /* Step 7.3: Create screen technology buttons */

    const techButtons = d3.select("#filters_screen")
        .selectAll("button")
        .data(filters_screen)
        .join("button")
        .attr("type", "button")
        .attr("class", "filter-btn")
        .text(d => d.label);


    /* Optional: Create screen size buttons */

    const sizeButtons = d3.select("#filters_size")
        .selectAll("button")
        .data(filters_size)
        .join("button")
        .attr("type", "button")
        .attr("class", "filter-btn")
        .text(d => d.label);


    /* Update active button appearance */

    function refreshButtonStates() {

        // Screen technology buttons
        techButtons
            .classed("active", d => d.isActive)
            .attr(
                "aria-pressed",
                d => String(d.isActive)
            );

        // Screen size buttons
        sizeButtons
            .classed("active", d => d.isActive)
            .attr(
                "aria-pressed",
                d => String(d.isActive)
            );

    }


    /* Step 7.4: Update the histogram */

    const updateHistogram = () => {

        // Filter data by screen technology AND size
        const updatedData = data.filter(tv =>

            (selectedTech === "all" ||
                tv.screenTech === selectedTech) &&

            (selectedSize === "all" ||
                tv.screenSize === selectedSize)

        );


        /* Generate updated histogram bins */

        const updatedBins = binGenerator(updatedData);

        const maxCount =
            d3.max(updatedBins, d => d.length) || 0;


        /* Update Y-axis scale */

        yScale
            .domain([0, Math.max(1, maxCount)])
            .nice();


        /* Create a D3 transition */

        const t = d3.transition()
            .duration(500)
            .ease(d3.easeCubicInOut);


        /* Update histogram bars */

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

            // Stop previous animation
            .interrupt()

            // Animate bars to new positions
            .transition(t)
            .attr("y", d => yScale(d.length))
            .attr("height", d =>
                innerHeight - yScale(d.length)
            );


        /* Update bar hover tooltips */

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


        /* Animate the Y-axis */

        d3.select("#histogram .y-axis")
            .interrupt()
            .transition(t)
            .call(
                d3.axisLeft(yScale)
                    .ticks(8)
                    .tickFormat(d3.format("d"))
            );


        /* Debugging */

        console.log(
            `Filter: ${selectedTech}, ` +
            `size: ${selectedSize}, ` +
            `TVs: ${updatedData.length}`
        );

    };


    /* Screen technology button click event */

    techButtons.on("click", (event, d) => {

        // Do nothing if button is already active
        if (d.isActive) return;

        // Update selected screen technology
        selectedTech = d.id;

        // Update active state
        filters_screen.forEach(filter => {
            filter.isActive = filter.id === d.id;
        });

        // Update buttons and histogram
        refreshButtonStates();
        updateHistogram();

    });


    /* Screen size button click event */

    sizeButtons.on("click", (event, d) => {

        // Do nothing if button is already active
        if (d.isActive) return;

        // Update selected screen size
        selectedSize = d.id;

        // Update active state
        filters_size.forEach(filter => {
            filter.isActive = filter.id === d.id;
        });

        // Update buttons and histogram
        refreshButtonStates();
        updateHistogram();

    });


    /* Set initial active buttons */

    refreshButtonStates();

};

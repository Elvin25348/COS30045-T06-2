
/* =====================================
   Load TV Dataset
===================================== */

d3.csv("data/Ex6_TVdata.csv", d => ({

    brand: d.brand,
    model: d.model,

    screenSize: +d.screenSize,

    screenTech: d.screenTech.trim(),

    energyConsumption: +d.energyConsumption,

    star: +d.star

})).then(data => {

    /* Check CSV Data */

    console.log("Loaded records:", data.length);

    console.log(
        "Sample records:",
        data.slice(0, 5)
    );


    /* =====================================
       Histogram Data
    ===================================== */

    // Histogram only includes TVs below 1800
    const histogramData = data.filter(d =>

        Number.isFinite(d.energyConsumption) &&

        d.energyConsumption >= 0 &&

        d.energyConsumption < energyMax

    );


    /* Draw Original Histogram */

    drawHistogram(histogramData);


    /* Create Technology and Size Filters */

    populateFilters(histogramData);


    /* =====================================
       Draw Scatterplot
    ===================================== */

    // Scatterplot uses full valid dataset
    drawScatterplot(data);


    /* Create Tooltip */

    createTooltip();


    /* Attach Mouse Events */

    handleMouseEvents();


}).catch(error => {

    console.error(
        "Error loading TV data:",
        error
    );

    d3.select("#histogram").text(
        "Unable to load TV data. " +
        "Please use VS Code Live Server."
    );

});

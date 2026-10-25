
/* Load the CSV file with a row conversion function */

d3.csv("data/Ex6_TVdata.csv", d => ({

    brand: d.brand,
    model: d.model,

    // Convert to number
    screenSize: +d.screenSize,

    screenTech: d.screenTech.trim(),

    // Convert to number
    energyConsumption: +d.energyConsumption,

    // Convert to number
    star: +d.star

})).then(data => {

    // Check that the data has loaded
    console.log("Loaded records:", data.length);
    console.log("Sample records:", data.slice(0, 5));

    // Include only TVs with energy consumption
    // between 0 and 1800 kWh/year (excluding 1800)
    const chartData = data.filter(d =>
        Number.isFinite(d.energyConsumption) &&
        d.energyConsumption >= 0 &&
        d.energyConsumption < energyMax
    );

    console.log(
        "Records within chart range:",
        chartData.length
    );

    // Draw initial histogram
    drawHistogram(chartData);

    // Create interactive filter buttons
    populateFilters(chartData);

}).catch(error => {

    console.error(
        "Error loading the CSV file:",
        error
    );

    d3.select("#histogram").text(
        "Unable to load TV data. " +
        "Please run this page using VS Code Live Server."
    );

});

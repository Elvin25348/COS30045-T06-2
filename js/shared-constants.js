
/* =====================================
   Chart Dimensions and Margins
===================================== */

const margin = {
    top: 40,
    right: 30,
    bottom: 65,
    left: 70
};

const width = 900;
const height = 460;

const innerWidth =
    width - margin.left - margin.right;

const innerHeight =
    height - margin.top - margin.bottom;


/* =====================================
   Colours
===================================== */

const barColor = "#606464";
const bodyBackgroundColor = "#fffaf0";


/* =====================================
   Histogram Scales
===================================== */

const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();

const energyMin = 0;
const energyMax = 1800;


/* Histogram Bin Generator */

const binGenerator = d3.bin()
    .value(d => d.energyConsumption)
    .domain([energyMin, energyMax])
    .thresholds(d3.range(200, energyMax, 200));


/* =====================================
   Screen Technology Filters
===================================== */

const filters_screen = [
    { id: "all", label: "All", isActive: true },
    { id: "LED", label: "LED", isActive: false },
    { id: "LCD", label: "LCD", isActive: false },
    { id: "OLED", label: "OLED", isActive: false }
];


/* =====================================
   Screen Size Filters
===================================== */

const filters_size = [
    { id: "all", label: "All Sizes", isActive: true },
    { id: 24, label: '24"', isActive: false },
    { id: 32, label: '32"', isActive: false },
    { id: 55, label: '55"', isActive: false },
    { id: 65, label: '65"', isActive: false },
    { id: 98, label: '98"', isActive: false }
];


/* =====================================
   Scatterplot Shared Constants
===================================== */

// Store the scatterplot inner chart
let innerChartS;

// Independent scatterplot X and Y scales
const xScaleS = d3.scaleLinear();
const yScaleS = d3.scaleLinear();

// Colour coding by screen technology
const colorScale = d3.scaleOrdinal()
    .domain(["LED", "LCD", "OLED"])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c"]);


/* =====================================
   Tooltip Dimensions
===================================== */

const tooltipWidth = 205;
const tooltipHeight = 76;

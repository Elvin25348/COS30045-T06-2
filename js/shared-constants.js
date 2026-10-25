
/* Step 5: Chart dimensions and margins */

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


/* Chart colours */

const barColor = "#606464";

const bodyBackgroundColor = "#fffaf0";


/* D3 scales */

const xScale = d3.scaleLinear();
const yScale = d3.scaleLinear();


/* Energy consumption range */

const energyMin = 0;
const energyMax = 1800;


/* Histogram bin generator */

const binGenerator = d3.bin()
    .value(d => d.energyConsumption)
    .domain([energyMin, energyMax])
    .thresholds(d3.range(200, energyMax, 200));


/* Step 7.2: Screen technology filters */

const filters_screen = [
    { id: "all", label: "All", isActive: true },
    { id: "LED", label: "LED", isActive: false },
    { id: "LCD", label: "LCD", isActive: false },
    { id: "OLED", label: "OLED", isActive: false }
];


/* Optional: Screen size filters */

const filters_size = [
    { id: "all", label: "All Sizes", isActive: true },
    { id: 24, label: '24"', isActive: false },
    { id: 32, label: '32"', isActive: false },
    { id: 55, label: '55"', isActive: false },
    { id: 65, label: '65"', isActive: false },
    { id: 98, label: '98"', isActive: false }
];

function loadJSON(path, success, error) { //generic function to get JSON
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          if (success)
            success(JSON.parse(xhr.responseText));
        } else {
          if (error)
            error(xhr);
        }
      }
    };
    xhr.open("GET", path, true);
    xhr.send();
  }
  
  loadJSON('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json',
    dataset,
    function(xhr) {
      console.error(xhr);
    }
  );

//colour palette for temperature


function dataset(data) {
    const dataset = data;

    //svg construction
    // universal measures

    var h = 804;
    var w = 1400;
    var padding = 60;

    var svg = d3.select("body")
    .append("svg")
    .attr("height", h)
    .attr("width", w)
    .attr("class", "svg");

    //---AXES----//
    //sequential scale for colours
    var range = [2.8,3.9,5.0,6.1,7.2,8.3,9.4,10.5,11.6,12.7,13.8];
    
    var colorScale = d3.scaleThreshold()
    .domain([2.8,3.9,5.0,6.1,7.2,8.3,9.4,10.5,11.6,12.7,13.8])
    .range(['#a50026','#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1','#4575b4','#313695'].reverse());
    
    var scaleColour = d3.scaleLinear()
    .domain([13.8, 1.6])
    .range([0, 400]);

    var axisColour = d3.axisBottom()
    .scale(scaleColour)
    .ticks(10)
    .tickValues(colorScale.domain())
    .tickFormat((d,i) => range[i]);
    

    svg.append("g")
    .attr("transform", "translate(800,40)")
    .call(axisColour);
    
    svg.append("g")
    .attr("transform", "translate(800, 0)")
    .attr("id", "legend")
    .selectAll("rect")
    .data(range)
    .enter()
    .append("rect")
    .attr("x", (d) => scaleColour(d))
    .attr("y", 20)
    .attr("id", "legend")
    .attr("width", 36)
    .attr("height", 20)
    .style("fill", (d) => colorScale(d));

    //x axis based on Scale time on Months

    //modify month to read them though the date function, creating date object
    dataset.monthlyVariance.map((d) => d.year = new Date(d.year, 0, 2));
    dataset.monthlyVariance.map((d) => d.month = d.month - 1);
    
    
    var minDate = d3.min(dataset.monthlyVariance, d => d.year);
    var maxDate = d3.max(dataset.monthlyVariance, d => d.year);
    var yearFormat = d3.timeFormat("%Y");

    var xScale = d3.scaleTime()
    .domain([new Date(1752, 0, 0), maxDate])
    .range([padding, w - padding]);

    const xAxis = d3.axisBottom()
    .scale(xScale);
    
    svg.append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .attr("id", "x-axis")
    .call(xAxis);

    //Y-Axis, based on month taken from date
    //get month name
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    

    var yScale = d3.scaleBand()
    .domain([0,1,2,3,4,5,6,7,8,9,10,11])
    .range([padding, h - padding])
    .paddingOuter(0);


    const yAxis = d3.axisLeft()
    .scale(yScale)
    .tickFormat(function(d) {
      return months[d];
    });

    svg.append("g")
    .attr("transform", "translate(" + padding + ",0)")
    .attr("id", "y-axis")
    .call(yAxis);
    
    //===TOOLTIP===//
    
    var tooltip = d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden");
    

    svg.append("g")
    .selectAll("rect")
    .data(dataset.monthlyVariance)
    .enter()
    .append("rect")
    .attr("x", (d) => xScale(d.year))
    .attr("y", (d)=> yScale(d.month))
    .attr("width", "5px")
    .attr("height", ((h - padding * 2) / 12))
    .attr("class", "cell")
    .attr("data-month", (d) => d.month)
    .attr("data-year",(d)=>yearFormat(d.year))
    .attr("data-temp", (d)=> 8.6 + d.variance)
    .style("fill", (d) => colorScale(8.66 + d.variance))
    .on("mouseover", function(d) {
      console.log(d)
      tooltip.style("visibility", "visible")
      .style("top", yScale(d.month) + 100 + "px")
      .style("left", xScale(d.year) + 50 + "px")
      .attr("data-year", yearFormat(d.year))
      .html(d3.timeFormat("%d-%m-%Y")(d.year) + "<br>Temperature: " + parseFloat(8.66 + d.variance).toFixed(2) + "<br>Variance: " + d.variance);
    })
    .on("mouseout", (d) => tooltip.style("visibility", "hidden"));
    
    
  }
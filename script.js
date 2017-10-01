const dataUrl = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json'

const width = 1200
const height = 580
const margin = {
  top: 20,
  right: 40,
  bottom: 25,
  left: 100
}
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const colors = ['#5e4fa2', '#3288bd', '#66c2a5', '#abdda4', '#e6f598', '#ffffbf', '#fee08b', '#fdae61', '#f46d43', '#d53e4f', '#9e0142']

d3.json(dataUrl, content => {
  const { baseTemperature, monthlyVariance: data } = content

  // calculate temperature
  data.map(d => {
    d.temp = Math.round((baseTemperature + d.variance) * 1000) / 1000
  })

  const svg = d3.select('svg')

  // scales for x
  const xExtent = d3.extent(data, d => d.year)

  const xScale = d3.scaleTime()
    .domain(xExtent)
    .range([margin.left, width - margin.right])

  // scale for y
  const yExtent = d3.extent(data, d => d.month)

  const yScale = d3.scaleLinear()
    .domain(yExtent)
    .range([margin.top, height - margin.bottom])

  // scale for colors
  const tempExtent = d3.extent(data, d => d.temp)

  const colorScale = d3.scaleQuantile()
    .domain(tempExtent)
    .range(colors)

  // scale for months
  const monthScale = d3.scaleTime()
    .domain([new Date(2012, 0, 1), new Date(2012, 11, 31)])
    .range([margin.top, height + margin.bottom])

  // define axis 
  const xAxis = d3.axisBottom()
    .scale(xScale)
    .tickFormat(d3.format('d'))

  const yAxis = d3.axisLeft()
    .scale(monthScale)
    .tickFormat(d3.timeFormat('%B'))

  // render data 
  svg.selectAll('rect')
    .data(data)
    .enter().append('rect')
    .attr('width', 5)
    .attr('height', height / months.length)
    .attr('fill', d => colorScale(d.temp))
    .attr('x', d => xScale(d.year))
    .attr('y', d => yScale(d.month))
    .on('mousemove', handleMouseMove)
    .on('mouseout', handleMouseOut)

  // render legend
  svg.append('g')
    .attr('class', 'legendLinear')
    .attr('transform', 'translate(50, 660)')

  const colorLegend = d3.legendColor()
    .labelFormat(d3.format('.2f'))
    .orient('horizontal')
    .shapeWidth(100)
    .scale(colorScale)

  svg.select('.legendLinear')
    .call(colorLegend)

  // append axis to chart
  svg.append('g')
    .attr('transform', `translate(${[0, height + margin.bottom]})`)
    .call(xAxis)
    .append('text')
    .attr('x', 600)
    .attr('y', 45)
    .style('text-anchor', 'middle')
    .attr('fill', '#000')
    .style('font-size', '25')
    .style('font-weight', 'bold')
    .text('Years')

  svg.append('g')
    .attr('transform', `translate(${[margin.left, 0]})`)
    .call(yAxis)
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('y', 20)

  svg.append('g')
    .attr('transform', 'translate(40, 250)')
    .append('text')
    .style('text-anchor', 'end')
    .style('fill', '#000')
    .style('font-size', '25')
    .style('font-weight', 'bold')
    .attr('transform', 'rotate(-90)')
    .text('Months')

  // show/hide tooltipe on mouse hover
  const divTooltip = d3.select('body')
    .append('div')
    .attr('class', 'tool-tip')

  function handleMouseMove(d) {
    divTooltip.style('left', d3.event.pageX + 10 + 'px')
    divTooltip.style('top', d3.event.pageY - 25 + 'px')
    divTooltip.style('display', 'inline-block')
    divTooltip.transition()
      .duration(300)
      .style('opacity', 1)
    divTooltip.html(d.year + ' - ' + months[d.month - 1] + '<br/>' +
      d.temp + ' &#8451<br/>' + d.variance + ' &#8451')
  }

  function handleMouseOut(d) {
    divTooltip.style('display', 'none')
    divTooltip.transition()
      .duration(300)
      .style('opacity', 0)
  }

  // style elements
  d3.selectAll('text')
    .attr('font-size', '15')

})

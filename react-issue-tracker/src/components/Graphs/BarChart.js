import * as d3 from "d3";
import React, {useState, useEffect, useRef} from 'react';

export const BarChart = ({data}) => {
    const ungroupedData = data.filter((item) => item.Status !== "Completed" && item.status !== "Canceled");

    const groups = ungroupedData.reduce((groups, issue)=>{
        const groupBy = issue.Assigned;
        if(!groups[groupBy]){
          groups[groupBy]=[];
        }
        groups[groupBy].push(issue);
        return groups
      },{});
      const dataset = Object.keys(groups).map((groupBy)=>{
        return{
          groupBy,
          issues: groups[groupBy]
        };
      });
    //add a new property for the average yValue for the stats property
    for(let i=0; i<dataset.length; i++){
      dataset[i].count = dataset[i].issues.length;
    }
    //creating svg specifications
    const svgRef = useRef(null);
    const w = 800;
    const h= 500;
    const padding = 100;
    // populating svg
    React.useEffect(()=>{
      const xArr = dataset.map((d)=>d.groupBy);
      const yMax = d3.max(dataset, (d)=>d.count);
      //tooltip on hover
      const tooltip = d3.select(".dashboards")
                        .append("div")
                        .attr("id", "tooltip");

      function handleMouseOver(e, d){
        tooltip.style("opacity", .8)
               .style("left", ((e.pageX))+"px")
               .style("top", ((e.pageY)-100)+"px")
               .html(d.groupBy + "<br>" + d.count + " Open Issues Assigned")
      }

      function handleMouseOut(){
        tooltip.style("opacity", 0)
      }
      //creating scales
      const xScale = d3.scaleBand()
                           .domain(xArr)
                           .range([padding, w-padding]);
      const yScale = d3.scaleLinear()
                       .domain([0, yMax])
                       .range([h-padding, padding]);
      //creating svg
      const svgEl = d3.select(svgRef.current);
      svgEl.selectAll("*").remove(); //clear contents before adding new elements
      const svg = svgEl
                  .append("g")
      // creating chart area
        svg.selectAll("rect")
          .data(dataset)
          .enter()
          .append("rect")
          .attr("x", (d,i) => xScale(d.groupBy))
          .attr("y", (d) => yScale(d.count))
          .attr("width", xScale.bandwidth())
          .attr("height", (d)=> (h-padding)-yScale(d.count))
          .attr("class", "bar")
          .on("mouseover", handleMouseOver)
          .on("mouseout", handleMouseOut)
      //wrapping xAxis labels
      function wrap(text,width){
        text.each(function(){
          var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line  =[],
          lineNumber = 0,
          lineHeight = 1.1, //ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x",0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()){
          line.push(word);
          tspan.text(line.join(" "));
          if(tspan.node().getComputedTextLength() > width){
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
          }
        }
      });
      }
      //creating axis
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      svg.append("g")
         .attr("transform", "translate(0," + (h-padding) + ")")
         .call(xAxis)
         .selectAll(".tick text")
         .call(wrap, xScale.bandwidth())

      svg.append("g")
         .attr("transform", "translate(" + padding + ",0)")
         .call(yAxis);

       //adding axis labels
       svg.append("text")
          .attr("id", "chartLabel")
          .attr("text-anchor", "middle")
          .attr("transform", "translate(" + (w/2) + ",80)")
          .text("Employee Workload")
          .attr("class", "chart-label")
       svg.append("text")
          .attr("id", "xAxisLabel")
          .attr("text-anchor", "middle")
          .attr("x", (w/2))
          .attr("y", h-50)
          .text("Assigned To")
          .attr("class", "axis-label")
      svg.append("text")
          .attr("id", "yAxisLabel")
          .attr("text-anchor", "middle")
          .attr("y", 50)
          .attr("x", -h/2)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .text("Open Issues")
          .attr("class", "axis-label")

      })
    return (
      <div className="chart">
      <svg
          ref={svgRef}
          viewBox="0 0 800 500"
          preserveAspectRatio="xMinYMid"
          />
      </div>
    );
}
//references
//	Grouping objects https://stackoverflow.com/questions/46802448/how-do-i-group-items-in-an-array-by-date
//Wrapping X-Axis Labels https://bl.ocks.org/mbostock/7555321
//implementing react & d3 together https://blog.griddynamics.com/using-d3-js-with-react-js-an-8-step-comprehensive-manual/

export default BarChart;

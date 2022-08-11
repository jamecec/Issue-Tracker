import * as d3 from "d3";
import React, {useState, useEffect, useRef} from 'react';

export const StackedBarChart = ({data}) => {
    const ungroupedData = data.filter((item) => item.Status !== "Canceled");

    const groups = ungroupedData.reduce((groups, issue)=>{
        const groupBy = issue.Project;
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
    const groupedData = []
    for(let i=0; i<dataset.length; i++){
      groupedData.push({
        Project: dataset[i].groupBy,
        OpenCount: dataset[i].issues.filter((item)=> item.Status === "Open").length,
        ProgressCount: dataset[i].issues.filter((item)=> item.Status === "In Progress").length,
        CompletedCount: dataset[i].issues.filter((item)=> item.Status === "Completed").length,
        Total: dataset[i].issues.length
      })
    }
    //creating svg spec;ifications
    const svgRef = useRef(null);
    const h = 500;
    const w = 800;
    const padding = 100;
    // populating svg
    React.useEffect(()=>{
      const xArr = d3.map(groupedData, (d)=>d.Project)
      const yMax = d3.max(groupedData, (d)=> Math.max(d.Total));
      const subgroups = ["OpenCount", "ProgressCount", "CompletedCount"];
      //tooltip on hover
      const tooltip = d3.select(".dashboards")
                        .append("div")
                        .attr("id", "tooltip");

      function handleMouseOver(e, d){
        tooltip.style("opacity", .8)
               .style("left", ((e.pageX))+"px")
               .style("top", ((e.pageY)-150)+"px")
               .html("Open: " + d.data.OpenCount + "<br>" + "In Progress: " + d.data.ProgressCount + "<br>" + "Completed: " + d.data.CompletedCount + "<br>" + "Total: " + d.data.Total)
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
      const color = d3.scaleOrdinal()
                      .domain(subgroups)
                      .range(['#d4463b','#3492b8','#29b674']);
      //stacking dataset
      const stackedData = d3.stack()
                            .keys(subgroups)
                            (groupedData)
      //creating svg
      const svgEl = d3.select(svgRef.current);
      svgEl.selectAll("*").remove(); //clear contents before adding new elements
      const svg = svgEl
                  .append("g")


      // creating chart area
        svg.selectAll("g")
          .data(stackedData)
          .enter()
          .append("g")
          .attr("fill", (d)=> color(d.key))
          .selectAll("rect")
          .data((d)=>d)
          .enter()
          .append("rect")
          .attr("x", (d,i) => xScale(d.data.Project))
          .attr("y", (d) => yScale(d[1]))
          .attr("width", xScale.bandwidth())
          .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
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
          .attr("transform", "translate(" + (w/2) + ",40)")
          .text("Issues By Project")
          .attr("class", "chart-label")
      svg.append("text")
         .attr("id", "xAxisLabel")
         .attr('text-anchor', 'start')
         .attr("transform", "translate(" + (w/6) + ",80)")
         .text("▣ Open")
         .attr("class", "key-label")
         .attr("fill", '#d4463b')
       svg.append("text")
          .attr("id", "xAxisLabel")
          .attr("transform", "translate(" + (w/2.5) + ",80)")
          .text("▣ In Progress")
          .attr("class", "key-label")
          .attr("fill", '#3492b8')
      svg.append("text")
         .attr("id", "xAxisLabel")
         .attr("transform", "translate(" + (w/1.5) + ",80)")
         .text("▣ Completed")
         .attr("class", "key-label")
         .attr("fill", '#29b674')
       svg.append("text")
          .attr("id", "xAxisLabel")
          .attr("text-anchor", "middle")
          .attr("x", (w/2))
          .attr("y", h-50)
          .text("Project")
          .attr("class", "axis-label")
      svg.append("text")
          .attr("id", "yAxisLabel")
          .attr("text-anchor", "middle")
          .attr("y", 50)
          .attr("x", -h/2)
          .attr("dy", ".75em")
          .attr("transform", "rotate(-90)")
          .text("Issue Count")
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

export default StackedBarChart;

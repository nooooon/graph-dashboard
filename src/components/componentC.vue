<template>
<div v-show="graphParam.Data != null">
  <h2>GraphC</h2>
  <svg id="svg3"></svg>
</div>
</template>

<script lang="ts">

import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Emit } from 'vue-property-decorator';

declare function require(x: string): any;
const d3 = require('d3');

@Component({
  computed: {
    
  },
  watch: {
    graphParam: function (newVal, oldVal) {
      console.log('Prop changed: ', newVal, ' | was: ', oldVal)
      this.updateGraph();
    }
  },
  beforeCreate: function () {
    console.log("E:beforeCreate");
  },
  created: function () {
    console.log("E:created");
  },
  beforeMount: function () {
    console.log("E:beforeMount");
  },
  mounted: function () {
    console.log("E:mounted");

    let dataSet = [];

    this.svg = d3.select("#svg3")
      .attr("width", this.width)
      .attr("height", this.height);

    /* X軸のスケールを作成する */
    let xScale = d3.scaleLinear()
      .domain([0, 10])
      .range([this.margin.left, this.width - this.margin.right]);

    /* X軸を描画する */
    this.svg.append("g")
      .attr("class", "x_axis")
      .attr(
        "transform",
        "translate(" + [
          0,
          this.height - this.margin.bottom
        ].join(",") + ")"
      )
      .call(
        d3.axisBottom(xScale)
          .tickPadding(10)
          .tickSize(-this.cHeight)
      );

    /* Y軸のスケールを作成する */
    let yScale = d3.scalePoint()
      .domain([100, 80, 60, 40, 20, 0])
      .range([this.margin.top, this.height - this.margin.bottom]);

    /* Y軸を描画する */
    this.svg.append("g")
      .attr("class", "y1_axis")
      .attr(
        "transform",
        "translate(" + [
          this.margin.left,
          0
        ].join(",") + ")"
      )
    .call(
      d3.axisLeft(yScale)
        .ticks(5)
        .tickSizeInner(-this.cWidth)
        .tickFormat((d) => {
          return d + "%";
        })
    );

    /* 線グラフの線 */
    this.line = d3.line()
      .x((d, i) => {
        return this.normalizeX(i) + this.margin.left;
      })
      .y((d) => {
        return (this.height - this.margin.bottom) - this.normalizeY(d['val']);
      })
      .curve(d3.curveMonotoneX);

    this.graphPath = this.svg.append('g').append("path")
      .attr("class", "line")
      .datum(dataSet)
      .attr("d", this.line);

  },
  beforeUpdate: function () {
    console.log("E:beforeUpdate");
  },
  updated: function () {
    console.log("E:updated");
  },
  beforeDestroy: function () {
    console.log("E:beforeDestroy");
  },
  destroyed: function () {
    console.log("E:destroyed");
  },
  methods: {

  },
  data: function () {
    return {
      
    }
  }
})
export default class ComponentC extends Vue {
  @Prop(Object) graphParam!: object

  private g;
  private width:number = 500;
  private height:number = 300;

  private margin = {
      left: 30,
      right: 20,
      bottom: 40,
      top: 10,
  };
  private cWidth = this.width - this.margin.left - this.margin.right;
  private cHeight = this.height - this.margin.top - this.margin.bottom;

  private line;
  private graphPath;

  private normalizeX = d3.scaleLinear()
    .domain([0, 10]) 
    .range([0, this.cWidth]);

  private normalizeY = d3.scaleLinear()
    .domain([0, 100]) 
    .range([0, this.cHeight]);


  updateGraph() {
    let newGraphData = this.graphParam["Data"]["Data2"];
    this.graphPath.datum(newGraphData)
    .attr("d", this.line);

    let pathLength = this.graphPath.node().getTotalLength();
    
    this.graphPath.attr("stroke-dasharray", pathLength + " " + pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", 0);
  }
}

</script>

<style lang="scss" scoped>
  
  div {
    color: #8595e0;
  }
</style>
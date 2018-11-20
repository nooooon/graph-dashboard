<template>
<div>
  <h2>GraphA</h2>
  <svg id="svg"></svg>
</div>
</template>

<script lang="ts">
declare function require(x: string): any;

import Vue from 'vue';
import Component from 'vue-class-component';
// import { Prop, Emit } from 'vue-property-decorator';

declare function require(x: string): any;
const d3 = require('d3');
const axios = require('axios');

@Component({
  props   : ['value'],
  computed: {

  },
  watch: {
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

    this.dataSet = [
      {label: 'Data1', id: 1, valY: 20, valX: 10},
      {label: 'Data2', id: 2, valY: 50, valX: 50},
      {label: 'Data3', id: 3, valY: 30, valX: 80},
    ];

    this.svg = d3.select("#svg")
      .attr("width", this.width)
      .attr("height", this.height);

    /* x軸のスケールを作成する */
    let xScale = d3.scaleLinear()
      .domain([0, 100])
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

    this.svg.selectAll(".dot")
      .data(this.dataSet)
      .enter().append("circle")
      .attr("class", "dot")
      .on("click", (d) => {
        this.selectData(d.id);
      })
      .attr("cx", (d, i) => {
        return this.normalizeX(d['valX']) + this.margin.left;
      })
      .attr("cy", (d) => {
        return (this.height - this.margin.bottom) - this.normalizeY(d['valY'])
      })
      .attr("r", 0)
      .transition()
      .duration((d, i) => {
        return i * 200}
      )
      .delay((d, i) => {
        return i * 2000/7;
      })
      .attr("r", 5);
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
export default class App3 extends Vue {
  private dataSet: Object;
  private g;
  private width:number = 300;
  private height:number = 300;

  private margin = {
      left: 20,
      right: 20,
      bottom: 40,
      top: 0,
  };
  private cWidth = this.width - this.margin.left - this.margin.right;
  private cHeight = this.height - this.margin.top - this.margin.bottom;

  private normalizeX = d3.scaleLinear()
    .domain([0, 100]) 
    .range([0, this.cWidth]);

  private normalizeY = d3.scaleLinear()
    .domain([0, 100]) 
    .range([0, this.cHeight]);

  selectData(id) {
    axios.get(`assets/TestData/data${id}.json`)
    .then(response => 
        {
          console.log(response.data, this);
          this.call(response.data);
        }
    )
  }

  call (data) {
    this.$emit('graph-data', data);
  }
}

</script>

<style lang="scss" scoped>
  
  div {
    color: #8595e0;
  }
</style>
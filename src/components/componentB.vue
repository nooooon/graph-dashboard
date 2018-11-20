<template>
<div v-show="graphParam.Data != null">
  <h2>GraphB</h2>
  <svg id="svg2"></svg>
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

    let dataSet = [
      {label: 'ラベルA', val: 0},
      {label: 'ラベルB', val: 0},
      {label: 'ラベルC', val: 0},
      {label: 'ラベルD', val: 0},
      {label: 'ラベルE', val: 0},
    ];

    this.svg = d3.select("#svg2")
      .attr("width", this.width)
      .attr("height", this.height);

    this.g = this.svg.append("g")
      .attr("transform","translate(" + (this.cWidth / 2) + "," + (this.cHeight / 2) +")")
      .attr("class","chart-group");
    
    this.pieGroup = this.g.selectAll(".arc")
      .data(this.pie(dataSet))
      .enter().append("g")
      .attr("class", "arc");

    this.beforeGraphData = this.pie(dataSet);

    this.pieGroup.append("path")
      .attr("d", this.arc)
      .style("fill", (d) => {
        return this.color(d.index)
      })
      .transition()
      .duration(1000)
      .attrTween("d", (d) => {
        let interpolate = d3.interpolate(
          {startAngle: 0, endAngle: 0},
          {startAngle: d.startAngle, endAngle : d.endAngle}
        );
        return (t) => {
          return this.arc(interpolate(t))
        } 
      });

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
export default class ComponentB extends Vue {
  @Prop(Object) graphParam!: object

  private g;
  private pieGroup;

  private width:number = 300;
  private height:number = 300;
  private color = d3.scaleOrdinal()
        .range(["#DC3912", "#3366CC", "#109618", "#FF9900", "#990099"]);

  private margin = {
      left: 0,
      right: 0,
      bottom: 0,
      top: 0,
  };
  private cWidth = this.width - this.margin.left - this.margin.right;
  private cHeight = this.height - this.margin.top - this.margin.bottom;
  private radius = Math.min(this.cWidth, this.cHeight) / 2;
  private donutWidth = ( this.cWidth / 4);

  private beforeGraphData;
  
  // Pi定義
  private pie = d3.pie()
    .sort(null)
    .value((d) => {
      return d.val;
    });
  // 円弧の外径と内径を定義
  private arc = d3.arc()
    .innerRadius(this.donutWidth)
    .outerRadius(this.radius);

  updateGraph() {
    let newGraphData = this.pie(this.graphParam["Data"]);
    this.pieGroup
      .data(newGraphData)
      // .exit().remove()
      // .enter()
      // .append("g")
      // .attr("class", "arc");
      
    let transitions = 0;
    this.pieGroup
      .select("path")
      .transition()
      .on("start", () => {
        transitions++;
      })
      .duration(1000)
      .attrTween("d", (d) => {
        let sAngle = 0;
        let eAngle = 0;

        if(this.beforeGraphData) {
          this.beforeGraphData.forEach(data => {
            if(data.index == d.index ) {
              sAngle = data.startAngle;
              eAngle = data.endAngle;
            }
          });
        }

        let interpolate = d3.interpolate(
          {startAngle: sAngle, endAngle: eAngle},
          {startAngle: d.startAngle, endAngle : d.endAngle}
        );
        return (t) => {
          return this.arc(interpolate(t))
        } 
      }).on("end", () => {
        if(--transitions === 0) {
          this.beforeGraphData = newGraphData;
        }
      });
  }
}

</script>

<style lang="scss" scoped>
  
  div {
    color: #8595e0;
  }
</style>
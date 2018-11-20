<template>
<div>
  <div>App</div>

  <div class="l-block-wrapper">
    <componentA @graph-data="graphData" class="c-block"></componentA>
    <componentB :graph-param="graphParam" class="c-block" ref="graph"></componentB>
  </div>
</div>
</template>

<script lang="ts">

import Vue from 'vue';
import Component from 'vue-class-component';

import componentA from '../components/componentA.vue';
import componentB from '../components/componentB.vue';

@Component({
  props   : {
    
  },
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
          this.localFunc();
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
  components: {
    'componentA': componentA,
    'componentB': componentB,
  },
  data: function () {
    return {
      state: store.state,
      // graphParam: {}
    }
  }
})
export default class App2 extends Vue {

  graphParam:Object = {}

  graphData(data) {
    console.log("App", data.Data);
    this.graphParam = {Data: data.Data};
  }
}

const store = {
  state: {
    data: ""
  },
  setData(d) {
    this.state.data = d;
  },
  clearData() {
    this.state.data = null;
  }
}



</script>

<style lang="scss" scoped>
  
</style>
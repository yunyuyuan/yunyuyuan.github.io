<template>
  <div class="loading-img" :style="calcStyle">
    <img :data-viewer="dataViewer" :class="{failed: failed}" :src="srcNow" @load="loaded" @error="errored" @click="reload" alt="img"/>
    <span v-if="loading" flex>
      <svg-icon name="loading"/>
    </span>
  </div>
</template>

<script>
import errorImage from '@/image/error.jpg'

export default {
  name: "LoadingImg",
  props: {
    src: {
      type: String,
      default: ''
    },
    size: {
      type: Array,
      default: () => [8, 8]
    },
    dataViewer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      srcNow: this.src,
      loading: true,
      failed: false,
    }
  },
  watch: {
    '$props.src'() {
      this.srcNow = this.$props.src;
      this.failed = false
      this.loading = true
    }
  },
  computed: {
    calcStyle() {
      const s = {};
      if (this.size[0] > 0) {
        s.width = `${this.size[0]}rem`
      }
      if (this.size[1] > 0) {
        s.height = `${this.size[1]}rem`
      }
      return s
    }
  },
  methods: {
    loaded() {
      this.loading = false
    },
    errored() {
      this.loading = false;
      this.failed = true;
      this.srcNow = errorImage
    },
    reload() {
      if (this.failed) {
        this.loading = true
        this.failed = false
        this.srcNow = this.src
      }
    }
  }
}
</script>

<style scoped lang="scss">
.loading-img{
  position: relative;
  > img{
    width: 100%;
    height: 100%;
    &.failed{
      cursor: pointer;
      object-fit: cover;
      border: 1px solid #bdbdbd;
      background: white;
    }
  }
  > span{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    justify-content: center;
    z-index: 1;
    > svg{
      width: 50%;
      height: 50%;
    }
  }
}
</style>
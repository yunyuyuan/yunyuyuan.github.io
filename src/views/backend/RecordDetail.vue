<template>
  <div class="record-detail" v-if="getInfo" flex>
    <div class="operate" flex>
      <div class="back" @click="$router.push({name: 'backend.md'})" flex="">
        <svg-icon :name="'back'"/>
        <span>返回</span>
      </div>
      <span class="state">{{ saving.state }}</span>
      <loading-button :loading="saving.b" :text="'上传'" :icon="'save'" @click.native="save"/>
    </div>
    <div class="edit">
      <div class="images">
        <span class="head">
          <svg-icon :name="'picture'"/>
        </span>
        <div class="item" v-for="(i,idx) in getInfo.images">
          <loading-img :src="i" :size="[20, 15]"/>
          <div>
            <input :data-idx="idx" @focusout="editImg(idx)"/>
            <single-button @click.native="delImg(idx)" :text="'删除'"/>
          </div>
        </div>
        <span class="add" @click="addImg">
          <svg-icon :name="'add'"/>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import LoadingButton from "@/components/LoadingButton";
import LoadingImg from "@/components/LoadingImg";
import SingleButton from "@/components/Button";

export default {
  name: "RecordDetail",
  components: {SingleButton, LoadingImg, LoadingButton},
  data() {
    return {
      newInfo: {
        file: '',
        time: 0,
        images: []
      },
      saving: {
        b: false,
        state: ''
      }
    }
  },
  computed: {
    ...mapState(['record']),
    id() {
      return this.$route.params.id
    },
    getInfo() {
      return this.id === 'new' ? this.newInfo : this.record.find(v => v.file === this.id)
    },
  },
  methods: {
    delImg() {
    },
    editImg() {

    },
    addImg() {

    },
    async save() {

    }
  }
}
</script>

<style scoped lang="scss">
.record-detail{
  flex-direction: column;
  > .operate{
    margin-bottom: 0.5rem;
    justify-content: space-between;
    width: calc(100% - 0.5rem);
    padding: 0.2rem 0.2rem 0 0.2rem;
    > .back{
      cursor: pointer;
      padding: 0.4rem 0.8rem;
      border-radius: 0.2rem;
      box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.3);
      justify-content: center;
      background: #ff8595;
      transition: all .15s linear;

      &:hover{
        background: #ee647e;
      }

      > svg{
        width: 1.4rem;
        height: 1.4rem;
      }

      > span{
        font-size: 0.9rem;
        margin-left: 0.5rem;
      }
    }
    > .state{
      color: red;
      height: 1rem;
      font-size: 0.8rem;
    }
    > ::v-deep .loading-button{
      padding: 0.4rem 0.8rem;
      background: #66dded;
      box-shadow: 0 0 0.3rem #00000078;
      color: black;
      &:not(.loading):hover{
        background: #62c7db;
      }
      &.loading{
        background: gray;
        color: white;
      }
    }
  }
  > .edit{
    > .images{
      > .head{
        > svg{

        }
      }
      > .item{

      }
      > .add{

      }
    }
  }
}
</style>
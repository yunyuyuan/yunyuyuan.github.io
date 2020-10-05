<template>
  <div class="record" flex>
    <div class="head" flex>
      <div class="delete-state" v-if="deleting.bool">
        <svg-icon :name="'loading'"/>
        <span>{{ deleting.state }}</span>
      </div>
      <loading-button :text="'新建'" :icon="'add'" class="new"
                      @click.native="$router.push({name: 'backend.record.detail', params: {id: 'new'}})"/>
    </div>
    <div class="body">
      <table>
        <thead>
        <tr>
          <td>图</td>
          <td>文</td>
          <td>操作</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in record" :key="item.file">
          <td>
            <img :src="item.images[0]"/>
          </td>
          <td>
            <span>{{ item.prefix }}</span>
          </td>
          <td>
            <single-button @click.native="deleteItem(item)" :text="'删除'"/>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";
import SingleButton from "@/components/Button";
import LoadingButton from "@/components/LoadingButton";

export default {
  name: "Record",
  components: {LoadingButton, SingleButton},
  data() {
    return {
      deleting: {
        b: false,
        state: ''
      }
    }
  },
  computed: {
    ...mapState(['record'])
  },
  methods: {
    deleteItem(item) {

    }
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/style/public";
.record{
  min-height: 90%;
  flex-direction: column;
  > .head{
    width: 100%;
    margin: 1rem 0;
    justify-content: space-between;
    > .delete-state{
      margin-left: 1rem;
      > svg{
        width: 1.5rem;
        height: 1.5rem;
      }
      > span{
        color: red;
        font-size: 0.8rem;
        margin-left: 0.6rem;
      }
    }
    > ::v-deep .new{
      margin: 0 1rem 0 auto;
      background: #ffd784;
      padding: 0.6rem 1.2rem;
      box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.3);
      &:hover{
        background: #efca7c;
      }
      > svg{
        width: 1.2rem;
        height: 1.2rem;
        fill: #000000;
      }
      > span{
        margin-left: 0.5rem;
        font-size: 0.95rem;
        color: black;
      }
    }
  }
  > .body{
    width: 95%;
    margin: 1rem 0;
    > table{
      width: 100%;
      tbody{
        tr{
          height: 8rem;
          td{
            text-align: center;
            &:nth-child(1){
              width: 25%;
            }
            &:nth-child(2){
              width: 65%;
            }
            > img{
              width: 100%;
              object-fit: contain;
              cursor: pointer;
            }
            > span{
              @include text-overflow(4);
            }
            ::v-deep .single-button{
              border-radius: 0.2rem;
              background: #ff344f;
              width: 2.4rem;
              margin: 0 0.5rem;
              &[deleting]{
                background: #727272;
                cursor: not-allowed;
              }
              &:not([deleting]):hover{
                background: #f1314a;
              }
            }
          }
        }
      }
    }
  }
}
</style>
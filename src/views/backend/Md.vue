<template>
  <div class="md">
    <div class="list">
      <router-link v-for="item in mdList" :key="item.file" :to="{name: 'backend.md.detail', params: {id: item.file}}" class="md-item">
        <img :src="`md/${item.file}/${item.cover}`"/>
        <div class="info">
          <span class="time">{{ item.time }}</span>
          <span class="name">{{ item.name }}</span>
          <span class="summary">{{ item.summary }}</span>
          <div class="tags">
            <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import SingleButton from "@/components/Button";
import {mapState} from "vuex";

export default {
  name: "Md",
  components: {SingleButton},
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['config', 'gitUtil']),
    mdList (){
      //     "name": "测试",
      //     "file": "1",
      //     "cover": "cover.jpg",
      //     "time": "2020.9.13",
      //     "summary": "测试这个博客的md",
      //     "tags": ["文章","js"]
      return this.config.md
    }
  }
}
</script>

<style scoped lang="scss">
.md {
  width: 95%;
  height: 90%;
  margin: 5% auto;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 0.7rem;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.5);
  flex-direction: column;
  transition: all .1s linear;

  &:hover {
    background: white;
  }

  >.list{
    width: 90%;
    flex-direction: column;
    margin: 2rem 0;
    >.md-item{
      width: 100%;
      height: 8rem;
      background: #d4fbff;
      border-radius: 0 0.3rem 0.3rem 0;
      margin: 0.5rem 0;
      box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.3);
      cursor: pointer;
      &:hover {
        background: #d4fbff;
      }
      >img{
        height: 100%;
        width: 10rem;
        object-fit: contain;
      }
      >.info{
        flex-direction: column;
        justify-content: center;
        height: 100%;
        width: 100%;
        >.name{
          font-size: 1.06rem;
        }
        >.summary{
          font-size: 0.7rem;
          color: #666666;
          margin-top: 0.5rem;
        }
        >.time{
          font-size: 0.75rem;
          color: #ff0000;
          width: 100%;
          text-align: right;
          padding: 0.2rem 0.2rem 0 0;
        }
        >.tags{
          width: 100%;
          justify-content: flex-end;
          margin: auto 0 0.3rem 0;
          >span{
            background: #36b347;
            line-height: 1.2rem;
            padding: 0.05rem 0.6rem;
            color: white;
            border-radius: 0.15rem;
            box-shadow: 0 0 0.3rem rgba(0, 0, 0, 0.2);
            font-size: 0.65rem;
            margin: 0 0.5rem;
          }
        }
      }
    }
  }

}
</style>
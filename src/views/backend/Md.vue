<template>
  <div class="md">
    <template v-if="!login">
      <div class="to-login">
        <span>请先<single-button :text="'登录'" @click="$emit('login')"/>后查看或编辑此内容</span>
      </div>
    </template>
    <template v-else>
    </template>
  </div>
</template>

<script>
import SingleButton from "@/components/Button";

export default {
  name: "Md",
  components: {SingleButton},
  data() {
    return {
      login: false
    }
  },
  created() {
    if (!this.gitUtil) {
      this.login = false
    } else {
      this.gitUtil.getFile('public/md').then(res => {
        if (res[0]) {
          console.log(decodeURIComponent(escape(atob(res[1].data.content))));
        }
      })
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

  > .to-login {
    > span {
      display: flex;
      align-items: center;
      font-size: 1rem;

      > .single-button {
        margin: 0 0.5rem;
        background: #ff7245;

        &:hover {
          background: #d05c37
        }
      }
    }
  }
}
</style>
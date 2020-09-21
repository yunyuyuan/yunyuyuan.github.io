<template>
  <div class="theme">
    <textarea v-model="scss"></textarea>
    <loading-button :loading="saving" :icon="'save'" :text="'保存'" @click.native="save"/>
  </div>
</template>

<script>
import LoadingButton from "@/components/LoadingButton";
import {mapState} from "vuex";
import {getText, parseAjaxError} from "@/utils";
import {staticFolder} from "@/main";

export default {
  name: "Theme",
  components: {LoadingButton},
  data (){
    return {
      saving: false,
      scss: ''
    }
  },
  computed: {
    ...mapState(['gitUtil'])
  },
  watch: {
    $route (){
      if (this.$route.name === 'backend.theme'){
        let res = getText(`${staticFolder}/markdown.scss`);
        if (res[0]){
          this.scss = res[1]
        }else{
          this.$message.error('获取markdown.scss失败!请检查网络')
        }
      }
    }
  },
  methods: {
    async save (){
      if (this.gitUtil){
        this.saving = true;
        let res = await this.gitUtil.updateTheme(this.scss, this.scss);
        if (res[0]){
          this.$message.success('保存成功!');
        }else{
          this.$message.error(parseAjaxError(res[1]));
        }
        this.saving = false
      } else {
        this.$message.warning('请先登录!');
        this.$emit('login')
      }
    }
  }
}
</script>

<style scoped lang="scss">

</style>
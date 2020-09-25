<template>
  <div class="write">
    <div class="inner">
      <div class="textarea" ref="textarea"></div>
      <div class="utils">
        <span title="表情">
          <svg-icon :name="'cmt-sticker'"/>
        </span>
        <span title="图片">
          <svg-icon :name="'cmt-image'"/>
        </span>
        <span title="预览">
          <svg-icon :name="'cmt-preview'"/>
        </span>
      </div>
      <div class="submit">
        <float-input @input="inputNick" :name="'昵称'" :value="nick"/>
        <float-input @input="inputSite" :name="'网址'" :value="site"/>
        <loading-button :loading="submitting" :icon="'save'" :text="'提交'"/>
      </div>
    </div>
  </div>
</template>

<script>
import FloatInput from "@/components/FloatInput";
import LoadingButton from "@/components/LoadingButton";

export default {
  name: "WriteComment",
  components: {LoadingButton, FloatInput},
  data() {
    return {
      nick: '',
      site: '',
      submitting: false
    }
  },
  methods: {
    inputNick(r) {
      this.nick = r[1]
    },
    inputSite(r) {
      this.site = r[1]
    }
  }
}
</script>

<style scoped lang="scss">
.write {

}
</style>
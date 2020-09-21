<template>
    <div class="loading-button" :class="{loading: loading}" flex>
      <svg-icon :name="loading?'loading':icon"/>
      <span>{{ text }}</span>
    </div>
</template>

<script>
    export default {
        name: "LoadingButton",
        props: {
            loading: {
                type: Boolean,
                default: false
            },
            text: {
                type: String,
                default: ''
            },
            icon: {
                type: String,
                default: ''
            },
        }
    }
</script>

<style scoped lang="scss">
    .loading-button{
        color: white;
        padding: 0.2rem 0.8rem;
        border-radius: 0.3rem;
        cursor: pointer;
        transition: all .1s linear;
        background: #4a91ff;
        box-shadow: 0 0 0.4rem rgba(255, 255, 255, 0.3);
        &:hover{
            background: #8c8e8d;
        }
        &.loading{
            cursor: not-allowed;
            background: #8c8e8d;
        }
        > svg{
            width: 1.6rem;
            height: 1.6rem;
        }
        > span{
            font-size: 0.9rem;
            margin-left: 0.6rem;
        }
    }
</style>
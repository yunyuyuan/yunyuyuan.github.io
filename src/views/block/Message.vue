<template>
    <div class="message" flex>
      <div v-for="(item,idx) in list" :class="item.type" @click="removeItem(idx)" v-if="item.display" flex>
        <svg-icon :name="item.type"/>
        <span>{{ item.text }}</span>
      </div>
    </div>
</template>

<script>
    export default {
        name: "Message",
        data() {
            return {
                list: [],
                msgId: 0
            }
        },
        methods: {
            success(text) {
                this.putMessage('success', text)
            },
            error(text) {
                this.putMessage('error', text)
            },
            warning(text) {
                this.putMessage('warning', text)
            },
            putMessage(type, text) {
                // 清除之前的元素
                if (this.list.length > 4) {
                    this.list.splice(0, 4)
                }
                let obj = {
                    type: type,
                    text: text,
                    display: true
                };
                this.list.push(obj);
                setTimeout(() => {
                    obj.display = false
                }, 5000)
            },
            removeItem(idx) {
                this.list.splice(idx, 1)
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "src/assets/style/public";
    @keyframes msg-fade-out{
        0%{
            opacity: 0;
            transform: translateY(calc(-100% + 2rem));
        }
        5%{
            opacity: 1;
            transform: translateY(0);
        }
        95%{
            opacity: 1;
            transform: translateY(0);
        }
        100%{
            opacity: 0;
            transform: translateY(calc(-100% + 2rem));
            display: none;
        }
    }
    .message{
        position: fixed;
        z-index: $z-index-message;
        top: 0;
        left: calc(50% - 10rem);
        margin: 0 auto;
        flex-direction: column;
        > div{
            width: 20rem;
            border-radius: 0.6rem;
            box-shadow: 0 0 1rem rgba(0, 0, 0, 0.5);
            padding: 0.6rem 0;
            margin: 1rem 0;
            cursor: pointer;
            position: relative;
            animation: msg-fade-out 5s linear forwards;
            justify-content: center;
            &.success{
                background: #e0fffc;
            }
            &.error{
                background: #ffe2e9;
            }
            &.warning{
                background: #fff9d9;
            }
            > svg{
                width: 2rem;
                height: 2rem;
            }
            > span{
                font-size: 0.9rem;
                margin-left: 1rem;
            }
        }
    }
</style>
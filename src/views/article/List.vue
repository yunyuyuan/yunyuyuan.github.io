<template>
    <div class="list">
        <img :src="RMImage">
        <div class="inner">
            <div :class="{search: true, active: searchFocus}">
                <input v-model="search" @focusin="toggleInputFocus(true)" @focusout="toggleInputFocus(false)"/>
                <span onclick="this.previousElementSibling.click()">
                    <svg-icon :name="'search'"/>
                </span>
            </div>
            <div class="blog">
                <div v-for="item in list" class="item">
                    <span>{{ item.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import RMImage from '@/image/r&m.jpg'
    import config from "@/config";

    export default {
        name: "List",
        data() {
            return {
                RMImage,
                config,
                search: '',
                searchFocus: false
            }
        },
        computed: {
            list() {
                if (!this.search) return this.config.md;
                let lis = [];
                this.config.md.forEach(e => {
                    if (e.name.indexOf(this.search) !== -1) {
                        lis.push(e)
                    }
                });
                return lis
            }
        },
        methods: {
            toggleInputFocus(b) {
                this.searchFocus = b
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "src/assets/style/public";
    .list{
        width: 100%;
        height: 100%;
        position: relative;
        flex-shrink: 0;
        > img, > .inner{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        > img{
            object-fit: cover;
        }
        > .inner{
            flex-direction: column;
            background: rgba(0, 0, 0, 0.15);
            > .search{
                border-radius: 1rem;
                border: 1px solid #787878;
                background: rgba(0, 0, 0, 0.2);
                margin-top: $head-height+1rem;
                padding: 0.3rem;
                box-shadow: 0 0 0.5rem #d2d2d2;
                transition: all .1s linear;
                &.active{
                    background: rgba(255, 255, 255, 0.4);
                    box-shadow: 0 0 1rem #d2d2d2;
                }
                > input{
                    width: 15rem;
                    height: 100%;
                    font-size: 0.9rem;
                    border: none;
                    padding-left: 0.5rem;
                    background: transparent;
                }
                > span{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    > svg{
                        width: 1.2rem;
                        height: 1.2rem;
                        margin-right: 0.3rem;
                    }
                }
            }
            > .blog{
                flex-direction: column;
                > .item{
                }
            }
        }
    }
</style>
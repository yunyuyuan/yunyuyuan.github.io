<template>
    <div class="markdown-guide" is-dialog>
      <div class="inner">
        <p>本站markdown语法说明</p>
        <ul>
          <li>
            <a href="https://guides.github.com/features/mastering-markdown/#syntax" target="_blank">
              markdown基础语法+GFM
            </a>
          </li>
          <li v-for="item in guide">
            <b>{{ item[0] }}:</b>
            <span>{{ item[1] }}</span>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
export default {
  name: "MarkdownHelp",
  data (){
    return {
      guide: [
        ['#[google](https://google.com)', 'target=_blank的链接'],
        ['![30% x *](imgurl)', '宽为30%未设高度的img'],
        ['--title--\ncontent\n-- --', 'field'],
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.markdown-guide {
  color: black;

  > .inner {
    padding: 1rem 3rem;

    > p {
      font-size: 1.1rem;
      font-weight: bold;
    }

    > ul {
      > li {
        margin: 1.5rem 0;

        > a, > b {
          font-size: 1rem;
          color: #0066d8;
          white-space: pre;
        }

        > b {
          margin-right: 1rem;
        }

        > span {
          font-size: 0.9rem;
        }
      }
    }
  }
}
</style>
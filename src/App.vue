<template>
  <div id="app">
    <the-index/>
  </div>
</template>

<script>
import TheIndex from '@/views/index'

export default {
  name: 'App',
  components: {TheIndex},
}
</script>

<style lang="scss">
html, body{
  width: 100%;
  height: 100%;
  font-size: 16px;
}
#app{
  width: 100%;
  height: 100%;
}
* {
  margin: 0;
  padding: 0;
}

*[flex] {
  display: flex;
  align-items: center;
}

input, textarea, select, button {
  outline: none;
  resize: none;
}
table{
  border-collapse: collapse;
  box-shadow: 0 0 0.4rem rgba(0, 0, 0, 0.3);
  tr{
    td{

    }
  }
  thead{
    background: #2b2b2b;
    border-bottom: 2px solid #9f9f9f;
    td{
      padding: 0.8rem 0;
      color: white;
      font-size: 1.06rem;
      text-align: center;
      &:not(:last-of-type){
        border-right: 1px solid #d2d2d2;
      }
    }
  }
  tbody{
    tr{
      &:not(:last-of-type){
        border-bottom: 1px solid #d2d2d2;
      }
      background: white;
      &:nth-child(even){
        background: #f5f5f5;
      }
      &:hover{
        background: #e5fff1;
      }
      td{
        padding: 0.4rem 0;
        &:not(:last-of-type){
          border-right: 1px solid #d2d2d2;
        }
      }
    }
  }
}
::-webkit-scrollbar{
    width: 0.66rem;
    height: 0.66rem;
}
::-webkit-scrollbar-corner,
::-webkit-scrollbar-button{
    display: none;
}
::-webkit-scrollbar-thumb{
    border-radius: 0.6rem;
    background: #404040;
    border: 1px solid #828282;
}
::-webkit-scrollbar-thumb:hover{
    background: #323232
}
::-webkit-scrollbar-track{
    border-radius: 0.6rem;
    background: transparent;
}
</style>

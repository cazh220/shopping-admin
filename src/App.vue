<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view></router-view>
    </div>
  </a-config-provider>
</template>
<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN"
export default {
  name: "app",
  components: {},
  data() {
    return {
      locale: zhCN
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  height: 100%;
}

/*Vue隐藏*/
[v-cloak] {
  display: none;
}

/*清除样式*/
body,
ol,
ul,
dl,
li,
dt,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
p,
th,
td,
dl,
dd,
form,
fieldset,
legend,
input,
textarea,
select {
  margin: 0;
  padding: 0;
}
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}

html,
body {
  height: 100%;
}

html {
  position: relative;
  margin: 0 auto;
}

body {
  position: relative;
  font-size: 14px;
  font-family: Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  background: #fff;
  color: #282828;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: transparent;
}

h1,
h2,
h3,
h4,
h5 {
  font-weight: normal;
  font-size: 14px;
}

a {
  /* color: #333; */
  text-decoration: none;
  transition: color 0.2s ease-out;
}

a:hover {
  text-decoration: none;
}

em,
i {
  font-style: normal;
}

ol,
ul,
dl,
li,
dt,
dd {
  list-style: none;
}

img {
  border: 0;
  vertical-align: middle;
}

.boxShadow {
  box-shadow: 0 0 0.18rem 0 rgba(0, 0, 0, 0.1);
}

a img {
  border: 0;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}
input,
textarea {
  font-family: Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
  outline: none;
}

input,
textarea {
  -webkit-appearance: none;
  border-radius: 0;
  -webkit-border-radius: 0;
  -moz-border-radius: 0;
  outline: none;
  padding: 0px;
  margin: 0;
}
/*透明度渐变*/
.opacity {
  -webkit-animation: opacity 0.3s linear;
  animation: opacity 0.3s linear;
}
@-webkit-keyframes opacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes opacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
/*清除浮动*/
.clearfloat {
  zoom: 1;
}
.clearfloat:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
/*居中*/
.center {
  margin: 0 auto;
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
  background-color: #f5f5f5;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #f5f5f5;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  background-color: #c8c8c8;
}
</style>

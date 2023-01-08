<template>
  <div class="text-body-2 font-weight-light mb-n1">Count {{ store.count }}</div>
  <div class="connections" @contextmenu="onContextMenu($event)">
    <canvas id="pixi"></canvas>
  </div>
  <div class="pixiBody">
    <div class="buttons">
      <button v-on:click="stop()">Stop</button>
      <button v-on:click="start()">Start</button>
      <button v-on:click="reset()">Reset</button>
    </div>
    <br/>
  </div>
</template>

<script lang="ts">
import * as PIXI from "pixi.js";

var app;
var dialog;
var stars = [];
var t = 0;
export default {
  name: "pixi",
  data () {
    return {
      dialog: false,
    }
  },
  ready: function() {},
  methods: {
    stop() {
      app.stop();
    },
    start() {
      app.start();
    },
    reset() {
      console.log("reset");
      for (var i = 0; i < stars.length; i++) {
        var star = stars[i];
        star.x = 0;
        star.y = 0;
      }
    },
    bigBang() {},
    drawPixi(introAnim) {
      let graphics = new PIXI.Graphics() 
      graphics.lineStyle(8, 0xffff00)

      //start
      graphics.moveTo(300, 250)
      //end
      graphics.lineTo(500, 250)

      introAnim.stage.addChild(graphics)
    },
    drawAnim(introAnim) {

      // 2. Append canvas element to the body
      //document.body.appendChild(introAnim.view);
      //this.$el.appendChild(introAnim.view);
      //document.getElementById("pixiBody").appendChild(introAnim.view);

      var wW = window.innerWidth / 2,
        wH = window.innerHeight / 2,
        cw = window.innerWidth / 4,
        ch = window.innerHeight / 4;

      var minX = wW / 4,
        maxX = minX + cw,
        minY = wH / 4,
        maxY = minY + ch;

      console.log(document.body);

      console.log(wH, minY, maxY);

      var animSpeed = 0.05;
      var increase = (Math.PI * 2) / 800;
      var c = 0;

      var starNumber = 500,
        starSize = 2,
        starY = 0,
        starX = 0,
        starAlpha = 1,
        starScale = 1,
        starSpeed = 1;

      // 3. Create a container that will hold your scene
      var container = new PIXI.Container();

      introAnim.stage.addChild(container);

      var i;
      for (i = 0; i < starNumber; i++) {
        // 4b. Create a circle
        var star = new PIXI.Graphics();

        // define fill of our circle
        star.beginFill(0xffffff, 1);

        starSize = Math.random() * 2 + 0.75;
        star.animSpeed = Math.random() * 1;
        star.aDirection = 0;
        star.cDirection = 0;

        star.tint = Math.random() * 0xffffff;
        star.tintTo = star.tint;
        starX = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
        starY = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

        star.initX = starX;
        star.initY = starY;

        star.dix = starX - cw;
        star.diy = starY - ch;
        star.angle = (Math.atan2(star.diy, star.dix) * 180) / Math.PI;
        star.radians = Math.atan2(star.diy, star.dix);

        // draw circle (x, y, radius)
        star.drawCircle(starX, starY, starSize);

        stars.push(star);

        container.addChild(star);
      }

      // Listen for animate update
      introAnim.ticker.add(function(delta) {
        animSpeed = Math.abs(Math.cos(c)) * 15 + Math.pow(Math.PI, Math.atan(c));

        t++;

        for (var i = 0; i < stars.length; i++) {
          var star = stars[i];

          var b = star.getBounds();

          if (
            b.x > window.innerWidth ||
            b.x < 0 ||
            b.y > window.innerHeight ||
            b.y < 0
          ) {
            star.x = 0;
            star.y = 0;
          } else {
            star.x += Math.cos(star.radians) * star.animSpeed * animSpeed;
            star.y += Math.sin(star.radians) * star.animSpeed * animSpeed;
          }
        }
      });

      /*
      window.addEventListener("resize", function() {
        var wW = window.innerWidth,
          wH = window.innerHeight;

        console.log(wW, wH);

        app.renderer.resize(wW, wH);

        for (var i = 0; i < stars.length; i++) {
          var star = stars[i];
          star.x = Math.floor(Math.random() * wH + 1);
          star.y = Math.floor(Math.random() * wW + 1);
        }
      });
      */
    },
  },
  mounted() {
    var canvas = document.getElementById('pixi');

    // 1. Create a Pixi renderer and define size and a background color
    app = new PIXI.Application({
      width: window.innerWidth /2,
      height: window.innerHeight / 2,
      // change background color to blue
      backgroundColor: "0x000000",
      //resolution: window.devicePixelRatio || 1, //will zoom to max screen
      view: canvas,
    });

    this.drawAnim(app);
    this.drawPixi(app);
  },

};

</script>

<style lang="scss">
body {
  height: 100%;
}
.buttons {
  position: fixed;
}
</style>



<script lang="ts" setup>

import { onMounted, reactive } from 'vue'

import { MenuOptions } from '@imengyu/vue3-context-menu//src/ContextMenuDefine';
import ContextMenu from '@imengyu/vue3-context-menu'
import { useCounterStore } from "../store/counter";

const store = useCounterStore();


onMounted(() => {
  //highlight demo code
  (window as unknown as {
      hljs: {
        highlightAll: () => void
      }
    }).hljs?.highlightAll?.();
});
const menuData = reactive<MenuOptions>({
  items: [
    { 
      label: 'Click increase',
        onClick: () => { alert('Click increase store'); store.increment(); },
    },
    {
      label: "Sub menu Example",
      children: [
        {
          label: "Back",
          onClick: () => {
            if (window.event) {
              var isShift = !!window.event.shiftKey;
              console.log(isShift);
            }
             console.log("You click Back");
          }
        },
        { label: "Forward", disabled: true },
        { 
          label: "Reload", 
          divided: true, 
          icon: "icon-reload-1",
          onClick: () => {
            alert("You click Reload");
          }
        },
        { 
          label: "Save as...",
          icon: "icon-save",
          onClick: () => {
            alert("You click Save as");
          }
        },
        { 
          label: "Print...", 
          icon: "icon-print",
          onClick: () => {
            alert("You click Print");
          } 
        },
        { label: "View source", icon: "icon-terminal" },
        { label: "Inspect" }
      ],
    },
    {
      label: "Submenu with Submenu",
      children: [
        {
          label: "Very long submenu",
          divided: true, 
          children: [
            { label: "Test1" },
            { label: "Test2" },
            { label: "Test3" },
            { label: "Test4" },
            { label: "Test5" },
            { label: "Test6" },
            { label: "Test7" },
            { label: "Test8" },
            { label: "Test9" },
            { label: "Test10" },
            { label: "Test11" },
            { label: "Test12" },
            { label: "Test13" },
            { label: "Test14" },
            { label: "Test15" },
            { label: "Test16" },
            { label: "Test17" },
            { label: "Test18" },
            { label: "Test19" },
            { label: "Test20" },
            { label: "Test21" },
            { label: "Test22" },
            { label: "Test23" },
            { label: "Test24" },
            { label: "Test25" },
            { label: "Test26" },
          ]
        },
        { 
          label: "A submenu", 
          children: [
            { label: "日本語の基礎" },
            { label: "Item2" },
            { label: "Item3" },
          ]
        },
        { 
          label: "A submenu2", 
          children: [
            { label: "Item1" },
            { label: "Item2" },
            { label: "Item3" },
            { 
              label: "A submenu", 
              children: [
                { label: "Item1" },
                { label: "Item2" },
                { label: "Item3" },
              ]
            },
          ]
        },
      ]
    },
    { 
      label: 'Test item dynamic show and hide',
      clickClose: false,
      onClick: () => {
        menuData.items[4].hidden = !menuData.items[4].hidden;
      },
    },
    { 
      label: 'Click the item above to show/hide me',
    },
    { 
      label: 'Test item dynamic change the label',
      clickClose: false,
      onClick: () => {
        if (menuData.items[5].label === 'Test item dynamic change the label')
          menuData.items[5].label = 'My label CHANGED!';
        else
          menuData.items[5].label = 'Test item dynamic change the label';
      },
    },
    { 
      label: 'Item with icon',
      icon: "icon-reload-1",
    },
    { 
      label: "Item with svg icon",
      svgIcon: "#icon-clock",
    },
    { 
      label: "Item with svg icon",
      svgIcon: "#icon-multiply",
      svgProps: {
        fill: '#f60',
      },
    },
  ],
  iconFontClass: 'iconfont',
  customClass: "class-a",
  zIndex: 3,
  minWidth: 230,
  x: 0,
  y: 0,
});
function onContextMenu(e : MouseEvent) {
  //prevent the browser's default menu
  e.preventDefault();

  if (store.count == 0) {
    menuData.x = e.x;
    menuData.y = e.y;
    //show our menu
    ContextMenu.showContextMenu(menuData);
  }
  else {
    //menuData2.x = e.x;
    //menuData2.y = e.y;
    const menuData2 = {
        items: [
          { 
            label: 'This is menu in child box',
          },
          { 
            label: 'Simple item',
          },
        ],
        iconFontClass: 'iconfont',
        customClass: "class-a",
        zIndex: 3,
        minWidth: 230,
        x: e.x,
        y: e.y
      } as MenuOptions;
    ContextMenu.showContextMenu(menuData2);

  }


}

</script>
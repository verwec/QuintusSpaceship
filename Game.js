
var clamp = function(x, min, max){
  return x < min ? min : (x > max ? max : x);
}

var Q = Quintus()
  .include('Sprites, Anim, Input, Touch')
  .setup({ width: 800, height: 480 })
  .controls();

  Q.Sprite.extend('Player', {
    init: function(p){
      this._super(p, {
        sprite: 'player',
        sheet: 'player',
        x: Q.el.width/2,
        y: Q.el.height-60,
        type: Q.SPRITE_FRIENDLY,
        speed: 10
      });
      this.add("animation");
      this.play("default");
    },
    step: function(dt){
      if (Q.inputs["left"]){
        this.p.x -= this.p.speed;
      }

      if (Q.inputs["right"]){
        this.p.x += this.p.speed;
      }

      this.p.x = clamp(this.p.x, 0 + (this.p.w /2), Q.el.width - (this.p.w/2));
      this.p.y = clamp(this.p.y, 0 + (this.p.h /2), Q.el.height - (this.p.h/2));
    }
  });

  Q.load(['back.png', 'player.png', 'player_anim.png', 'player.json'], function(){
    Q.compileSheets("player_anim.png", "player.json")
    Q.animations("player", { default: { frames: [0,1,2,3], rate: 1/4 }});
    var background = new Q.Sprite({ asset: 'back.png', x: Q.el.width/2, y: Q.el.height/2, type: Q.SPRITE_NONE });
    var player = new Q.Player();
    Q.gameLoop(function(dt){
      Q.clear();
      background.render(Q.ctx);
      player.update(dt);
      player.render(Q.ctx);
    });
  });

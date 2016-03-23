
var clamp = function(x, min, max){
  return x < min ? min : (x > max ? max : x);
}

var Q = Quintus()
  .include('Sprites, Anim, Input, Touch, Scenes')
  .setup({ width: 800, height: 480 })
  .controls()
  .touch();

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
      this.add("Gun");
    },
    step: function(dt){
      if (Q.inputs["left"]){
        this.p.x -= this.p.speed;
      }

      if (Q.inputs["right"]){
        this.p.x += this.p.speed;
      }

      this.p.x = clamp(this.p.x, 0 + (this.p.w /2), Q.el.width - (this.p.w/2));
    }
  });

  Q.Sprite.extend("Shot", {
    init: function(p) {
      this._super(p, {
        sprite: 'shot',
        sheet: 'shot',
        speed: 200
      });

      this.add("animation");
      this.play("default");
    },
    step: function(dt){
      this.p.y -= this.p.speed * dt;
      if (this.p.y < 0) {
        this.destroy();
      }
    }
  });

  Q.component("Gun", {
    added: function(){
      this.entity.p.shots = [];
      this.entity.on('step', "handleFiring");
    },

    extend: {
      handleFiring: function(dt){
        var entity = this;

        for (var i=entity.p.shots.length-1; i>=0; i--) {
          if (entity.p.shots[i].isDestroyed) {
              entity.p.shots.splice(i, 1);
          }
        }

        if (Q.inputs["fire"]){
          this.fire();
        }
      },

      fire: function(){
        var entity = this;
        var shot = Q.stage().insert(new Q.Shot({x: this.p.x, y: this.p.y - 50, speed: 200, type: Q.SPRITE_DEFAULT | Q.SPRITE_FRIENDLY}));
        entity.p.shots.push(shot);
      }
    }
  });

  Q.scene("mainLevel", function(stage){
    Q.gravity=0;
    stage.insert(new Q.Sprite({ asset: 'back.png', x: Q.el.width/2, y: Q.el.height/2, type: Q.SPRITE_NONE }))
    stage.insert(new Q.Player());
  });

  Q.load(['back.png', 'player.png', 'player_anim.png', 'shot.png', 'player.json', 'shot.json'], function(){
    Q.compileSheets("player_anim.png", "player.json");
    Q.compileSheets("shot.png", "shot.json");
    Q.animations("player", { default: { frames: [0,1,2,3], rate: 1/4 }});
    Q.animations("shot", { default: { frames: [0,1,2,3], rate: 1/4 }});
    Q.stageScene("mainLevel");
  });

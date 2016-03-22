var Q = Quintus()
  .include('Sprites')
  .setup({ widht: 800, height: 480 });

Q.load([], function(){
  Q.gameLoop(function(dt){
  });
});

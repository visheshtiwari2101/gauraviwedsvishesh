// Playback intent is separate from asynchronous YouTube state notifications.
export function createMusicPlayback(onChange=()=>{}) {
 let player, wanted=false, playing=false, blocked=false, manuallyPaused=false;
 const report=()=>onChange({wanted,playing,blocked,manuallyPaused});
 const play=()=>{if(player&&wanted){try{player.unMute?.();player.playVideo();}catch{blocked=true;report();}}};
 return {
  ready(target){player=target;player.setVolume(35);play();},
  request(){wanted=true;manuallyPaused=false;blocked=false;report();play();},
  gesture(){if(!manuallyPaused&&!playing){wanted=true;blocked=false;report();play();}},
  pause(){wanted=false;manuallyPaused=true;playing=false;blocked=false;player?.pauseVideo();report();},
  toggle(){if(playing)this.pause();else this.request();},
  state(code){
   if(code===1&&!wanted){player?.pauseVideo();return;}
   playing=code===1;
   if(playing)blocked=false;
   report();
   if(code===0&&wanted){player.seekTo(0,true);play();}
  },
  blocked(){playing=false;blocked=true;report();},
  error(){playing=false;blocked=true;report();}
 };
}

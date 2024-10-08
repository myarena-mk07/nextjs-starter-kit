// interface YT {
//     Player: new (elementId: string, options: YT.PlayerOptions) => YT.Player;
//     PlayerState: {
//       ENDED: number;
//       PLAYING: number;
//       PAUSED: number;
//       BUFFERING: number;
//       CUED: number;
//     };
//   }
  
//   namespace YT {
//     interface PlayerOptions {
//       height?: string | number;
//       width?: string | number;
//       videoId?: string;
//       playerVars?: YT.PlayerVars;
//       events?: YT.Events;
//     }
  
//     interface PlayerVars {
//       autoplay?: 0 | 1;
//       controls?: 0 | 1 | 2;
//       modestbranding?: 1;
//       rel?: 0 | 1;
//       showinfo?: 0 | 1;
//     }
  
//     interface Events {
//       onReady?: (event: YT.PlayerEvent) => void;
//       onStateChange?: (event: YT.OnStateChangeEvent) => void;
//       onError?: (event: YT.OnErrorEvent) => void;
//     }
  
//     interface PlayerEvent {
//       target: YT.Player;
//     }
  
//     interface OnStateChangeEvent {
//       target: YT.Player;
//       data: number;
//     }
  
//     interface OnErrorEvent {
//       target: YT.Player;
//       data: number;
//     }
  
//     interface Player {
//       playVideo(): void;
//       pauseVideo(): void;
//       stopVideo(): void;
//       destroy(): void;
//     }
//   }
  
//   interface Window {
//     onYouTubeIframeAPIReady?: () => void;
//     YT?: YT;
//   }


interface YT {
    Player: new (elementId: string, options: YT.PlayerOptions) => YT.Player;
    PlayerState: {
      ENDED: number;
      PLAYING: number;
      PAUSED: number;
      BUFFERING: number;
      CUED: number;
    };
  }
  
  namespace YT {
    interface PlayerOptions {
      height?: string | number;
      width?: string | number;
      videoId?: string;
      playerVars?: YT.PlayerVars;
      events?: YT.Events;
    }
  
    interface PlayerVars {
      autoplay?: 0 | 1;
      controls?: 0 | 1 | 2;
      modestbranding?: 1;
      rel?: 0 | 1;
      showinfo?: 0 | 1;
    }
  
    interface Events {
      onReady?: (event: YT.PlayerEvent) => void;
      onStateChange?: (event: YT.OnStateChangeEvent) => void;
      onError?: (event: YT.OnErrorEvent) => void;
    }
  
    interface PlayerEvent {
      target: YT.Player;
    }
  
    interface OnStateChangeEvent {
      target: YT.Player;
      data: number;
    }
  
    interface OnErrorEvent {
      target: YT.Player;
      data: number;
    }
  
    interface Player {
      playVideo(): void;
      pauseVideo(): void;
      stopVideo(): void;
      destroy(): void;
    }
  }
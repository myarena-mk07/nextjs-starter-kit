// import React, { useState, useEffect, useRef } from 'react';
// import { Play, Pause, Loader } from 'lucide-react';

// declare global {
//   interface Window {
//     Vimeo?: any;
//   }
// }

// const VideoSection: React.FC = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [scrollPercentage, setScrollPercentage] = useState(0);
//   const [error, setError] = useState<string | null>(null);
//   const [isVimeoLoaded, setIsVimeoLoaded] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const iframeRef = useRef<HTMLIFrameElement>(null);
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const playerRef = useRef<any>(null);

//   useEffect(() => {
//     let script: HTMLScriptElement | null = null;
//     const loadVimeoAPI = () => {
//       return new Promise<void>((resolve, reject) => {
//         script = document.createElement("script");
//         script.src = "https://player.vimeo.com/api/player.js";
//         script.async = true;
//         script.onload = () => {
//           console.log("Vimeo API script loaded");
//           setIsVimeoLoaded(true);
//           resolve();
//         };
//         script.onerror = () => {
//           console.error("Failed to load Vimeo API script");
//           reject(new Error("Failed to load Vimeo API"));
//         };
//         document.body.appendChild(script);
//       });
//     };

//     const initializePlayer = async () => {
//       setIsLoading(true);
//       try {
//         await loadVimeoAPI();
//         if (iframeRef.current && window.Vimeo) {
//           playerRef.current = new window.Vimeo.Player(iframeRef.current);
//           console.log("Vimeo player initialized");
//           playerRef.current.on('play', () => setIsPlaying(true));
//           playerRef.current.on('pause', () => setIsPlaying(false));
//           playerRef.current.on('loaded', () => setIsLoading(false));
//           playerRef.current.on('error', (error: any) => {
//             console.error("Vimeo player error:", error);
//             setError("An error occurred with the video player. Please try again.");
//             setIsLoading(false);
//           });
//         }
//       } catch (error) {
//         console.error("Error initializing Vimeo player:", error);
//         setError("Failed to initialize video player. Please refresh the page and try again.");
//         setIsLoading(false);
//       }
//     };

//     initializePlayer();

//     return () => {
//       if (script && script.parentNode) {
//         script.parentNode.removeChild(script);
//       }
//       if (playerRef.current) {
//         playerRef.current.off('play');
//         playerRef.current.off('pause');
//         playerRef.current.off('loaded');
//         playerRef.current.off('error');
//       }
//     };
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (sectionRef.current) {
//         const { top, height } = sectionRef.current.getBoundingClientRect();
//         const windowHeight = window.innerHeight;
//         const scrollPercentage = Math.max(0, Math.min(1, 1 - (top - windowHeight/2) / (height + windowHeight/2)));
//         setScrollPercentage(scrollPercentage);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     handleScroll();

//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const togglePlay = () => {
//     if (isLoading) {
//       console.log("Player is still loading, please wait");
//       return;
//     }
//     if (playerRef.current) {
//       if (isPlaying) {
//         playerRef.current.pause();
//       } else {
//         playerRef.current.play().catch((error: any) => {
//           console.error("Playback error:", error);
//           setError("Playback was prevented. Please try again.");
//         });
//       }
//     } else {
//       console.error("Vimeo player not initialized");
//       setError("Video player is not ready. Please refresh the page and try again.");
//     }
//   };

//   const tiltAngle = 25 * (1 - scrollPercentage);
//   const scale = 0.95 + (scrollPercentage * 0.05);

//   return (
//     <div
//       ref={sectionRef}
//       className="relative w-[90vw] h-[25vh] sm:w-[60vw] sm:h-[25vh] md:w-[60vw] md:h-[50vh] lg:w-[70vw] lg:h-[70vh] overflow-hidden px-4 md:px-8 lg:px-16 group transition-all duration-300 ease-in-out hover:-translate-y-2"
//       style={{
//         transform: `perspective(1000px) rotateX(${tiltAngle}deg) scale(${scale})`,
//         transition: 'transform 0.3s ease-out, translate 0.3s ease-out',
//       }}
//     >
//       <div
//         className="w-full h-full rounded-lg overflow-hidden transition-all duration-300 relative"
//         style={{
//           boxShadow: `
//             0 0 10px rgba(198, 255, 177, 0.3),
//             0 0 20px rgba(180, 238, 245, 0.2)
//           `,
//         }}
//       >
//         {/* Gradient overlays */}
//         <div className="absolute inset-0 bg-gradient-to-t from-[#c6ffb1] via-transparent to-[#c6ffb1] opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
//         <div className="absolute inset-0 bg-gradient-to-r from-[#c6ffb1] via-transparent to-[#c6ffb1] opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
        
//         <div className="relative w-full h-full">
//           {!isPlaying && (
//             <img
//               src="https://i.ibb.co/qW28cnN/Screenshot-2024-10-07-at-12-49-10-PM.png"
//               alt="Preview"
//               className="absolute inset-0 w-full h-full object-cover"
//             />
//           )}
//           <iframe
//             ref={iframeRef}
//             src="https://player.vimeo.com/video/829718058?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479"
//             className="absolute inset-0 w-full h-full"
//             frameBorder="0"
//             allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
//             style={{ display: isPlaying ? 'block' : 'none' }}
//             title="Screen Recording 2023-05-24 at 9.38.33 AM"
//           ></iframe>
//           <button
//             onClick={togglePlay}
//             className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity duration-300 group-hover:bg-opacity-50"
//             style={{ display: isPlaying ? 'none' : 'flex' }}
//             disabled={isLoading}
//           >
//             <div className="w-20 h-20 flex items-center justify-center">
//               {isLoading ? (
//                 <Loader size={60} className="text-[#c6ffb1] animate-spin" />
//               ) : (
//                 <Play size={60} className="text-[#c6ffb1]" />
//               )}
//             </div>
//           </button>
//           {error && (
//             <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
//               <p className="text-white text-center">{error}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoSection;

// import React, { useState } from 'react';
// import { Play } from 'lucide-react';

// const VideoSection: React.FC = () => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [scrollPercentage, setScrollPercentage] = useState(0);

//   const videoId = "xiql2_QTUVc"; // Your YouTube video ID
//   const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
//   const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

//   // Scroll effect (you may need to adjust this based on your specific requirements)
//   React.useEffect(() => {
//     const handleScroll = () => {
//       const scrollTop = window.scrollY;
//       const docHeight = document.documentElement.scrollHeight - window.innerHeight;
//       const scrollPercent = scrollTop / docHeight;
//       setScrollPercentage(scrollPercent);
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   const tiltAngle = 25 * (1 - scrollPercentage);
//   const scale = 0.95 + (scrollPercentage * 0.05);

//   return (
//     <div 
//       className="relative w-[90vw] h-[25vh] sm:w-[60vw] sm:h-[25vh] md:w-[60vw] md:h-[50vh] lg:w-[70vw] lg:h-[70vh] overflow-hidden py-4 px-4 md:px-8 lg:px-16 group transition-all duration-300 ease-in-out hover:-translate-y-2"
//       style={{
//         transform: `perspective(1000px) rotateX(${tiltAngle}deg) scale(${scale})`,
//         transition: 'transform 0.3s ease-out, translate 0.3s ease-out',
//       }}
//     >
//       <div 
//         className="w-full h-full rounded-lg overflow-hidden transition-all duration-300 relative"
//         style={{
//           boxShadow: `
//             0 0 10px rgba(198, 255, 177, 0.3),
//             0 0 20px rgba(180, 238, 245, 0.2)
//           `,
//         }}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//       >
//         {/* Gradient overlays */}
//         <div className="absolute inset-0 bg-gradient-to-t from-[#c6ffb1] via-transparent to-[#c6ffb1] opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
//         <div className="absolute inset-0 bg-gradient-to-r from-[#c6ffb1] via-transparent to-[#c6ffb1] opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
        
//         {/* YouTube thumbnail and play button */}
//         <div className="relative w-full h-full">
//           <img 
//             src={thumbnailUrl} 
//             alt="Video thumbnail" 
//             className="w-full h-full object-cover"
//           />
//           <a
//             href={videoUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition-all duration-300"
//           >
//             <div className={`w-20 h-20 flex items-center justify-center bg-red-600 rounded-full transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}>
//               <Play size={40} color="white" />
//             </div>
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoSection;

import React, { useState, useEffect, useRef } from 'react';
import { Play, X } from 'lucide-react';

const VideoSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = "https://res.cloudinary.com/dmwocnj1q/video/upload/v1728395953/ptu1b3moape4qh2qfit1.mp4";
  const thumbnailSrc = "https://res.cloudinary.com/dmwocnj1q/video/upload/v1728393517/p3ij0neaxueueq4jla7v.jpg";

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { top, height } = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const scrollPercentage = Math.max(0, Math.min(1, 1 - (top - windowHeight/2) / (height + windowHeight/2)));
        setScrollPercentage(scrollPercentage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const tiltAngle = 25 * (1 - scrollPercentage);
  const scale = 0.95 + (scrollPercentage * 0.05);

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-[90vw] h-[25vh] sm:w-[60vw] sm:h-[25vh] md:w-[60vw] md:h-[50vh] lg:w-[70vw] lg:h-[70vh] overflow-hidden py-4 px-4 md:px-8 lg:px-16 group transition-all duration-300 ease-in-out hover:-translate-y-2"
        style={{
          transform: `perspective(1000px) rotateX(${tiltAngle}deg) scale(${scale})`,
          transition: 'transform 0.3s ease-out, translate 0.3s ease-out',
        }}
      >
        <div
          className="w-full h-full rounded-lg overflow-hidden transition-all duration-300 relative cursor-pointer"
          onClick={openModal}
          style={{
            boxShadow: `
              0 0 10px rgba(198, 255, 177, 0.3),
              0 0 20px rgba(180, 238, 245, 0.2)
            `,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#c6ffb1] via-transparent to-[#c6ffb1] opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#c6ffb1] via-transparent to-[#c6ffb1] opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
          <img src={thumbnailSrc} alt="Video thumbnail" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-20 h-20 flex items-center justify-center bg-red-600 rounded-full hover:bg-red-700 transition-all duration-300">
              <Play size={40} className="text-white" />
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative w-[90vw] h-[50vh] md:w-[80vw] md:h-[70vh] bg-black">
            <button
              onClick={closeModal}
              className="absolute top-[-40px] right-0 text-white text-xl p-2"
            >
              <X size={24} />
            </button>
            <video
              ref={videoRef}
              className="w-full h-full"
              src={videoSrc}
              poster={thumbnailSrc}
              controls
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoSection;
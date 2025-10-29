import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipBack, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const { theme } = useTheme();

  // Update current time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('loadeddata', () => setIsLoaded(true));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  // Handle fullscreen
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Auto-hide controls
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      window.clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    if (isPlaying) {
      resetControlsTimeout();
    }
    return () => {
      if (controlsTimeoutRef.current) {
        window.clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, currentTime]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
    resetControlsTimeout();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
    resetControlsTimeout();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    resetControlsTimeout();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
    resetControlsTimeout();
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
    resetControlsTimeout();
  };

  const skip = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
    resetControlsTimeout();
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-2xl overflow-hidden ${className} ${
        theme === 'dark' ? 'bg-black' : 'bg-gray-100'
      } ${
        isFullscreen ? '!rounded-none flex items-center justify-center h-full' : ''
      }`}
      style={isFullscreen ? { height: '100%', width: '100%' } : undefined}
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }}
      onMouseEnter={() => setShowControls(true)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className={`object-contain ${
          isFullscreen 
            ? 'max-w-full max-h-full w-auto h-auto' 
            : 'w-full h-auto max-h-[600px]'
        }`}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
        playsInline
        preload="metadata"
      />

      {/* Loading Shimmer */}
      {!isLoaded && (
        <div className={`absolute inset-0 flex items-center justify-center ${
          theme === 'dark' ? 'bg-black/50' : 'bg-gray-100/50'
        }`}>
          <div className={`w-16 h-16 rounded-full border-4 ${
            theme === 'dark' ? 'border-gray-700 border-t-white' : 'border-gray-300 border-t-gray-600'
          } animate-spin`} />
        </div>
      )}

      {/* Controls Overlay - LGBTQ+ Rainbow Style (only at bottom) */}

<div
  className="absolute bottom-0 left-0 right-0 h-[60px] pointer-events-none transition-opacity duration-300 backdrop-blur-xl"
  style={{
    opacity: showControls ? (theme === 'dark' ? 0.8 : 0.7) : 0,
    background: `linear-gradient(to top,
      rgba(255, 0, 0, 0.3) 0%,
      rgba(255, 165, 0, 0.25) 10%,
      rgba(255, 255, 0, 0.2) 20%,
      rgba(0, 128, 0, 0.15) 30%,
      rgba(0, 0, 255, 0.1) 40%,
      rgba(75, 0, 130, 0.1) 50%,
      rgba(238, 130, 238, 0.08) 60%,
      transparent 100%
    )`
  }}
/>
      {/* Clickable overlay for play/pause on video */}
      <div
        className="absolute inset-0 pointer-events-none"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            togglePlay();
          }
        }}
      />

      {/* Progress Bar and Controls Container */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto">
        {/* Progress Bar - Professional YouTube Style */}
        <div 
          className="absolute bottom-[48px] left-0 right-0 px-0 pointer-events-auto z-20"
          onMouseDown={(e) => e.stopPropagation()}
          onMouseEnter={() => resetControlsTimeout()}
        >
          <div className="relative h-[4px] group/progress hover:h-[5px] transition-all duration-200 cursor-pointer">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`absolute inset-0 h-full rounded-full overflow-hidden ${
              theme === 'dark' 
                ? 'bg-white/20 group-hover/progress:bg-white/25' 
                : 'bg-black/20 group-hover/progress:bg-black/25'
            } transition-colors`}>
              <motion.div 
                className="absolute left-0 top-0 h-full bg-[#ff0000] rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`
                }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>
            <motion.div 
              className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[#ff0000] opacity-0 group-hover/progress:opacity-100 transition-opacity -translate-x-1/2 shadow-lg ring-2 ring-white/50"
              style={{
                left: `${duration ? (currentTime / duration) * 100 : 0}%`
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          </div>
        </div>

        {/* Control Bar - YouTube Style */}
        <div className="absolute bottom-0 left-0 right-0 px-2 py-1 pointer-events-auto">
          <div className="flex items-center justify-between gap-2">
            {/* Left Controls */}
            <div className="flex items-center gap-0">
              {/* Play/Pause Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className={`p-2 rounded-full transition-all duration-150 flex items-center justify-center ${
                  theme === 'dark' 
                    ? 'text-white hover:bg-white/10' 
                    : 'text-black hover:bg-black/10'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                )}
              </motion.button>

              {/* Previous/Next Buttons - Combined */}
              <div className="flex items-center">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    skip(-10);
                  }}
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ scale: 1.1 }}
                  className={`p-2 rounded transition-all duration-150 ${
                    theme === 'dark' 
                      ? 'text-white hover:bg-white/10' 
                      : 'text-black hover:bg-black/10'
                  }`}
                  title="Rewind 10 seconds"
                >
                  <SkipBack className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    skip(10);
                  }}
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ scale: 1.1 }}
                  className={`p-2 rounded transition-all duration-150 ${
                    theme === 'dark' 
                      ? 'text-white hover:bg-white/10' 
                      : 'text-black hover:bg-black/10'
                  }`}
                  title="Forward 10 seconds"
                >
                  <SkipForward className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Volume Control - YouTube Style */}
              <div className="flex items-center gap-0 group/volume">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  whileTap={{ scale: 0.85 }}
                  whileHover={{ scale: 1.1 }}
                  className={`p-2 rounded transition-all duration-150 ${
                    theme === 'dark' 
                      ? 'text-white hover:bg-white/10' 
                      : 'text-black hover:bg-black/10'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-6 h-6" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                </motion.button>
                <div className="w-0 group-hover/volume:w-20 opacity-0 group-hover/volume:opacity-100 transition-all duration-200 overflow-hidden">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full h-1 rounded-lg appearance-none cursor-pointer slider-volume ${
                      theme === 'dark' ? 'bg-white/30' : 'bg-black/30'
                    }`}
                    style={{
                      background: `linear-gradient(to right, ${
                        theme === 'dark' ? '#fff' : '#000'
                      } 0%, ${
                        theme === 'dark' ? '#fff' : '#000'
                      } ${
                        (isMuted ? 0 : volume) * 100
                      }%, ${
                        theme === 'dark' 
                          ? 'rgba(255, 255, 255, 0.3)' 
                          : 'rgba(0, 0, 0, 0.3)'
                      } ${
                        (isMuted ? 0 : volume) * 100
                      }%, ${
                        theme === 'dark' 
                          ? 'rgba(255, 255, 255, 0.3)' 
                          : 'rgba(0, 0, 0, 0.3)'
                      } 100%)`,
                    }}
                  />
                </div>
              </div>

              {/* Time Display - YouTube Style */}
              <div className="flex items-center gap-1 px-2">
                <span className={`text-xs font-medium tabular-nums ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}>
                  {formatTime(currentTime)}
                </span>
                <span className={`text-xs ${
                  theme === 'dark' ? 'text-white/70' : 'text-black/70'
                }`}>/</span>
                <span className={`text-xs tabular-nums ${
                  theme === 'dark' ? 'text-white/70' : 'text-black/70'
                }`}>
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-0">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                whileTap={{ scale: 0.85 }}
                whileHover={{ scale: 1.1 }}
                className={`p-2 rounded transition-all duration-150 ${
                  theme === 'dark' 
                    ? 'text-white hover:bg-white/10' 
                    : 'text-black hover:bg-black/10'
                }`}
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize className="w-6 h-6" />
                ) : (
                  <Maximize className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Slider Styles - Theme Aware */}
      <style>{`
        .slider-volume::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${theme === 'dark' ? '#fff' : '#000'};
          cursor: pointer;
          transition: all 0.15s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .slider-volume::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        }
        .slider-volume::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${theme === 'dark' ? '#fff' : '#000'};
          cursor: pointer;
          border: none;
          transition: all 0.15s;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .slider-volume::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;


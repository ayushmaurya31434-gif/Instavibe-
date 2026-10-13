import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Camera,
  Film,
  Sparkles,
  MapPin,
  Music,
  Check,
  Image as ImageIcon,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CreateModal: React.FC = () => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    createModalInitialType,
    createPost,
    createStory,
    createReel,
  } = useApp();

  const [contentType, setContentType] = useState<'post' | 'story' | 'reel'>(
    createModalInitialType
  );
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [audioTitle, setAudioTitle] = useState('Trending Sound · Original Audio');
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoStreamRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setContentType(createModalInitialType);
  }, [createModalInitialType]);

  // Cleanup camera stream on unmount or close
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleClose = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsUsingCamera(false);
    setMediaPreview(null);
    setCaption('');
    setLocation('');
    setIsCreateModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isVideo = file.type.startsWith('video');
      setMediaType(isVideo ? 'video' : 'image');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaPreview(event.target.result as string);
          setIsUsingCamera(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Live Camera Snap
  const startCamera = async () => {
    setCameraError(null);
    setIsUsingCamera(true);
    setMediaPreview(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoStreamRef.current) {
        videoStreamRef.current.srcObject = stream;
        videoStreamRef.current.play();
      }
    } catch (err) {
      console.error(err);
      setCameraError('Camera access unavailable. Please upload a photo or choose a preset.');
      setIsUsingCamera(false);
    }
  };

  const takeCameraSnapshot = () => {
    if (videoStreamRef.current) {
      const video = videoStreamRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 640;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setMediaPreview(dataUrl);
        setMediaType('image');

        // Stop camera stream
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        }
        setIsUsingCamera(false);
      }
    }
  };

  // Aesthetic Preset Templates
  const presets = [
    {
      name: 'Sunset Coast',
      type: 'image' as const,
      url: '/src/assets/images/feed_travel_sunset_1791873734304.jpg',
    },
    {
      name: 'Cafe Morning',
      type: 'image' as const,
      url: '/src/assets/images/feed_coffee_flatlay_1791873734112.jpg',
    },
    {
      name: 'Mountain Hike',
      type: 'image' as const,
      url: '/src/assets/images/story_mountain_hike_1791873734452.jpg',
    },
    {
      name: 'Rooftop Beat',
      type: 'video' as const,
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
  ];

  const handleSelectPreset = (preset: (typeof presets)[0]) => {
    setMediaPreview(preset.url);
    setMediaType(preset.type);
    setIsUsingCamera(false);
  };

  const filters = [
    { id: 'none', label: 'Normal', filterStyle: '' },
    { id: 'warm', label: 'Clarendon', filterStyle: 'sepia(0.2) contrast(1.15) brightness(1.05)' },
    { id: 'juno', label: 'Juno', filterStyle: 'contrast(1.2) saturate(1.3)' },
    { id: 'ludwig', label: 'Ludwig', filterStyle: 'brightness(1.05) contrast(1.05) hue-rotate(-10deg)' },
    { id: 'noir', label: 'Noir', filterStyle: 'grayscale(1) contrast(1.25)' },
  ];

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaPreview) return;

    if (contentType === 'post') {
      createPost({
        mediaUrl: mediaPreview,
        mediaType,
        caption: caption || 'Living the dream ✨ #instavibe',
        location: location || 'Mumbai, India',
        filter: selectedFilter,
      });
    } else if (contentType === 'story') {
      createStory({
        mediaUrl: mediaPreview,
        mediaType,
        caption: caption || undefined,
      });
    } else if (contentType === 'reel') {
      createReel({
        videoUrl: mediaPreview,
        caption: caption || 'New reel alert 🔥 #viral #reels',
        audioTitle: audioTitle || 'Original Audio',
        thumbnailUrl: mediaType === 'image' ? mediaPreview : undefined,
      });
    }

    handleClose();
  };

  if (!isCreateModalOpen) return null;

  const currentFilterStyle =
    filters.find((f) => f.id === selectedFilter)?.filterStyle || '';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col text-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-500" />
            <h3 className="font-bold text-sm">Create New {contentType.toUpperCase()}</h3>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Type Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/50">
          {(['post', 'story', 'reel'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setContentType(type)}
              className={`flex-1 py-2.5 text-xs font-bold tracking-wide capitalize transition-colors border-b-2 ${
                contentType === type
                  ? 'border-pink-500 text-pink-400 bg-zinc-900'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              {type === 'post' && 'Feed Post'}
              {type === 'story' && 'Your Story 📸'}
              {type === 'reel' && 'Reels Video 🎬'}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col md:flex-row gap-4 no-scrollbar">
          {/* Media Selection / Preview Side */}
          <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900/60 rounded-xl border border-zinc-800/80 p-3 min-h-[260px] md:min-h-[340px] relative overflow-hidden">
            {mediaPreview ? (
              <div className="relative w-full h-full max-h-[320px] flex items-center justify-center">
                {mediaType === 'video' ? (
                  <video
                    src={mediaPreview}
                    controls
                    className="max-h-[300px] w-auto rounded-lg object-contain"
                  />
                ) : (
                  <img
                    src={mediaPreview}
                    alt="Preview"
                    style={{ filter: currentFilterStyle }}
                    className="max-h-[300px] w-auto rounded-lg object-contain transition-all"
                    referrerPolicy="no-referrer"
                  />
                )}
                <button
                  onClick={() => setMediaPreview(null)}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-full transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            ) : isUsingCamera ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <video
                  ref={videoStreamRef}
                  autoPlay
                  playsInline
                  className="max-h-[280px] rounded-lg"
                />
                <button
                  onClick={takeCameraSnapshot}
                  className="mt-3 px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded-full text-xs font-bold text-white flex items-center gap-2 shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                  <span>Snap Photo</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-14 h-14 rounded-full bg-zinc-800/80 flex items-center justify-center mb-3 text-pink-500">
                  <Upload className="w-7 h-7" />
                </div>
                <p className="text-xs font-semibold text-white mb-1">
                  Upload photo or video from device
                </p>
                <p className="text-[11px] text-zinc-400 max-w-[200px] mb-4">
                  Drag and drop, browse files, or snap live with webcam
                </p>

                <div className="flex flex-wrap gap-2 justify-center mb-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,video/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-1.5 bg-pink-600 hover:bg-pink-500 rounded-lg text-xs font-semibold text-white transition-colors"
                  >
                    Select from Computer / Phone
                  </button>

                  <button
                    onClick={startCamera}
                    className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Webcam</span>
                  </button>
                </div>

                {cameraError && (
                  <p className="text-[11px] text-rose-400 mt-1">{cameraError}</p>
                )}

                {/* Or Pick Aesthetic Presets */}
                <div className="mt-3 pt-3 border-t border-zinc-800 w-full">
                  <span className="text-[10px] text-zinc-400 block mb-2 font-medium">
                    Or pick from ready high-res photos:
                  </span>
                  <div className="flex gap-2 justify-center">
                    {presets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handleSelectPreset(preset)}
                        className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded-md text-zinc-300 hover:text-white transition-colors"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Controls Side */}
          <div className="w-full md:w-72 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Filter Selection for Photos */}
              {mediaType === 'image' && mediaPreview && (
                <div>
                  <label className="text-[11px] text-zinc-400 font-medium block mb-1.5">
                    Photo Filters
                  </label>
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                    {filters.map((filter) => (
                      <button
                        key={filter.id}
                        type="button"
                        onClick={() => setSelectedFilter(filter.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap transition-colors ${
                          selectedFilter === filter.id
                            ? 'bg-pink-600 text-white'
                            : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="text-[11px] text-zinc-400 font-medium block mb-1">
                  Caption & Hashtags
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption, tag friends, add #hashtags..."
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 resize-none"
                />
              </div>

              {/* Location Tag */}
              {contentType === 'post' && (
                <div>
                  <label className="text-[11px] text-zinc-400 font-medium block mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-pink-400" />
                    <span>Location</span>
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bandra, Mumbai or Goa Beach"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700"
                  />
                </div>
              )}

              {/* Audio Title for Reels */}
              {contentType === 'reel' && (
                <div>
                  <label className="text-[11px] text-zinc-400 font-medium block mb-1 flex items-center gap-1">
                    <Music className="w-3 h-3 text-pink-400" />
                    <span>Audio Track</span>
                  </label>
                  <input
                    type="text"
                    value={audioTitle}
                    onChange={(e) => setAudioTitle(e.target.value)}
                    placeholder="Song title or Original Audio"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700"
                  />
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-zinc-900 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={!mediaPreview}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
                  mediaPreview
                    ? 'bg-pink-600 hover:bg-pink-500 active:scale-95'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                Share {contentType === 'post' ? 'Post' : contentType === 'story' ? 'Story' : 'Reel'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

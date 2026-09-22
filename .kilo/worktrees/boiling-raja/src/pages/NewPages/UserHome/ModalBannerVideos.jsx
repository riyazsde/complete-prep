import { useEffect, useState, useCallback, useRef } from 'react';
import images from '../../../utils/images';
import { userApi } from '../../../services/apiFunctions';
import { Icon } from '@iconify/react';

const getPrimarySrc = (v) =>
  v?.videoLink || v?.video || v?.url || v?.videoUrl || v?.link || v?.file || v?.image || '';

const isVideoExtension = (src = '') =>
  /\.(mp4|webm|ogg|mov|m3u8|mpd)(\?.*)?$/i.test(String(src));

const isYouTube = (src = '') =>
  /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)/i.test(src);

const getYouTubeEmbed = (src = '') => {
  try {
    const u = String(src);
    const idMatch = u.match(/(?:v=|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    const id = idMatch?.[1] || '';
    return id ? `https://www.youtube.com/embed/${id}` : '';
  } catch {
    return '';
  }
};

const isVimeo = (src = '') => /vimeo\.com\/\d+/i.test(String(src));

const getVimeoEmbed = (src = '') => {
  try {
    const match = String(src).match(/vimeo\.com\/(\d+)/);
    const id = match?.[1] || '';
    return id ? `https://player.vimeo.com/video/${id}` : '';
  } catch {
    return '';
  }
};

const ModalBannerVideos = ({ open = false, onClose = () => {}, onWatched = () => {} }) => {
  const [videos, setVideos] = useState([]);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const sliderRef = useRef(null);

  const fetchVideos = useCallback(async () => {
    setIsLoading(true);
    userApi.staticContent.banner.getAll({
      params: { type: 'video' },
      onSuccess: (res) => {
        setVideos(res?.data || []);
        setIsLoading(false);
      },
      onError: () => setIsLoading(false),
    });
  }, []);

  useEffect(() => {
    if (open) {
      fetchVideos();
      setIndex(0);
    }
  }, [open, fetchVideos]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!open) return;
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, videos]);

  const prev = () => {
    setIndex((s) => (s - 1 + videos.length) % Math.max(1, videos.length));
  };

  const next = () => {
    setIndex((s) => (s + 1) % Math.max(1, videos.length));
  };

  if (!open) return null;

  const active = videos[index] || {};
  const activeSrc = getPrimarySrc(active);
  const activeIsYouTube = isYouTube(activeSrc);
  const activeIsVimeo = isVimeo(activeSrc);
  const activeIsVideoFile =
    isVideoExtension(activeSrc) ||
    activeIsYouTube ||
    activeIsVimeo ||
    String(active?.type || '').toLowerCase().includes('video');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6" role="dialog">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-60 w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <img src={images.navBarLogo2} alt="logo" className="w-10 h-10 object-contain" />
            <h3 className="text-lg font-semibold">Tutorials</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <Icon icon="mdi:close" width="18" height="18" />
          </button>
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="py-8 text-center text-sm text-gray-600">Loading media...</div>
          ) : !videos.length ? (
            <div className="py-8 text-center text-sm text-gray-600">No media available.</div>
          ) : (
            <>
              <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
                {activeIsYouTube ? (
                  <iframe
                    title="youtube-player"
                    src={getYouTubeEmbed(activeSrc)}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : activeIsVimeo ? (
                  <iframe
                    title="vimeo-player"
                    src={getVimeoEmbed(activeSrc)}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : activeIsVideoFile ? (
                  <video
                    key={activeSrc}
                    src={activeSrc}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img src={activeSrc} alt="media" className="w-full h-full object-cover" />
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={prev}
                  className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-[#3dd455]"
                >
                  Prev
                </button>

                <button
                  onClick={next}
                  className="px-4 py-2 text-sm font-medium border rounded-md hover:bg-[#3dd455]"
                >
                  Next
                </button>
              </div>

              <div className="mt-4 overflow-x-auto" ref={sliderRef}>
                <div className="flex gap-3">
                  {videos?.map((v, i) => {
                    const thumb =
                      v?.thumbnail || v?.image || v?.poster || getPrimarySrc(v);
                    const title = v?.title || v?.name || 'Media';

                    return (
                      <button
                        key={v?._id || i}
                        onClick={() => setIndex(i)}
                        className={`w-28 flex-shrink-0 rounded-md overflow-hidden border ${
                          i === index
                            ? 'border-blue-500 ring-2 ring-blue-100'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="aspect-video bg-gray-100">
                          <img src={thumb} alt={title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-2 text-xs truncate">{title}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalBannerVideos;

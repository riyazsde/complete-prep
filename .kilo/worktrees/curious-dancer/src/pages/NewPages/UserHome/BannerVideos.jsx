import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { userApi } from "../../../services/apiFunctions";
import { AuthContext } from "../../../Context/AuthContext";
import images from "../../../utils/images";

const BannerVideos = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(AuthContext);

  const getVideoSrc = (v) =>
    v?.videoLink || v?.video || v?.url || v?.videoUrl || v?.link || "";

  const fetchVideos = async () => {
    setIsLoading(true);
    await userApi.staticContent.banner.getAll({
      params: { type: "video" },
      onSuccess: (res) => {
        setVideos(res?.data || []);
        setIsLoading(false);
      },
      onError: () => {
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div>
      <div className="bg-green-900 text-white px-6 py-1 relative">
        <div className="flex items-center space-x-1 z-10" onClick={()=>navigate('/user/home')}>
          <img src={images.navBarLogo2} alt="Logo" className="max-w-[250px] max-h-[90px]" />
        </div>
      </div>

      <div className="bg-white px-4 py-8">
        <div className="w-full max-w-8xl">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-black text-left">Tutorial Videos</h1>

          {selectedVideo && (
            <div className="mb-6 rounded-xl overflow-hidden border">
              <div className="p-3 flex items-center justify-between">
                <p className="font-semibold text-black">{selectedVideo?.title || selectedVideo?.name || "Now Playing"}</p>
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="text-sm px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
              <video
                key={getVideoSrc(selectedVideo)}
                src={getVideoSrc(selectedVideo)}
                controls
                autoPlay
                className="w-full aspect-video bg-black"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6 rounded-xl">
            {videos?.map((v) => {
              const thumb = v?.thumbnail || v?.image || v?.poster || images.userDashboardTopBanner;
              const title = v?.title || v?.name || "Tutorial";
              const desc = v?.description ? String(v.description).slice(0, 100) : "";
              return (
                <button
                  key={v?._id}
                  onClick={() => setSelectedVideo(v)}
                  className="text-left rounded-lg overflow-hidden bg-white border border-gray-200 hover:shadow transition"
                >
                  <div className="w-full aspect-video bg-gray-100">
                    <img src={thumb} alt={title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3 space-y-1">
                    <div className="font-medium text-black truncate">{title}</div>
                    <div className="text-sm text-gray-500 line-clamp-2">{desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {isLoading && <div className="text-center mt-4 text-sm text-gray-600">Loading videos...</div>}
        </div>
      </div>
    </div>
  );
};

export default BannerVideos;

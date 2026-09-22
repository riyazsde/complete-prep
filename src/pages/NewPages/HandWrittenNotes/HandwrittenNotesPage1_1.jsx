import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserMenuBar } from "../../../components/common/MenuBar";
import HOC from "../../../components/layout/HOC";
import { userApi } from "../../../services/apiFunctions";
import images from "../../../utils/images";

const HandwrittenNotesPage1 = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [bundles, setBundles] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Navigate to subjects / notes
  const handleBundleClick = (bundleId) => {
    if (!bundleId) {
      console.error("Bundle ID is missing");
      return;
    }

    navigate(`/user/notes/${bundleId}/subjects`);
  };

  // Fetch handwritten notes
  useEffect(() => {
    const fetchNotesData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await userApi.handWrittenNotes.getAll();

        console.log("FULL HANDWRITTEN NOTES RESPONSE:", response);

        if (Array.isArray(response?.data)) {
          setBundles(response.data);
        } else {
          setBundles([]);
        }
      } catch (error) {
        console.error("Error fetching handwritten notes:", error);

        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch handwritten notes."
        );

        setBundles([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotesData();
  }, []);

  // =========================
  // LOADING
  // =========================
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />

          <p className="mt-3 text-sm font-medium text-gray-500">
            Loading notes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* =========================
          MENU
      ========================= */}
      <div className="user_container_width">
        <UserMenuBar />
      </div>

      {/* =========================
          MAIN CONTAINER
      ========================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* =========================
            ERROR
        ========================= */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">{error}</p>
          </div>
        )}

        {/* =========================
            PAGE HEADER
        ========================= */}
        <div className="mb-7">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <div>
              <p className="text-xs sm:text-sm font-semibold text-indigo-600 mb-1">
                Study Materials
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Handwritten Notes
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Explore handwritten notes for your exam preparation.
              </p>
            </div>

            {/* Bundle Count */}
            <div className="self-start  rounded px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-500">
                {bundles.length}{" "}
                {bundles.length === 1 ? "Bundle" : "Bundles"}
              </span>
            </div>
          </div>
        </div>

        {/* =========================
            NOTES GRID
        ========================= */}
        {bundles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {bundles.map((bundle) => {
              const noteImage =
                bundle?.image ||
                bundle?.goalCategory?.imageUrl ||
                images.newHandwrittenNotesImage1;

              return (
                <div
                  key={bundle?._id}
                  className="
                    group
                    bg-white
                    rounded-2xl
                    border
                    border-gray-200
                    overflow-hidden
                    shadow-sm
                    hover:shadow-xl
                    hover:-translate-y-1
                    transition-all
                    duration-300
                    flex
                    flex-col
                  "
                >
                  {/* =========================
                      IMAGE
                  ========================= */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={noteImage}
                      alt={bundle?.bundleName || "Handwritten Notes"}
                      className="
                        w-full
                        h-full
                        object-cover
                        group-hover:scale-105
                        transition-transform
                        duration-500
                      "
                      onError={(event) => {
                        event.currentTarget.src =
                          images.newHandwrittenNotesImage1;
                      }}
                    />

                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                    {/* =========================
                        CATEGORY
                    ========================= */}
                    {bundle?.goalCategory?.name && (
                      <span
                        className="
                          absolute
                          top-3
                          left-3
                          bg-white/95
                          backdrop-blur-sm
                          text-indigo-600
                          text-xs
                          font-semibold
                          px-3
                          py-1.5
                          rounded-full
                          shadow-sm
                        "
                      >
                        {bundle.goalCategory.name}
                      </span>
                    )}

                    {/* =========================
                        PRICE
                    ========================= */}
                    <div className="absolute bottom-3 right-3">
                      <span
                        className="
                          inline-flex
                          items-center
                          bg-white
                          text-gray-900
                          text-sm
                          font-bold
                          px-3
                          py-1.5
                          rounded-lg
                          shadow-md
                        "
                      >
                        ₹{bundle?.price ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* =========================
                      CARD CONTENT
                  ========================= */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Bundle Name */}
                    <h2
                      className="
                        text-base
                        font-bold
                        text-gray-900
                        line-clamp-1
                      "
                      title={bundle?.bundleName}
                    >
                      {bundle?.bundleName || "Handwritten Notes"}
                    </h2>

                    {/* Topper */}
                    {bundle?.topperName && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        By{" "}
                        <span className="font-medium text-gray-700">
                          {bundle.topperName}
                        </span>
                      </p>
                    )}

                    {/* =========================
                        VIEW BUTTON
                    ========================= */}
                    <button
                      type="button"
                      onClick={() => handleBundleClick(bundle?._id)}
                      className="
                        w-full
                        mt-4
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-indigo-600
                        hover:bg-indigo-700
                        active:bg-indigo-800
                        text-white
                        text-sm
                        font-semibold
                        py-2.5
                        px-4
                        rounded-xl
                        transition-colors
                        duration-200
                      "
                    >
                      <span>View Notes</span>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* =========================
              EMPTY STATE
          ========================= */
          <div className="bg-white border border-gray-200 rounded-2xl py-16 px-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-50 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-bold text-gray-800">
              No handwritten notes available
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Notes will appear here when they are available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HOC(HandwrittenNotesPage1);

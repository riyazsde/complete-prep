import { Icon } from '@iconify/react';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReusableModal } from '../../../components/common/ComPrepComponent/ComPrepComponent';
import HOC from '../../../components/layout/HOC';
import { AuthContext } from '../../../Context/AuthContext';
import { userApi } from '../../../services/apiFunctions';

const CommunityPage1 = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { goal = '' } = user || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedComments, setExpandedComments] = useState({});
  const [pinnedPostId, setPinnedPostId] = useState(null);
  const [commentInput, setCommentInput] = useState({});
  const [commentingPostId, setCommentingPostId] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '',
    description: '',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate('/login');
    } else if (goal) {
      fetchPosts();
    }
  }, [isAuthenticated, goal]);

  const fetchPosts = () => {
    userApi.community.getAll({
      setIsLoading,
      onSuccess: res => setPosts(res?.data || []),
      onError: err => console.error('Failed to fetch posts:', err),
    });
  };

  const toggleComments = postId => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleLike = postId => {
    userApi.community.likePost({
      id: postId,
      onSuccess: fetchPosts,
      onError: err => console.error('Failed to like post:', err),
    });
  };

  const pinPost = postId => {
    userApi.community.pinPost({
      id: postId,
      onSuccess: () => {
        setPinnedPostId(postId);
        fetchPosts();
      },
      onError: err => console.error('Failed to pin post:', err),
    });
  };

  const handleCommentChange = (postId, value) => {
    setCommentInput({ ...commentInput, [postId]: value });
  };

  const submitComment = postId => {
    if (!commentInput[postId]) return;

    userApi.community.addComment({
      id: postId,
      comment: commentInput[postId],
      onSuccess: () => {
        setCommentInput(prev => ({ ...prev, [postId]: '' }));
        fetchPosts();
      },
      onError: err => console.error('Failed to add comment:', err),
    });
  };

  const handleInputChange = e => {
    const { id, value } = e.target;
    setNewPost(prev => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      setNewPost(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreatePost = () => {
    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('desc', newPost.description);
    formData.append('goal', user.goal);
    formData.append('goalCategory', user.goalCategory);
    if (newPost.image) formData.append('image', newPost.image);

    userApi.community.createPost({
      data: formData,
      onSuccess: () => {
        setNewPost({ title: '', description: '', image: null });
        setImagePreview(null);
        setIsModalOpen(false);
        fetchPosts();
      },
      onError: err => console.error('Failed to create post:', err),
    });
  };

  const pinnedPost = pinnedPostId ? posts.find(post => post._id === pinnedPostId) : null;

  const otherPosts = pinnedPostId ? posts.filter(post => post._id !== pinnedPostId) : posts;

  const PostCard = ({ post, isPinned = false }) => (
    <div className={`p-3 space-y-3 mt-2 ${isPinned ? '' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          {post.createdBy?.image && (
            <img
              src={post.createdBy?.image}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover"
            />
          )}
          <div>
            <p className="text-sm font-semibold text-black">
              {post.createdBy?.fullName || 'Anonymous'}
              {'   '}
              <span className="text-xs text-gray-400">
                {' '}
                {new Date(post.createdAt).toLocaleTimeString()}
              </span>
            </p>
            <div className="text-black">
              {/* {post.title && (
                <h2 className="text-base font-medium">{post.title}</h2>
              )} */}
              <p className="text-sm text-gray-700">{post.desc}</p>
            </div>
          </div>
        </div>
        {/* <Icon icon="mdi:dots-horizontal" className="text-xl text-gray-500" /> */}
      </div>

      {post?.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full max-h-[200px] object-contain rounded-lg border"
        />
      )}

      <div className="flex items-center justify-between text-gray-600 text-sm pt-2">
        <div className="flex gap-6">
          <button className="flex items-center gap-1" onClick={() => handleLike(post._id)}>
            <Icon
              icon="mdi:heart"
              className={`text-lg ${post.isLike ? 'text-red-500' : 'text-gray-600'}`}
            />
            {post.likes.length}
          </button>
          {/* <button
            className="flex items-center gap-1"
            onClick={() => {
              toggleComments(post._id);
              setCommentingPostId(post._id);
            }}
          >
            <Icon icon="mdi:comment-outline" className="text-lg" />
            {post.comments.length}
          </button> */}
        </div>

        {/* <div className="flex gap-6">
          <Icon
            icon="material-symbols:bookmark-outline"
            className={`text-lg cursor-pointer ${
              post.isSaved ? "text-red-500" : "text-gray-600"
            }`}
            onClick={() => pinPost(post._id)}
          />
          <Icon icon="mdi:share-outline" className="text-lg cursor-pointer" />
        </div> */}
      </div>

      {expandedComments[post._id] && (
        <div className="space-y-2 mt-4">
          <input
            type="text"
            value={commentInput[post._id] || ''}
            onChange={e => handleCommentChange(post._id, e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-2 border rounded"
          />
          <button
            className="bg-yellow-300 hover:bg-yellow-400 text-black font-semibold py-1 px-4 rounded"
            onClick={() => submitComment(post._id)}
          >
            Submit
          </button>
          {post.comments.map((comment, idx) => (
            <div key={idx} className="bg-gray-100 p-2 rounded">
              <p className="font-semibold">{comment.user.fullName}</p>
              <p>{comment.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {/* <div className="user_container_width">
        <UserMenuBar />
      </div> */}
      <div className="bg-[#efefef] rounded-xl">
        {/* <p className="sm:p-2 lg:p-4">
          <img
            src={images.newCommunityBannerImage}
            alt="Community Banner"
            className="w-full rounded-xl object-cover"
          />
        </p> */}

        <div className="space-y-4 sm:p-2 lg:p-2">
          {isLoading ? (
            <div className="text-center py-10 text-gray-600">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-10 text-gray-600">No posts available.</div>
          ) : (
            <>
              {pinnedPost && <PostCard post={pinnedPost} isPinned />}
              {otherPosts.map(post => (
                <PostCard post={post} key={post._id} />
              ))}
            </>
          )}
        </div>

        <ReusableModal
          show={isModalOpen}
          size="lg"
          onHide={() => {
            setIsModalOpen(false);
            setImagePreview(null);
          }}
          title="Create Post"
          body={
            <div className="space-y-6 p-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-800">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  placeholder="Enter post title..."
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-lime-500 focus:ring-2 focus:ring-lime-300 outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-800">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newPost.description}
                  onChange={handleInputChange}
                  placeholder="Write your post description..."
                  rows={4}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-800 focus:border-lime-500 focus:ring-2 focus:ring-lime-300 outline-none resize-none transition"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-800 mb-1">Upload Image</label>

                <input
                  type="file"
                  id="fileUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {imagePreview ? (
                  <div
                    className="mt-2 cursor-pointer"
                    onClick={() => document.getElementById('fileUpload').click()}
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-auto rounded-lg max-h-[200px] object-contain border border-gray-300"
                    />
                    <p className="text-xs text-center text-gray-500 mt-2">
                      Click on image to change
                    </p>
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-lime-400 transition"
                    onClick={() => document.getElementById('fileUpload').click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      e.preventDefault();
                      const files = e.dataTransfer.files;
                      if (files.length) {
                        handleImageUpload({ target: { files } });
                      }
                    }}
                  >
                    <p className="text-gray-500">
                      <strong>Click to upload</strong> or drag and drop an image here
                    </p>
                    <p className="text-sm text-gray-400 mt-1">PNG, JPG, JPEG — max 5MB</p>
                  </div>
                )}
              </div>

              <button
                onClick={handleCreatePost}
                className="w-full bg-yellow-300 hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded"
              >
                Create Post
              </button>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default HOC(CommunityPage1);

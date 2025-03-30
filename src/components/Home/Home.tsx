import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import defaultUser from "/user-solid.svg";
import user from "/user-solid (1).svg";
import Modal from "../Modal/Modal";
import { Heart, MessageCircle, MoreHorizontal, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { usePostRequest } from "../Request/UsePostRequest";

interface Post {
  id: number;
  image?: string;
  username: string;
  user_image?: string;
  text: string;
  has_liked: boolean;
  has_followed: boolean;
  likes: number;
  comments: number;
}

function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const { postData } = usePostRequest(
    "https://social-backend-kzy5.onrender.com/comments"
  );

  const fetchPosts = async (loadMore = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Authentication required");

      const response = await axios.get(
        `https://social-backend-kzy5.onrender.com/posts?page=${page}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (loadMore) {
        setPosts((prev) => [...prev, ...response.data]);
        setPage((prev) => prev + 1);
      } else {
        setPosts(response.data);
        setPage(2);
        if (response.data.length > 0) {
          setSelectedPostId(response.data[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts");
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = async (): Promise<void> => {
    if (!selectedPostId) {
      toast.error("Iltimos, postni tanlang!");
      return;
    }
    const token = localStorage.getItem("access_token");
    try {
      await postData({
        body: {
          content: content,
          post_id: selectedPostId,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      toast.success("Komment muvaffaqiyatli qo‘shildi!");
      setContent("");
      const res = await axios.get(
        `https://social-backend-kzy5.onrender.com/comments/${selectedPostId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments(res.data);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      toast.error("Komment yuborilmadi!");
    }
  };
  const token = localStorage.getItem("access_token");
  useEffect(() => {
    if (isOpen && selectedPostId) {
      axios
        .get(
          `https://social-backend-kzy5.onrender.com/comments/${selectedPostId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => setComments(res.data))
        .catch((err) => console.error("Kommentlarni olishda xatolik:", err));
    }
  }, [isOpen, selectedPostId]);
  const handleLike = async (postId: number) => {
    try {
      const token = localStorage.getItem("access_token");

      await axios.post(
        `https://social-backend-kzy5.onrender.com/posts/like`,
        { post_id: postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                has_liked: !post.has_liked,
                likes: post.has_liked ? post.likes - 1 : post.likes + 1,
              }
            : post
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
      toast.error("Failed to like post");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="max-w-2xl mx-auto pb-20 bg-gray-50 min-h-screen rounded-2xl">
      <div className="space-y-6 p-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={post.user_image || user}
                    alt={post.username}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = defaultUser;
                    }}
                  />
                  {post.has_followed && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <span className="font-semibold">{post.username}</span>
              </div>
              <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
                <MoreHorizontal size={20} />
              </button>
            </div>
            {post.image ? (
              <div className="w-full flex justify-center bg-gray-100">
                <img
                  src={post.image}
                  alt="Post content"
                  className="max-w-full h-[300px] max-h-[600px] object-contain rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
            <div className="p-4">
              <div className="flex justify-between mb-3">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`p-1 rounded-full ${
                      post.has_liked
                        ? "text-red-500 hover:bg-red-50"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Heart
                      size={24}
                      fill={post.has_liked ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    className="p-1 rounded-full text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(true)}
                  >
                    <MessageCircle size={24} />
                  </button>
                </div>
              </div>
              <div className="font-semibold mb-1">{post.likes} likes</div>
              <div className="mb-2">
                <span className="font-semibold mr-2">{post.username}</span>
                <span>{post.text}</span>
              </div>
              {post.comments > 0 && (
                <button className="text-gray-500 text-sm hover:text-gray-700">
                  View all {post.comments} comments
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {posts.length > 0 && !isLoading && (
        <div className="flex justify-center p-4">
          <Button
            onClick={() => fetchPosts(true)}
            variant="outline"
            className="border-gray-300"
          >
            Load More
          </Button>
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      )}
      {!isLoading && posts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-700">
            No posts available
          </h3>
          <p className="text-gray-500 mt-2">
            {error
              ? "Failed to load posts"
              : "Follow people to see their posts"}
          </p>
          <Button onClick={() => fetchPosts()} className="mt-4">
            {error ? "Retry" : "Refresh"}
          </Button>
        </div>
      )}
      <Modal open={isOpen} setOpen={setIsOpen}>
        <div className="h-[70vh] max-h-[600px] min-h-[400px] flex flex-col bg-white rounded-lg overflow-hidden">
          <div className="bg-indigo-600 text-white p-4">
            <h2 className="text-2xl font-bold text-center">Kommentlar</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={comment.user_img || user}
                      alt={comment.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">
                          {comment.username}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="mt-1 text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="mt-2 text-lg">Kommentlar yo'q</p>
                <p className="text-sm">
                  Birinchilardan bo'lib fikringizni bildiring
                </p>
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Fikringizni yozing..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <button
                onClick={handleComment}
                disabled={!content.trim()}
                className={`p-2 rounded-full ${
                  content.trim()
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } transition-colors`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Home;

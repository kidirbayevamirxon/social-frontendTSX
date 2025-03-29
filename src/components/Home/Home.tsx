import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import defaultUser from "/user-solid.svg";
import user from "/user-solid (1).svg";
import {
  Heart,
  MessageCircle,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";

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
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts");
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: number) => {
    
    try {
      const token = localStorage.getItem("access_token");

      await axios.post(
        `https://social-backend-kzy5.onrender.com/posts/like`,
        { post_id: postId },
        { headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          } 
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
                  <button className="p-1 rounded-full text-gray-700 hover:bg-gray-100">
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
    </div>
  );
}

export default Home;

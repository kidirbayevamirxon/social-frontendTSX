import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import axios from "axios";
import { Loader2, ImagePlus } from "lucide-react";
import { toast } from "react-hot-toast";

function Post() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select an image first");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("caption", caption);
    try {
      const imageResponse = await axios.post(
        "https://social-backend-kzy5.onrender.com/image/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      await axios.post(
        "https://social-backend-kzy5.onrender.com/posts/upload",
        {
          text: caption,
          image_id: imageResponse.data.image_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Post created successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Create New Post
        </h1>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2 text-lg">
              What's on your mind?
            </label>
            <Input
              className="w-full h-16 text-lg bg-gray-700 border-gray-600 text-white"
              placeholder="Share your thoughts..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 text-lg">
              Add an image
            </label>
            <Label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-xl p-8 cursor-pointer hover:bg-gray-700 transition">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 rounded-lg object-contain mb-4"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <ImagePlus className="w-12 h-12 text-gray-400 mb-2" />
                  <span className="text-gray-400">Click to upload image</span>
                </div>
              )}
              <Input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Label>
          </div>
          <Button
            className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={loading || !selectedFile}
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
            ) : null}
            {loading ? "Posting..." : "Create Post"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Post;
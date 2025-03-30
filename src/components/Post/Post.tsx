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
      navigate("/dashboard/home");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-200">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          Create New Post
        </h1>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-lg">
              What's on your mind?
            </label>
            <Input
              className="w-full text-lg bg-white border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              placeholder="Share your thoughts..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-lg">
              Add an image
            </label>
            <Label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:bg-gray-50 transition">
              {preview ? (
                <div className="relative w-full">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full max-h-96 rounded-lg object-contain mb-4"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center p-4">
                  <div className="p-4 bg-indigo-50 rounded-full mb-4">
                    <ImagePlus className="w-8 h-8 text-indigo-600" />
                  </div>
                  <span className="text-gray-600 font-medium">
                    Click to upload image
                  </span>
                  <span className="text-gray-400 text-sm mt-1">
                    JPG, PNG up to 5MB
                  </span>
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
            type="submit"
            className="w-full py-3 text-lg bg-indigo-600 hover:bg-indigo-700"
            disabled={loading || !selectedFile}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Posting...
              </>
            ) : (
              "Create Post"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Post;

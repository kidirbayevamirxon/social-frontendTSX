import { Button } from "../ui/button";
import leftStrelka from "/arrow-left-solid.svg";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { usePostRequest } from "../Request/UsePostRequest";

interface PostRequestOptions {
  body: {
    text: string;
    image_id: number;
  };
}

function Post() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const [img_Id, setImg_Id] = useState<number>();
  const {
    data,
    loading: loader,
    error,
    postData,
  } = usePostRequest("https://social-backend-kzy5.onrender.com/posts/upload");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      console.error("Fayl tanlanmagan!");
      return;
    }
    setMessage(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("caption", caption);

    try {
      const response = await axios.post(
        "https://social-backend-kzy5.onrender.com/image/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data.img_id) {
        const newImgId = response.data.img_id;
        setImg_Id(newImgId);

        postData({
          body: {
            text: caption,
            image_id: newImgId,
          },
        } as PostRequestOptions);
        setMessage("Post muvaffaqiyatli yuklandi! ✅");
        navigate("/dashboard");
      }
      if (response.data) {
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }
    } catch (error) {
      setMessage("Xatolik yuz berdi, iltimos qayta urinib ko‘ring ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black w-full h-screen overflow-hidden">
      <Button
        className="w-[80px] h-18 ml-[10%] mt-14"
        onClick={() => navigate("/dashboard")}
      >
        <img src={leftStrelka} alt="Back" className="w-xl h-15" />
      </Button>
      <div className="flex flex-col items-center">
        <div className="w-[40%] h-auto mt-20 rounded-3xl p-4 flex flex-col gap-10 items-center">
          <Input
            className="h-22 rounded-2xl text-amber-50 !text-2xl placeholder:text-2xl p-8 "
            placeholder="What is happening!?"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <h2 className="text-amber-50 text-5xl font-bold">Choose Image</h2>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 rounded-xl object-cover"
            />
          )}
          <Label className="flex items-center justify-center h-20 rounded-2xl border text-amber-50 text-3xl cursor-pointer w-full">
            Select Image
            <Input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Label>

          <Button
            className="w-full h-20 rounded-2xl bg-blue-600 text-4xl"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <LoaderCircle className="animate-spin w-16 h-16" />
            ) : (
              "Submit"
            )}
          </Button>
          {message && <p className="text-white text-2xl mt-4">{message}</p>}
          {error && <p className="text-red-500">Xatolik: {error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Post;

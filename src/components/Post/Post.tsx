import { Button } from "../ui/button";
import leftStrelka from "/arrow-left-solid.svg";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { usePostRequest } from "../Request/UsePostRequest";

function Post() {
  const navigate = useNavigate();
  const { data, loading, error, postData } = usePostRequest(
    "https://social-backend-kzy5.onrender.com/image/"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      console.error("Fayl tanlanmagan!");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    try {
      await postData({
        body: formData,
      });
    } catch (error) {
      console.error("Yuborishda xatolik:", error);
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
            {loading ? "Uploading..." : "Submit"}
          </Button>

          {error && <p className="text-red-500">Xatolik: {error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Post;

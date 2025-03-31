import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { usePostRequest } from "../Request/UsePostRequest";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Modal from "../Modal/Modal";
import settings from "/gear-solid.svg";

type MyResponseType = {
  success: boolean;
  message: string;
  data?: any;
};

function ResetPass() {
  const { t, i18n } = useTranslation();
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<number>();
  const [newPassword, setNewPassword] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { data, loading, error, postData } = usePostRequest<MyResponseType>(
    "https://social-backend-kzy5.onrender.com/auth/reset-pass"
  );
  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postData({
      body: {
        username,
        code: password,
        newPassword,
      },
    });
    if (data?.message === "login success") {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 py-6 px-8 text-center">
          <h2 className="text-3xl font-bold text-white">{t("titleRes")}</h2>
        </div>
        <form className="p-8 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              {t("username_label")}
            </Label>
            <Input
              placeholder={t("username_placeholderRes")}
              id="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              {t("verification_code_label")}
            </Label>
            <Input
              type="number"
              placeholder={t("verification_code_placeholder")}
              id="password"
              value={password}
              onChange={(e) => setPassword(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              {t("new_password_label")}
            </Label>
            <Input
              type="password"
              placeholder={t("new_password_placeholder")}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end">
            <Link
              to="/"
              className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              {t("loginRes")}
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 mt-4"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <LoaderCircle className="animate-spin mr-2" />
                {t("processing")}
              </div>
            ) : (
              `${t("submitRes")}`
            )}
          </Button>
        </form>
      </div>
      {!isOpen && (
        <div className="fixed top-4 right-4 z-50">
          <button
            className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setIsOpen(true)}
            aria-label="Settings"
          >
            <img
              src={settings}
              alt="Settings"
              className="w-6 h-6 text-gray-700"
            />
          </button>
        </div>
      )}
      <Modal
        open={isOpen}
        setOpen={setIsOpen}
        className="max-w-md w-full p-6 rounded-lg"
      >
        <div className="space-y-4">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
            {t("select_language")}
          </h2>

          <div className="relative">
            <select
              onChange={changeLanguage}
              value={i18n.language}
              className="block w-full px-4 py-3 pr-8 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="uz" className="py-2">
                O'zbekcha
              </option>
              <option value="en" className="py-2">
                English
              </option>
              <option value="ru" className="py-2">
                Русский
              </option>
              <option value="qr" className="py-2">
                Qaraqalpaq
              </option>
              <option value="xt" className="py-2">
                Xitoy
              </option>
              <option value="ge" className="py-2">
                Germany
              </option>
              <option value="kk" className="py-2">
                Qozoqcha
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {t("close")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ResetPass;

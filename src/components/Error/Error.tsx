import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-20 md:w-64 h-full bg-indigo-900 hidden md:block"></div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <div className="text-9xl font-bold text-indigo-600 mb-4">404</div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full py-6 text-lg bg-indigo-600 hover:bg-indigo-700"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full py-6 text-lg border-indigo-600 text-indigo-600 hover:bg-indigo-50"
              onClick={() => navigate("/dashboard/home")}
            >
              <Zap className="mr-2 h-5 w-5" />
              Return to Home
            </Button>
          </div>

          <div className="mt-12 text-gray-400 text-sm">
            <p>Need help? Contact our support team</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;

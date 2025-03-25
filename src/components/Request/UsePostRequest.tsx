import { useState } from "react";

interface PostRequestOptions {
  body: Record<string, any>;
  headers?: HeadersInit;
}

interface PostRequestState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function usePostRequest<T>(url: string) {
  const [state, setState] = useState<PostRequestState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const postData = async ({
    body,
    headers,
  }: PostRequestOptions): Promise<T | null> => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result: T = await response.json();
      setState({ data: result, loading: false, error: null });
      return result; // ✅ Natijani qaytarish kerak
    } catch (error) {
      setState({ data: null, loading: false, error: (error as Error).message });
      return null; // ✅ Xato bo‘lsa null qaytarish
    }
  };

  return { ...state, postData };
}

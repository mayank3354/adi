import { useState } from "react";

interface UIState {
  input: string;
  c1Response: string;
  isLoading: boolean;
}

interface UIActions {
  setInput: (input: string) => void;
  setC1Response: (response: string) => void;
  setIsLoading: (loading: boolean) => void;
  submit: (prompt?: string) => Promise<void>;
}

export const useUIState = (): {
  state: UIState;
  actions: UIActions;
} => {
  const [state, setState] = useState<UIState>({
    input: "",
    c1Response: "",
    isLoading: false,
  });

  const setInput = (input: string) => {
    setState((prev) => ({ ...prev, input }));
  };

  const setC1Response = (response: string) => {
    setState((prev) => ({ ...prev, c1Response: response }));
  };

  const setIsLoading = (loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  };

  const submit = async (prompt?: string) => {
    const finalPrompt = prompt || state.input;
    if (!finalPrompt.trim()) return;

    setIsLoading(true);
    setC1Response("");

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          previousC1Response: state.c1Response,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Response body not found");
      }

      const decoder = new TextDecoder();
      let streamResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        const chunk = decoder.decode(value, { stream: !done });
        
        streamResponse += chunk;
        setC1Response(streamResponse);

        if (done) break;
      }

      // Clear input after successful submission
      setInput("");
    } catch (error) {
      console.error("Error submitting prompt:", error);
      setC1Response("Error generating response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    state,
    actions: {
      setInput,
      setC1Response,
      setIsLoading,
      submit,
    },
  };
};

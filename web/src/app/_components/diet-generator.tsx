"use client";

import { useRef, useState } from "react";
import { Loader, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DietData } from "@/types/diet-data";
import ReactMarkdown from "react-markdown";

export function DietGenerator({ data }: {data: DietData}) {
  const [output, setOutput] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const controllerRef = useRef<AbortController | null>(null);

  async function startStreaming() {
    const controller = new AbortController();
    controllerRef.current = controller;

    setOutput("");
    setIsStreaming(true);
    try {
      const response = await fetch("http://localhost:3333/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: data.name,
          idade: data.age,
          peso_kg: data.weight_kg,
          altura_cm: data.height_cm,
          sexo: data.gener,
          nivel_atividade: data.activity_level,
          objetivo: data.objective,
        }),
        signal: controller.signal,
      });

      const render = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { value, done } = await render!.read();
        if (done) break;
        
        setOutput((prev) => prev + decoder.decode(value));
      }
    } catch(err: any) {
      if (err.name === "AbortError") {
        console.log("Stream de dieta abortada pelo usuário.");
        return;
      }

      console.error("Erro ao gerar dieta:", err);
    } finally {
      setIsStreaming(false);
      controllerRef.current = null;
    }
  }

  async function handleGenerate() {
    if (isStreaming) {
      controllerRef.current?.abort();
      setIsStreaming(false);
      return;
    }

    await startStreaming();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-4xl border-0">
        <div className="flex justify-center gap-4">
          <Button
            className="cursor-pointer gap-2"
            size="lg"
            onClick={handleGenerate}
          >
            {isStreaming ? <Loader className="w-6 h-6" /> : <Sparkles name="w-6 h-6" />}
            {isStreaming ? "Parar dieta" : "Gerar Dieta"}
          </Button>
        </div>

        {output && (
          <div className="bg-card rounded-lg p-6 border border-border max-h-125 overflow-y-auto">
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-green-600 my-1" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-zinc-900 mb-1" {...props} />,
              }}
            >
              {output}
            </ReactMarkdown>
          </div>
        </div>
        )}
      </Card>
    </div>
  );
}
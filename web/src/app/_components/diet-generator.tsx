"use client";

import { useRef, useState } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DietData } from "@/types/diet-data";

export function DietGenerator({ data }: {data: DietData}) {
  const [output, setOutput] = useState<string>("");
  const [streaming, setStreaming] = useState<boolean>(false);

  const controllerRef = useRef<AbortController | null>(null);

  async function startStreaming() {
    const controller = new AbortController();
    controllerRef.current = controller;

    setOutput("");
    setStreaming(true);
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
      setStreaming(false);
      controllerRef.current = null;
    }
  }

  async function handleGenerate() {
    if (streaming) {
      controllerRef.current?.abort();
      setStreaming(false);
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
            <Sparkles name="w-6 h-6" />
            Gerar dieta
          </Button>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border max-h-125 overflow-y-auto">
          <div className="prose prose-sm max-w-none">
            {output}
          </div>
        </div>
      </Card>
    </div>
  );
}
"use client";

import { Card } from "@/components/ui/card";
import { Form } from "@base-ui/react";
import { Utensils } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const dietSchema = z.object({
  nome: z.string().min(2, "O nome é obrigatório"),
  idade: z.number().int().positive(),
  altura_cm: z.number().positive(),
  peso_kg: z.number().positive(),
  sexo: z.enum(["masculino", "feminino"], { message: "Selecione o sexo" }),
  nivel_atividade: z.enum(["sedentario", "2x_semana", "4x_semana"], { message: "Selecione um nível de atividade" }),
  objetivo: z.enum(["perda_de_peso", "hipertrofia", "manter_massa_muscular"], { message: "Selecione o objetivo" }),
});

type DietSchemaFormData = z.infer<typeof dietSchema>;

interface DietFormProps {
  onSubmit: (data: DietSchemaFormData) => void;
}

export function DietForm({onSubmit}: DietFormProps) {

  const form = useForm<DietSchemaFormData>({
    resolver: zodResolver(dietSchema),
    defaultValues: {
      nome: "",
      idade: undefined,
      altura_cm: undefined,
      peso_kg: undefined,
      sexo: undefined,
      nivel_atividade: undefined,
      objetivo: undefined,
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card>
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4 mx-auto">
              <Utensils className="w-14 h-14 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-green-500 mb-2">
              Calcule sua dieta
            </h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray 900 flex items-center">
                  Dados pessoais
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                  <FieldGroup>
                    <Controller
                      name="nome"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="input-nome">
                            Nome
                          </FieldLabel>
                          <Input
                            {...field}
                            id="input-nome"
                            aria-invalid={fieldState.invalid}
                            placeholder="Digite seu nome..."
                            autoComplete="off"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </form>
              </div>
            </form>
          </Form>
        </div>
      </Card>
    </div>
  )
}

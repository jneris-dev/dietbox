"use client";

import { Card } from "@/components/ui/card";
import { Utensils } from "lucide-react";
import { Controller, Form, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const dietSchema = z.object({
  name: z.string().min(2, "O nome é obrigatório"),
  age: z.number().int().positive(),
  height_cm: z.number().positive(),
  weight_kg: z.number().positive(),
  gener: z.enum(["masculino", "feminino"], { message: "Selecione o sexo" }),
  activity_level: z.enum(["sedentario", "2x_semana", "4x_semana"], { message: "Selecione um nível de atividade" }),
  objective: z.enum(["perda_de_peso", "hipertrofia", "manter_massa_muscular"], { message: "Selecione o objetivo" }),
});

type DietSchemaFormData = z.infer<typeof dietSchema>;

interface DietFormProps {
  onSubmit: (data: DietSchemaFormData) => void;
}

const GENER_LABELS = {
  "masculino": "Masculino",
  "feminino": "Feminino",
};

const ACTIVITY_LABELS = {
  "sedentario": "Sedentário",
  "2x_semana": "2x na semana",
  "4x_semana": "4x na semana",
};

const OBJECTIVE_LABELS = {
  "perda_de_peso": "Perda de peso",
  "hipertrofia": "Hipertrofia",
  "manter_massa_muscular": "Manter massa muscular",
};

export function DietForm({onSubmit}: DietFormProps) {

  const form = useForm<DietSchemaFormData>({
    resolver: zodResolver(dietSchema),
    defaultValues: {
      name: "",
      age: undefined,
      height_cm: undefined,
      weight_kg: undefined,
      gener: undefined,
      activity_level: undefined,
      objective: undefined,
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-0">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4 mx-auto">
              <Utensils className="w-14 h-14 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-green-500 mb-2">
              Calcule sua dieta
            </h1>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray 900 flex items-center">
                Dados pessoais
              </h3>
            </div>

            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="input-name">
                      Nome
                    </FieldLabel>
                    <Input
                      {...field}
                      id="input-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="Digite seu nome"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="age"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="input-age">
                      Idade
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      id="input-age"
                      aria-invalid={fieldState.invalid}
                      placeholder="Informe sua idade"
                      autoComplete="off"
                      step="any"
                      {...form.register("age", {
                        setValueAs: (v) => v === "" ? undefined : Number(v),
                      })}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Controller
                name="height_cm"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="input-height">
                      Altura(cm)
                    </FieldLabel>
                    <Input
                      type="number"
                      id="input-height"
                      aria-invalid={fieldState.invalid}
                      placeholder="Sua altura em cm"
                      autoComplete="off"
                      step="any"
                      {...form.register("height_cm", {
                        setValueAs: (v) => v === "" ? undefined : parseFloat(v),
                      })}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="weight_kg"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="input-weight">
                      Peso(kg)
                    </FieldLabel>
                    <Input
                      {...field}
                      type="number"
                      step="any"
                      id="input-weight"
                      aria-invalid={fieldState.invalid}
                      placeholder="Seu peso em kg"
                      autoComplete="off"
                      {...form.register("weight_kg", {
                        setValueAs: (v) => v === "" ? undefined : parseFloat(v),
                      })}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="gener"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="input-gener">
                      Sexo
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="input-gener"
                        aria-invalid={fieldState.invalid}
                        className="w-full"
                      >
                        <SelectValue placeholder="Selecione o sexo">
                          {field.value ? GENER_LABELS[field.value as keyof typeof GENER_LABELS] : undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="feminino">Feminino</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="activity_level"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="input-activity-level">
                      Nível de atividade
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="input-activity-level"
                        aria-invalid={fieldState.invalid}
                        className="w-full"
                      >
                        <SelectValue placeholder="Selecione o nivel de atividade">
                          {field.value ? ACTIVITY_LABELS[field.value as keyof typeof ACTIVITY_LABELS] : undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentario">Sedentário</SelectItem>
                        <SelectItem value="2x_semana">2x na semana</SelectItem>
                        <SelectItem value="4x_semana">4x na semana</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="objective"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="input-objective">
                      Objetivo
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="input-objective"
                        aria-invalid={fieldState.invalid}
                        className="w-full"
                      >
                        <SelectValue placeholder="Selecione o nivel de atividade">
                          {field.value ? OBJECTIVE_LABELS[field.value as keyof typeof OBJECTIVE_LABELS] : undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="perda_de_peso">Perda de peso</SelectItem>
                        <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
                        <SelectItem value="manter_massa_muscular">Manter massa muscular</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button type="submit" className="w-full mt-4 hover:opacity-90 cursor-pointer">
              Gerar minha dieta
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}

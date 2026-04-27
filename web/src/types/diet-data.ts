export interface DietData {
  name: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  gener: "masculino" | "feminino";
  activity_level: "sedentario" | "2x_semana" | "4x_semana";
  objective: "perda_de_peso" | "hipertrofia" | "manter_massa_muscular";
}
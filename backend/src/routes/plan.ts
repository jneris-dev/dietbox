import type { FastifyInstance } from "fastify";
import { DietPlanRequestSchema } from "../types";
import { generateDietPlan } from "../agents";

export async function planRoutes(app:FastifyInstance) {
  app.post("/plan", async (request, reply) => {

    const parse = DietPlanRequestSchema.safeParse(request.body);

    if (!parse.success) {
      return reply.status(400).send({
        error: "ValidationError",
        details: parse.error.flatten(issue => issue.message)
      });
    }

    try {

      const data = generateDietPlan(parse.data);

      return reply.send(data);
    }catch (err: any) {
      request.log.error(err);
      reply.raw.write(`event: error\ndata: ${JSON.stringify(err.message)}`);
      reply.raw.end();
    };
  })  
}
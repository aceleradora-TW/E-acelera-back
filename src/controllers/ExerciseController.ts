import { Prisma, PrismaClient } from "@prisma/client";
import { Response, Request } from "express";

export class ExerciseController {
    async updateExerciseStatus (req: Request, res: Response) {
        const prisma = new PrismaClient();
        const { id } = req.params;
        const { value } = req.body;
        try {
              if (!value){
                return res.status(400).json({message: "Status value is required"});
              }

              const validateStatus = ["NotStarted", "InProgress", "Completed"]
              if (!validateStatus.includes(value)){
                return res.status(400).json({message: "Status value is invalid"});
              }

            const currentProgress = await prisma.progress.findUnique({ 
                where: {itemId: id}       
            })

              if (currentProgress && currentProgress.itemStatus == value){
                return res.status(400).json({message: "Status value is already being used"});
              }

            const exercise = await prisma.progress.update({where: {itemId : id}, data: { itemStatus: value}});
            res.status(200).json(exercise)

        } catch (error) {
            res.json({message: "Erro"})
        }
    }
}
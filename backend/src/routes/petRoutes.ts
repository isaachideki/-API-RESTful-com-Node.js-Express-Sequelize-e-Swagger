import { Router } from 'express';
import { PetController } from '../controllers/PetController';

const petRoutes = Router();

petRoutes.get('/', PetController.index);
petRoutes.get('/:id', PetController.show);
petRoutes.post('/', PetController.create);
petRoutes.put('/:id', PetController.update);
petRoutes.delete('/:id', PetController.delete);

export { petRoutes };

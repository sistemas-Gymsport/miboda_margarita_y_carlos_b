const { createCollectionService } = require('../services/collectionService');
const { validate } = require('../utils/validators');

/** Genera los handlers CRUD + reordenamiento para una coleccion ordenable. */
function createCollectionController(modelName, schema, defaults = {}) {
  const service = createCollectionService(modelName);
  const strip = ({ weddingId, createdAt, updatedAt, ...item }) => item;

  return {
    async list(req, res) {
      res.json({ success: true, data: (await service.list()).map(strip) });
    },
    async create(req, res) {
      const data = validate({ ...defaults, ...req.body }, schema);
      res.status(201).json({ success: true, data: strip(await service.create(data)) });
    },
    async update(req, res) {
      const data = validate(req.body, schema);
      res.json({ success: true, data: strip(await service.update(req.params.id, data)) });
    },
    async remove(req, res) {
      await service.remove(req.params.id);
      res.json({ success: true });
    },
    async reorder(req, res) {
      res.json({ success: true, data: (await service.reorder(req.body?.ids)).map(strip) });
    },
  };
}

module.exports = { createCollectionController };

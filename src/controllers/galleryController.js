const galleryService = require('../services/galleryService');
const { rules, validate } = require('../utils/validators');

const altSchema = { alt: rules.string(180) };

async function list(req, res) {
  res.json({ success: true, data: await galleryService.list() });
}

async function upload(req, res) {
  const images = await galleryService.uploadMany(req.files);
  res.status(201).json({ success: true, data: images });
}

async function update(req, res) {
  const { alt = '' } = validate(req.body, altSchema);
  res.json({ success: true, data: await galleryService.updateAlt(req.params.id, alt) });
}

async function replace(req, res) {
  res.json({ success: true, data: await galleryService.replace(req.params.id, req.file) });
}

async function remove(req, res) {
  await galleryService.remove(req.params.id);
  res.json({ success: true });
}

async function setMain(req, res) {
  res.json({ success: true, data: await galleryService.setMain(req.params.id) });
}

async function reorder(req, res) {
  res.json({ success: true, data: await galleryService.reorder(req.body?.ids) });
}

module.exports = { list, upload, update, replace, remove, setMain, reorder };

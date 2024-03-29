import express from "express";

const notfoundRouter = express.Router();

notfoundRouter.use((_, res) => {
  res.status(404).send({
    message: "path not found",
  });
});

export default notfoundRouter;

import express from 'express';
import bodyParser from 'body-parser'
import cors from "cors";
import * as dotenv from 'dotenv';
import fileUpload from "express-fileupload";
import morgan from 'morgan';
import path from "path";


// Importation de la configuration Swagger depuis le fichier `swagger.ts`
import swaggerDocs from "./swagger";

// Importation des routers
import rolesRouter from "./routes/role.Routes";
import rolesPermissionRouter from "./routes/rolePermission.Routes";
import permissionRouter from "./routes/permission.Routes";
import authRouter from "./routes/auth.Routes";
import userRouter from "./routes/user.Routes";

// 
dotenv.config();


import corsOptions from "./config/corsOptions";
import { initDb } from "./db/sequelize";

const app = express();


const port = process.env.PORT || 5000;

// parse application/json
app
  .use(bodyParser.json())
  .use(express.json())
  .use(cors(corsOptions))
  .use(
    fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
      useTempFiles: true,
      tempFileDir: path.join(__dirname, "/public/tmp"),
      createParentPath: true,
    })
  )
  .use(morgan('dev'))
  .use(express.static("./public"));

initDb();

// 
// Middleware pour servir la documentation Swagger

// Vos routes
// Utilisation des routes
app.use("/api/v1/roles", rolesRouter);
app.use("/api/v1/permissions", permissionRouter);
app.use("/api/v1/rolesPermission", rolesPermissionRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);



app.get('/', (req, res) => {
  res.send('Well done auth-service!');
})

app.listen(port, () => {
  console.log(`Example app listening on port: http://localhost:${port}`);

  swaggerDocs(app, port);
})
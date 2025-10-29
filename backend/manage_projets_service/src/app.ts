import express from 'express';
import bodyParser from 'body-parser'
import cors from "cors";
import * as dotenv from 'dotenv';
import fileUpload from "express-fileupload";
import morgan from 'morgan';
import path from "path";


// Importation de la configuration Swagger depuis le fichier `swagger.ts`
import swaggerDocs from "./swagger";



// 
// import authRouter from "./routes/auth";
// import reinitialserRouter from "./routes/reinitialser";
// import utilisateurRouter from "./routes/utilisateur";
// import rolesRouter from "./routes/roles";
// import permissionsRouter from "./routes/permissions";
// 
dotenv.config();



import corsOptions from "./config/corsOptions";
import sequelize from "./db/sequelize";


const app = express();


const port = process.env.PORT || 9000;

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
  .use(express.static("./public"))
  .use('/uploads', express.static(path.join(__dirname, '../public/uploads')));


sequelize.initDb();

// 
// Middleware pour servir la documentation Swagger
// app.use("/api/v1/api-docs-user", swaggerUi.serve, swaggerUi.setup(specs));

// Vos routes
// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/reinitialser", reinitialserRouter);
// app.use("/api/v1/utilisateur", utilisateurRouter);
// app.use("/api/v1/roles", rolesRouter);
// app.use("/api/v1/permissions", permissionsRouter);
// Route pour le téléchargement


app.get('/', (req, res) => {
  res.send('Well done Users!');
})

app.listen(port, () => {
  console.log(`Example app listening on port: http://localhost:${port}`);

  swaggerDocs(app, port);
})
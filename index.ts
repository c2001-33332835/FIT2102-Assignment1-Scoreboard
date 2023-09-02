import express, { Express, Request, Response } from 'express';
import { sha256 } from 'js-sha256';
import dotenv from 'dotenv';
import { getScoreboard, submitScoreboard } from './scoreboard';

dotenv.config();

const app: Express = express();
const port = process.env.PORT!;
const secret = process.env.SECRET!;
const filename = process.env.FILENAME!;

app.use(express.json());

const serialize = (object: any) => JSON.parse(JSON.stringify(object));

app.post('/submit', (req: Request, res: Response) => {
  // if body malformed
  if ((!req.body) || (!req.body["name"]) || (!req.body["score"]) || (!req.body["secret"])){
    res.status(400);
    res.json({
      "status": "error",
      "message": "The post body is malformed.",
      "content": undefined
    })
    return;
  }

  // if name too long
  if (req.body["name"].length > 10){
    res.status(400);
    res.json({
      "status": "error",
      "message": "The name is too long.",
      "content": undefined
    })
    return;
  }
  
  // if secret not match
  if (req.body.secret !== sha256(secret)){
    res.status(401);
    res.json({
      "status": "error",
      "message": "The secret does not match.",
      "content": undefined
    })
    return;
  }

  submitScoreboard(filename, req.body.name!, req.body.score!);

  res.json({
    "awa": "awa"
  })
});

app.get('/scoreboard', (req: Request, res: Response) => {
  res.json({
    "status": "success",
    "message": "The request was successful.",
    "content": serialize(getScoreboard(filename)),
  });
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    "status": "success",
    "message": "Saluton Mondo! The API is working!",
    "content": undefined,
  });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
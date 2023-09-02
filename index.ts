import express, { Express, Request, Response } from 'express';
import { sha256 } from 'js-sha256';
import dotenv from 'dotenv';
import cors from 'cors';
import { getScoreboard, submitScoreboard } from './scoreboard';

dotenv.config();

const app: Express = express();
const port = process.env.PORT!;
const secret = process.env.SECRET!;
const filename = process.env.FILENAME!;

app.use(express.json());
app.use(cors<Request>());

const serialize = (object: any) => JSON.parse(JSON.stringify(object));

app.post('/submit', (req: Request, res: Response) => {
  // if body malformed
  if ((!req.body) || 
      (req.body["name"] === undefined) || 
      (req.body["score"] === undefined) || 
      (req.body["secret"] === undefined)
     ){
    
    res.status(400);
    res.json({
      "status": "error",
      "message": `The post body is malformed: ${JSON.stringify(req.body)}`,
      "content": undefined
    })
    return;
  }

  // if name too long
  let name: string = req.body.name!
  if (name.length > 10){
    name = name.slice(0, 11);
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

  const rank = submitScoreboard(filename, name, req.body.score!);

  res.json({
    "status": "success",
    "message": "The request was successful.",
    "content": {rank}
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
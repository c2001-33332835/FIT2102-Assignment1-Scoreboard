import fs from "fs";

type ScoreEntry = {
  name: string,
  score: number,
}

const insert = <T>(list: T[], index: number, element: T): T[] => [
  ...list.slice(0, index),
  element,
  ...list.slice(index)
];

function prepareFile(filename: string){
  const fileExist = fs.existsSync(`./${filename}`);
  if (!fileExist){
    fs.writeFileSync(`./${filename}`, "[]", "utf-8");
  }

  // try reading
  try{
    JSON.parse(fs.readFileSync(`./${filename}`, "utf-8")) as ScoreEntry[];
  } catch (error) {
    fs.writeFileSync(`./${filename}`, "[]", "utf-8");
  }
}

function getScoreboard(filename: string): ScoreEntry[]{
  prepareFile(filename);
  const data = JSON.parse(fs.readFileSync(`./${filename}`, "utf-8")) as ScoreEntry[];
  return data;
}

function submitScoreboard(filename: string, name: string, score: number): number{
  const scoreboard = getScoreboard(filename);
  const scores = scoreboard.map((entry) => entry.score);

  let scoreIndex = 0;
  for (const s of scores){
    if (score > s){
      break;
    }
    scoreIndex ++;
  }

  let newScoreboard = insert(scoreboard, scoreIndex, {name, score});
  if (newScoreboard.length > 15){
    newScoreboard = newScoreboard.slice(0, 10);
  }

  fs.writeFileSync(`./${filename}`, JSON.stringify(newScoreboard, null, "\t"), "utf-8");
  return scoreIndex;
}

export { getScoreboard, submitScoreboard };
export type { ScoreEntry };
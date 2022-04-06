import { prompt } from "inquirer";
import { HomeMenu } from "./config";

export const displayMenu = async () => {
  prompt(HomeMenu).then((ans) => {
    console.log(ans);
  });
};

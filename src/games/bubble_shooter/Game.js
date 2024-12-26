import Phaser from "phaser";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./utils/Constants";
import WelcomeScene from "./scenes/WelcomeScene";
import StartScene from "./scenes/StartScene";
import GameScene from "./scenes/GameScene";
import WinScene from "./scenes/WinScene";
import LoseScene from "./scenes/LoseScene";

const config = {
  type: Phaser.AUTO,
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  backgroundColor: "#000036",
  parent: "game-root",
  physics: {
    default: "arcade",
    arcade: {
      // debug: true,
    },
  },
  scene: [WelcomeScene, StartScene, GameScene, WinScene, LoseScene],
  initialScene: "WelcomeScene",
};

const StartGame = (parent) => {
  return new Phaser.Game({ ...config, parent });
};

export default StartGame;

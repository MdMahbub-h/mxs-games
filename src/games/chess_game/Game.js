import Phaser from "phaser";
import WelcomeScene from "./scenes/WelcomeScene";
import StartScene from "./scenes/StartScene";
import GameScene from "./scenes/GameScene";
import WinScene from "./scenes/WinScene";
import LoseScene from "./scenes/LoseScene";

const config = {
  type: Phaser.AUTO,
  width: 680,
  height: 580,
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
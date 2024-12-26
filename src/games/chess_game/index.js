import { useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getGameData } from "../../utils/apiActions";
import StartGame from "./Game";

const Chess = () => {
  const game = useRef();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.user);

  useLayoutEffect(() => {
    const resize = (ev) => {
      if (game.current) {
        let canvas = document.querySelector("#game-root canvas");
        if (canvas) {
          let padding =
            window.innerWidth > 580 && window.innerHeight > 680 ? 40 : 10;
          let winWidth = window.innerWidth - padding;
          let winHeight = window.innerHeight - padding;
          let winRatio = winWidth / winHeight;
          let gameRatio =
            game.current.config.width / game.current.config.height;

          if (winRatio < gameRatio) {
            let canvasWidth = winWidth > 680 ? 680 : winWidth;
            let canvasHeight =
              winWidth / gameRatio > 580 ? 580 : winWidth / gameRatio;

            canvas.style.width = canvasWidth + "px";
            canvas.style.height = canvasHeight + "px";
          } else {
            let canvasWidth =
              winHeight * gameRatio > 680 ? 680 : winHeight * gameRatio;
            let canvasHeight = winHeight > 580 ? 580 : winHeight;

            canvas.style.width = canvasWidth + "px";
            canvas.style.height = canvasHeight + "px";
          }
        }
      }
    };

    const initGame = async () => {
      if (userData) {
        const gameData = await getGameData("game_web_match");
        if (gameData) {
          if (game.current === undefined) {
            game.current = StartGame("game-root");
          }
          const _gameData = {
            winScore: parseInt(gameData.score_needed),
            gameTime: parseInt(gameData.seconds_allowed),
            rewardCount: parseInt(gameData.reward_on_complete),
          };
          game.current.registry.set("user_data", userData);
          game.current.registry.set("game_data", _gameData);

          resize();
        }
      }
    };

    initGame();

    window.addEventListener("resize", resize);
    return () => {
      if (game.current) {
        window.removeEventListener("resize", resize);
        game.current.destroy(true);
        game.current = undefined;
      }
    };
  }, [userData]);

  useEffect(() => {
    if (!userData) {
      navigate("/");
    }
  }, [userData, navigate]);

  return <div id="game-root"></div>;
};

export default Chess;

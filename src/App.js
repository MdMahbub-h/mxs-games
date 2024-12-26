import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SpaceGame from "./games/space_invaders";
import SnakeGame from "./games/snake_game";
import BubbleGame from "./games/bubble_shooter";
import CandyGame from "./games/candy_crush";
import BricksGame from "./games/break_bricks";
import TetrisGame from "./games/tetris_game";
import FlappyBird from "./games/flappy_bird";
import ArcheryGame from "./games/archery_game";
import EggCatcher from "./games/egg_catcher";
import WhackAMole from "./games/whack_a_mole";
import Landing from "./landing";
import "./index.css";
import Chess from "./games/chess_game";
import EndlessRunner from "./games/endless-runner";
import EndlessCave from "./games/endless-cave";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    children: [
      {
        path: "bubble-shooter",
        element: <BubbleGame />,
      },
      {
        path: "candy-crush",
        element: <CandyGame />,
      },
      {
        path: "tetris",
        element: <TetrisGame />,
      },
      {
        path: "break-bricks",
        element: <BricksGame />,
      },
      {
        path: "space-invaders",
        element: <SpaceGame />,
      },
      {
        path: "snake",
        element: <SnakeGame />,
      },
      {
        path: "flappy-bird",
        element: <FlappyBird />,
      },
      {
        path: "archery",
        element: <ArcheryGame />,
      },
      {
        path: "egg-catcher",
        element: <EggCatcher />,
      },
      {
        path: "whack-a-mole",
        element: <WhackAMole />,
      },
      {
        path: "chess-game",
        element: <Chess />,
      },
      {
        path: "endless-runner",
        element: <EndlessRunner />,
      },
      {
        path: "endless-cave",
        element: <EndlessCave />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;

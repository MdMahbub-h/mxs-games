import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import "./landing.css";

const Manue = () => {
  const userData = useSelector((state) => state.user.user);
  const menuRef = useRef();

  const navigate = useNavigate();

  const [games, setGames] = useState([
    {
      name: "MXS Bubble Shooter",
      link: "bubble-shooter",
      image: "./images/bubble.png",
    },
    {
      name: "MXS Break Bricks",
      link: "break-bricks",
      image: "./images/bricks.png",
    },
    {
      name: "MXS Candy Crush",
      link: "candy-crush",
      image: "./images/candy.png",
    },
    { name: "MXS Tetris", link: "tetris", image: "./images/tetris.png" },
    {
      name: "MXS Space-Invaders",
      link: "space-invaders",
      image: "./images/space.png",
    },
    {
      name: "MXS Snake Game",
      link: "snake",
      image: "./images/snake.png",
    },
    {
      name: "MXS Flappy Bird",
      link: "flappy-bird",
      image: "./images/flappy-bird.png",
    },
    {
      name: "MXS Archery",
      link: "archery",
      image: "./images/archery.png",
    },
    {
      name: "MXS Egg Catcher",
      link: "egg-catcher",
      image: "./images/egg-catcher.png",
    },
    {
      name: "MXS Whack A Mole",
      link: "whack-a-mole",
      image: "./images/whack_a_mole.png",
    },
    {
      name: "MXS Chess",
      link: "chess-game",
      image: "./images/chess.png",
    },
    {
      name: "MXS Endless Runner",
      link: "endless-runner",
      image: "./images/endless-runner.png",
    },
    {
      name: "MXS Endless Cave",
      link: "endless-cave",
      image: "./images/endless-cave.png",
    },
  ]);

  const scrollMenu = (left) => {
    if (left) {
      menuRef.current.scrollLeft -= 200;
    } else {
      menuRef.current.scrollLeft += 200;
    }
  };

  const enterGame = (link) => {
    if (!userData) {
      return toast.error("Please login first to play a game!");
    }
    navigate(link);
  };

  return (
    <main className="mt-4 mb-4">
      <div className="relative h-[200px] select-none">
        <button
          onClick={() => scrollMenu(true)}
          className="block absolute top-1/2 transform -translate-y-1/2 left-4 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="55"
            height="70"
            viewBox="10 0 12 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-chevron-left my-auto cursor-pointer text-white hover:text-blue-400"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <div
          ref={menuRef}
          className="no-scrollbar w-full h-full overflow-x-auto overflow-y-hidden relative"
        >
          <div className="flex h-full gap-3">
            {games.map((game, index) => (
              <div
                key={index}
                onClick={() => enterGame(game.link)}
                className="min-w-[200px] w-[200px] h-full p-2 flex items-center justify-center overflow-hidden bg-white border bg-cover border-gray-200 rounded-lg shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700"
              >
                <img
                  src={game.image}
                  alt={game.name}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => scrollMenu(false)}
          className="block absolute top-1/2 transform -translate-y-1/2 right-4 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="55"
            height="70"
            viewBox="0 0 14 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-chevron-right text-white cursor-pointer hover:text-blue-400"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </main>
  );
};

export default Manue;

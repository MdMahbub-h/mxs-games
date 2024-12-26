import axios from "axios";
import toast from "react-hot-toast";

const API_KEY = process.env.REACT_APP_API_KEY;

export const getGameData = async (gameName) => {
  return axios
    .get("https://us-central1-prodmxs.cloudfunctions.net/getGameData", {
      params: {
        game_name: gameName,
      },
      headers: {
        Authorization: API_KEY,
      },
    })
    .then((res) => {
      if (res.data && res.data.success) {
        return res.data.data.game_configurations;
      } else {
        if (!res.data.success && res.data.error) {
          toast.error(res.data.error);
        }
        return null;
      }
    })
    .catch((err) => {
      if (err.response.data && typeof err.response.data == "string") {
        toast.error(err.response.data);
      } else {
        toast.error("Failed to get game data!");
      }
      console.log(err);
      return null;
    });
};

export const getUserData = async (code) => {
  // return await axios
  //   .get(`https://us-central1-prodmxs.cloudfunctions.net/getUserDataByCode?game_access_code=${code}`, {
  //     headers: {
  //       Authorization: API_KEY,
  //     },
  //   })
  //   .then((res) => {
  //     if (res.data) {
  //       return res.data;
  //     }
  //     return null;
  //   })
  //   .catch((err) => {
  //     if (err.response.data && typeof err.response.data == "string") {
  //       toast.error(err.response.data);
  //     } else {
  //       toast.error("Failed to get user data!");
  //     }
  //     console.log(err);
  //     return null;
  //   });
  return { id: "1234", userName: "1234", code: "7520" };
};

export const claimReward = async (gameName, userId) => {
  let ip_address = "";
  let ipdata = await axios
    .get("https://api.ipify.org/?format=json")
    .then((response) => response.data);
  let gameData = await getGameData(gameName);
  if (ipdata && ipdata.ip) ip_address = ipdata.ip;
  return axios
    .post(
      "https://us-central1-prodmxs.cloudfunctions.net/addReward",
      {
        uid: userId,
        sub_event: "GAME",
        type: "LEVEL_COMPLETE",
        game_name: gameName,
        ip_address: ip_address,
        mxs_gold_claimed: gameData.rewardCount,
        comment: "MXS earned by winning the game.",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: API_KEY,
        },
      }
    )
    .then((res) => {
      return Promise.resolve(res);
    })
    .catch((err) => {
      return Promise.reject(err);
    });
};

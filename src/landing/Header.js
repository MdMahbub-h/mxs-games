import { useDispatch, useSelector } from "react-redux";
import { getUserData } from "../utils/apiActions";
import { useState } from "react";
import { setUser } from "../store/userSlice";
import toast from "react-hot-toast";
import "./landing.css";
import { Link } from "react-router-dom";

const Header = () => {
  const userData = useSelector((state) => state.user.user);

  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [userCode, setUserCode] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async (ev) => {
    ev.preventDefault();
    if (userId && userCode) {
      setLoading(true);
      const userData = await getUserData(userCode);
      console.log(userData);
      if (userData) {
        dispatch(setUser(userData));
      }
      setLoading(false);
    } else {
      toast("Please enter User ID and user Code");
    }
  };

  const logout = (ev) => {
    dispatch(setUser(null));
  };

  return (
    <header className="header">
      <div className="site-title">
        <a href="/">MXS Games</a>{" "}
      </div>

      {!userData ? (
        <div>
          <button className="styled-button" onClick={() => setModalOpen(true)}>
            Login
          </button>
          {modalOpen && (
            <div className="login-modal">
              <div className="login-modal-body">
                <h3>MXS TETRIS</h3>
                <h4>Enter User ID and Game Code</h4>
                <form id="user_data_form" onSubmit={login}>
                  <section>
                    <input id="user_id" name="user_id" type="text" onChange={(ev) => setUserId(ev.target.value)} placeholder="User ID" required autoFocus />
                  </section>
                  <section>
                    <input id="user_code" name="user_code" type="text" onChange={(ev) => setUserCode(ev.target.value)} placeholder="Game Code" required />
                  </section>
                  <div className="flex justify-between gap-2">
                    <button className="styled-button gray" type="button" disabled={loading} onClick={() => setModalOpen(false)}>
                      Cancel
                    </button>
                    <button className="styled-button" type="submit" disabled={loading}>
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* {userData.user_id} */}
          <button className="styled-button" onClick={() => logout()}>
            Log Out
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;

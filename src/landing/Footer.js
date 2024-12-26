import "./landing.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span>
          All rights reserved ©{new Date().getFullYear()}{" "}
          <a href="https://www.metaxseed.io/">MXS GAMES</a>
        </span>
        <span>
          Dev:{" "}
          <a
            rel="noreferrer"
            href="https://github.com/MohsinUddinAbir"
            target="_blank"
          >
            Md Mahabub
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;

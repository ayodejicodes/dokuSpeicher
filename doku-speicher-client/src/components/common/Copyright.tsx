import { FaGithubSquare, FaLinkedin, FaTwitterSquare } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Copyright = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-lightBackground h-[10%] p-3 w-full">
      <small className=" text-[11px] flex flex-col text-center opacity-75">
        &copy;
        {` ${new Date().getFullYear()}`} | Designed and Developed by
        <span className="font-semibold"> Ayodeji Fabusiwa</span>
      </small>
      <div className="flex justify-center gap-2 mt-1">
        <Link to="https://twitter.com/ayodejicodes" target="_blank">
          <FaGithubSquare
            size={17}
            className=" cursor-pointer"
            onClick={() => navigate("/")}
          />
        </Link>
        <Link
          to="https://www.linkedin.com/in/ayodeji-fabusiwa/"
          target="_blank"
        >
          <FaLinkedin
            size={17}
            className=" cursor-pointer"
            onClick={() => navigate("/")}
          />
        </Link>
        <Link to="https://twitter.com/ayodejicodes" target="_blank">
          <FaTwitterSquare
            size={17}
            className=" cursor-pointer"
            onClick={() => navigate("/")}
          />
        </Link>
      </div>
    </div>
  );
};

export default Copyright;

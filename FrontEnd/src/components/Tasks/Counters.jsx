import React from "react";
import CountUp from "react-countup";
import {
  CheckSquareOutlined,
  ThunderboltOutlined,
  LoadingOutlined,
  RestTwoTone,
} from "@ant-design/icons";

const Counters = (props) => {
  let { allData, yetToStartData, inProcessData, finishedData } = props.counters;
  const changeCounterAndGridData = (type) => {
    return props.changeCounterAndGridData(type);
  };

  return (
    <div className="row justify-content-around mx-0 text-center pt-2">
      <div
        className="col-3"
        onClick={() => changeCounterAndGridData("all")}
        style={{ cursor: "pointer" }}
      >
        <p>
          <RestTwoTone className="fa-3x" />
        </p>
        <h4>All</h4>
        <h2>
          <CountUp end={allData} separator="," />
        </h2>
      </div>
      <div
        className="col-3"
        onClick={() => changeCounterAndGridData("0")}
        style={{ cursor: "pointer" }}
      >
        <p>
          <ThunderboltOutlined className="fa-3x" style={{color:"#678d06"}} />
        </p>
        <h4>Yet To Start</h4>
        <h2>
          <CountUp end={yetToStartData} separator="," />
        </h2>
      </div>
      <div
        className="col-3"
        onClick={() => changeCounterAndGridData("1")}
        style={{ cursor: "pointer" }}
      >
        <p>
          <LoadingOutlined className="fa-3x" style={{color:"#b49805"}} />
        </p>
        <h4>In Process</h4>
        <h2>
          <CountUp end={inProcessData} separator="," />
        </h2>
      </div>
      <div
        className="col-3"
        onClick={() => changeCounterAndGridData("2")}
        style={{ cursor: "pointer" }}
      >
        <p>
          <CheckSquareOutlined className="fa-3x" style={{color:"#2bc72b"}} />
        </p>
        <h4>Finished</h4>
        <h2>
          <CountUp end={finishedData} separator="," />
        </h2>
      </div>
    </div>
  );
};

export default Counters;

import React from "react";
import { Statistic } from "antd";
const { Countdown } = Statistic;

const CountDownCell = (props) => {
  const dateObject = new Date(props.data.end_date);
  const deadline = dateObject.getTime();
  return <Countdown value={deadline} />;
};

export default CountDownCell;

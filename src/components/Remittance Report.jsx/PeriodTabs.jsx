import { useState } from "react";
import "./PeriodTabs.css";

const PERIODS = ["Today", "This week", "This month", "Custom"];

export default function PeriodTabs({ onChange }) {
  const [active, setActive] = useState("Today");

  function selectPeriod(period) {
    setActive(period);
    onChange?.(period);
  }

  return (
    <div className="period-tabs">
      {PERIODS.map((period) => (
        <button
          key={period}
          className={
            "period-tabs__btn" + (period === active ? " period-tabs__btn--active" : "")
          }
          onClick={() => selectPeriod(period)}
        >
          {period}
        </button>
      ))}
    </div>
  );
}

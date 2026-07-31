import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const AccuracyChart = ({ stats }) => {
  const data = {
    labels: ["TRUE", "FAKE"],
    datasets: [
      {
        data: [stats.TRUE || 0, stats.FAKE || 0],
        backgroundColor: ["rgba(16, 185, 129, 0.9)", "rgba(244, 63, 94, 0.9)"],
        borderWidth: 0,
        hoverOffset: 8
      }
    ]
  };

  return (
    <div className="glass-panel p-5">
      <div className="mb-4">
        <p className="text-sm font-semibold text-slate-200">Verification trend</p>
        <p className="text-xs text-slate-400">Distribution of AI verification results</p>
      </div>
      <div className="mx-auto max-w-[240px]">
        <Doughnut
          data={data}
          options={{
            plugins: {
              legend: {
                labels: {
                  color: "#cbd5e1"
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default AccuracyChart;

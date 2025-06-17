import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const data = {
    labels: ["th1", "th2", "th3", "th4", "th5"],
    datasets: [
      {
        label: "",
        data: [2, 4, 3, 5, 6],
        backgroundColor: "#D55455",
        borderColor: "#D55455",
        borderWidth: 1,
        borderRadius: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
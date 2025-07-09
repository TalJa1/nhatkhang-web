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


import { format, subMonths } from "date-fns";
import { vi } from "date-fns/locale";

const BarChart = () => {
  const now = new Date();
  const months = Array.from({ length: 5 }, (_, i) => {
    const d = subMonths(now, 4 - i);
    return format(d, "MMM", { locale: vi });
  });

  const data = {
    labels: months,
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
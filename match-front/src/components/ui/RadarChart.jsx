// src/components/ui/RadarChart.jsx
import { Radar } from "react-chartjs-2";
import {
    Chart,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from "chart.js";

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

/**
 * props:
 *  - labels: string[] （メトリクス名）
 *  - values: number[]  （各値）
 *  - max: number       （最大値・既定100）
 *  - size: number      （描画サイズpx・既定320）
 */
export const RadarChart = ({ labels, values, max = 100, size = 320 }) => {
    const data = {
        labels,
        datasets: [
            {
                data: values,
                borderColor: "rgba(250, 204, 21, 1)",      // 黄ライン（テーマに合わせる）
                backgroundColor: "rgba(250, 204, 21, 0.15)",// 薄い黄フィル
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                min: 0,
                max,
                ticks: { display: false, stepSize: max / 5 },
                grid: { color: "rgba(250, 204, 21, 0.35)" },     // 同心円グリッド
                angleLines: { color: "rgba(250, 204, 21, 0.6)" },// 放射グリッド
                pointLabels: {
                    color: "#FFFFFF",
                    font: { size: 16, weight: "700" },            // ラベルは太め白
                },
            },
        },
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }, // デモではツールチップ無効
        },
        elements: {
            line: { tension: 0.25 }, // ほんの少し曲線
        },
    };

    return (
        <div
            style={{
                width: size,
                height: size,
                margin: "0 auto",
                filter: "drop-shadow(0 10px 24px rgba(0,0,0,0.35))",
            }}
        >
            <Radar data={data} options={options} />
        </div>
    );
}

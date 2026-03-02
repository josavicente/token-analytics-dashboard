import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scalePoint } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { curveMonotoneX } from "d3-shape";

import { formatDateLabel, formatTokenCount } from "../../lib/formatters";

interface LineChartPoint {
  date: string;
  value: number;
}

interface LineChartCardProps {
  title: string;
  description: string;
  points: LineChartPoint[];
  color: string;
  note?: string;
}

function Chart({ points, color }: Pick<LineChartCardProps, "points" | "color">) {
  const chartHeight = 320;

  return (
    <div className="chart-frame">
      <ParentSize>
        {({ width }) => {
          const safeWidth = Math.max(width, 320);
          const margin = { top: 12, right: 20, bottom: 44, left: 72 };
          const safeHeight = chartHeight;
          const innerWidth = safeWidth - margin.left - margin.right;
          const innerHeight = safeHeight - margin.top - margin.bottom;
          const maxValue = Math.max(...points.map((point) => point.value), 1);
          const maxLabels = safeWidth < 520 ? 4 : safeWidth < 860 ? 6 : 8;
          const tickStep = Math.max(1, Math.ceil(points.length / maxLabels));
          const tickValues = points
            .filter((_, index) => index % tickStep === 0)
            .map((point) => point.date);

          if (points.length && tickValues[tickValues.length - 1] !== points[points.length - 1]?.date) {
            tickValues.push(points[points.length - 1].date);
          }

          const xScale = scalePoint<string>({
            domain: points.map((point) => point.date),
            range: [0, innerWidth],
          });

          const yScale = scaleLinear<number>({
            domain: [0, maxValue],
            range: [innerHeight, 0],
            nice: true,
          });

          return (
            <svg width={safeWidth} height={safeHeight}>
              <g transform={`translate(${margin.left}, ${margin.top})`}>
                <GridRows
                  scale={yScale}
                  width={innerWidth}
                  height={innerHeight}
                  stroke="rgba(148, 163, 184, 0.11)"
                />
                <LinePath
                  data={points}
                  x={(point) => xScale(point.date) ?? 0}
                  y={(point) => yScale(point.value)}
                  curve={curveMonotoneX}
                  stroke={color}
                  strokeWidth={8}
                  opacity={0.12}
                  strokeLinecap="round"
                />
                <LinePath
                  data={points}
                  x={(point) => xScale(point.date) ?? 0}
                  y={(point) => yScale(point.value)}
                  curve={curveMonotoneX}
                  stroke={color}
                  strokeWidth={2.5}
                  opacity={0.9}
                  strokeLinecap="round"
                />
                <AxisLeft
                  scale={yScale}
                  stroke="rgba(100, 116, 139, 0.22)"
                  tickStroke="rgba(100, 116, 139, 0.18)"
                  tickLabelProps={() => ({
                    fill: "#7b8497",
                    fontSize: 10,
                    textAnchor: "end",
                    dy: "0.33em",
                    dx: "-0.25em",
                  })}
                  tickFormat={(value) => formatTokenCount(Number(value))}
                />
                <AxisBottom
                  top={innerHeight}
                  scale={xScale}
                  stroke="rgba(100, 116, 139, 0.22)"
                  tickStroke="rgba(100, 116, 139, 0.18)"
                  tickValues={tickValues}
                  tickLabelProps={() => ({
                    fill: "#7b8497",
                    fontSize: 10,
                    textAnchor: "middle",
                  })}
                  tickFormat={(value) => formatDateLabel(String(value))}
                />
              </g>
            </svg>
          );
        }}
      </ParentSize>
    </div>
  );
}

export function LineChartCard({ title, description, points, color, note }: LineChartCardProps) {
  return (
    <section className="chart-card">
      <div className="chart-card-header">
        <div>
          <h2 className="section-title">{title}</h2>
          <p className="section-copy">{description}</p>
        </div>
      </div>
      <Chart points={points} color={color} />
      {note ? <div className="chart-note">{note}</div> : null}
    </section>
  );
}

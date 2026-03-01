import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";

import { formatTokenCount } from "../../lib/formatters";

interface BarDatum {
  label: string;
  value: number;
}

interface BarChartCardProps {
  title: string;
  description: string;
  rows: BarDatum[];
  color: string;
}

function Chart({ rows, color }: Pick<BarChartCardProps, "rows" | "color">) {
  const chartHeight = 320;

  return (
    <div className="chart-frame">
      <ParentSize>
        {({ width }) => {
          const safeWidth = Math.max(width, 320);
          const margin = { top: 12, right: 20, bottom: 32, left: 124 };
          const safeHeight = chartHeight;
          const innerWidth = safeWidth - margin.left - margin.right;
          const innerHeight = safeHeight - margin.top - margin.bottom;
          const maxValue = Math.max(...rows.map((row) => row.value), 1);

          const yScale = scaleBand<string>({
            domain: rows.map((row) => row.label),
            range: [0, innerHeight],
            padding: 0.25,
          });

          const xScale = scaleLinear<number>({
            domain: [0, maxValue],
            range: [0, innerWidth],
            nice: true,
          });

          return (
            <svg width={safeWidth} height={safeHeight}>
              <Group left={margin.left} top={margin.top}>
                {rows.map((row) => {
                  const y = yScale(row.label);
                  const barHeight = yScale.bandwidth();
                  const barWidth = xScale(row.value);

                  return (
                    <g key={row.label}>
                      <rect
                        x={0}
                        y={y}
                        width={barWidth}
                        height={barHeight}
                        rx={10}
                        fill={color}
                        opacity={0.9}
                      />
                    </g>
                  );
                })}
                <AxisLeft
                  scale={yScale}
                  stroke="rgba(100, 116, 139, 0.4)"
                  tickStroke="rgba(100, 116, 139, 0.4)"
                  tickLabelProps={() => ({
                    fill: "#475569",
                    fontSize: 11,
                    textAnchor: "end",
                    dy: "0.33em",
                    dx: "-0.5em",
                  })}
                />
                <AxisBottom
                  top={innerHeight}
                  scale={xScale}
                  stroke="rgba(100, 116, 139, 0.4)"
                  tickStroke="rgba(100, 116, 139, 0.4)"
                  tickLabelProps={() => ({
                    fill: "#64748b",
                    fontSize: 11,
                    textAnchor: "middle",
                  })}
                  tickFormat={(value) => formatTokenCount(Number(value))}
                />
              </Group>
            </svg>
          );
        }}
      </ParentSize>
    </div>
  );
}

export function BarChartCard({ title, description, rows, color }: BarChartCardProps) {
  return (
    <section className="chart-card">
      <div className="chart-card-header">
        <div>
          <h2 className="section-title">{title}</h2>
          <p className="section-copy">{description}</p>
        </div>
      </div>
      <Chart rows={rows} color={color} />
    </section>
  );
}

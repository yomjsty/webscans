"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "./ui/badge";

interface DonutChartProps {
    novel: number;
    comic: number;
    category: string;
}

export default function DonutChart({
    novel,
    comic,
    category,
}: DonutChartProps) {
    const chartData = [
        { name: "Novels", count: novel, fill: "hsl(var(--chart-1))" },
        { name: "Comics", count: comic, fill: "hsl(var(--chart-2))" },
    ];

    const totalSeries = novel + comic;

    const chartConfig: ChartConfig = {
        novels: {
            label: "Novels",
            color: "hsl(var(--chart-1))",
        },
        comics: {
            label: "Comics",
            color: "hsl(var(--chart-2))",
        },
    };

    return (
        <Card className="flex flex-col border-none shadow-none mx-auto w-full">
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="name"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        "cx" in viewBox &&
                                        "cy" in viewBox
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalSeries}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Total {category}
                                                </tspan>
                                            </text>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <Badge className="flex items-center bg-chart-1 hover:bg-chart-1/80">
                    Novel
                </Badge>
                <Badge className="flex items-center bg-chart-2 hover:bg-chart-2/80">
                    Comic
                </Badge>
            </CardFooter>
        </Card>
    );
}

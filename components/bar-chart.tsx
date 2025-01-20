"use client";

import * as React from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { getTransactionCount } from "@/actions/getTransactionCount";

export default function BarChartLabel() {
    const [chartData, setChartData] = React.useState<
        { date: string; totalPrice: number }[]
    >([]);

    React.useEffect(() => {
        async function fetchData() {
            const data = await getTransactionCount();
            setChartData(data);
        }
        fetchData();
    }, []);

    const totalRevenue = chartData.reduce(
        (sum, item) => sum + item.totalPrice,
        0
    );

    const chartConfig: ChartConfig = {
        coins: {
            label: "Total Revenue",
            color: "hsl(var(--chart-3))",
        },
    };

    return (
        <Card className="flex flex-col border-none shadow-none w-full py-6">
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <BarChart data={chartData} margin={{ top: 20 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} />
                        <YAxis />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="totalPrice"
                            fill="var(--color-desktop)"
                            radius={8}
                        >
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <Badge className="flex items-center bg-chart-3 hover:bg-chart-3/80">
                    Total Revenue: Rp. {totalRevenue.toLocaleString("id-ID")}
                </Badge>
            </CardFooter>
        </Card>
    );
}

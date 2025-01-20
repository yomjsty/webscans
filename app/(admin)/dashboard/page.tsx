import DonutChart from "@/components/donut-chart";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Book, DollarSign, Users } from "lucide-react";
import { getSeriesCount } from "@/actions/getSeriesCount";
import { getChapterCount } from "@/actions/getChapterCount";
import BarChartLabel from "@/components/bar-chart";
import { getTransactionCount } from "@/actions/getTransactionCount";
import db from "@/lib/db";

export default async function DashboardPage() {
    const { totalSeries, novelSeries, comicSeries } = await getSeriesCount();
    const { totalChapter, novelChapter, comicChapter } =
        await getChapterCount();
    const transactions = await getTransactionCount();
    const totalPrice = transactions.reduce(
        (sum, transaction) => sum + transaction.totalPrice,
        0
    );
    const allUser = await db.user.findMany();

    return (
        <div className="space-y-4">
            <div className="">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-gray-600">Welcome to the dashboard.</p>
            </div>
            <div className="">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Series
                            </CardTitle>
                            <Book className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="">
                                <div className="text-2xl font-bold">
                                    {totalSeries}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="">
                            <DonutChart
                                novel={novelSeries}
                                comic={comicSeries}
                                category="Series"
                            />
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Chapter
                            </CardTitle>
                            <Book className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalChapter}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <DonutChart
                                novel={novelChapter}
                                comic={comicChapter}
                                category="Chapter"
                            />
                        </CardFooter>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalPrice.toLocaleString("id-ID")} Rupiah
                            </div>
                        </CardContent>
                        <CardFooter>
                            <BarChartLabel />
                        </CardFooter>
                    </Card>
                    <div className="">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Users
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {allUser.length}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

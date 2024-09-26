// Chart 1: total income in a period
var data_chart1 = []
$('.data-chart1').each((index, element) => {
    var date = new Date($(element).data('date'))
    data_chart1.push({
        x: date.getHours(),
        y: $(element).data('total'),
    })
})

if ($("#layout1-chart-1").length) {
    var options = {
        chart: {
            height: 350,
            type: 'bar',
        },
        series: [{
            data: data_chart1
        }],
        xaxis: {
            categories: () => {
                var data = []
                data_chart1.map(value => {
                    data.push(value.x)
                })
            },
            position: 'bottom',
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            crosshairs: {
                fill: {
                    type: 'gradient',
                    gradient: {
                        colorFrom: '#D8E3F0',
                        colorTo: '#BED1E6',
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    }
                }
            },
            tooltip: {
                enabled: true,
            }
        },
        tooltip: {
            x: {
                format: 'HH/mm'
            }
        },
        stroke: {
            width: 5,
            curve: 'smooth'
        },
    }
    var chart = new ApexCharts(document.querySelector("#layout1-chart-1"), options)
    chart.render()
}


// Chart 2: Revenue and cost
var data_chart2 = {
    date: [],
    revenue: [],
    cost: []
}

$('.data-chart2').each((index, element) => {
    var date = new Date($(element).data('date')).getHours()
    if (data_chart2.date.includes(date)) {
        const index = data_chart2.date.indexOf(date)
        data_chart2.revenue[index] += $(element).data('revenue')
        data_chart2.cost[index] += $(element).data('cost')
    }
    else {
        data_chart2.date.push(date)
        data_chart2.revenue.push($(element).data('revenue'))
        data_chart2.cost.push($(element).data('cost'))
    }
})

if (jQuery('#layout1-chart-2').length) {
    var options = {
        series: [{
            name: "Revenue",
            data: data_chart2.revenue
        },
        {
            name: "Cost",
            data: data_chart2.cost
        }],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: [5, 7, 5],
            curve: 'straight',
            dashArray: [0, 8, 5]
        },
        title: {
            text: 'Page Statistics',
            align: 'left'
        },
        legend: {
            tooltipHoverFormatter: function (val, opts) {
                return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
            }
        },
        markers: {
            size: 0,
            hover: {
                sizeOffset: 6
            }
        },
        xaxis: {
            categories: data_chart2.date
        },
        tooltip: {
            y: [
                {
                    title: {
                        formatter: function (val) {
                            return val + " (mins)"
                        }
                    }
                },
                {
                    title: {
                        formatter: function (val) {
                            return val + " per session"
                        }
                    }
                },
                {
                    title: {
                        formatter: function (val) {
                            return val;
                        }
                    }
                }
            ]
        },
        grid: {
            borderColor: '#f1f1f1',
        }
    };

    var chart = new ApexCharts(document.querySelector("#layout1-chart-2"), options);
    chart.render();
}

var data_chart3 = {
    productname: [],
    salerate: [],
    income: [],
    nosale: []
}

$('.data-chart3').each((index, element) => {
    data_chart3.productname.push($(element).data('productname'))
    data_chart3.salerate.push($(element).data('salerate'))
    data_chart3.income.push($(element).data('income'))
    data_chart3.nosale.push($(element).data('nosale'))
})

// Chart 3: Monthly sale
if (jQuery("#report-chart3").length) {
    var options = {
        series: [{
            name: 'Income',
            type: 'column',
            data: data_chart3.income,
            yaxisIndex: 0
        }, {
            name: 'No.Sale',
            type: 'column',
            data: data_chart3.nosale,
            yaxisIndex: 0
        }, {
            name: 'Sale rate',
            type: 'line',
            data: data_chart3.salerate,
            yaxisIndex: 1
        }],
        chart: {
            height: 350,
            type: 'line',
            stacked: false,
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: [1, 1, 4]
        },
        title: {
            text: 'Compare the sale rate between brands',
            align: 'left',
            offsetX: 110
        },
        xaxis: {
            categories: data_chart3.productname,
        },
        yaxis: [
            {
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                    color: '#008FFB'
                },
                labels: {
                    style: {
                        colors: '#008FFB',
                    }
                },
                title: {
                    text: "Income from saling product",
                    style: {
                        color: '#008FFB',
                    }
                },
                tooltip: {
                    enabled: true
                }
            },
            {
                seriesName: 'Import',
                opposite: true,
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                    color: '#00E396'
                },
                labels: {
                    style: {
                        colors: '#00E396',
                    }
                },
                title: {
                    text: "Number of export",
                    style: {
                        color: '#00E396',
                    }
                },
            },
            {
                seriesName: 'Sale rate',
                opposite: true,
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                    color: '#FEB019'
                },
                labels: {
                    style: {
                        colors: '#FEB019',
                    },
                },
                title: {
                    text: "Sale rate",
                    style: {
                        color: '#FEB019',
                    }
                }
            },
        ],
        tooltip: {
            fixed: {
                enabled: true,
                position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
                offsetY: 30,
                offsetX: 60
            },
        },
        legend: {
            horizontalAlign: 'left',
            offsetX: 40
        }
    };

    var chart = new ApexCharts(document.querySelector("#report-chart3"), options);
    chart.render();
}

let myDoughnutChart = $("#migrafico1")[0].getContext('2d');
let myChart2 = $("#migrafico2")[0].getContext('2d');
let labels2 = [];
let data2 = [];
let colors2 = [];

let chart1 = new Chart(myDoughnutChart, {
    type: 'doughnut',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: []
        }]
    },
    options: {
        title: {
            text: "Consumo por Equipos",
            display: false
        },
    }
});

let chart2 = new Chart(myChart2, {
    type: 'bar',
    data: {
        labels: labels2,
        datasets: [{
            data: data2,
            backgroundColor: colors2
        }]
    },
    options: {
        title: {
            text: " ",
            display: false
        },
        legend: {
            display: false,
            labels: {
                fontColor: 'white'
            },
        },

        scales: {
            yAxes: [{
                ticks: {

                    beginAtZero: true,

                },
            }],
        },
    },
});

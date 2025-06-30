const xValues = ["Crime", "Criminals", "Masked Entrance", "Powers", "Threats"];
  const yValues = [42, 40, 48, 45, 37];
  const barColors = ["white", "purple", "red", "orange", "black"];
  const fontColors = ["white"];

  new Chart("myChart", {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [{
        backgroundColor: barColors,
        data: yValues,
        fontColor: fontColors
      }]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: "Unmasking the Hero",
        fontColor: fontColors
      },
    scales: {
    xAxes: [{
      ticks: {
        fontColor: "white" // ⬅ x-axis values
      },
      gridLines: {
        color: "rgba(255,255,255,0.1)" // optional: subtle grid lines
      }
    }],
    yAxes: [{
      ticks: {
        fontColor: "white" // ⬅ y-axis values
      },
      gridLines: {
        color: "rgba(255,255,255,0.1)"
      }
    }]
  }
}
});
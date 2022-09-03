const personagensContador = document.getElementById('personagens')
const luasContador = document.getElementById('luas')
const planetasContador = document.getElementById('planetas')
const navesContador = document.getElementById('naves')
const table = document.getElementById('filmsTable')

function preencherContador(){
  Promise.all([
    swapiGet('people/'),
    swapiGet('vehicles/'),
    swapiGet('planets/'),
    swapiGet('starships/'),
  ])
  .then(
    function(results){
      personagensContador.innerHTML = results[0].data.count
      luasContador.innerHTML = results[1].data.count
      planetasContador.innerHTML = results[2].data.count
      navesContador.innerHTML = results[3].data.count
    }
  )
}

function swapiGet(param){
  return axios.get(`https://swapi.dev/api/${param}`)
}

async function preencherTabela(){
  const response = await swapiGet('films/')
  const tableData = response.data.results

  tableData.forEach(film => {
    table.insertAdjacentHTML('afterbegin',
      `<tr>
        <td>${film.title}</td>
        <td>${film.release_date.split('-').reverse().join('/')}</td>
        <td>${film.director}</td>
        <td>${film.episode_id}</td>
      </tr>`
      )
  });
} 

google.charts.load('current', { 'packages': ['corechart'] });
google.charts.setOnLoadCallback(desenharGrafico);

async function desenharGrafico() {
  const response = await swapiGet('vehicles/')
  const vehiclesArray = response.data.results

  const dataArray = []
  dataArray.push(['Veículos', 'Passageiros'])

  vehiclesArray.forEach((vehicle) => {
    dataArray.push([vehicle.name, Number(vehicle.passengers)])
  })

  var data = google.visualization.arrayToDataTable(dataArray);

  var options = {
    title: 'Estáticas',
    legend: 'none'
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
}

preencherTabela()

preencherContador()

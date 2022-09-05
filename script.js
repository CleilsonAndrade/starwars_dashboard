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
      personagensContador.innerHTML = results[0].count
      luasContador.innerHTML = results[1].count
      planetasContador.innerHTML = results[2].count
      navesContador.innerHTML = results[3].count
    }
  )
}

 const swapiGet = async (param) => {
  const response = await fetch(`https://swapi.dev/api/${param}`)
  if(response.status === 200){
    const data = await response.json()
    return data
  }
}

async function preencherTabela(){
  const data = await swapiGet('films/')
  const tableData = data.results

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
  const response = await swapiGet('planets/')
  const planetsArray = response.results

  const dataArray = []
  dataArray.push(['Veículos', 'Passageiros'])

  planetsArray.forEach((planet) => {
    dataArray.push([planet.name, Number(planet.diameter)])
  })

  var data = google.visualization.arrayToDataTable(dataArray);

  var options = {
    title: 'Tamanho dos planetas',
    legend: 'none'
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
}

preencherTabela()
preencherContador()

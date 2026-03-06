function addRow() {

    let table = document.querySelector("#taskTable tbody")

    let row = document.createElement("tr")

    row.innerHTML = `
<td><input></td>
<td><input></td>
<td><input></td>
`

    table.appendChild(row)

}

function getTasks() {

    let rows = document.querySelectorAll("#taskTable tbody tr")

    let tasks = {}

    rows.forEach(r => {

        let name = r.cells[0].children[0].value.trim()
        let time = parseInt(r.cells[1].children[0].value)
        let pred = r.cells[2].children[0].value
            .split(",")
            .map(p => p.trim())
            .filter(p => p)

        tasks[name] = {
            time: time,
            pred: pred,
            succ: []
        }

    })

    for (let t in tasks) {

        tasks[t].pred.forEach(p => {
            if (tasks[p]) tasks[p].succ.push(t)
        })

    }

    return tasks

}

function positionalWeight(tasks, task) {

    let weight = tasks[task].time

    tasks[task].succ.forEach(s => {
        weight += positionalWeight(tasks, s)
    })

    return weight

}

function calculate() {

    let tasks = getTasks()

    let cycle = parseInt(document.getElementById("cycleTime").value)

    let weights = {}

    for (let t in tasks) {

        weights[t] = positionalWeight(tasks, t)

    }

    let sorted = Object.keys(weights).sort((a, b) => weights[b] - weights[a])

    let assigned = new Set()

    let stations = []
    let current = []
    let time = 0

    while (assigned.size < sorted.length) {

        for (let t of sorted) {

            if (assigned.has(t)) continue

            let ready = tasks[t].pred.every(p => assigned.has(p))

            if (!ready) continue

            if (time + tasks[t].time <= cycle) {

                current.push(t)
                time += tasks[t].time
                assigned.add(t)

            }

        }

        stations.push({ tasks: [...current], time: time })

        current = []
        time = 0

    }

    showResults(tasks, weights, stations, cycle)

    drawStations(stations)

}

function showResults(tasks, weights, stations, cycle) {

    let total = 0

    for (let t in tasks) total += tasks[t].time

    let efficiency = (total / (stations.length * cycle)) * 100

    let html = "<b>Positional Weight</b><br>"

    for (let t in weights) {

        html += `${t}: ${weights[t]}<br>`

    }

    html += `<br><b>Stations:</b> ${stations.length}`
    html += `<br><b>Efficiency:</b> ${efficiency.toFixed(2)}%`

    document.getElementById("results").innerHTML = html

}

function drawStations(stations) {

    let opc = document.getElementById("opc")

    opc.innerHTML = ""

    stations.forEach((s, i) => {

        let station = document.createElement("div")
        station.className = "station"

        let title = document.createElement("div")
        title.className = "station-title"
        title.innerText = "Station " + (i + 1)

        station.appendChild(title)

        s.tasks.forEach(t => {

            let task = document.createElement("div")
            task.className = "task"
            task.innerText = t

            station.appendChild(task)

        })

        opc.appendChild(station)

    })

}
var consumoTotaldeEquipos = 0;
var precioTotal = 0;
const suma = "suma";
const resta = "resta";
var cantidadDeDiasDelMes = 31;
var version = 0.6;

class Equipos {
    constructor() {
        this.equipos = []
    }
    nuevoEquipo(nombre, consumo, id, uso, cantidad, imagen) {
        let p = new Equipo(nombre, consumo, id, uso, cantidad, imagen)
        this.equipos.push(p)
        return p
    }
    borrarEquipos() {
        delete this

    }

}

class Equipo {
    constructor(tipo, consumo, id, uso, cantidad, imagen) {
        this.id = id
        this.tipo = tipo
        this.consumo = parseFloat(consumo)
        this.cantidad = cantidad
        this.consumoTotalKW = parseInt(cantidad) * parseFloat(consumo) * parseInt(uso)
        this.uso = parseInt(uso)
        this.imagen = imagen;
        this.guardarDatosLocal();
    }

    guardarDatosLocal() {
        localStorage.setItem(this.id, JSON.stringify(this));
    };


    SumarORestarHoras(valorUsoHoras) {
        this.uso = valorUsoHoras;
        if (this.cantidad > 0) {
            mostrarConsumoTotalEquipo(this);
        }
        mostrarSumarORestarHoras(this);
        this.actualizarGraficos()
    }


    sumarORestarCantidad(signo) {
        if (signo == "suma") {
            this.cantidad++
        } else {
            if (this.cantidad > 0) {
                this.cantidad--
            }
        }
        $(`#${this.tipo}cantidad`).text(`Cantidad:${this.cantidad}`)
        mostrarConsumoTotalEquipo(this);
        this.actualizarGraficos()
    }

    get calcularConsumoTotal() {
        let consumoTotal = 0
        for (const p in equiposTodos.equipos) {
            consumoTotal = consumoTotal + parseFloat(equiposTodos.equipos[p].consumoTotalKW)
        }
        consumoTotal = cantidadDeDiasDelMes * consumoTotal
        return consumoTotal
    }

    calcularPrecio(consumoPorCalculoTotal) {

        let consumoTotal;
        if (consumoPorCalculoTotal === null) {
            consumoTotal = this.calcularConsumoTotal;
        }
        else {
            consumoTotal = consumoPorCalculoTotal;
        }
        let i;
        let tarifaId = 0;
        let precioTotal = 0;

        for (i = 0; i < tarifasFija.length; i++) {
            if (consumoTotal < tarifasFija[i].max) {
                tarifaId = i;
                i = tarifasFija.length;
            }
        }
        precioTotal = consumoTotal * parseInt(tarifasFija[tarifaId].CostoKW) + parseInt(tarifasFija[tarifaId].TarifaCosto);
        mostrarResultados(consumoTotal, precioTotal, tarifaId);
    }

    actualizarGraficos() {
        chart1.data.datasets[0].data[this.id] = parseInt(this.cantidad);
        chart1.data.labels[this.id] = this.tipo;
        let colorRandom = generarColoresRandom();
        chart1.data.datasets[0].backgroundColor[this.id] = colorRandom;
        labels2[this.id] = this.tipo;
        data2[this.id] = parseFloat(this.consumoTotalKW);
        colors2[this.id] = colorRandom;
        chart1.update();
        chart2.update();
    }
}


if ((verificarJSON(tarifasEdenor)) && (verificarJSON(equiposDatosJSON))) {
    var tarifasFija = JSON.parse(tarifasEdenor);
    var equiposDatos = JSON.parse(equiposDatosJSON);
    console.log("json ok");
    verificarVersion();
    crearCodigoHtml();
    var equiposTodos = new Equipos();
    generarEquipos();
    equiposTodos.equipos[0].calcularPrecio(null);
} else {
    $('#equiposId').append(`<h2 class="errorDeJson" >Error en la carga de los archivos</h2>`);
    $('#navbarSupportedContent').hide();
    $('#cambiar').hide();
}

function cambiarProveedor(proveedor) {
    if (proveedor == 'Edenor') {
        $('#labelproveedor').empty();
        $('#labelproveedor').append("Edenor");
        tarifasFija = JSON.parse(tarifasEdesur);
        localStorage.setItem('proveedor', 'Edesur');
        $('.subtitulo').text("Edesur");
    } else {
        $('#labelproveedor').empty();
        $('#labelproveedor').append("Edesur");
        tarifasFija = JSON.parse(tarifasEdenor);
        localStorage.setItem('proveedor', 'Edenor');
        $('.subtitulo').text("Edenor");
    }
    let valorConsumo = $('#textConsumo').val();

    if ((isNaN(valorConsumo)) || (valorConsumo == "")) {
        
        equiposTodos.equipos[0].calcularPrecio(null);
    }
    else {
        equiposTodos.equipos[0].calcularPrecio(parseFloat(valorConsumo));
    };
}

function mostrarResultados(consumoT, precioT, id) {
    let iva = 0.21;
    let municipal = 0.063830;
    let totalConImpuestos;
    $(`#consumototal`).text(`Consumo Total: ${consumoT.toFixed(2)}KW`);
    $(`#preciosubtotal`).text(`Subtotal: $${precioT.toFixed(2)}`);
    totalConImpuestos = precioT + (precioT * iva) + (precioT * municipal);
    $(`#preciototal`).text(`Total: $${totalConImpuestos.toFixed(2)}`);
    $(`#precioporKW`).text(`Precio KW: $${parseFloat(tarifasFija[id].CostoKW)}`);
    $(`#tarifa`).text(`Tarifa Mensual : $${parseFloat(tarifasFija[id].TarifaCosto)}`);

}



function mostrarConsumoTotalEquipo(objeto) {
    objeto.consumoTotalKW = objeto.cantidad * objeto.consumo * objeto.uso
    objeto.consumoTotalKW = objeto.consumoTotalKW.toFixed(2)
    $(`#${objeto.id}ConsumoParcial`).text(`Consumo Parcial:${objeto.consumoTotalKW}KW`);
    equiposTodos.equipos[parseInt(objeto.id)].guardarDatosLocal();
    equiposTodos.equipos[parseInt(objeto.id)].calcularPrecio(null);
}

function mostrarSumarORestarHoras(objeto) {
    $(`#${objeto.tipo}horasTexto`).text(`Uso diario promedio: ${objeto.uso}`);
    $(`#${objeto.tipo}cantidad`).text(`Cantidad:${objeto.cantidad}`);
    $(`#${objeto.id}ConsumoParcial`).text(`Consumo Parcial:${objeto.consumoTotalKW}KW`);
    $(`#${objeto.tipo}horasTexto`).text(`Uso diario promedio: ${objeto.uso}`);
    $(`#${objeto.tipo}horas`).val(parseInt(objeto.uso));
}

function recalcularPrecio() {
    let valorConsumo = parseFloat($('#textConsumo').val());
    $('.alert').fadeOut(1000);
    if ((isNaN(valorConsumo)) || (valorConsumo == "")) {
        $('.alert').fadeIn(function () {
            $('.alert').fadeOut(2000).delay(2000);
            $('#textConsumo').val("");
        });
    } else {
        reiniciar();
        equiposTodos.equipos[0].calcularPrecio(parseFloat(valorConsumo));
        $('#textConsumo').val(valorConsumo);
    }
}

function reiniciar() {
    let ValorFirstTime = localStorage.getItem('modo');
    let tipoCalcSim = localStorage.getItem('tipo');
    let proveedor = localStorage.getItem('proveedor');
    localStorage.clear();
    $('#textConsumo').val("");
    equiposTodos = null;
    equiposTodos = new Equipos();
    generarEquipos();
    localStorage.setItem('modo', ValorFirstTime);
    localStorage.setItem('tipo', tipoCalcSim);
    localStorage.setItem('proveedor', proveedor);
}

function generarColoresRandom() {
    return "#" + ("00000" + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)).slice(-6);
}

function cambiarcoloresgrafico() {
    let colorRandom = generarColoresRandom();
    let p;
    let i = equiposTodos.equipos.length;
    for (p = 0; p < i; p++) {
        colorRandom = generarColoresRandom();
        chart1.data.datasets[0].backgroundColor[p] = colorRandom;
        colors2[p] = colorRandom;
    }
    chart1.update();
    chart2.update();
}

function crearCodigoHtml() {
    equiposDatos.map(datos => {
        crearEquiposEnHtml(datos);
    });
}

function crearEquiposEnHtml(datos) {
    const equipmentDataHtml = `<div class="col-12 col-md-3 col-lg-2 col-sm-4 align-items-start equiposHtml">
                                     <div id="equiposDatos">
                                        <img class="imagenSvg equiposHtml" src="${datos.imagen}" alt="${datos.tipo}">
                                        <h4>${datos.tipo}</h4>
                                        <p>Consumo ${datos.consumo} KW</p>
                                        <h5 id="${datos.id}ConsumoParcial" >Consumo ParcialKW</h5>
                                        <label for="${datos.tipo}horas" id="${datos.tipo}horasTexto"class="form-label ">Uso diario promedio: ${datos.uso} </label>
                                        <input type="range" class="form-range rangoFormHtml" id="${datos.tipo}horas" min="0" max="24" value="${datos.uso}" onchange="equiposTodos.equipos[${datos.id}].SumarORestarHoras(this.value)"" >
                                        <h5 id="${datos.tipo}cantidad">Cantidad</h5>
                                        <div class="botones"> 
                                            <button type="button"  id ="${datos.id}sumar" class="btn btn-primary  px-4 me-md-2 fw-bold" onclick="equiposTodos.equipos[${datos.id}].sumarORestarCantidad(${suma})" >+</button>
                                            <button type="button" id ="${datos.id}restar" class="btn btn-outline-secondary  px-4" onclick="equiposTodos.equipos[${datos.id}].sumarORestarCantidad(${resta})">-</button>
                                        </div>
                                      </div>
                                </div>`;
    $('#equiposId').append(equipmentDataHtml);
}

function verificarPrimerIgreso() {
    let ValorFirstTime = localStorage.getItem('firstTime');
    if ((ValorFirstTime != null) && (ValorFirstTime = 'no')) {
        return true;
    } else {
        return false;
    }
}

function verificarVersion() {
    let ValorVersion = localStorage.getItem('version');
    if ((ValorVersion == version)) {
        return true;
    } else {
        localStorage.removeItem("firstTime");
        localStorage.setItem("version", version);
        return false;
    }
}

function generarEquipos() {
    if (verificarPrimerIgreso()) {
        generarEquiposDesdeLocalStorage();
    }
    else {
        generarEquiposDesdeJson();
    }
}

function generarEquiposDesdeLocalStorage() {
    let i = 0;
    let valorLocalStorage;
    do {
        valorLocalStorage = JSON.parse(localStorage.getItem(i));
        equiposTodos.nuevoEquipo(valorLocalStorage.tipo, valorLocalStorage.consumo, valorLocalStorage.id, valorLocalStorage.uso, valorLocalStorage.cantidad, valorLocalStorage.imagen);
        equiposTodos.equipos[i].SumarORestarHoras(valorLocalStorage.uso);
        i++;
    } while (localStorage.getItem(i));
    $('#labelproveedor').empty();
    let proveedor = localStorage.getItem('proveedor');
    if (proveedor == 'Edenor') {
        cambiarProveedor("Edesur");
    }
    else {
        cambiarProveedor("Edenor");
    }
    $('.subtitulo').text(proveedor);

}

function generarEquiposDesdeJson() {
    $('#equiposId').empty();
    for (const p in equiposDatos) {
        equiposTodos.nuevoEquipo(equiposDatos[p].tipo, equiposDatos[p].consumo, p, equiposDatos[p].uso, equiposDatos[p].cantidad, equiposDatos[p].imagen);
        crearEquiposEnHtml(equiposDatos[p]);
        equiposTodos.equipos[p].SumarORestarHoras(equiposDatos[p].uso);
    }
    localStorage.setItem("firstTime", "no");
    localStorage.setItem('proveedor', 'Edenor');
}

function verificarJSON(json) {
    var chequearjson
    try {
        chequearjson = JSON.parse(json)
    } catch (e) {
        chequearjson = null;
    }
    return chequearjson
}
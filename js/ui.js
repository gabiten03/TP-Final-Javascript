agregarElementoaListadeResultados("consumototal", "Consumo Total:0.00KW",4);
agregarElementoaListadeResultados("preciosubtotal", "SubTotal: $00.00"),5;
agregarElementoaListadeResultados("preciototal", "Total: $00.00",4);
agregarElementoaListadeResultados("precioporKW", "Precio KW: $0.00",6);
agregarElementoaListadeResultados("tarifa", "Precio KW: $0.00",6);

modoGUI();
let modoCalculo ;
valorProveedorLocalStorage();
tipoCalculo();


$('#modoWeb').click((e) => {
    let p = localStorage.getItem('modo');
    switch (p) {
        case "dark":
            cambiarModo("claro");
            localStorage.setItem("modo", "light");
            break;
        case "light":
            cambiarModo("oscuro");
            localStorage.setItem("modo", "dark");
            break;
        default:
            cambiarModo("oscuro");
            localStorage.setItem("modo", "dark");
            break;
    }
});



$('#clearStorage').click((e) => {
    reiniciar()
});


$('#btnId').click((e) => {
    e.preventDefault();
    recalcularPrecio();

})

$('#modoproveedor').click((e) => {
    let proveedor = localStorage.getItem('proveedor');
    cambiarProveedor(proveedor);
})

$('#modocalculo').click((e) => {
    cambiarCalculo();
})

$('#cambiargrafico').click((e) => {
    $("#electrosId").hide();
    $("#diagramaId").fadeIn(1000);
    $("#cambiarcoloresgrafico").show();
})

$('#cambiarelectros').click((e) => {
    $("#diagramaId").hide();
    $("#cambiarcoloresgrafico").hide();
    $("#electrosId").fadeIn(1000);
})

$('#cambiarcoloresgrafico').click((e) => {
    e.preventDefault();
    cambiarcoloresgrafico();
})


function cambiarCalculo() {   
    if (modoCalculo == "Total") {
        modoCalculo = "Equipos";
        localStorage.setItem ('tipo','simulador');
        cambiarGUICalculador();       
    } else {
        modoCalculo = "Total";
        localStorage.setItem ('tipo','calculador');
        cambiarGUISimulador();
    }

}
function cambiarGUISimulador(){
    $('#labelcalculo').empty();
    $('#labelcalculo').append("Calculador");
    $('#resultadosNav').show();
    $('#cambiarelectros').show();
    $('#cambiargrafico').show();
    $('#electrosId').show();
    $('#electrosformId').hide();
    $('#formId').hide();
    $('h2.titulo').text ("Simulador de Gastos Electricidad");
    $('#textConsumo').val("");

}
function cambiarGUICalculador() {

    $('#labelcalculo').empty();
    $('#labelcalculo').append("Simulador");
    $('#cambiarelectros').hide();
    $('#cambiargrafico').hide();
    $('#electrosId').hide();
    $('#electrosformId').show();
    $('#formId').show();
    $('#diagramaId').hide();
    $('h2.titulo').text ("Calculador de Gastos Electricidad");
    
}

function valorProveedorLocalStorage(){

    let p = localStorage.getItem ('proveedor');
    switch (p){

        case 'Edenor':
        
        break;

        case 'Edesur':
            $('#modoproveedor').prop ('checked', true);
            $('.subtitulo').text (p);
           
        break;

        default :
        break;
    }
}

function cambiarModo(valor) {
    let textoColor;
    if (valor == "oscuro") {
        textoColor = "text-white";
        $("#cuerpo").addClass("px-4 text-center").removeClass("bg-dark text-white");
        $('#navegador').addClass("navbar-light ").removeClass("navbar-dark bg-dark");
        $('h1').addClass("display-5 fw-bold ").removeClass("text-white");
        $('#cambiargrafico').addClass("text-white ").removeClass("text-dark");
        $('#cambiarelectros').addClass("text-white ").removeClass("text-dark");
        $('#labelmodo').empty();
        $('#labelmodo').append("Modo Oscuro");
        $('.form-control').css({ 'background-color': '' });
        chart1.options.legend.labels.fontColor = 'black';
        chart2.options.legend.labels.fontColor = 'black';
        /* chart2.options.scales.xAxes[0].ticks.fontColor = "black"; */
        /*   chart2.options.scales.yAxes[0].ticks.fontColor = "black"; */
        chart1.update();
        chart2.update();
        
    }
    else {
        textoColor = "text-dark";
        $('#cambiargrafico').addClass("text-dark ").removeClass("text-white");
        $('#cambiarelectros').addClass("text-dark ").removeClass("text-white");
        $("#cuerpo").addClass("bg-dark text-white");
        $('navegador').addClass(" navbar-dark bg-dark").removeClass(" navbar-light ");
        $('h1').addClass("display-5 fw-bold text-white");
        $('#labelmodo').empty();
        $('#labelmodo').append("Modo Claro");
        $('.form-control').css("background-color", "#212529 !important");
        chart1.options.legend.labels.fontColor = 'white';
        chart2.options.legend.labels.fontColor = 'white';
        /* chart2.options.scales.xAxes[0].ticks.fontColor = "white"; */
        /* chart2.options.scales.yAxes[0].ticks.fontColor = "white"; */
        chart1.update();
        chart2.update();
        
    }

    $('a').addClass(`""${textoColor}""`);
    $('#tarifa').addClass(`""${textoColor}""`);
    $('#consumototal').addClass(`""${textoColor}""`);
    $('#preciototal').addClass(`""${textoColor}""`);
    $('#precioporKW').addClass(`""${textoColor}""`);
}

function agregarElementoaListadeResultados(elemento, texto, tipo) {
    $('#resultadosNav').append(`<li class="nav-item "><h${tipo} id="${elemento}" class="">${texto}</h${tipo}></li>`);
}

function tipoCalculo(){
    let p = localStorage.getItem('tipo');
    switch (p) {
        case "calculador":
            modoCalculo = "Equipos";
            
            break;
        case "simulador":
            modoCalculo = "Total"; 
            $('#modocalculo').prop('checked',true)  ;       
            break;
        default:
            modoCalculo = "Equipos";
            break;
    }
   
    cambiarCalculo();
}

function modoGUI() {
    let modoUI = localStorage.getItem("modo");
    switch (modoUI) {
        case "dark":
            cambiarModo("oscuro");
            $('#modoWeb').prop('checked',true)  ;    

            break;
        case "light":
            cambiarModo("claro");
             
            break;
        default:
            cambiarModo("claro");
            break;
    }
}
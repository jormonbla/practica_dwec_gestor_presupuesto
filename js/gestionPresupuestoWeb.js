import * as gestionPresupuesto from './gestionPresupuesto.js';
'use strict';
function mostrarDatoEnId(idElemento,valor){
    let elemento=document.getElementById(idElemento);
    elemento.innerHTML += valor;
}
function mostrarGastoWeb(idElemento, gasto){
    let elemento=document.getElementById(idElemento);

    let divClase=document.createElement('div');
    divClase.className='gasto';
    elemento.append(divClase);

    let divDescripcion=document.createElement('div');
    divDescripcion.className='gasto-descripcion';
    divDescripcion.textContent=gasto.descripcion;
    divClase.append(divDescripcion);

    let divFecha=document.createElement('div');
    divFecha.className='gasto-fecha';
    divFecha.textContent=gasto.fecha;
    divClase.append(divFecha);

    let divValor=document.createElement('div');
    divValor.className='gasto-valor';
    divValor.textContent=gasto.valor;
    divClase.append(divValor);

    let divEtiquetas=document.createElement('div');
    divEtiquetas.className='gasto-etiquetas';
    for(let etiqueta of gasto.etiquetas){
        let spanEtiqueta=document.createElement('span');
        spanEtiqueta.className='gasto-etiquetas-etiqueta';
        spanEtiqueta.textContent=etiqueta;
        divEtiquetas.append(spanEtiqueta);

        let borrarEtiquetas= new BorrarEtiquetasHandle();
        borrarEtiquetas.gasto=gasto;
        borrarEtiquetas.etiquetas=etiqueta;
        spanEtiqueta.addEventListener('click',borrarEtiquetas);
    }
    divClase.append(divEtiquetas);

    //Boton editar
    let botonEditar=document.createElement('button');
    botonEditar.type='button';
    botonEditar.className='gasto-editar';
    botonEditar.textContent='Editar';
    let editar=new EditarHandle(gasto);
    editar.gasto=gasto;
    botonEditar.addEventListener('click',editar);
    divClase.append(botonEditar);
    //Boton borrar
    let botonBorrar=document.createElement('button');
    botonBorrar.type='button';
    botonBorrar.className='gasto-borrar';
    botonBorrar.textContent='Borrar';
    let borrar=new BorrarHandle(gasto);
    borrar.gasto=gasto;
    botonBorrar.addEventListener('click',borrar);
    divClase.append(botonBorrar);
}
function mostrarGastosAgrupadosWeb(idElemento,agrup,periodo){
    let grupo = document.getElementById(idElemento);
    grupo.innerHTML='';
    let divAgrupado=`<div class="agrupacion"> 
                    <h1>Gastos agrupados por ${periodo}</h1>`;
    for(let agrupacion in agrup){
        divAgrupado+=`<div class="agrupacion-dato">
                        <span class="agrupacion-dato-clave">${agrupacion}</span>
                        <span class="agrupacion-dato-valor>${agrup[agrupacion]}</span>
                        </div>`;
    }
    divAgrupado+='/<div>';
    grupo.innerHTML=divAgrupado;
}
function repintar(){
    document.getElementById('presupuesto');
    mostrarDatoEnId('presupuesto',gestionPresupuesto.mostrarPresupuesto());

    document.getElementById('gastos-totales');
    mostrarDatoEnId('gastos-totales',gestionPresupuesto.calcularTotalGastos());

    document.getElementById('balance-total');
    mostrarDatoEnId('balance-total',gestionPresupuesto.calcularBalance());

    document.getElementById('listado-gastos-completo').innerHTML='';
    for(let listaCompleta of gestionPresupuesto.listarGastos()){
        mostrarGastoWeb('listado-gastos-completo',listaCompleta);
    }
};
function actualizarPresupuestoWeb(){
    let presupuesto=parseInt(prompt('Introduce presupuesto: '));
    gestionPresupuesto.actualizarPresupuesto(presupuesto);

    repintar();
}
//BOTON ACTUALIZAR
let botonActualizar=document.getElementById('actualizarpresupuesto');
botonActualizar.addEventListener('click',actualizarPresupuestoWeb);

function nuevoGastoWeb(){
    let descripcion=prompt('Introduce descripcion: ');
    let valor=parseFloat(prompt('Introduce valor: '));
    let fecha=Date.parse(prompt('Introduce fecha: '));
    let etiquetas=prompt('Introduce etiquetas separadas por coma').split(',');

    let nuevoGasto=new gestionPresupuesto.CrearGasto(descripcion,valor,fecha,...etiquetas);
    gestionPresupuesto.anyadirGasto(nuevoGasto);

    repintar();
}
//BOTON ANYADIR
let botonAnyadir=document.getElementById('anyadirgasto');
botonAnyadir.addEventListener('click',nuevoGastoWeb);

function EditarHandle(){
    this.handleEvent=function(event){
        let nDescripcion = prompt('Introduce nueva descripción: ');
        let nValor = parseFloat(prompt('Introduce nuevo valor: '));
        let nFecha = Date.parse(prompt('Introduce nueva fecha: '));
        let nEtiquetas = prompt('Introduce nuevas etiquetas separadas por comas: ').split(',');

        this.gasto.actualizarValor(nValor);
        this.gasto.actualizarDescripcion(nDescripcion);
        this.gasto.actualizarFecha(nFecha);
        this.gasto.anyadirEtiquetas(...nEtiquetas);
        
        repintar();
    }
}
function BorrarHandle(){
    this.handleEvent=function(event){
        let eliminarGasto=this.gasto.id;
        gestionPresupuesto.borrarGasto(eliminarGasto);
        
        repintar();
    }
}
function BorrarEtiquetasHandle(){
    this.handleEvent=function(event){
        this.gasto.borrarEtiquetas(this.etiquetas);
        
        repintar();
    }
}
function nuevoGastoWebFormulario(){
    let plantillaFormulario = document.getElementById("formulario-template").content.cloneNode(true);
    var formulario = plantillaFormulario.querySelector("form");

    //BOTON CANCELAR
    //BOTON ENVIAR
}
//BOTON ANYADIR GASTO FORMULARIO
let botonAnyadirGastoFormulario=document.getElementById('anyadirgasto-formulario');
botonAnyadirGastoFormulario.addEventListener('click',nuevoGastoWebFormulario);

function EditarHandleFormulario(){
    this.handleEvent=function(event){
        event.preventDefault();

        let plantilla = document.getElementById('formulario-template').content.cloneNode(true);

        var formulario = plantillaFormulario.querySelector("form");
        formulario.elements.descripcion.value=this.gasto.descripcion;
        formulario.elements.valor.value=this.gasto.valor;
        formulario.elements.fecha.value=new Date(this.gasto.fecha);
        formulario.elements.etiquetas.value=this.gasto.etiquetas;

        //BOTON CANCELAR
        //BOTON ENVIAR
    }
}


export {
    mostrarDatoEnId,
    mostrarGastoWeb,
    mostrarGastosAgrupadosWeb,
    repintar,
    actualizarPresupuestoWeb,
    nuevoGastoWeb, 
    EditarHandle,
    BorrarHandle,
    BorrarEtiquetasHandle
}
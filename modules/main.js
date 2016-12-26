const $ = require('jquery');

/*

Формула аннуитетного платежа:

1. Ежемесячный аннуитетный платеж:

A = K*S,

где:

A — ежемесячный аннуитетный платеж,

K — коэффициент аннуитета,

S — сумма кредита.

2. Коэффициент аннуитета:

K=i*(1+i)^n/((1+i)^n-1),

где:

K — коэффициент аннуитета,

i — месячная процентная ставка по кредиту (= годовая ставка/12 месяцев),

n — количество периодов, в течение которых выплачивается кредит.

*/

/*
Формула сложного процента:

SUM = X * (1 + %)^n

где
SUM - конечная сумма;
X - начальная сумма;
% - процентная ставка, процентов годовых /100;
n - количество периодов, лет (месяцев, кварталов).

*/

var g_currentTime = 0; //Текущее время
var g_currentSummVTB = 0; //Текущий остаток по кредиту в банке ВТБ
var g_currentSummSBR = 0; //Текущий остаток по кредиту в банке Сбербанк

$(function() {
    //По умолчанию
    /////////////////////
    $('#inputSumm').val(1000000); //Начальная сумма кредита
    $('#inputPeriod').val(24); //Полное время кредита
    $('#inputProcent').val(10); //Процентная ставка по кредиту
    $('#inputMonthSumm').val(50000); //Сумма погашения
    $('#inputSumm').prop('disabled', false);
    $('#inputPeriod').prop('disabled', false);
    $('#inputProcent').prop('disabled', false);
    /////////////////////
    
    $('#btnContinue').click(function(e) {
        
        const inputSumm = $('#inputSumm').val(); //Начальная сумма кредита
        const inputPeriod = $('#inputPeriod').val(); //Полное время кредита
        const inputProcent = $('#inputProcent').val()/(12*100); //Процентная ставка по кредиту
        
        $('#inputSumm').prop('disabled', true);
        $('#inputPeriod').prop('disabled', true);
        $('#inputProcent').prop('disabled', true);
        
        if (g_currentSummVTB == 0) g_currentSummVTB = inputSumm;
        if (g_currentSummSBR == 0) g_currentSummSBR = inputSumm;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
//          Расчет для банка ВТБ
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        
        const kVTB = (inputProcent*Math.pow(1+inputProcent, inputPeriod)) / (Math.pow(1+inputProcent, inputPeriod) - 1);
        const aVTB = kVTB*inputSumm; //Ежемесячный аннуитетный платеж в банке ВТБ
        const deltaVTB = $('#inputMonthSumm').val() - aVTB; //Сумма дополнительного досрочного погашения для ВТБ
        
        const fCurrentSummVTB = g_currentSummVTB*(1+inputProcent) - aVTB - deltaVTB; //Остаток по кредиту в банке ВТБ
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
//          Расчет для банка Сбербанк
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
        const iPeriodSBR = inputPeriod-g_currentTime;
        const kSBR = (inputProcent*Math.pow(1+inputProcent, iPeriodSBR)) / (Math.pow(1+inputProcent, iPeriodSBR) - 1);
        const aSBR = kSBR*g_currentSummSBR; //Ежемесячный аннуитетный платеж в банке Сбербанк
        const deltaSBR = $('#inputMonthSumm').val() - aSBR; //Сумма дополнительного досрочного погашения для Сбербанка
        
        const fCurrentSummSBR = g_currentSummSBR*(1+inputProcent) - aSBR - deltaSBR; //Остаток по кредиту в банке Сбербанк
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

//        var timeRest = inputPeriod - g_currentTime; //Оставшееся время кредита
        
        g_currentTime++;

        $('#table_sber').append('<tr><td>'+g_currentTime+'</td><td>'+aSBR.toFixed(2)+'</td><td>'+fCurrentSummSBR.toFixed(2)+'</td></tr>');
        $('#table_vtb').append('<tr><td>'+g_currentTime+'</td><td>'+aVTB.toFixed(2)+'</td><td>'+fCurrentSummVTB.toFixed(2)+'</td></tr>');
        
        g_currentSummVTB = fCurrentSummVTB;
        g_currentSummSBR = fCurrentSummSBR;
    });
    
});


//browserify --debug ~/workspace/modules/main.js -s htmlEvents > ~/workspace/site/js/main.js
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

var g_fullSummVTB = 0; //Полная сумма выплаченная по кредиту для ВТБ
var g_fullSummSBR = 0; //Полная сумма выплаченная по кредиту для Сбербанка

$(function() {
    InitDefaults();

    $('#btnContinue').click(function(e) {
        
        const inputSumm = $('#inputSumm').val(); //Начальная сумма кредита
        const inputPeriod = $('#inputPeriod').val(); //Полное время кредита
        const inputProcent = $('#inputProcent').val()/(12*100); //Процентная ставка по кредиту
        
        $('#inputSumm').prop('disabled', true);
        $('#inputPeriod').prop('disabled', true);
        $('#inputProcent').prop('disabled', true);
        $('#btnContinue').text('Продолжить');
        
        if (g_currentSummVTB == 0) g_currentSummVTB = parseFloat(inputSumm);
        if (g_currentSummSBR == 0) g_currentSummSBR = parseFloat(inputSumm);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
//          Расчет для банка ВТБ
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        
        const kVTB = (inputProcent*Math.pow(1+inputProcent, inputPeriod)) / (Math.pow(1+inputProcent, inputPeriod) - 1);
        const aVTB = kVTB*inputSumm; //Ежемесячный аннуитетный платеж в банке ВТБ
        const deltaVTB = $('#inputMonthSumm').val() - aVTB; //Сумма дополнительного досрочного погашения для ВТБ

        const fProcentVTB = g_currentSummVTB*inputProcent; //Начислено процентов за период в ВТБ

        const fCurrentSummVTB = g_currentSummVTB + fProcentVTB - aVTB - deltaVTB; //Остаток по кредиту в банке ВТБ
        
        g_fullSummVTB += (fCurrentSummVTB < 0) ? (parseFloat($('#inputMonthSumm').val())+fCurrentSummVTB) : parseFloat($('#inputMonthSumm').val()); //Полная сумма погашений на данный момент в ВТБ
        
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
//          Расчет для банка Сбербанк
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////   
        const iPeriodSBR = inputPeriod-g_currentTime;
        const kSBR = (inputProcent*Math.pow(1+inputProcent, iPeriodSBR)) / (Math.pow(1+inputProcent, iPeriodSBR) - 1);
        const aSBR = kSBR*g_currentSummSBR; //Ежемесячный аннуитетный платеж в банке Сбербанк
        const deltaSBR = $('#inputMonthSumm').val() - aSBR; //Сумма дополнительного досрочного погашения для Сбербанка
        
        const fProcentSBR = g_currentSummSBR*inputProcent; //Начислено процентов за период в Сбербанке
        
        const fCurrentSummSBR = g_currentSummSBR + fProcentSBR - aSBR - deltaSBR; //Остаток по кредиту в банке Сбербанк

        g_fullSummSBR += (fCurrentSummSBR < 0) ? (parseFloat($('#inputMonthSumm').val())+fCurrentSummSBR) : parseFloat($('#inputMonthSumm').val()); //Полная сумма погашений на данный момент в Сбербанке

 ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        

        UpdateTables(aSBR, aVTB, fProcentSBR, fProcentVTB, deltaSBR, deltaVTB, fCurrentSummSBR, fCurrentSummVTB);
        
        if (fCurrentSummSBR < 0 || fCurrentSummVTB < 0)
            ShowResult();
    });
    
});

function UpdateTables(aSBR, aVTB, fProcentSBR, fProcentVTB, deltaSBR, deltaVTB, fCurrentSummSBR, fCurrentSummVTB)
{
    g_currentTime++;
    
    const rowSBR = '<tr id="sbr_'+g_currentTime+'"><td>'+g_currentTime+'</td><td>'+aSBR.toFixed(2)+'</td><td>'+fProcentSBR.toFixed(2)+'</td><td>'+deltaSBR.toFixed(2)+'</td><td>'+fCurrentSummSBR.toFixed(2)+'</td></tr>';
    const rowVTB = '<tr id="vtb_'+g_currentTime+'"><td>'+g_currentTime+'</td><td>'+aVTB.toFixed(2)+'</td><td>'+fProcentVTB.toFixed(2)+'</td><td>'+deltaVTB.toFixed(2)+'</td><td>'+fCurrentSummVTB.toFixed(2)+'</td></tr>';
        
    if (g_currentTime == 1)
    {
        $('#table_sber').append(rowSBR);
        $('#table_vtb').append(rowVTB);
    }
    else
    {
        $('#sbr_'+(g_currentTime-1)).before(rowSBR);
        $('#vtb_'+(g_currentTime-1)).before(rowVTB);
    }

    g_currentSummVTB = fCurrentSummVTB;
    g_currentSummSBR = fCurrentSummSBR;
}

function InitDefaults()
{
    //Устанавливаем значения по умолчанию
    /////////////////////
    $('#inputSumm').val(1000000); //Начальная сумма кредита
    $('#inputPeriod').val(24); //Полное время кредита
    $('#inputProcent').val(10); //Процентная ставка по кредиту
    $('#inputMonthSumm').val(50000); //Сумма погашения
    $('#inputSumm').prop('disabled', false);
    $('#inputPeriod').prop('disabled', false);
    $('#inputProcent').prop('disabled', false);
    $('#btnContinue').prop('disabled', false);
    /////////////////////
}

function ShowResult()
{
    $('#header_result').text('Итог');
    $('#table_result').append('<tr><th>Банк</th><th>Выплачено по кредиту</th></tr>');
    $('#table_result').append('<tr><td>ВТБ</td><td>'+g_fullSummVTB.toFixed(2)+'</td></tr>');
    $('#table_result').append('<tr><td>Сбербанк</td><td>'+g_fullSummSBR.toFixed(2)+'</td></tr>');
    
    $('#btnContinue').prop('disabled', true);
}

//browserify --debug ~/workspace/modules/main.js -s htmlEvents > ~/workspace/site/js/main.js
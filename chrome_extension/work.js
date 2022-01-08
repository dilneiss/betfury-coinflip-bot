function pressCoroa(){
    document.dispatchEvent( new KeyboardEvent("keydown", { key: "w", keyCode: 87,code: "KeyW",which: 87, shiftKey: false,ctrlKey: false,metaKey: false}) );
    console.log('Apostar na Coroa');
}
function pressCara(){
    document.dispatchEvent( new KeyboardEvent("keydown", { key: "q", keyCode: 81,code: "KeyQ",which: 81, shiftKey: false,ctrlKey: false,metaKey: false}) );
    console.log('Apostar na Cara');
}
function duplicarAposta(){
    document.dispatchEvent( new KeyboardEvent("keydown", { key: "d", keyCode: 68,code: "KeyD",which: 68, shiftKey: false,ctrlKey: false,metaKey: false}) );
    console.log('Duplicar Aposta');
}
function apostaMinima(){
    document.dispatchEvent( new KeyboardEvent("keydown", { key: "a", keyCode: 65,code: "KeyA",which: 65, shiftKey: false,ctrlKey: false,metaKey: false}) );
    duplicarAposta();
    duplicarAposta();
    duplicarAposta();
    duplicarAposta();
    duplicarAposta();
    duplicarAposta();
    duplicarAposta(); //128
    console.log('Aposta Minima');
}
function _waitForElement(selector, delay = 50, tries = 250) {

    const element = document.querySelector(selector);

    if (!window[`__${selector}`]) {
        window[`__${selector}`] = 0;
    }

    function _search() {
        return new Promise((resolve) => {
            window[`__${selector}`]++;
            setTimeout(resolve, delay);
        });
    }

    if (element === null) {
        if (window[`__${selector}`] >= tries) {
            window[`__${selector}`] = 0;
            return Promise.reject(null);
        }

        return _search().then(() => _waitForElement(selector));
    } else {
        window[`__${selector}`] = 0;
        return Promise.resolve(element);
    }
}

function bet(){

    //Limitando aposta em 0.20 e máximo de erros simultâneos em 16
    if ($('.inp-number').val() <= '0.20' && parseInt($('.tickets__value').find('.max').text()) < 16){

        //Limitando ganhos por sessão
        if ($('div.bets').find('.font-digits').first().text() >= '0.01' && $('div.bets').find('.font-digits').first().attr('style') == 'color: #2ddc4b'){

            console.log('Limite de ganho atingido: '+$('div.bets').find('.font-digits').first().text());

        }else{

            console.log('Iniciando apostas');

            console.log('Lucro obtido na sessão: '+$('div.bets').find('.font-digits').first().text());

            console.log('Valor da aposta atual: '+$('.inp-number').val());

            if ($('.lado-moeda-atual').text() == 'coroa'){
                pressCoroa();
            }else{
                pressCara();
            }

            const start = (async () => {

                try {

                    await _waitForElement('.bets__item');

                    classUltimoItem = $('.bets__inner').find('.bets__item').first().attr('class');

                    //Marcando item como checado
                    $('.bets__inner').find('.bets__item').first().attr('class', 'checked');

                    console.log('Class ultimo item: '+classUltimoItem);

                    let ganhou = classUltimoItem != 'bets__item bets__item_losing';

                    //Se ganhou só volta para aposta minima novamente
                    if (ganhou){

                        $('.tickets__value').find('.atual').text('0');

                        console.log('ganhou');

                        apostaMinima();

                    }else{

                        errosSeguidos = parseInt($('.tickets__value').find('.atual').text());
                        maxErrosSeguidos = parseInt($('.tickets__value').find('.max').text());
                        errosSeguidos++;
                        $('.tickets__value').find('.atual').text(errosSeguidos);

                        if (errosSeguidos > maxErrosSeguidos){
                            maxErrosSeguidos = errosSeguidos;
                            $('.tickets__value').find('.max').text(maxErrosSeguidos)
                        }

                        //Se perdeu, duplica a aposta e aposta no outro lado
                        duplicarAposta();

                        setTimeout(() => {

                            if ($('.lado-moeda-atual').text() == 'coroa'){
                                $('.lado-moeda-atual').text('cara');
                            }else{
                                $('.lado-moeda-atual').text('coroa');
                            }

                            console.log('Proxima aposta será: '+$('.lado-moeda-atual').text());

                        }, 200);

                    }

                    //Terminou de processar, começa de novo
                    setTimeout(bet, 100);

                }catch (e) {
                    //Se deu erro, começa de novo
                    setTimeout(bet, 100);
                }

            })();

        }


    }else{

        $('.lado-moeda-atual').text('Parado por atingir limite da aposta ou limite de erros simultâneos');

    }


}

$('.tickets__title').text('Erros Atual / Máx Erros Seguidos / Aposta Atual');
$('.tickets__value').html('<span class="atual">0</span> &nbsp; / &nbsp; <span class="max">0</span> &nbsp;&nbsp; (<span class="lado-moeda-atual">coroa</span>)');

apostaMinima();
bet();
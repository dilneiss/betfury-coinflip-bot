//Carrega o jquery
var jq = document.createElement('script');
jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);
jQuery.noConflict();

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

    console.log('Iniciando apostas');

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

$('.tickets__title').text('Erros Atual / Máx Erros Seguidos / Aposta Atual');
$('.tickets__value').html('<span class="atual">0</span> &nbsp; / &nbsp; <span class="max">0</span> &nbsp;&nbsp; (<span class="lado-moeda-atual">coroa</span>)');

apostaMinima();
bet();
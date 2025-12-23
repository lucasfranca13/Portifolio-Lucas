document.querySelector('.formulario-contato').addEventListener('submit', async function (event) {
    event.preventDefault();

    const captchaResponse = grecaptcha.getResponse();
    if (captchaResponse.length === 0) {
        alert("Por favor, prove que você não é um robô completando o desafio.");
        return;
    }

    let envios = parseInt(localStorage.getItem('contagemEnvios')) || 0;
    if (envios >= 2) {
        alert("Limite de envios atingido para esta sessão. Aguarde nossa resposta.");
        return;
    }

    const formulario = event.target;
    const botao = formulario.querySelector('.botao-form');

    botao.disabled = true;
    botao.innerText = "Enviando...";

    const dados = new FormData(formulario);

    try {
        const resposta = await fetch(formulario.action, {
            method: formulario.method,
            body: dados,
            headers: { 'Accept': 'application/json' }
        });

        if (resposta.ok) {
            envios++;
            localStorage.setItem('contagemEnvios', envios);

            alert("Obrigado, Lucas França recebeu sua mensagem!");
            formulario.reset();
            grecaptcha.reset();

            if (envios >= 2) {
                botao.innerText = "Limite atingido";
                botao.disabled = true;
                botao.style.opacity = "0.5";
                botao.style.cursor = "not-allowed";
            }
        } else {
            alert("Erro ao enviar. Tente novamente.");
            botao.disabled = false;
            botao.innerText = "Enviar E-mail";
        }
    } catch (erro) {
        alert("Erro de conexão.");
        botao.disabled = false;
        botao.innerText = "Enviar E-mail";
    }
});

window.addEventListener('load', () => {
    const envios = parseInt(localStorage.getItem('contagemEnvios')) || 0;
    if (envios >= 2) {
        const botao = document.querySelector('.botao-form');
        if (botao) {
            botao.disabled = true;
            botao.innerText = "Limite atingido";
            botao.style.opacity = "0.5";
            botao.style.cursor = "not-allowed";
        }
    }
});
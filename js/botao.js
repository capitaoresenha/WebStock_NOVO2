const botao = document.getElementById('meuBotao');
const info = document.getElementById('info');

botao.addEventListener('click', function () {
    if (info.style.display === 'none') {
        info.style.display = 'block';
        botao.textContent = '^';
    } else {
        info.style.display = 'none';
        botao.textContent = 'v';
    }
});
const MeuBotao = document.getElementById('MeuBotao');
const info2 = document.getElementById('info2');

MeuBotao.addEventListener('click', function () {
    if (info2.style.display === 'none') {
        info2.style.display = 'block';
        MeuBotao.textContent = '^';
    } else {
        info2.style.display = 'none';
        MeuBotao.textContent = 'v';
    }
});
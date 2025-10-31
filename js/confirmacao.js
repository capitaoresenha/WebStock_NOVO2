// Sistema de validação de senha e e-mail para WebStock

// Configuração padrão para senha forte
const senhaForteConfig = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true
};

// ... (Mantenha as funções 'verificarForcaSenha', 'verificarConfirmacaoSenha', 'validarEmail', 'validarSenha', 'validarFormulario', 'limparErros', 'mostrarErro' exatamente como estão no seu arquivo original) ...

// Função para verificar se a senha atende aos critérios de força
function verificarForcaSenha(senha) {
    const criterios = {
        length: senha.length >= senhaForteConfig.minLength,
        uppercase: senhaForteConfig.requireUppercase ? /[A-Z]/.test(senha) : true,
        lowercase: senhaForteConfig.requireLowercase ? /[a-z]/.test(senha) : true,
        number: senhaForteConfig.requireNumber ? /\d/.test(senha) : true,
        specialChar: senhaForteConfig.requireSpecialChar ? /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(senha) : true
    };

    const todosCriterios = Object.values(criterios).every(criterio => criterio);
    return { valida: todosCriterios, criterios };
}

// Função para verificar confirmação de senha
function verificarConfirmacaoSenha(senha, confirmacao) {
    return senha === confirmacao;
}

// Função para validar e-mail (padrão corporativo: formato válido, domínio comum)
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        return false;
    }
    // Verificações adicionais corporativas: evitar domínios suspeitos ou temporários
    const dominiosSuspeitos = ['10minutemail.com', 'temp-mail.org', 'guerrillamail.com'];
    const dominio = email.split('@')[1].toLowerCase();
    if (dominiosSuspeitos.includes(dominio)) {
        return false;
    }
    return true;
}

// Função para validar senha completa
function validarSenha(senha, confirmacao) {
    const forca = verificarForcaSenha(senha);
    const confirmacaoValida = verificarConfirmacaoSenha(senha, confirmacao);

    const erros = [];

    if (!forca.valida) {
        erros.push('A senha não atende aos critérios de força:');
        if (!forca.criterios.length) erros.push('- Mínimo de ' + senhaForteConfig.minLength + ' caracteres');
        if (!forca.criterios.uppercase) erros.push('- Pelo menos uma letra maiúscula');
        if (!forca.criterios.lowercase) erros.push('- Pelo menos uma letra minúscula');
        if (!forca.criterios.number) erros.push('- Pelo menos um número');
        if (!forca.criterios.specialChar) erros.push('- Pelo menos um caractere especial');
    }

    if (!confirmacaoValida) {
        erros.push('A confirmação de senha não corresponde à senha inserida.');
    }

    return { valida: forca.valida && confirmacaoValida, erros };
}

// Função para validar formulário completo (senha e e-mail)
function validarFormulario(email, senha, confirmacao) {
    const emailValido = validarEmail(email);
    const senhaValida = validarSenha(senha, confirmacao);

    const erros = [];

    if (!emailValido) {
        erros.push('E-mail inválido ou domínio suspeito.');
    }

    erros.push(...senhaValida.erros);

    return { valida: emailValido && senhaValida.valida, erros };
}

// Função para limpar mensagens de erro
function limparErros() {
    const erros = document.querySelectorAll('.error-message');
    erros.forEach(erro => {
        erro.style.display = 'none';
        erro.textContent = '';
    });
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('input-error'));
}

// Função para mostrar erro em um campo específico
function mostrarErro(campoId, mensagem) {
    const erroDiv = document.getElementById(campoId + '-error');
    if (erroDiv) {
        erroDiv.textContent = mensagem;
        erroDiv.style.display = 'block';
        const input = document.getElementById(campoId);
        if (input) {
            input.classList.add('input-error');
        }
    }
}

// Event listener para o botão de cadastro/login
document.addEventListener('DOMContentLoaded', function() {
    const botao = document.getElementById('tzao');
    if (botao) {
        botao.addEventListener('click', function(event) {
            event.preventDefault();

            limparErros();

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const confirmacaoEl = document.getElementById('confsenha');
            const isCadastro = confirmacaoEl !== null;

            let validacao;
            let errosCampos = {};

            if (isCadastro) {
                // Validação completa para cadastro (com confirmação de senha)
                const confirmacao = confirmacaoEl.value;
                validacao = validarFormulario(email, senha, confirmacao);

                // Mapear erros para campos específicos
                if (!validarEmail(email)) {
                    errosCampos.email = 'E-mail inválido ou domínio suspeito.';
                }
                const forcaSenha = verificarForcaSenha(senha);
                if (!forcaSenha.valida) {
                    let detalhes = [];
                    if (!forcaSenha.criterios.length) detalhes.push('Mínimo de 8 caracteres');
                    if (!forcaSenha.criterios.uppercase) detalhes.push('Pelo menos uma letra maiúscula');
                    if (!forcaSenha.criterios.lowercase) detalhes.push('Pelo menos uma letra minúscula');
                    if (!forcaSenha.criterios.number) detalhes.push('Pelo menos um número');
                    if (!forcaSenha.criterios.specialChar) detalhes.push('Pelo menos um caractere especial');
                    errosCampos.senha = 'A senha deve ter: ' + detalhes.join(', ') + '.';
                }
                if (senha !== confirmacao) {
                    errosCampos.confsenha = 'A confirmação de senha não corresponde.';
                }
                
                // --- INÍCIO DA MODIFICAÇÃO PARA CADASTRO ---
                if (validacao.valida) {
                    // Enviar dados para o backend
                    fetch('http://localhost:3000/api/cadastro', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, senha } ),
                    })
                    .then(response => response.json())
                    .then(data => {
                        const successDiv = document.getElementById('success-message');
                        
                        if (data.erro) {
                            // Erro do servidor (ex: email já cadastrado)
                            successDiv.textContent = 'Erro: ' + data.erro;
                            successDiv.style.display = 'block';
                            successDiv.style.color = 'red';
                        } else {
                            // Cadastro bem-sucedido
                            successDiv.textContent = 'Cadastro realizado com sucesso! Redirecionando para o login...';
                            successDiv.style.display = 'block';
                            successDiv.style.color = 'green';
                            
                            // Redirecionar após 2 segundos
                            setTimeout(() => {
                                window.location.href = 'login.html';
                            }, 2000); 
                        }
                    })
                    .catch(error => {
                        console.error('Erro de rede ou servidor:', error);
                        const successDiv = document.getElementById('success-message');
                        successDiv.textContent = 'Erro ao comunicar com o servidor. Verifique se o backend está rodando.';
                        successDiv.style.display = 'block';
                        successDiv.style.color = 'red';
                    });
                } else {
                    // Mostrar erros nos campos específicos
                    for (const campo in errosCampos) {
                        mostrarErro(campo, errosCampos[campo]);
                    }
                }
                // --- FIM DA MODIFICAÇÃO PARA CADASTRO ---

            } else {
                // Validação simplificada para login (sem confirmação de senha)
                const emailValido = validarEmail(email);
                const forca = verificarForcaSenha(senha);

                const erros = [];
                if (!emailValido) {
                    errosCampos.email = 'E-mail inválido ou domínio suspeito.';
                }
                // A validação de força de senha para login é opcional, mas vamos mantê-la
                if (!forca.valida) {
                    let detalhes = [];
                    if (!forca.criterios.length) detalhes.push('Mínimo de 8 caracteres');
                    if (!forca.criterios.uppercase) detalhes.push('Pelo menos uma letra maiúscula');
                    if (!forca.criterios.lowercase) detalhes.push('Pelo menos uma letra minúscula');
                    if (!forca.criterios.number) detalhes.push('Pelo menos um número');
                    if (!forca.criterios.specialChar) detalhes.push('Pelo menos um caractere especial');
                    errosCampos.senha = 'A senha deve ter: ' + detalhes.join(', ') + '.';
                }

                validacao = { valida: emailValido && forca.valida, erros };

                // --- INÍCIO DA MODIFICAÇÃO PARA LOGIN ---
                if (validacao.valida) {
                    // Enviar dados para o backend
                    fetch('http://localhost:3000/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email, senha } ),
                    })
                    .then(response => response.json())
                    .then(data => {
                        const successDiv = document.getElementById('success-message');
                        
                        if (data.erro) {
                            // Erro do servidor (ex: credenciais inválidas)
                            successDiv.textContent = 'Erro no Login: ' + data.erro;
                            successDiv.style.display = 'block';
                            successDiv.style.color = 'red';
                        } else {
                            // Login bem-sucedido
                            successDiv.textContent = 'Login realizado com sucesso! Redirecionando...';
                            successDiv.style.display = 'block';
                            successDiv.style.color = 'green';
                            
                            // Redirecionar para a home
                            setTimeout(() => {
                                window.location.href = 'home.html';
                            }, 2000); 
                        }
                    })
                    .catch(error => {
                        console.error('Erro de rede ou servidor:', error);
                        const successDiv = document.getElementById('success-message');
                        successDiv.textContent = 'Erro ao comunicar com o servidor. Verifique se o backend está rodando.';
                        successDiv.style.display = 'block';
                        successDiv.style.color = 'red';
                    });
                } else {
                    // Mostrar erros nos campos específicos
                    for (const campo in errosCampos) {
                        mostrarErro(campo, errosCampos[campo]);
                    }
                }
                // --- FIM DA MODIFICAÇÃO PARA LOGIN ---
            }
        });
    }
});

document.getElementById("cadastroForm").addEventListener("submit", function(event) {
    event.preventDefault();  // Impede o envio do formulário

    // Obtendo os valores dos campos
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    // Validação simples
    if (nome === "" || email === "" || senha === "") {
        document.getElementById("resultado").innerHTML = "Todos os campos são obrigatórios!";
        document.getElementById("resultado").style.color = "red";
        return;
    }

    // Caso a validação seja bem-sucedida
    document.getElementById("resultado").innerHTML = "Cadastro realizado com sucesso!";
    document.getElementById("resultado").style.color = "green";

    // Limpar o formulário após o envio
    document.getElementById("cadastroForm").reset();
});

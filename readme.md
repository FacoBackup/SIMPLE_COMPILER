## Membros 
#### Gustavo Micael Barbosa Roque - 1912082031
#### Gabriel Oliveira Moura Lima - 1912130050

## Repositório

[SIMPLE_COMPILER github](https://github.com/FacoBackup/SIMPLE_COMPILER)

## Dependências
- NodeJS 18 ou superior
  - Instalação: https://github.com/nodesource/distributions#ubuntu-versions
    ```shell
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | sudo gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
    
    NODE_MAJOR=18
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_$NODE_MAJOR.x nodistro main" | sudo tee /etc/apt/sources.list.d/nodesource.list
    sudo apt-get update
    sudo apt-get install nodejs -y
    ```
- npm (node package manager) (é instalado junto ao nodejs)

## Instruções de uso
- Execute `npm install` na raiz do diretório
- Execute `npm run build` para gerar o arquivo executável no diretório `build`
- Entre no diretório `build`
- Crie ou mova o arquivo com conteúdo do programa SIMPLE no mesmo diretório
- Execute no terminal `node compiler.js <nomedoarquivo>` 
- Único argumento é o nome do arquivo, tal deve estar no mesmo diretório que o arquivo `compiler.js`

> **OBS:** Caso deseje gerar o código intermediário com **_comentários_** descrevendo cada linha, utilize o executável node `debug-compiler.js` ao invés do `compiler.js`

## Output
O output do programa é dado na escrita de um arquivo com nome de `compiled.smc`, onde `smc` é "simple machine code".

